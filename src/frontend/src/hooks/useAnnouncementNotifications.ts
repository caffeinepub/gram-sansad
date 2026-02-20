import { useEffect, useRef } from 'react';
import { useGetAnnouncements } from './useQueries';

export function useAnnouncementNotifications() {
  const { data: announcements } = useGetAnnouncements();
  const previousCountRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const permissionRequestedRef = useRef(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('/assets/announcement-alert.mp3');
    }
  }, []);

  useEffect(() => {
    if (!permissionRequestedRef.current && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      permissionRequestedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!announcements || announcements.length === 0) {
      previousCountRef.current = 0;
      return;
    }

    const currentCount = announcements.length;

    if (previousCountRef.current > 0 && currentCount > previousCountRef.current) {
      const newAnnouncement = announcements[announcements.length - 1];

      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play notification sound:', error);
        });
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Announcement from Gram Sansad', {
          body: newAnnouncement.message,
          icon: '/assets/generated/logo.dim_256x256.png',
          tag: 'announcement',
        });
      }
    }

    previousCountRef.current = currentCount;
  }, [announcements]);
}
