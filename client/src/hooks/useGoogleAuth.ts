import { useState, useEffect } from 'react';
import { googleAuth, type GoogleUser } from '@/lib/google-auth';
import { trackLaunchAIInteraction } from '@/lib/analytics';

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await googleAuth.initialize();
        const currentUser = googleAuth.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async () => {
    setIsSigningIn(true);
    try {
      const user = await googleAuth.signIn();
      setUser(user);
      
      // Track successful sign-in
      trackEvent('login', 'authentication', 'google_oauth');
      
      return user;
    } catch (error) {
      console.error('Sign-in failed:', error);
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      await googleAuth.signOut();
      setUser(null);
      
      // Track sign-out
      trackEvent('logout', 'authentication', 'google_oauth');
    } catch (error) {
      console.error('Sign-out failed:', error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isSigningIn,
    isAuthenticated: !!user,
    signIn,
    signOut
  };
}