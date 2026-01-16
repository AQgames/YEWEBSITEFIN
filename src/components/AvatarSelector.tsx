import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AVATARS = [
  { id: 'default', emoji: '🌱', name: 'Sprout' },
  { id: 'tree', emoji: '🌳', name: 'Tree' },
  { id: 'flower', emoji: '🌸', name: 'Flower' },
  { id: 'sunflower', emoji: '🌻', name: 'Sunflower' },
  { id: 'cactus', emoji: '🌵', name: 'Cactus' },
  { id: 'book', emoji: '📚', name: 'Bookworm' },
  { id: 'star', emoji: '⭐', name: 'Star Reader' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly' },
  { id: 'bee', emoji: '🐝', name: 'Busy Bee' },
  { id: 'owl', emoji: '🦉', name: 'Wise Owl' },
  { id: 'fox', emoji: '🦊', name: 'Clever Fox' },
  { id: 'cat', emoji: '🐱', name: 'Cozy Cat' },
  { id: 'dragon', emoji: '🐉', name: 'Book Dragon' },
  { id: 'unicorn', emoji: '🦄', name: 'Unicorn' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow' },
  { id: 'mushroom', emoji: '🍄', name: 'Mushroom' },
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatarId: string) => void;
  trigger?: React.ReactNode;
}

export const AvatarSelector = ({ currentAvatar, onSelect, trigger }: AvatarSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentAvatar);

  const handleSelect = (avatarId: string) => {
    setSelected(avatarId);
    onSelect(avatarId);
    setOpen(false);
  };

  const currentAvatarData = AVATARS.find(a => a.id === currentAvatar) || AVATARS[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" className="h-auto p-2 hover:bg-primary/10">
            <div className="text-4xl">{currentAvatarData.emoji}</div>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Choose Your Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-3 pt-4">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.id}
              onClick={() => handleSelect(avatar.id)}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl transition-all hover:scale-105",
                "border-2 hover:border-primary",
                selected === avatar.id 
                  ? "border-primary bg-primary/10 shadow-lg" 
                  : "border-transparent bg-muted/50"
              )}
            >
              <span className="text-3xl">{avatar.emoji}</span>
              <span className="text-xs mt-1 text-muted-foreground">{avatar.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const getAvatarEmoji = (avatarId: string): string => {
  const avatar = AVATARS.find(a => a.id === avatarId);
  return avatar?.emoji || '🌱';
};
