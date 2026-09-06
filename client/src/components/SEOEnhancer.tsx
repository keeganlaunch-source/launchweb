import { useEffect } from 'react';

export default function SEOEnhancer() {
  useEffect(() => {
    // Enhanced Schema.org structured data for fitness coaching
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Launch Lifestyle",
      "image": "https://launchfit.app/og-image.jpg",
      "description": "Building Better Humans. Personal training, group classes, youth coaching and neurodiverse specialist coaching in Ballito, plus a global training app.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Ballito",
        "addressRegion": "KwaZulu-Natal",
        "addressCountry": "ZA"
      },
      "telephone": "+27-69-484-4629",
      "url": "https://launchfit.app",
      "foundingDate": "2017",
      "sameAs": [
        "https://www.instagram.com/launch_lifestyle",
        "https://www.facebook.com/share/1BzegpPS9J/?mibextid=wwXIfr",
        "https://www.tiktok.com/@launch_lifestyle",
        "https://youtube.com/@lifeofkeegs"
      ],
      "service": {
        "@type": "Service",
        "name": "Personal & Group Fitness Coaching",
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
          "name": "Do I need gym equipment?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The Launch Lifestyle app lets you filter workouts by equipment — full gym, limited kit, or bodyweight only."
          }
        },
        {
          "@type": "Question",
          "name": "What if the app isn't for me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer a 30-day money-back guarantee, and every in-person service starts with a free first session."
          }
        },
        {
          "@type": "Question",
          "name": "Where are in-person sessions based?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ballito, KZN, South Africa — at your home, estate, outdoors, or at Sugar Rush Park for group classes."
          }
        }
      ]
    };

    // Update meta tags for better SEO
    const updateMetaTags = () => {
      document.title = "Launch Lifestyle | Personal Training & Coaching, Ballito | Coach Keegs";

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'Personal training, group classes, youth and neurodiverse specialist coaching in Ballito, plus the Launch Lifestyle app. Building Better Humans since 2017.');
      }

      const ogTags = [
        { property: 'og:title', content: 'Launch Lifestyle | Personal Training & Coaching, Ballito' },
        { property: 'og:description', content: 'Personal training, group classes, youth and neurodiverse specialist coaching in Ballito, plus a global training app.' },
        { property: 'og:image', content: 'https://launchfit.app/og-image.jpg' },
        { property: 'og:url', content: 'https://launchfit.app' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Launch Lifestyle' }
      ];

      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Launch Lifestyle | Personal Training & Coaching, Ballito' },
        { name: 'twitter:description', content: 'Personal training, group classes, youth and neurodiverse specialist coaching in Ballito, plus a global training app.' },
        { name: 'twitter:image', content: 'https://launchfit.app/og-image.jpg' }
      ];

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

      const additionalMeta = [
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'keywords', content: 'personal training ballito, fitness coach south africa, neurodiverse coaching, kids sports academy, outdoor group fitness, online training app' },
        { name: 'author', content: 'Coach Keegs' },
        { name: 'geo.region', content: 'ZA-KZN' },
        { name: 'geo.placename', content: 'Ballito, South Africa' }
      ];

      additionalMeta.forEach(meta => {
        const existing = document.querySelector(`meta[name="${meta.name}"]`);
        if (!existing) {
          const metaTag = document.createElement('meta');
          metaTag.setAttribute('name', meta.name);
          metaTag.setAttribute('content', meta.content);
          document.head.appendChild(metaTag);
        } else {
          existing.setAttribute('content', meta.content);
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
