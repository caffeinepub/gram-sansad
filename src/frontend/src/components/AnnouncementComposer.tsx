import { useState } from 'react';
import { usePostAnnouncement } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

export default function AnnouncementComposer() {
  const [message, setMessage] = useState('');
  const postAnnouncement = usePostAnnouncement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      await postAnnouncement.mutateAsync(message.trim());
      toast.success('Announcement sent to all users!');
      setMessage('');
    } catch (error) {
      toast.error('Failed to send announcement');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Type your announcement message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="resize-none"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {message.length} characters
          </span>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={postAnnouncement.isPending || !message.trim()}
      >
        {postAnnouncement.isPending ? (
          'Sending...'
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Announcement
          </>
        )}
      </Button>
    </form>
  );
}
