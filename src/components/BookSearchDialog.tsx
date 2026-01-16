import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Loader2, BookOpen, Check, X } from 'lucide-react';

interface BookResult {
  id: string;
  title: string;
  author: string;
  pageCount: number | null;
  coverUrl: string | null;
  description: string | null;
}

interface BookSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookSelected: (book: {
    title: string;
    author: string;
    totalPages: number;
    coverUrl: string | null;
  }) => void;
}

export const BookSearchDialog = ({ open, onOpenChange, onBookSelected }: BookSearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<BookResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);
  const [manualEntry, setManualEntry] = useState(false);
  const [manualPages, setManualPages] = useState('');
  const [step, setStep] = useState<'search' | 'confirm' | 'manual'>('search');

  const searchBooks = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a book title');
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-book', {
        body: { query: searchQuery }
      });

      if (error) throw error;

      if (data.books && data.books.length > 0) {
        setResults(data.books);
        setStep('confirm');
      } else {
        toast.info('No books found. Please enter details manually.');
        setStep('manual');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search. Please try again or enter manually.');
      setStep('manual');
    } finally {
      setSearching(false);
    }
  };

  const confirmBook = (book: BookResult) => {
    if (!book.pageCount) {
      setSelectedBook(book);
      setStep('manual');
      return;
    }

    onBookSelected({
      title: book.title,
      author: book.author,
      totalPages: book.pageCount,
      coverUrl: book.coverUrl,
    });
    resetDialog();
  };

  const submitManualPages = () => {
    const pages = parseInt(manualPages);
    if (!pages || pages < 1) {
      toast.error('Please enter a valid number of pages');
      return;
    }

    onBookSelected({
      title: selectedBook?.title || searchQuery,
      author: selectedBook?.author || 'Unknown Author',
      totalPages: pages,
      coverUrl: selectedBook?.coverUrl || null,
    });
    resetDialog();
  };

  const resetDialog = () => {
    setSearchQuery('');
    setResults([]);
    setSelectedBook(null);
    setManualEntry(false);
    setManualPages('');
    setStep('search');
    onOpenChange(false);
  };

  const searchAgain = () => {
    setResults([]);
    setStep('search');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) resetDialog(); else onOpenChange(o); }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-6 h-6 text-primary" />
            {step === 'search' && 'Search for a Book'}
            {step === 'confirm' && 'Is this your book?'}
            {step === 'manual' && 'Enter Page Count'}
          </DialogTitle>
        </DialogHeader>

        {step === 'search' && (
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="search">Book Title</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter book title..."
                  onKeyDown={(e) => e.key === 'Enter' && searchBooks()}
                />
                <Button onClick={searchBooks} disabled={searching}>
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => setStep('manual')}
              className="text-muted-foreground"
            >
              Can't find your book? Enter manually
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4 pt-4">
            <div className="grid gap-4">
              {results.map((book) => (
                <Card 
                  key={book.id} 
                  className="hover:border-primary transition-colors cursor-pointer group"
                  onClick={() => confirmBook(book)}
                >
                  <CardContent className="p-4 flex gap-4">
                    {book.coverUrl ? (
                      <img 
                        src={book.coverUrl} 
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-muted rounded flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-muted-foreground">by {book.author}</p>
                      {book.pageCount && (
                        <p className="text-sm text-primary font-medium mt-1">
                          {book.pageCount} pages
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Check className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={searchAgain} className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Not here? Search again
              </Button>
              <Button variant="ghost" onClick={() => setStep('manual')}>
                Enter manually
              </Button>
            </div>
          </div>
        )}

        {step === 'manual' && (
          <div className="space-y-4 pt-4">
            {selectedBook && (
              <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                {selectedBook.coverUrl && (
                  <img 
                    src={selectedBook.coverUrl} 
                    alt={selectedBook.title}
                    className="w-12 h-18 object-cover rounded"
                  />
                )}
                <div>
                  <h4 className="font-bold">{selectedBook.title}</h4>
                  <p className="text-sm text-muted-foreground">by {selectedBook.author}</p>
                </div>
              </div>
            )}
            {!selectedBook && (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="manual-title">Book Title</Label>
                  <Input
                    id="manual-title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter book title"
                  />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="pages">Total Number of Pages</Label>
              <Input
                id="pages"
                type="number"
                value={manualPages}
                onChange={(e) => setManualPages(e.target.value)}
                placeholder="Enter page count"
                min="1"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={searchAgain}>
                Back to Search
              </Button>
              <Button onClick={submitManualPages} className="flex-1">
                Add Book
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
