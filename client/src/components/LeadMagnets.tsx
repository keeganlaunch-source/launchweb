import { useState } from 'react';
import { Download, Dumbbell, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    <section className="py-24 px-6 lg:px-12 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="font-heading text-5xl lg:text-7xl uppercase tracking-tight mb-4">
            Free <span className="text-primary">Resources</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose a free resource and get a taste of the Launch Lifestyle approach.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {leadMagnets.map((magnet) => (
            <div key={magnet.id} className="bg-background border border-border p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="text-primary">{magnet.icon}</div>
                <span className="text-xs uppercase tracking-widest text-primary border border-primary/40 px-2 py-1">
                  {magnet.value}
                </span>
              </div>

              <h3 className="font-heading text-2xl uppercase tracking-wide mb-2">{magnet.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{magnet.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {magnet.includes.map((item, index) => (
                  <li key={index} className="flex items-center text-sm gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={selectedMagnet === magnet.id ? email : ''}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedMagnet(magnet.id);
                  }}
                  className="w-full bg-background border-border"
                />
                <Button
                  onClick={() => handleSubmit(magnet.id)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium uppercase tracking-wide"
                  disabled={!email || selectedMagnet !== magnet.id}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {magnet.id === 'consultation-draw' ? 'Enter Draw' : 'Get Free Access'}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-3 text-center">
                {magnet.id === 'consultation-draw'
                  ? 'Draw ends last day of the month. Only 3 winners selected.'
                  : 'No spam. Unsubscribe anytime.'
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
