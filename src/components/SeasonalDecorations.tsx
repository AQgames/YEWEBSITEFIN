import { useSeason } from '@/hooks/useSeason';
import { Snowflake, Leaf, Sun, Flower, Ghost, Candy, Gift, Star } from 'lucide-react';

export const SeasonalDecorations = () => {
  const season = useSeason();

  const decorations = {
    halloween: (
      <>
        <Ghost className="absolute top-20 right-10 w-16 h-16 text-orange-500/40 animate-float" />
        <Candy className="absolute bottom-32 left-16 w-14 h-14 text-purple-500/40 float-delayed" />
        <Ghost className="absolute top-1/3 right-1/3 w-12 h-12 text-purple-400/30 animate-float" />
        <Candy className="absolute bottom-1/4 left-1/4 w-10 h-10 text-orange-400/40 float-delayed" />
      </>
    ),
    christmas: null,
    spring: (
      <>
        <Flower className="absolute top-20 right-10 w-12 h-12 text-pink-400/30 animate-float" />
        <Flower className="absolute bottom-32 left-16 w-16 h-16 text-purple-400/30 float-delayed" />
        <Flower className="absolute top-1/2 right-1/4 w-10 h-10 text-pink-300/30 animate-float" />
      </>
    ),
    summer: (
      <>
        <Sun className="absolute top-20 right-10 w-16 h-16 text-yellow-400/30 pulse-slow" />
        <Sun className="absolute bottom-32 left-16 w-12 h-12 text-orange-400/30 pulse-slow" />
        <Leaf className="absolute top-1/2 right-1/4 w-14 h-14 text-green-400/30 animate-float" />
      </>
    ),
    autumn: (
      <>
        <Leaf className="absolute top-20 right-10 w-12 h-12 text-orange-500/30 animate-float" />
        <Leaf className="absolute bottom-32 left-16 w-14 h-14 text-red-500/30 float-delayed" />
        <Leaf className="absolute top-1/3 right-1/3 w-10 h-10 text-yellow-600/30 animate-float" />
        <Leaf className="absolute bottom-1/4 right-1/2 w-12 h-12 text-orange-400/30 float-delayed" />
      </>
    ),
    winter: null,
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {decorations[season]}
    </div>
  );
};
