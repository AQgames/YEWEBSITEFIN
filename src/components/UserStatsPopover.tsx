import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Trophy, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { getAvatarEmoji } from './AvatarSelector';

interface UserStatsPopoverProps {
  trigger: React.ReactNode;
}

const EXPERIENCE_LEVELS = [
  { title: 'Beginner Reader', level: 1, minXp: 0, maxXp: 100 },
  { title: 'Apprentice Reader', level: 2, minXp: 100, maxXp: 500 },
  { title: 'Adept Reader', level: 3, minXp: 500, maxXp: 1000 },
  { title: 'Expert Reader', level: 4, minXp: 1000, maxXp: 2500 },
  { title: 'Master Reader', level: 5, minXp: 2500, maxXp: 5000 },
  { title: 'Legend Reader', level: 6, minXp: 5000, maxXp: 10000 },
];

export const UserStatsPopover = ({ trigger }: UserStatsPopoverProps) => {
  const { profile, badges, getExperienceLevel } = useProfile();
  const levelInfo = getExperienceLevel();
  const xp = profile?.experience_points || 0;
  
  // Find current and next level
  const currentLevelData = EXPERIENCE_LEVELS.find(l => l.level === levelInfo.level) || EXPERIENCE_LEVELS[0];
  const nextLevelData = EXPERIENCE_LEVELS.find(l => l.level === levelInfo.level + 1);
  
  const xpInCurrentLevel = xp - currentLevelData.minXp;
  const xpNeededForNextLevel = currentLevelData.maxXp - currentLevelData.minXp;
  const progressPercent = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
        {/* Header with avatar and name */}
        <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 p-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">
              {getAvatarEmoji(profile?.avatar_id || 'default')}
            </div>
            <div>
              <h3 className="font-bold text-lg">{profile?.username || 'Reader'}</h3>
              <Badge className="bg-gradient-to-r from-primary to-accent text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {levelInfo.title}
              </Badge>
            </div>
          </div>
        </div>

        {/* Experience Progress */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Level {levelInfo.level}</span>
            <span className="font-medium text-primary">{xp} XP</span>
          </div>
          <Progress value={progressPercent} className="h-2 mb-2" />
          {nextLevelData ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {levelInfo.nextLevel - xp} XP to {nextLevelData.title}
            </p>
          ) : (
            <p className="text-xs text-primary font-medium">Max level reached!</p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <BookOpen className="w-4 h-4 text-primary" />
            <div>
              <div className="font-bold text-sm">{profile?.total_books_read || 0}</div>
              <div className="text-xs text-muted-foreground">Books</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <FileText className="w-4 h-4 text-accent" />
            <div>
              <div className="font-bold text-sm">{profile?.total_pages_read || 0}</div>
              <div className="text-xs text-muted-foreground">Pages</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <div>
              <div className="font-bold text-sm">{badges.length}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
            <Star className="w-4 h-4 text-secondary" />
            <div>
              <div className="font-bold text-sm">Lv.{levelInfo.level}</div>
              <div className="text-xs text-muted-foreground">Level</div>
            </div>
          </div>
        </div>

        {/* Level Progression */}
        <div className="px-4 pb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Level Progression</p>
          <div className="space-y-1">
            {EXPERIENCE_LEVELS.map((level) => {
              const isCurrentLevel = level.level === levelInfo.level;
              const isCompleted = level.level < levelInfo.level;
              return (
                <div 
                  key={level.level}
                  className={`flex items-center justify-between text-xs p-1.5 rounded ${
                    isCurrentLevel ? 'bg-primary/10 border border-primary/30' : 
                    isCompleted ? 'opacity-60' : 'opacity-40'
                  }`}
                >
                  <span className={isCurrentLevel ? 'font-medium text-primary' : ''}>
                    {isCompleted && '✓ '}{level.title}
                  </span>
                  <span className="text-muted-foreground">{level.minXp} XP</span>
                </div>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
