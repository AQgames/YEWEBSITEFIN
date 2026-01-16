import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  id: string;
  username: string;
  email: string;
  total_books_read: number;
  total_pages_read: number;
  experience_points: number;
  avatar_id: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  difficulty: string;
  xp_reward: number;
}

interface UserBadge extends Badge {
  earned_at: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchBadges = async () => {
    if (!user) return;

    try {
      // Fetch all badges
      const { data: allBadgesData } = await supabase
        .from('badges')
        .select('*')
        .order('requirement_value');

      setAllBadges(allBadgesData || []);

      // Fetch user's earned badges
      const { data: userBadgesData } = await supabase
        .from('user_badges')
        .select(`
          earned_at,
          badges (*)
        `)
        .eq('user_id', user.id);

      if (userBadgesData) {
        const earnedBadges = userBadgesData.map((ub: any) => ({
          ...ub.badges,
          earned_at: ub.earned_at,
        }));
        setBadges(earnedBadges);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const updateAvatar = async (avatarId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_id: avatarId })
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile();
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const checkAndAwardBadges = async (): Promise<Badge | null> => {
    if (!user || !profile) return null;

    try {
      // Refresh profile to get latest stats
      const { data: freshProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!freshProfile) return null;

      const { data: unearned } = await supabase
        .from('badges')
        .select('*');

      const { data: earned } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.id);

      const earnedIds = new Set(earned?.map(e => e.badge_id) || []);
      
      for (const badge of unearned || []) {
        if (earnedIds.has(badge.id)) continue;

        let qualified = false;
        if (badge.requirement_type === 'books_read' && freshProfile.total_books_read >= badge.requirement_value) {
          qualified = true;
        }
        if (badge.requirement_type === 'pages_read' && freshProfile.total_pages_read >= badge.requirement_value) {
          qualified = true;
        }

        if (qualified) {
          // Insert badge
          const { error: badgeError } = await supabase
            .from('user_badges')
            .insert({ user_id: user.id, badge_id: badge.id });

          if (!badgeError) {
            // Award XP for the badge
            const xpReward = badge.xp_reward || 50;
            const newXp = (freshProfile.experience_points || 0) + xpReward;
            
            await supabase
              .from('profiles')
              .update({ experience_points: newXp })
              .eq('id', user.id);

            await fetchBadges();
            await fetchProfile();
            return badge;
          }
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
    return null;
  };

  const getExperienceLevel = (): { title: string; level: number; nextLevel: number } => {
    const xp = profile?.experience_points || 0;
    
    if (xp >= 5000) return { title: 'Legend Reader', level: 6, nextLevel: 10000 };
    if (xp >= 2500) return { title: 'Master Reader', level: 5, nextLevel: 5000 };
    if (xp >= 1000) return { title: 'Expert Reader', level: 4, nextLevel: 2500 };
    if (xp >= 500) return { title: 'Adept Reader', level: 3, nextLevel: 1000 };
    if (xp >= 100) return { title: 'Apprentice Reader', level: 2, nextLevel: 500 };
    return { title: 'Beginner Reader', level: 1, nextLevel: 100 };
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchBadges()]);
      setLoading(false);
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return {
    profile,
    badges,
    allBadges,
    loading,
    updateAvatar,
    checkAndAwardBadges,
    getExperienceLevel,
    refreshProfile: fetchProfile,
    refreshBadges: fetchBadges,
  };
};
