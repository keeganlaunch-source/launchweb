import { services } from "@/data/services";
import { enquiryWhatsappLink, enquiryMailtoLink } from "@/lib/contact";
import { MessageCircle, Mail, Clock } from "lucide-react";

export default function ServiceSections() {
  return (
    <>
      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={`py-20 px-6 lg:px-12 ${index % 2 === 0 ? 'bg-background' : 'bg-card'}`}
        >
          <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3 space-y-4">
              <h2 className="font-heading text-4xl lg:text-5xl uppercase tracking-tight">
                {service.title}
              </h2>
              <p className="text-lg text-foreground/85 leading-relaxed">
                {service.description}
              </p>
              {service.schedule && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                  <Clock className="w-4 h-4 text-primary" />
                  {service.schedule}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 border border-border p-6 space-y-4">
              <div className="space-y-1">
                {service.pricing.map((line, i) => (
                  <p key={i} className="font-heading text-2xl uppercase tracking-wide text-primary">
                    {line}
                  </p>
                ))}
                {service.firstSessionFree && (
                  <p className="text-sm text-muted-foreground pt-1">First session free</p>
                )}
              </div>

              <div className="space-y-2 pt-2">
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
        </section>
      ))}
    </>
  );
}
