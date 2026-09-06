import { Shield, Award, Users, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function TrustSignals() {
  const trustElements = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "100% Money Back Guarantee",
      description: "30-day risk-free trial"
    },
    {
      icon: <Award className="w-8 h-8 text-[#FFD600]" />,
      title: "Certified Personal Trainer",
      description: "10+ years experience"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "1,247+ Success Stories",
      description: "Real transformations"
    },
    {
      icon: <Star className="w-8 h-8 text-orange-500" />,
      title: "5/5 Rating",
      description: "From verified clients"
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustElements.map((element, index) => (
            <Card key={index} className="text-center border-0 shadow-none">
              <CardContent className="p-4">
                <div className="flex justify-center mb-3">
                  {element.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{element.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">{element.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}