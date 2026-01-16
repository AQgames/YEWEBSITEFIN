import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, BookOpen, Scroll, Crown, FileText, Library } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AchievementPopupProps {
  badge: {
    name: string;
    description: string;
    icon: string;
  } | null;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'book': <BookOpen className="w-16 h-16" />,
  'book-open': <BookOpen className="w-16 h-16" />,
  'library': <Library className="w-16 h-16" />,
  'file-text': <FileText className="w-16 h-16" />,
  'scroll': <Scroll className="w-16 h-16" />,
  'trophy': <Trophy className="w-16 h-16" />,
  'crown': <Crown className="w-16 h-16" />,
  'star': <Star className="w-16 h-16" />,
};

export const AchievementPopup = ({ badge, onClose }: AchievementPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (badge) {
      setIsOpen(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#eab308', '#3b82f6', '#ec4899'],
      });
    }
  }, [badge]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm text-center border-4 border-primary bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="py-6 space-y-4">
          <div className="animate-bounce mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white shadow-xl">
            {iconMap[badge.icon] || <Trophy className="w-16 h-16" />}
          </div>
          
          <div className="space-y-2">
            <Badge className="text-lg px-4 py-1 bg-gradient-to-r from-primary to-accent">
              🎉 Achievement Unlocked!
            </Badge>
            <h2 className="text-3xl font-bold text-primary">{badge.name}</h2>
            <p className="text-muted-foreground text-lg">{badge.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
