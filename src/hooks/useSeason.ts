import { useEffect, useState } from 'react';

export type Season = 'halloween' | 'christmas' | 'spring' | 'summer' | 'autumn' | 'winter';

export const useSeason = () => {
  const [season, setSeason] = useState<Season>('spring');

  useEffect(() => {
    const getCurrentSeason = (): Season => {
      const now = new Date();
      const month = now.getMonth(); // 0-11
      const day = now.getDate();
      
      // Halloween theme (October 15 - November 5)
      if ((month === 9 && day >= 15) || (month === 10 && day <= 5)) {
        return 'halloween';
      }
      
      // Christmas theme (December 1 - January 6)
      if (month === 11 || (month === 0 && day <= 6)) {
        return 'christmas';
      }
      
      // Spring (March, April, May)
      if (month >= 2 && month <= 4) return 'spring';
      
      // Summer (June, July, August)
      if (month >= 5 && month <= 7) return 'summer';
      
      // Autumn (September, October, November)
      if (month >= 8 && month <= 10) return 'autumn';
      
      // Winter (December, January, February)
      return 'winter';
    };

    const currentSeason = getCurrentSeason();
    setSeason(currentSeason);
    
    // Apply season to document
    document.documentElement.setAttribute('data-season', currentSeason);
  }, []);

  return season;
};
