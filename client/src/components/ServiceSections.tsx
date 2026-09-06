import { services } from "@/data/services";
import { enquiryWhatsappLink, enquiryMailtoLink } from "@/lib/contact";
import { MessageCircle, Mail, Clock } from "lucide-react";

export default function ServiceSections() {
  return (
    <section className="py-24 px-6 lg:px-12 bg-background">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            id={service.id}
            className="bg-card border border-border p-8 flex flex-col"
          >
            <div className="w-14 h-14 flex items-center justify-center border border-primary/30 mb-5">
              <service.icon className="w-6 h-6 text-primary" />
            </div>

            <h2 className="font-heading text-3xl lg:text-4xl uppercase tracking-tight mb-3">
              {service.title}
            </h2>
            <p className="text-base text-foreground/85 leading-relaxed mb-4">
              {service.description}
            </p>
            {service.schedule && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                {service.schedule}
              </div>
            )}

            <div className="mt-auto pt-4 border-t border-border space-y-4">
              <div className="space-y-1">
                {service.pricing.map((line, i) => (
                  <p key={i} className="font-heading text-xl uppercase tracking-wide text-primary">
                    {line}
                  </p>
                ))}
                {service.firstSessionFree && (
                  <p className="text-sm text-muted-foreground pt-1">First session free</p>
                )}
              </div>

              <div className="space-y-2">
                <a
                  href={enquiryWhatsappLink(service.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-primary text-primary-foreground px-5 py-3 font-medium uppercase tracking-wide text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enquire on WhatsApp
                </a>
                <a
                  href={enquiryMailtoLink(service.title)}
                  className="w-full border border-border px-5 py-3 font-medium uppercase tracking-wide text-sm flex items-center justify-center gap-2 text-foreground/80 hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Enquiry
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
