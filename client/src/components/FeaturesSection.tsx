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
    <section id="features" className="py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-5xl lg:text-7xl uppercase tracking-tight mb-4">
            What You <span className="text-primary">Get</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything built into the Launch Lifestyle app.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border p-8 transition-colors hover:border-primary/50"
              >
                <Icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="font-heading text-2xl uppercase tracking-wide mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
