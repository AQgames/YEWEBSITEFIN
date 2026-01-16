import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { AvatarSelector, getAvatarEmoji } from '@/components/AvatarSelector';
import { SeasonalDecorations } from '@/components/SeasonalDecorations';
import { Trophy, Star, BookOpen, Scroll, Crown, FileText, Library, Lock, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  'book': <BookOpen className="w-8 h-8" />,
  'book-open': <BookOpen className="w-8 h-8" />,
  'library': <Library className="w-8 h-8" />,
  'file-text': <FileText className="w-8 h-8" />,
  'scroll': <Scroll className="w-8 h-8" />,
  'trophy': <Trophy className="w-8 h-8" />,
  'crown': <Crown className="w-8 h-8" />,
  'star': <Star className="w-8 h-8" />,
};

const difficultyColors: Record<string, string> = {
  'easy': 'bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30',
  'normal': 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30',
  'hard': 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
  'legendary': 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
};

const EXPERIENCE_LEVELS = [
  { title: 'Beginner Reader', level: 1, minXp: 0, maxXp: 100, color: 'text-gray-500' },
  { title: 'Apprentice Reader', level: 2, minXp: 100, maxXp: 500, color: 'text-green-500' },
  { title: 'Adept Reader', level: 3, minXp: 500, maxXp: 1000, color: 'text-blue-500' },
  { title: 'Expert Reader', level: 4, minXp: 1000, maxXp: 2500, color: 'text-purple-500' },
  { title: 'Master Reader', level: 5, minXp: 2500, maxXp: 5000, color: 'text-orange-500' },
  { title: 'Legend Reader', level: 6, minXp: 5000, maxXp: 10000, color: 'text-yellow-500' },
];

const Achievements = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, badges, allBadges, loading, updateAvatar, getExperienceLevel } = useProfile();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 px-4 text-center">
          <p className="text-xl">Loading achievements... 🏆</p>
        </div>
      </div>
    );
  }

  const earnedBadgeIds = new Set(badges.map(b => b.id));
  const levelInfo = getExperienceLevel();
  const xp = profile?.experience_points || 0;
  
  // Find current level data
  const currentLevelData = EXPERIENCE_LEVELS.find(l => l.level === levelInfo.level) || EXPERIENCE_LEVELS[0];
  const nextLevelData = EXPERIENCE_LEVELS.find(l => l.level === levelInfo.level + 1);
  
  const xpInCurrentLevel = xp - currentLevelData.minXp;
  const xpNeededForNextLevel = currentLevelData.maxXp - currentLevelData.minXp;
  const xpProgress = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-season-bg via-background to-season-accent/10">
      <SeasonalDecorations />
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Profile Section */}
          <Card className="mb-8 border-2 border-primary/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-8">
              <div className="flex items-center gap-6">
                <AvatarSelector
                  currentAvatar={profile?.avatar_id || 'default'}
                  onSelect={updateAvatar}
                  trigger={
                    <button className="relative group">
                      <div className="text-7xl transition-transform group-hover:scale-110">
                        {getAvatarEmoji(profile?.avatar_id || 'default')}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        ✏️
                      </div>
                    </button>
                  }
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{profile?.username || 'Reader'}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={cn("text-lg px-4 py-1", currentLevelData.color, "bg-gradient-to-r from-primary to-accent text-primary-foreground")}>
                      <Sparkles className="w-4 h-4 mr-1" />
                      {levelInfo.title}
                    </Badge>
                    <span className="text-muted-foreground">Level {levelInfo.level}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Experience Points</span>
                      <span className="font-medium">{xp} / {currentLevelData.maxXp} XP</span>
                    </div>
                    <Progress value={Math.min(xpProgress, 100)} className="h-3" />
                    {nextLevelData && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {currentLevelData.maxXp - xp} XP until {nextLevelData.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold">{profile?.total_books_read || 0}</div>
                  <div className="text-sm text-muted-foreground">Books Read</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <FileText className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-3xl font-bold">{profile?.total_pages_read || 0}</div>
                  <div className="text-sm text-muted-foreground">Pages Read</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold">{badges.length}</div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <div className="text-3xl font-bold">{xp}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Level Progression */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <TrendingUp className="w-6 h-6 text-primary" />
                Level Progression
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {EXPERIENCE_LEVELS.map((level) => {
                  const isCurrentLevel = level.level === levelInfo.level;
                  const isCompleted = level.level < levelInfo.level;
                  const progressInLevel = isCurrentLevel 
                    ? ((xp - level.minXp) / (level.maxXp - level.minXp)) * 100 
                    : isCompleted ? 100 : 0;
                  
                  return (
                    <div 
                      key={level.level}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-all",
                        isCurrentLevel ? "bg-primary/10 border-2 border-primary/30" : 
                        isCompleted ? "bg-muted/30" : "bg-muted/10 opacity-50"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                        isCompleted ? "bg-primary text-primary-foreground" :
                        isCurrentLevel ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      )}>
                        {isCompleted ? '✓' : level.level}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("font-medium", level.color)}>
                            {level.title}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {level.minXp} - {level.maxXp} XP
                          </span>
                        </div>
                        <Progress value={progressInLevel} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allBadges.map((badge) => {
                  const isEarned = earnedBadgeIds.has(badge.id);
                  const difficulty = (badge as any).difficulty || 'normal';
                  const xpReward = (badge as any).xp_reward || 50;
                  
                  return (
                    <div
                      key={badge.id}
                      className={cn(
                        "relative p-4 rounded-xl transition-all flex items-start gap-4",
                        isEarned
                          ? "bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-2 border-yellow-400"
                          : "bg-muted/30 border-2 border-dashed border-muted-foreground/20 opacity-60"
                      )}
                    >
                      <div className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center shrink-0",
                        isEarned
                          ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {isEarned ? iconMap[badge.icon] : <Lock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold truncate">{badge.name}</h4>
                          <Badge className={cn("text-xs border", difficultyColors[difficulty])}>
                            {difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Zap className="w-3 h-3 text-yellow-500" />
                          <span className="text-yellow-600 dark:text-yellow-400 font-medium">+{xpReward} XP</span>
                          {badge.requirement_type === 'books_read' && (
                            <span className="text-muted-foreground">• {badge.requirement_value} books</span>
                          )}
                          {badge.requirement_type === 'pages_read' && (
                            <span className="text-muted-foreground">• {badge.requirement_value} pages</span>
                          )}
                        </div>
                      </div>
                      {isEarned && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
