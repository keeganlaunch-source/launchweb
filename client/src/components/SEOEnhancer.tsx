import { useEffect } from 'react';

export default function SEOEnhancer() {
  useEffect(() => {
    // Enhanced Schema.org structured data for fitness coaching
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Coach Keegs Fitness",
      "image": "https://launchfit.app/og-image.jpg",
      "description": "Transform your body in 30 days with personalized home fitness coaching. Money-back guarantee.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ZA"
      },
      "telephone": "+27-XXX-XXX-XXXX",
      "url": "https://launchfit.app",
      "sameAs": [
        "https://instagram.com/coachkeegs",
        "https://youtube.com/@coachkeegs",
        "https://tiktok.com/@coachkeegs"
      ],
      "openingHours": "Mo-Su 00:00-23:59",
      "priceRange": "R75-R299",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "247"
      },
      "offers": {
        "@type": "Offer",
        "name": "30-Day Fitness Transformation",
        "price": "299",
        "priceCurrency": "ZAR",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "validThrough": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      "service": {
        "@type": "Service",
        "name": "Online Fitness Coaching",
        "provider": {
          "@type": "Person",
          "name": "Coach Keegs"
        }
      }
    };

    // FAQ Schema for better SERP features
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How quickly will I see results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most clients see visible results within 10-14 days, with significant transformation by day 30. Our program is designed for rapid, sustainable results."
          }
        },
        {
          "@type": "Question", 
          "name": "Do I need gym equipment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No gym required! Our home fitness program uses bodyweight exercises and minimal equipment you already have at home."
          }
        },
        {
          "@type": "Question",
          "name": "What if I don't see results?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a 30-day money-back guarantee. If you follow the program and don't see results, get a full refund."
          }
        }
      ]
    };

    // Update meta tags for better SEO
    const updateMetaTags = () => {
      // Primary meta tags
      document.title = "Transform Your Body in 30 Days | Coach Keegs Fitness | Money-Back Guarantee";
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Get fit at home in 30 days with Coach Keegs proven fitness program. Join 1,247+ success stories. Money-back guarantee. Start your transformation today!');
      }

      // Open Graph tags
      const ogTags = [
        { property: 'og:title', content: 'Transform Your Body in 30 Days | Coach Keegs Fitness' },
        { property: 'og:description', content: 'Join 1,247+ people who transformed their bodies with our proven home fitness program. 30-day money-back guarantee.' },
        { property: 'og:image', content: 'https://launchfit.app/og-image.jpg' },
        { property: 'og:url', content: 'https://launchfit.app' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Coach Keegs Fitness' }
      ];

      // Twitter Card tags
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Transform Your Body in 30 Days | Coach Keegs Fitness' },
        { name: 'twitter:description', content: 'Join 1,247+ success stories. Proven home fitness program with 30-day guarantee.' },
        { name: 'twitter:image', content: 'https://launchfit.app/og-image.jpg' }
      ];

      // Add meta tags if they don't exist
      [...ogTags, ...twitterTags].forEach(tag => {
        const existingTag = document.querySelector(`meta[${tag.property ? 'property' : 'name'}="${tag.property || tag.name}"]`);
        if (!existingTag) {
          const meta = document.createElement('meta');
          if (tag.property) meta.setAttribute('property', tag.property);
          if (tag.name) meta.setAttribute('name', tag.name);
          meta.setAttribute('content', tag.content);
          document.head.appendChild(meta);
        } else {
          existingTag.setAttribute('content', tag.content);
        }
      });

      // Additional SEO meta tags
      const additionalMeta = [
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'keywords', content: 'home fitness, weight loss, fitness coach, online training, 30 day transformation, south africa fitness' },
        { name: 'author', content: 'Coach Keegs' },
        { name: 'geo.region', content: 'ZA' },
        { name: 'geo.placename', content: 'South Africa' }
      ];

      additionalMeta.forEach(meta => {
        const existing = document.querySelector(`meta[name="${meta.name}"]`);
        if (!existing) {
          const metaTag = document.createElement('meta');
          metaTag.setAttribute('name', meta.name);
          metaTag.setAttribute('content', meta.content);
          document.head.appendChild(metaTag);
        }
      });
    };

    // Add structured data to head
    const addStructuredData = (data: any, id: string) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      
      const script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    };

    updateMetaTags();
    addStructuredData(structuredData, 'business-schema');
    addStructuredData(faqSchema, 'faq-schema');

    // Preconnect to external domains for performance
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];

    preconnects.forEach(domain => {
      if (!document.querySelector(`link[href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      }
    });

    // Add canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://launchfit.app';
      document.head.appendChild(link);
    }

  }, []);

  return null; // This component only handles SEO enhancements
}