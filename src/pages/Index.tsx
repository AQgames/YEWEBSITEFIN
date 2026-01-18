import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSeason } from '@/hooks/useSeason';
import { SeasonalDecorations } from '@/components/SeasonalDecorations';
import { BookOpen, Sprout, Camera, Star, Trophy, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const season = useSeason();
  const { user } = useAuth();

  const isChristmas = season === 'christmas';

  return (
    <div className="min-h-screen relative">
      <SeasonalDecorations />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-season-bg via-background to-season-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-secondary rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          {isChristmas && (
            <div className="mb-6 inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-2 rounded-full border border-primary/20">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Happy Holidays! 🎄</span>
              <Sparkles className="w-5 h-5" />
            </div>
          )}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
            Plant Your Reading Journey
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your books, earn achievements, and watch your reading garden bloom! 🌱📚
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform bg-gradient-to-r from-primary to-accent">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Garden
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/my-garden">
                  <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform bg-gradient-to-r from-primary to-accent">
                    <BookOpen className="w-5 h-5 mr-2" />
                    My Garden
                  </Button>
                </Link>
                <Link to="/achievements">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Achievements
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            How Seeded Bookmarks Work 🌿
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
            Turn your reading adventures into real-world gardens!
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all hover:scale-105 hover:border-primary/50 group">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">1. Read Your Book</h3>
                <p className="text-muted-foreground text-lg">
                  Use your seeded bookmark while enjoying your favorite stories! Track your page progress in our app.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all hover:scale-105 hover:border-accent/50 group">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="w-10 h-10 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">2. Finish & Rate</h3>
                <p className="text-muted-foreground text-lg">
                  When you finish reading, rate your book out of 5 stars and earn XP & badges!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all hover:scale-105 hover:border-secondary/50 group">
              <CardContent className="pt-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Sprout className="w-10 h-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">3. Plant & Grow</h3>
                <p className="text-muted-foreground text-lg">
                  Plant your bookmark in soil, water it, and watch beautiful flowers bloom! 🌸
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 p-8 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-3xl max-w-3xl mx-auto border-2 border-primary/10">
            <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
              <Sprout className="w-6 h-6 text-primary" />
              Planting Instructions
            </h3>
            <ol className="space-y-4 text-lg">
              <li className="flex items-start gap-4 p-3 bg-background/50 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</span>
                <span>Soak the card in water for 30-60 mins</span>
              </li>
              <li className="flex items-start gap-4 p-3 bg-background/50 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</span>
                <span>Whilst card is soaking, prepare a seed tray with potting compost</span>
              </li>
              <li className="flex items-start gap-4 p-3 bg-background/50 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</span>
                <span>Level off compost and water</span>
              </li>
              <li className="flex items-start gap-4 p-3 bg-background/50 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</span>
                <span>After soaking place the card on the compost and gently press down, but do not cover the card with compost</span>
              </li>
              <li className="flex items-start gap-4 p-3 bg-background/50 rounded-xl">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">5</span>
                <span>Place the seed tray in a propagator or cover with cling film and put in a warm sunny place such as the kitchen window sill or conservatory 🌻</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Your Reading Companion 📖
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all group">
              <CardContent className="pt-8">
                <BookOpen className="w-14 h-14 text-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">Track Your Books</h3>
                <p className="text-muted-foreground text-lg">
                  Search for books, track pages read, and see your progress percentage!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-yellow-500 hover:shadow-xl transition-all group">
              <CardContent className="pt-8">
                <Trophy className="w-14 h-14 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">Earn Achievements</h3>
                <p className="text-muted-foreground text-lg">
                  Collect badges, gain XP, and level up from Beginner to Legend Reader!
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent hover:shadow-xl transition-all group">
              <CardContent className="pt-8">
                <Camera className="w-14 h-14 text-accent mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">Plant Health Scanner</h3>
                <p className="text-muted-foreground text-lg">
                  Scan your flowers with AI to check their health and get growing tips!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t-2 border-primary/10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Rootmarks
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2026 Rootmarks. Grow your mind, plant your future. 🌱
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
