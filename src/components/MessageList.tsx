import { useEffect, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { Message } from '@/types/chat';
import { ChatMessage } from './ChatMessage';

interface MessageListProps {
  messages: Message[];
  searchQuery: string;
  onViewCitations: (message: Message) => void;
  onUseExample: (value: string) => void;
  isLoading: boolean;
}

export function MessageList({ messages, searchQuery, onViewCitations, onUseExample, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Filter messages by search query
  const filteredMessages = searchQuery
    ? messages.filter(m => 
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sampleQuestions = [
    'Define Global Supply chain Management.',
    'Give an example of a Turabian style citation.',
  ];

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg animate-fade-in">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/10 text-primary shadow-soft">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
            Ask anything about your uploaded course materials.
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {sampleQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => onUseExample(question)}
                className="rounded-full border border-border bg-background px-4 py-3 text-left text-sm text-foreground shadow-soft transition hover:border-primary/40 hover:bg-primary/10"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (searchQuery && filteredMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center animate-fade-in">
          <p className="text-muted-foreground">
            No messages found matching "{searchQuery}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
      {filteredMessages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          isLatest={index === filteredMessages.length - 1 && message.role === 'assistant'}
          onViewCitations={onViewCitations}
        />
      ))}
      
      {isLoading && (
        <div className="flex gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <div className="bg-chat-assistant border border-border rounded-2xl px-4 py-3 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}