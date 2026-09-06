import robImage from "@assets/IMG_1145.jpeg";
import emmaImage from "@assets/WhatsApp Image 2025-02-12 at 18.20.29_b2546580.jpeg";
import bronwenImage from "@assets/IMG_1146.jpeg";
import kristinaImage from "@assets/IMG_1540.jpeg";
import jasonImage from "@assets/IMG_1221.jpeg";
import dylanImage from "@assets/IMG_1222.jpeg";

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

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <div className="bg-card border border-border p-8 flex flex-col justify-between w-[380px] shrink-0">
      <p className="text-base leading-relaxed text-foreground/85 mb-6">
        {testimonial.content}
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="w-10 h-10 bg-muted rounded-full overflow-hidden shrink-0">
          <img
            src={testimonial.author.image}
            alt={testimonial.author.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium text-sm">{testimonial.author.name}</h4>
          <p className="text-muted-foreground text-xs">{testimonial.author.detail}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  // Duplicated so the track can loop seamlessly from -50% back to 0
  const track = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden">
      <div className="text-center mb-16 px-6">
        <h2 className="font-heading text-5xl lg:text-7xl uppercase tracking-tight">
          What <span className="text-primary">Clients</span> Say
        </h2>
      </div>

      <div className="[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="flex gap-6 w-max animate-marquee">
          {track.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
