import { ExternalLink, FileText, BookMarked, Quote } from 'lucide-react';
import { Citation } from '@/types/chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CitationsPanelProps {
  citations: Citation[];
}

export function CitationsPanel({ citations }: CitationsPanelProps) {
  if (citations.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-3xl bg-accent/10 flex items-center justify-center mb-3 text-primary shadow-soft">
          <Quote className="h-6 w-6" />
        </div>
        <h4 className="font-semibold text-foreground mb-1">Sources</h4>
        <p className="text-sm text-muted-foreground px-2">
          When an answer references your documents, citations will show up in this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-serif font-semibold text-foreground flex items-center gap-2">
          <BookMarked className="h-4 w-4 text-primary" />
          PDF Sources ({citations.length})
        </h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {citations.map((citation, index) => (
            <div
              key={index}
              className={cn(
                'p-3 rounded-lg border border-citation-border bg-citation-bg',
                'hover:border-primary/30 transition-colors animate-fade-in'
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                  <h4 className="font-medium text-sm text-foreground line-clamp-2">
                    {citation.title || 'Document Source'}
                  </h4>
                </div>
                <span className="rounded-full border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground">
                  Source
                </span>
              </div>
              
              {citation.text && (
                <div className="pl-6 mb-2">
                  <div className="p-2 rounded bg-muted/50 border-l-2 border-primary/30">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      "{citation.text}"
                    </p>
                  </div>
                </div>
              )}
              
              {citation.uri && (
                <a
                  href={citation.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline pl-6"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open source
                </a>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}