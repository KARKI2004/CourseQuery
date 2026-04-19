import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ChatContainer } from '@/components/ChatContainer';
import { BookOpen } from 'lucide-react';

const Index = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background gradient-paper">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-primary/10 text-primary shadow-soft">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-foreground">
                CourseQuery
              </h1>
            </div>
          </div>

          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 mt-6">
        <ChatContainer />
      </main>
    </div>
  );
};

export default Index;