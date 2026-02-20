import { useEffect, useRef, useState } from 'react';
import { useGetChat } from '../hooks/useQueries';
import ChatMessage from './ChatMessage';
import MessageComposer from './MessageComposer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';

export default function ChatInterface() {
  const { data: messages, isLoading } = useGetChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="p-4 border-b bg-accent/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">Community Chat</h2>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" onScrollCapture={handleScroll}>
        <div ref={scrollRef} className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading messages...</div>
          ) : messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <ChatMessage key={index} content={message} />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-accent/30">
        <MessageComposer />
      </div>
    </div>
  );
}
