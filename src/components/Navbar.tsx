import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Leaf, BookOpen, Camera, LogOut, Trophy, Settings, Calendar } from 'lucide-react';
import { getAvatarEmoji } from './AvatarSelector';
import { useProfile } from '@/hooks/useProfile';
import { UserStatsPopover } from './UserStatsPopover';
import { SettingsDialog } from './SettingsDialog';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b-2 border-primary/10 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rootmarks
            </span>
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            {user ? (
              <>
                <Link to="/my-garden">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">My Garden</span>
                  </Button>
                </Link>
                <Link to="/achievements">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-yellow-500/10">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="hidden sm:inline">Achievements</span>
                  </Button>
                </Link>
                <Link to="/plant-scanner">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-accent/10">
                    <Camera className="w-4 h-4" />
                    <span className="hidden sm:inline">Scanner</span>
                  </Button>
                </Link>
                <Link to="/events">
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Events</span>
                  </Button>
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                  <SettingsDialog
                    trigger={
                      <Button variant="ghost" size="icon" className="hover:bg-muted h-8 w-8">
                        <Settings className="w-4 h-4" />
                      </Button>
                    }
                  />
                  <UserStatsPopover
                    trigger={
                      <button className="text-2xl hover:scale-110 transition-transform">
                        {getAvatarEmoji(profile?.avatar_id || 'default')}
                      </button>
                    }
                  />
                  <Button onClick={signOut} variant="outline" size="sm" className="gap-2">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button className="shadow-lg hover:shadow-xl transition-shadow">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
