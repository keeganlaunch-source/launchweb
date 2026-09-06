import { Shield, Award, MapPin, Star } from 'lucide-react';

export function TrustSignals() {
  const trustElements = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Money-Back Guarantee",
      description: "30-day risk-free trial"
    },
    {
      icon: <Award className="w-6 h-6 text-primary" />,
      title: "Certified Personal Trainer",
      description: "NASM certified"
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Est. Ballito, 2017",
      description: "Locally built, globally used"
    },
    {
      icon: <Star className="w-6 h-6 text-primary" />,
      title: "Real Client Results",
      description: "See testimonials below"
    }
  ];

  return (
    <section className="py-14 bg-background border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {trustElements.map((element, index) => (
            <div key={index} className="text-center space-y-2">
              <div className="flex justify-center">{element.icon}</div>
              <h3 className="font-medium text-sm uppercase tracking-wide">{element.title}</h3>
              <p className="text-xs text-muted-foreground">{element.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
