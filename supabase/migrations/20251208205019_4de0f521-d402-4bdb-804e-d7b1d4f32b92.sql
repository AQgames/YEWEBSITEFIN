-- Add difficulty and XP reward columns to badges
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS difficulty text DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard', 'legendary'));
ALTER TABLE public.badges ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 50;

-- Update existing badges with difficulties and XP rewards
UPDATE public.badges SET difficulty = 'easy', xp_reward = 25 WHERE requirement_type = 'books_read' AND requirement_value = 1;
UPDATE public.badges SET difficulty = 'normal', xp_reward = 50 WHERE requirement_type = 'books_read' AND requirement_value = 5;
UPDATE public.badges SET difficulty = 'hard', xp_reward = 100 WHERE requirement_type = 'books_read' AND requirement_value = 10;
UPDATE public.badges SET difficulty = 'legendary', xp_reward = 250 WHERE requirement_type = 'books_read' AND requirement_value = 25;

UPDATE public.badges SET difficulty = 'easy', xp_reward = 25 WHERE requirement_type = 'pages_read' AND requirement_value = 100;
UPDATE public.badges SET difficulty = 'normal', xp_reward = 50 WHERE requirement_type = 'pages_read' AND requirement_value = 500;
UPDATE public.badges SET difficulty = 'hard', xp_reward = 100 WHERE requirement_type = 'pages_read' AND requirement_value = 1000;
UPDATE public.badges SET difficulty = 'legendary', xp_reward = 250 WHERE requirement_type = 'pages_read' AND requirement_value = 5000;