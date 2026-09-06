import robImage from "@assets/IMG_1145.jpeg";
import emmaImage from "@assets/WhatsApp Image 2025-02-12 at 18.20.29_b2546580.jpeg";
import bronwenImage from "@assets/IMG_1146.jpeg";
import kristinaImage from "@assets/IMG_1540.jpeg";
import jasonImage from "@assets/IMG_1221.jpeg";
import dylanImage from "@assets/IMG_1222.jpeg";

export default function TestimonialsSection() {
  const testimonials = [
    {
      content: "I recently fractured my wrist, and the Search tab was a lifesaver. It helped me quickly find wrist-friendly workouts that kept me active. The time-based tags are also incredibly useful for adapting to a busy schedule - really smart feature. Appreciate how practical and flexible the app is.",
      author: {
        name: "Rob Aitken",
        detail: "Busy CEO of a company",
        image: robImage
      }
    },
    {
      content: "Keegan is an excellent trainer and coach. He's totally committed to your success, taking time to understand your challenges and fitness goals. His training sessions are personalised and super engaging. Highly recommend for those wanting to stay in shape, reach new heights or anyone seeking to make a transformative health journey.",
      author: {
        name: "Bronwen Bowley",
        detail: "Fused Spine",
        image: bronwenImage
      }
    },
    {
      content: "Wow Keegan the recipes are amazing. I have completely changed my selection of meals based on your recipes. Not only am I seeing results from your exercise routines but feeling so much healthier and have so much more energy in a day. Thank you so much. Best investment I could ever have made.",
      author: {
        name: "Jason Marsden",
        detail: "Manages a holiday resort",
        image: jasonImage
      }
    },
    {
      content: "I've just joined the Launch Lifestyle App and I am stoked to be here. The value on this App is crazy good! Much appreciated Keegs.",
      author: {
        name: "Dylan Smith",
        detail: "Business owner and busy dad/husband",
        image: dylanImage
      }
    },
    {
      content: "I just need to let you know that the Launch App has completely changed the way I train. Super simple, motivating, and crazy effective!",
      author: {
        name: "Emma Jordan",
        detail: "Focussing on career",
        image: emmaImage
      }
    },
    {
      content: "EXCELLENT workout programs!",
      author: {
        name: "Kristina Botha",
        detail: "Busy mom",
        image: kristinaImage
      }
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 lg:px-8 bg-muted">
      <div className="max-w-6xl mx-auto">
        {/* Testimonials Header */}
        <div className="text-center mb-16">
          <h2 className="font-grunge text-4xl lg:text-6xl uppercase tracking-tight mb-4">
            Real <span className="text-primary">Results</span> From Real People
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background border-2 border-border p-8 relative">
              <div className="absolute -top-4 left-6 bg-background px-2">
                <span className="text-4xl text-primary font-black">"</span>
              </div>
              <p className="text-lg mb-6 font-medium pt-4">
                {testimonial.content}
              </p>
              
              {/* Testimonial Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full overflow-hidden">
                  <img 
                    src={testimonial.author.image} 
                    alt={testimonial.author.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-black uppercase text-sm">{testimonial.author.name}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.author.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
