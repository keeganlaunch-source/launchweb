import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackPageView } from '../lib/meta-pixel';

export const useMetaPixel = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Track page view when location changes
    trackPageView();
  }, [location]);

  useEffect(() => {
    // Track initial page load
    trackPageView();
  }, []);
};