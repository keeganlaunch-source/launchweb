import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { initializeFirebase, trackPageView } from '../lib/firebase';

export const useFirebaseAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  const initializedRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Initialize Firebase once
    if (!initializedRef.current) {
      const success = initializeFirebase();
      initializedRef.current = true;
      
      if (!success) {
        console.warn('Firebase Analytics not initialized - missing configuration');
        return;
      }
    }
    
    // Track page views when location changes
    if (location !== prevLocationRef.current && initializedRef.current) {
      const pageTitle = getPageTitle(location);
      trackPageView(pageTitle, window.location.href);
      prevLocationRef.current = location;
    }
  }, [location]);
};

// Helper function to get meaningful page titles
const getPageTitle = (path: string): string => {
  switch (path) {
    case '/':
      return 'Home - Launch Lifestyle';
    case '/privacy':
      return 'Privacy Policy - Launch Lifestyle';
    case '/terms':
      return 'Terms of Service - Launch Lifestyle';
    case '/cookies':
      return 'Cookie Policy - Launch Lifestyle';
    case '/refund':
      return 'Refund Policy - Launch Lifestyle';
    default:
      return `${path} - Launch Lifestyle`;
  }
};