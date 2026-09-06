// Google OAuth 2.0 authentication utilities
declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

interface AuthResponse {
  access_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
}

class GoogleAuthService {
  private clientId: string;
  private isInitialized = false;
  private authInstance: any = null;

  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load Google API script
    await this.loadGoogleScript();
    
    // Initialize Google Auth
    await new Promise((resolve) => {
      window.gapi.load('auth2', resolve);
    });

    this.authInstance = window.gapi.auth2.init({
      client_id: this.clientId,
      scope: 'email profile openid'
    });

    this.isInitialized = true;
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google API'));
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<GoogleUser> {
    await this.initialize();
    
    const authResponse = await this.authInstance.signIn();
    const profile = authResponse.getBasicProfile();
    
    return {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl(),
      given_name: profile.getGivenName(),
      family_name: profile.getFamilyName()
    };
  }

  async signOut(): Promise<void> {
    if (this.authInstance) {
      await this.authInstance.signOut();
    }
  }

  getCurrentUser(): GoogleUser | null {
    if (!this.authInstance) return null;
    
    const authUser = this.authInstance.currentUser.get();
    if (!authUser.isSignedIn()) return null;

    const profile = authUser.getBasicProfile();
    return {
      id: profile.getId(),
      email: profile.getEmail(),
      name: profile.getName(),
      picture: profile.getImageUrl(),
      given_name: profile.getGivenName(),
      family_name: profile.getFamilyName()
    };
  }

  isSignedIn(): boolean {
    return this.authInstance?.currentUser?.get()?.isSignedIn() || false;
  }

  getAccessToken(): string | null {
    if (!this.authInstance) return null;
    
    const authUser = this.authInstance.currentUser.get();
    return authUser.isSignedIn() ? authUser.getAuthResponse().access_token : null;
  }
}

export const googleAuth = new GoogleAuthService();
export type { GoogleUser };