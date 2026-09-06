import { useEffect } from 'react';

export default function PerformanceOptimizations() {
  useEffect(() => {
    // Preload critical resources
    const preloadResource = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    };

    // Preload fonts if using external fonts
    preloadResource('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap', 'style');

    // Optimize images with lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));

    // Service Worker registration for caching
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service worker registered'))
        .catch(() => console.log('Service worker registration failed'));
    }

    // Cleanup
    return () => {
      imageObserver.disconnect();
    };
  }, []);

  return null;
}