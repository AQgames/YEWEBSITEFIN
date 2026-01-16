import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Camera, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PlantScanner = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      setSelectedImage(base64Image);
      await analyzeImage(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageData: string) => {
    setAnalyzing(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-plant', {
        body: { imageData },
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysis(data.analysis);
        
        // Save to database
        await supabase.from('plant_scans').insert({
          user_id: user?.id,
          image_url: imageData,
          health_status: data.analysis.split('\n')[0] || 'Unknown',
          tips: data.analysis,
        });

        toast.success('Plant analyzed successfully! 🌿');
      }
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze plant. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 px-4 text-center">
          <p className="text-xl">Loading... 🌱</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-season-bg via-background to-season-accent/10">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Plant Health Scanner 🌿</h1>
            <p className="text-muted-foreground text-lg">
              Upload a photo of your plant to check its health!
            </p>
          </div>

          <Card className="mb-6 border-2 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Important Disclaimer
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Our AI plant scanner is a helpful tool, but it's not always 100% accurate. 
                    For serious plant health concerns, please consult a gardening expert or visit your local nursery!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Upload Plant Photo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="plant-upload"
                  disabled={analyzing}
                />
                <label htmlFor="plant-upload" className="cursor-pointer">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Click to upload a plant photo
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG up to 5MB
                  </p>
                </label>
              </div>

              {selectedImage && (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden border-2">
                    <img
                      src={selectedImage}
                      alt="Selected plant"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>

                  {analyzing && (
                    <div className="text-center py-8">
                      <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-lg font-medium">
                        Analyzing your plant... 🔍
                      </p>
                    </div>
                  )}

                  {analysis && !analyzing && (
                    <Card className="bg-primary/5 border-primary">
                      <CardHeader>
                        <CardTitle className="text-xl">Analysis Results 🌿</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">{analysis}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlantScanner;