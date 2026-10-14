import { Star } from "lucide-react";
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
  },
  {
    content: "More than fitness and training... Caring about business, but his business is caring! Amazing with children.",
    author: { name: "Rachel Van Greuning", detail: "Google Review" }
  },
  {
    content: "I'm really enjoying my gym sessions with Keegan - he plans well for each session and the exercises are always beneficial.",
    author: { name: "Melissa Wang", detail: "Google Review" }
  },
  {
    content: "Highly recommend Keegan. Professional and on time! He has managed to inspire my two older teenage boys to get moving and understand the long term positive effects of taking care of themselves. He's great for adults too, and usually plays good music.",
    author: { name: "Michelle Corns", detail: "Google Review" }
  },
  {
    content: "Keegan is an outstanding coach. He is patient, caring, and genuinely kind. My son feels comfortable, supported, and encouraged in every session, and he absolutely looks forward to each class with excitement.",
    author: { name: "J Naicker", detail: "Google Review" }
  },
  {
    content: "Keegan is one highly trained person in the fitness industry and shows so much commitment and dedication to his clients. The workouts have a mix of fun to them with challenging exercises as well. He's the best to make you break that sweat.",
    author: { name: "Isabella De Musso", detail: "Google Review" }
  },
  {
    content: "We have appreciated the consistent input Keegan has provided Angus. We are adamant that the physical exercise, strength training and coordination exercises have had an effect on Angus's autism related challenges. His mentorship with our son is also greatly appreciated.",
    author: { name: "Angus Eaton", detail: "Google Review" }
  },
  {
    content: "Keegan is an amazing trainer, he truly cares about his clients' health and fitness. He shares his knowledge and skill with humor and it's always fun.",
    author: { name: "Marilyn Duke", detail: "Google Review" }
  },
  {
    content: "Keegan's motivation before and during sessions is unmatched to any fitness coach I have been to. Appreciate the well thought out training as well as the depth of each session.",
    author: { name: "Chad Brown", detail: "Google Review" }
  },
  {
    content: "Getting back to exercise after a very long absence, Keegan made me feel comfortable, and capable of improving. An excellent workout!",
    author: { name: "Bridget Latter", detail: "Google Review" }
  },
  {
    content: "Keegan is absolutely amazing! So driven, so motivating and inspiring. I highly recommend his services.",
    author: { name: "Dawné Coetzer", detail: "Google Review" }
  },
  {
    content: "Keegan does a weekly class at our pre-primary school and the children absolutely love their time with him. Children need more outside time and exercise. Thank you, Coach Keegan.",
    author: { name: "Tracey Prepok", detail: "Google Review" }
  },
  {
    content: "Launch Fitness is professional, passionate and vivacious when it comes to training kids and working with them.",
    author: { name: "Melissa Hertz", detail: "Google Review" }
  },
  {
    content: "Keegan is a knowledgeable and passionate trainer. Awesome ability to tailor your workouts according to your physical abilities.",
    author: { name: "Dylan Elson", detail: "Google Review" }
  },
  {
    content: "Keegan practises what he preaches. A fit, healthy and knowledgeable leader. I would highly recommend him for all things pertaining to living a better life in a better body.",
    author: { name: "Dylan Smith", detail: "Google Review" }
  },
  {
    content: "Keegan is brilliant. I stopped by for 2 sessions during my holiday and loved it.",
    author: { name: "Christie Cares", detail: "Google Review" }
  }
];

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  const image = "image" in testimonial.author ? testimonial.author.image : undefined;

  return (
    <div className="bg-card border border-border p-8 flex flex-col justify-between w-[380px] shrink-0">
      <div>
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
          ))}
        </div>
        <p className="text-base leading-relaxed text-foreground/85 mb-6">
          {testimonial.content}
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        {image ? (
          <div className="w-10 h-10 bg-muted rounded-full overflow-hidden shrink-0">
            <img
              src={image}
              alt={testimonial.author.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full border border-primary/30 bg-primary/10 text-primary flex items-center justify-center font-heading text-lg shrink-0">
            {testimonial.author.name.charAt(0)}
          </div>
        )}
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
        <div
          className="flex gap-6 w-max animate-marquee"
          style={{ "--marquee-duration": `${testimonials.length * 8}s` } as React.CSSProperties}
        >
          {track.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
