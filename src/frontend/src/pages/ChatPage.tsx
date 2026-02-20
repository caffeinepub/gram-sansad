import ChatInterface from '../components/ChatInterface';
import { Card } from '@/components/ui/card';

export default function ChatPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Community Chat</h1>
        <p className="text-muted-foreground">
          Connect with your community members, share updates, and participate in discussions.
        </p>
      </div>
      <Card className="shadow-lg">
        <ChatInterface />
      </Card>
    </div>
  );
}
