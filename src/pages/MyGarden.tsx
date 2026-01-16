import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Star, Trash2, BookOpen, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BookSearchDialog } from '@/components/BookSearchDialog';
import { AchievementPopup } from '@/components/AchievementPopup';
import { SeasonalDecorations } from '@/components/SeasonalDecorations';

interface Book {
  id: string;
  title: string;
  author: string;
  rating: number;
  progress: number;
  status: string;
  total_pages: number;
  pages_read: number;
  cover_url: string | null;
  created_at: string;
}

interface BadgeInfo {
  name: string;
  description: string;
  icon: string;
}

const MyGarden = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, checkAndAwardBadges, refreshProfile } = useProfile();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<BadgeInfo | null>(null);
  
  // Track pending edits
  const [pendingPages, setPendingPages] = useState<Record<string, number>>({});
  const [pendingRatings, setPendingRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
      // Initialize pending values
      const pages: Record<string, number> = {};
      const ratings: Record<string, number> = {};
      (data || []).forEach(book => {
        pages[book.id] = book.pages_read;
        ratings[book.id] = book.rating;
      });
      setPendingPages(pages);
      setPendingRatings(ratings);
    } catch (error: any) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelected = async (book: {
    title: string;
    author: string;
    totalPages: number;
    coverUrl: string | null;
  }) => {
    try {
      const { error } = await supabase
        .from('books')
        .insert({
          user_id: user?.id,
          title: book.title,
          author: book.author,
          total_pages: book.totalPages,
          pages_read: 0,
          cover_url: book.coverUrl,
          rating: 0,
          progress: 0,
          status: 'reading',
        });

      if (error) throw error;

      toast.success('Book added to your garden! 📚');
      setDialogOpen(false);
      fetchBooks();
    } catch (error: any) {
      toast.error('Failed to add book');
    }
  };

  const savePagesRead = async (book: Book) => {
    const pagesRead = pendingPages[book.id] || 0;
    const clampedPages = Math.max(0, Math.min(pagesRead, book.total_pages));
    const progress = book.total_pages > 0 ? Math.round((clampedPages / book.total_pages) * 100) : 0;

    try {
      const { error } = await supabase
        .from('books')
        .update({ pages_read: clampedPages, progress })
        .eq('id', book.id);

      if (error) throw error;
      toast.success('Progress saved!');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to update progress');
    }
  };

  const saveRating = async (bookId: string) => {
    const rating = pendingRatings[bookId] || 0;
    
    try {
      const { error } = await supabase
        .from('books')
        .update({ rating })
        .eq('id', bookId);

      if (error) throw error;
      fetchBooks();
      toast.success('Rating saved! ⭐');
    } catch (error) {
      toast.error('Failed to update rating');
    }
  };

  const markAsFinished = async (book: Book) => {
    try {
      // Update book status
      const { error: bookError } = await supabase
        .from('books')
        .update({ 
          status: 'finished', 
          progress: 100, 
          pages_read: book.total_pages 
        })
        .eq('id', book.id);

      if (bookError) throw bookError;

      // Update profile stats
      const newBooksRead = (profile?.total_books_read || 0) + 1;
      const newPagesRead = (profile?.total_pages_read || 0) + book.total_pages;
      const xpGained = Math.round(book.total_pages * 0.5) + 50; // 50 base XP + 0.5 per page
      const newXp = (profile?.experience_points || 0) + xpGained;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          total_books_read: newBooksRead,
          total_pages_read: newPagesRead,
          experience_points: newXp,
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      toast.success(`Book finished! +${xpGained} XP! Time to plant your bookmark! 🌱`);
      
      // Refresh data
      await fetchBooks();
      await refreshProfile();
      
      // Check for new badges
      const newBadge = await checkAndAwardBadges();
      if (newBadge) {
        setEarnedBadge(newBadge);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Book removed from garden');
      fetchBooks();
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 px-4 text-center">
          <div className="inline-block animate-bounce">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>
          <p className="text-xl mt-4">Loading your garden... 🌱</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-season-bg via-background to-season-accent/10">
      <SeasonalDecorations />
      <Navbar />
      
      <AchievementPopup 
        badge={earnedBadge} 
        onClose={() => setEarnedBadge(null)} 
      />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                My Reading Garden 🌿
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your books and watch your knowledge grow!
              </p>
            </div>
            
            <Button 
              size="lg" 
              className="gap-2 shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="w-5 h-5" />
              Add Book
            </Button>
          </div>

          <BookSearchDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onBookSelected={handleBookSelected}
          />

          {books.length === 0 ? (
            <Card className="text-center py-16 border-2 border-dashed border-primary/30">
              <CardContent>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Your garden is empty!</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Add your first book to start your reading journey 📚
                </p>
                <Button onClick={() => setDialogOpen(true)} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Book
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {books.map((book) => (
                <Card 
                  key={book.id} 
                  className="hover:shadow-xl transition-all border-2 hover:border-primary/30 overflow-hidden group"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-start gap-4">
                      {book.cover_url ? (
                        <img 
                          src={book.cover_url} 
                          alt={book.title}
                          className="w-16 h-24 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-16 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-1 truncate">{book.title}</h3>
                        <p className="text-sm text-muted-foreground font-normal truncate">
                          by {book.author}
                        </p>
                        {book.total_pages > 0 && (
                          <p className="text-xs text-primary mt-1">
                            {book.total_pages} pages total
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBook(book.id)}
                        className="hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="bg-muted/30 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium">Reading Progress</Label>
                        <span className="text-lg font-bold text-primary">{book.progress}%</span>
                      </div>
                      <Progress value={book.progress} className="h-4 mb-3" />
                      
                      {book.status !== 'finished' && book.total_pages > 0 && (
                        <div className="flex items-center gap-2">
                          <Label className="text-sm whitespace-nowrap">Pages read:</Label>
                          <Input
                            type="number"
                            min="0"
                            max={book.total_pages}
                            value={pendingPages[book.id] ?? book.pages_read}
                            onChange={(e) => setPendingPages({
                              ...pendingPages,
                              [book.id]: parseInt(e.target.value) || 0
                            })}
                            className="w-24 h-9"
                          />
                          <span className="text-sm text-muted-foreground">/ {book.total_pages}</span>
                          <Button 
                            size="sm" 
                            onClick={() => savePagesRead(book)}
                            className="ml-auto"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Done
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <Label className="mb-2 block font-medium">Your Rating</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setPendingRatings({
                                ...pendingRatings,
                                [book.id]: star
                              })}
                              className="transition-all hover:scale-125 active:scale-95"
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= (pendingRatings[book.id] ?? book.rating)
                                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                                    : 'text-muted-foreground/30 hover:text-yellow-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                        {(pendingRatings[book.id] ?? 0) !== book.rating && (
                          <Button 
                            size="sm" 
                            onClick={() => saveRating(book.id)}
                            className="ml-auto"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Done
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {book.status !== 'finished' && (
                      <Button
                        onClick={() => markAsFinished(book)}
                        className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Mark as Finished
                      </Button>
                    )}
                    
                    {book.status === 'finished' && (
                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-4 py-3 rounded-xl text-center font-medium border border-primary/20">
                        ✅ Finished! Time to plant your bookmark! 🌱
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyGarden;
