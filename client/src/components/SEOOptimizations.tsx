import { useEffect } from 'react';

interface SEOOptimizationsProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
}

export default function SEOOptimizations({
  title = "Launch Lifestyle - Transform Your Fitness Journey | Personal Training South Africa",
  description = "Join 1000+ members transforming their lives with Launch Lifestyle. Personal fitness coaching, custom workouts, and AI-powered guidance. Start your free trial today.",
  keywords = "fitness coaching, personal trainer, AI fitness, workout plans, South Africa, online training, launch lifestyle",
  canonicalUrl = "https://launchfit.app"
}: SEOOptimizationsProps) {
  
  useEffect(() => {
    // Set document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };
    
    // Core SEO meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Coach Keegs - Launch Lifestyle');
    updateMetaTag('robots', 'index, follow');
    
    // Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:type', 'website');
    updatePropertyTag('og:url', canonicalUrl);
    updatePropertyTag('og:site_name', 'Launch Lifestyle');
    updatePropertyTag('og:image', `${canonicalUrl}/og-image.jpg`);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${canonicalUrl}/og-image.jpg`);
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    
    // JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Launch Lifestyle",
      "url": canonicalUrl,
      "logo": `${canonicalUrl}/app-icon-180.svg`,
      "description": description,
      "founder": {
        "@type": "Person",
        "name": "Keegan",
        "jobTitle": "Founder & Head Coach"
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "ZA"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+27-69-484-4629",
        "contactType": "Customer Service",
        "availableLanguage": "English"
      },
      "sameAs": [
        "https://wa.me/27694844629"
      ]
    };
    
    let jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);
    
  }, [title, description, keywords, canonicalUrl]);
  
  return null; // This component doesn't render anything
}