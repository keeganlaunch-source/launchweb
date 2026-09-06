import { services, appService } from "@/data/services";
import { ArrowRight } from "lucide-react";

export default function ServicesOverview() {
  const allServices = [...services, appService];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="services" className="py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="font-heading text-5xl lg:text-7xl uppercase tracking-tight mb-4">
            Everything <span className="text-primary">Launch</span> Offers
          </h2>
          <p className="text-muted-foreground text-lg">
            In-person coaching in Ballito, and a global app. Pick what fits your life.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allServices.map((service) => (
            <button
              key={service.id}
              onClick={() => scrollTo(service.id)}
              className="group text-left bg-card border border-border p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-heading text-2xl uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{service.summary}</p>
              <span className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-primary font-medium">
                Details <ArrowRight className="w-3 h-3" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
