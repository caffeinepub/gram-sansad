import { useGetCallerUserRole, useGetAnnouncements } from '../hooks/useQueries';
import AnnouncementComposer from '../components/AnnouncementComposer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Megaphone, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminAnnouncementsPage() {
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();
  const { data: announcements, isLoading: announcementsLoading } = useGetAnnouncements();

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied. Only administrators can access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Announcements</h1>
        <p className="text-muted-foreground">
          Send important announcements to all community members. They will receive notifications with a special alert sound.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            Create Announcement
          </CardTitle>
          <CardDescription>
            Compose a message to broadcast to all registered users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnnouncementComposer />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Announcement History</CardTitle>
          <CardDescription>Previously sent announcements</CardDescription>
        </CardHeader>
        <CardContent>
          {announcementsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : announcements && announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div
                  key={Number(announcement.id)}
                  className="p-4 border rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm flex-1">{announcement.message}</p>
                    <Badge variant="secondary" className="shrink-0">
                      #{Number(announcement.id)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No announcements sent yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
