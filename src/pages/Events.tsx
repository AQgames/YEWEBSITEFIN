import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeasonalDecorations } from '@/components/SeasonalDecorations';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface Event {
  id: string;
  date: string;
  title: string;
  location: string;
  description?: string;
}

const events: Event[] = [
  {
    id: '1',
    date: 'Tuesday 27th January 2025',
    title: 'Year 9 Parents Evening',
    location: 'AGS',
    description: 'Come visit our stall to learn about Rootmarks and our seeded bookmarks!'
  }
];

const Events = () => {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background to-muted/30">
      <SeasonalDecorations />
      <Navbar />
      
      <main className="container mx-auto px-4 pt-28 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upcoming Events
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find us at these upcoming events! Come say hello and learn more about Rootmarks.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {events.map((event) => (
            <Card key={event.id} className="border-2 hover:border-primary/50 hover:shadow-xl transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-foreground" />
                  </div>
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="font-medium">{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span>{event.location}</span>
                </div>
                {event.description && (
                  <p className="text-foreground mt-4 p-4 bg-muted/50 rounded-xl">
                    {event.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}

          {events.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No upcoming events at the moment.</p>
              <p>Check back soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Events;
