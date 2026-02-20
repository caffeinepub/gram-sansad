import { useState, useRef } from 'react';
import { useSendMessage } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalBlob } from '../backend';
import { Send, Image as ImageIcon, Video, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import PollCreator from './PollCreator';

export default function MessageComposer() {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useSendMessage();

  const handleSendText = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage.mutateAsync({ __kind__: 'text', text: message.trim() });
      setMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleFileUpload = async (file: File, type: 'photo' | 'video') => {
    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      if (type === 'photo') {
        await sendMessage.mutateAsync({ __kind__: 'photo', photo: blob });
        toast.success('Photo sent!');
      } else {
        await sendMessage.mutateAsync({ __kind__: 'video', video: blob });
        toast.success('Video sent!');
      }
    } catch (error) {
      toast.error(`Failed to send ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file, 'photo');
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      handleFileUpload(file, 'video');
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => photoInputRef.current?.click()}
          disabled={uploading || sendMessage.isPending}
          title="Send photo"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => videoInputRef.current?.click()}
          disabled={uploading || sendMessage.isPending}
          title="Send video"
        >
          <Video className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setShowPollCreator(true)}
          disabled={uploading || sendMessage.isPending}
          title="Create poll"
        >
          <BarChart3 className="w-4 h-4" />
        </Button>

        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendText();
            }
          }}
          disabled={uploading || sendMessage.isPending}
          className="flex-1"
        />

        <Button
          onClick={handleSendText}
          disabled={!message.trim() || uploading || sendMessage.isPending}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {uploading && (
        <p className="text-xs text-muted-foreground mt-2">Uploading...</p>
      )}

      <PollCreator open={showPollCreator} onClose={() => setShowPollCreator(false)} />
    </>
  );
}
