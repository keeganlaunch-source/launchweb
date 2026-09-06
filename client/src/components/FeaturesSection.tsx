import { Dumbbell, TrendingUp, Users, Smartphone, Utensils, Headphones } from "lucide-react";
import { trackFeatureClick } from "../lib/firebase";

export default function FeaturesSection() {
  const features = [
    {
      icon: Dumbbell,
      title: "Custom Workouts",
      description: "Personalized exercise plans that adapt to your fitness level, equipment, and schedule.",
      aiQuestion: "Create a custom workout plan based on my fitness level and available equipment"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking", 
      description: "Visual analytics and insights to monitor your improvement and stay motivated.",
      aiQuestion: "How do I track my fitness progress effectively?"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals and share your fitness journey.",
      aiQuestion: "How can I stay motivated and accountable with my fitness goals?"
    },
    {
      icon: Smartphone,
      title: "Mobile App",
      description: "Take your workouts anywhere with our fully-featured mobile application.",
      aiQuestion: "What are the best fitness apps and tools for tracking workouts?"
    },
    {
      icon: Utensils,
      title: "Nutrition Guidance",
      description: "Meal plans, hundreds of tasty recipes, and nutritional advice tailored to support your fitness goals.",
      aiQuestion: "Create a nutrition plan that supports my fitness goals"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock customer support.",
      aiQuestion: "I need help with my fitness routine and staying consistent"
    }
  ];

  const handleFeatureSelect = (feature: { title: string; aiQuestion: string }) => {
    trackFeatureClick(feature.title);
    console.log('Feature selected:', feature.title);
    // Open Launch AI with the specific question for this feature
    window.dispatchEvent(new CustomEvent('openLaunchAI', { 
      detail: { question: feature.aiQuestion } 
    }));
  };

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
                
                {/* Launch AI Button */}
                <button
                  onClick={() => {
                    handleFeatureSelect(feature);
                  }}
                  className="w-full bg-black text-primary px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                >
                  Learn More
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
