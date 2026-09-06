import { Dumbbell, TrendingUp, Users, Smartphone, Utensils, Headphones } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Dumbbell,
      title: "Custom Workouts",
      description: "Personalized exercise plans that adapt to your fitness level, equipment, and schedule."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Visual analytics and insights to monitor your improvement and stay motivated."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals and share your fitness journey."
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Take your workouts anywhere with our fully-featured mobile application."
    },
    {
      icon: Utensils,
      title: "Nutrition Guidance",
      description: "Meal plans, hundreds of tasty recipes, and nutritional advice tailored to support your fitness goals."
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock customer support."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Features Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="font-grunge text-4xl lg:text-6xl uppercase tracking-tight mb-4">
            Everything You Need To <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our comprehensive platform provides all the tools, guidance, and community support you need for lasting transformation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            return (
              <div 
                key={index}
                className="bg-muted border-2 border-border p-8 transition-all duration-300 cursor-pointer card-shadow hover:bg-primary group relative"
              >
                <h3 className="text-2xl font-black uppercase mb-4 text-black">{feature.title}</h3>
                <p className="font-medium text-gray-700 mb-4">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
