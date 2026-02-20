import { ChatMessageContent } from '../backend';
import { Card } from '@/components/ui/card';
import { FileText, Image as ImageIcon, Video } from 'lucide-react';

interface ChatMessageProps {
  content: ChatMessageContent;
}

export default function ChatMessage({ content }: ChatMessageProps) {
  return (
    <Card className="p-4 bg-card hover:bg-accent/50 transition-colors">
      {content.__kind__ === 'text' && (
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm flex-1 break-words">{content.text}</p>
        </div>
      )}

      {content.__kind__ === 'photo' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ImageIcon className="w-4 h-4" />
            <span>Photo</span>
          </div>
          <img
            src={content.photo.getDirectURL()}
            alt="Shared photo"
            className="rounded-lg max-w-full h-auto max-h-96 object-contain"
          />
        </div>
      )}

      {content.__kind__ === 'video' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Video className="w-4 h-4" />
            <span>Video</span>
          </div>
          <video
            src={content.video.getDirectURL()}
            controls
            className="rounded-lg max-w-full h-auto max-h-96"
          />
        </div>
      )}
    </Card>
  );
}
