import { useState } from 'react';
import { Download, Dumbbell, Calendar, Star, Smartphone } from 'lucide-react';
import { SiAppstore, SiGoogleplay } from 'react-icons/si';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LeadMagnetProps {
  onEmailCapture: (email: string, magnetType: string) => void;
}

export function LeadMagnets({ onEmailCapture }: LeadMagnetProps) {
  const [email, setEmail] = useState('');
  const [selectedMagnet, setSelectedMagnet] = useState<string | null>(null);

  const leadMagnets = [
    {
      id: 'transformation-guide',
      title: '7-Day Launch Transformation Guide',
      description: 'Complete workout and nutrition plan to kickstart your fitness journey',
      icon: <Star className="w-6 h-6" />,
      value: 'R297 Value',
      includes: ['Daily workouts', 'Meal prep guide', 'Progress tracking sheets', 'Motivation tips']
    },
    {
      id: 'ballito-beach-workout',
      title: 'Ballito Beach Body Workout',
      description: 'Get the workout routine! For daily workouts with video demos, join the Launch Lifestyle app',
      icon: <Dumbbell className="w-6 h-6" />,
      value: 'R199 Value',
      includes: ['20-minute HIIT routine', 'No equipment needed', 'Exercise descriptions', 'App Store & Play Store links']
    },
    {
      id: 'consultation-draw',
      title: 'Win a Free 15-Minute Consultation',
      description: 'Enter our monthly draw! Only 3 winners selected. Draw ends last day of the month',
      icon: <Calendar className="w-6 h-6" />,
      value: 'R500 Value',
      includes: ['Goal assessment', 'Custom recommendations', 'Program overview', 'Q&A session']
    }
  ];

  const handleSubmit = (magnetId: string) => {
    if (email) {
      onEmailCapture(email, magnetId);
      setEmail('');
      setSelectedMagnet(null);
    }
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Start Your Transformation Today</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose your free resource and begin your Launch Lifestyle journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {leadMagnets.map((magnet) => (
            <Card key={magnet.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-[#FFD600] text-black">
                  {magnet.value}
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-[#FFD600] rounded-full w-fit">
                  {magnet.icon}
                </div>
                <CardTitle className="text-xl mb-2">{magnet.title}</CardTitle>
                <CardDescription className="text-base">
                  {magnet.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {magnet.includes.map((item, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-[#FFD600] rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* App Store buttons for beach workout */}
                {magnet.id === 'ballito-beach-workout' && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium mb-4 text-center text-gray-700">Download the Launch Lifestyle app for video demos:</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.gtag) {
                            window.gtag('event', 'app_store_click', {
                              method: 'iOS',
                              source: 'lead_magnet',
                              campaign: 'ballito_beach_workout'
                            });
                          }
                          window.open('https://apps.apple.com/za/app/launch-lifestyle/id6743004197', '_blank');
                        }}
                        className="w-full sm:w-40 h-12 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        <div className="text-left text-xs">
                          <div>App Store</div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined' && window.gtag) {
                            window.gtag('event', 'play_store_click', {
                              method: 'Android',
                              source: 'lead_magnet',
                              campaign: 'ballito_beach_workout'
                            });
                          }
                          window.open('https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share', '_blank');
                        }}
                        className="w-full sm:w-40 h-12 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                          <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                        </svg>
                        <div className="text-left text-xs">
                          <div>Google Play</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={selectedMagnet === magnet.id ? email : ''}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSelectedMagnet(magnet.id);
                    }}
                    className="w-full"
                  />
                  <Button 
                    onClick={() => handleSubmit(magnet.id)}
                    className="w-full bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold"
                    disabled={!email || selectedMagnet !== magnet.id}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {magnet.id === 'consultation-draw' ? 'Enter Draw' : 'Get Free Access'}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  {magnet.id === 'consultation-draw' 
                    ? 'Draw ends last day of the month. Only 3 winners selected.'
                    : 'No spam. Unsubscribe anytime. 100% free.'
                  }
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Instant Download
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              No Credit Card Required
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              100% Privacy Protected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}