-- Add book tracking fields to books table
ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS total_pages integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS pages_read integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS cover_url text;

-- Add gamification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS total_books_read integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_pages_read integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS experience_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS avatar_id text DEFAULT 'default';

-- Create badges table
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_badges junction table
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Badges are viewable by everyone
CREATE POLICY "Badges are viewable by everyone" 
ON public.badges 
FOR SELECT 
USING (true);

-- Users can view their own earned badges
CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can earn badges
CREATE POLICY "Users can earn badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert default badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
('First Steps', 'Read your first book', 'book', 'books_read', 1),
('Bookworm', 'Read 5 books', 'book-open', 'books_read', 5),
('Library Explorer', 'Read 10 books', 'library', 'books_read', 10),
('Page Turner', 'Read 100 pages', 'file-text', 'pages_read', 100),
('Avid Reader', 'Read 500 pages', 'scroll', 'pages_read', 500),
('Reading Champion', 'Read 1000 pages', 'trophy', 'pages_read', 1000),
('Master Reader', 'Read 25 books', 'crown', 'books_read', 25),
('Legend', 'Read 5000 pages', 'star', 'pages_read', 5000);