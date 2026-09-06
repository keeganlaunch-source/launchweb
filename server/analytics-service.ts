import { Request } from "express";
import { db } from "./db";
import { analytics } from "@shared/schema";
import { getLocationFromRequest, enrichLocationData } from "./location-service";

interface AnalyticsEvent {
  sessionId: string;
  eventType: 'page_view' | 'app_download' | 'play_store_click' | 'app_store_click' | 'conversion' | 'newsletter_signup' | 'contact_form' | 'social_click';
  eventData?: any;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  socialPlatform?: 'facebook' | 'instagram' | 'tiktok' | 'whatsapp' | 'youtube';
}

export async function trackEvent(req: Request, event: AnalyticsEvent): Promise<void> {
  try {
    // Get location data from request
    const locationData = await enrichLocationData(getLocationFromRequest(req));
    
    // Extract UTM parameters from query string
    const url = new URL(req.url, `http://${req.headers.host}`);
    const utmSource = url.searchParams.get('utm_source') || event.utmSource;
    const utmMedium = url.searchParams.get('utm_medium') || event.utmMedium;
    const utmCampaign = url.searchParams.get('utm_campaign') || event.utmCampaign;
    
    // Get referrer from headers
    const referrer = req.headers.referer || req.headers.referrer || event.referrer;

    await db.insert(analytics).values({
      sessionId: event.sessionId,
      eventType: event.eventType,
      eventData: event.eventData ? JSON.stringify(event.eventData) : null,
      referrer: referrer as string || null,
      utmSource: utmSource || null,
      utmMedium: utmMedium || null,
      utmCampaign: utmCampaign || null,
      socialPlatform: event.socialPlatform || null,
      country: locationData.country || null,
      city: locationData.city || null,
      region: locationData.region || null,
      ipAddress: locationData.ipAddress || null,
      userAgent: locationData.userAgent || null
    });
  } catch (error) {
    console.error('Failed to track analytics event:', error);
  }
}

export async function getAnalyticsMetrics() {
  try {
    const [allEvents] = await Promise.all([
      db.select().from(analytics)
    ]);

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Filter events by time periods
    const todayEvents = allEvents.filter(e => e.createdAt.toISOString().split('T')[0] === today);
    const weeklyEvents = allEvents.filter(e => e.createdAt >= weekAgo);
    const monthlyEvents = allEvents.filter(e => e.createdAt >= monthAgo);

    // Count by event type
    const eventCounts = {
      total: {
        pageViews: allEvents.filter(e => e.eventType === 'page_view').length,
        playStoreClicks: allEvents.filter(e => e.eventType === 'play_store_click').length,
        appStoreClicks: allEvents.filter(e => e.eventType === 'app_store_click').length,
        appDownloads: allEvents.filter(e => e.eventType === 'app_download').length,
        newsletterSignups: allEvents.filter(e => e.eventType === 'newsletter_signup').length,
        contactForms: allEvents.filter(e => e.eventType === 'contact_form').length,
        conversions: allEvents.filter(e => e.eventType === 'conversion').length,
        socialClicks: allEvents.filter(e => e.eventType === 'social_click').length
      },
      today: {
        pageViews: todayEvents.filter(e => e.eventType === 'page_view').length,
        playStoreClicks: todayEvents.filter(e => e.eventType === 'play_store_click').length,
        appStoreClicks: todayEvents.filter(e => e.eventType === 'app_store_click').length,
        appDownloads: todayEvents.filter(e => e.eventType === 'app_download').length,
        newsletterSignups: todayEvents.filter(e => e.eventType === 'newsletter_signup').length,
        contactForms: todayEvents.filter(e => e.eventType === 'contact_form').length,
        conversions: todayEvents.filter(e => e.eventType === 'conversion').length,
        socialClicks: todayEvents.filter(e => e.eventType === 'social_click').length
      },
      weekly: {
        pageViews: weeklyEvents.filter(e => e.eventType === 'page_view').length,
        playStoreClicks: weeklyEvents.filter(e => e.eventType === 'play_store_click').length,
        appStoreClicks: weeklyEvents.filter(e => e.eventType === 'app_store_click').length,
        appDownloads: weeklyEvents.filter(e => e.eventType === 'app_download').length,
        newsletterSignups: weeklyEvents.filter(e => e.eventType === 'newsletter_signup').length,
        contactForms: weeklyEvents.filter(e => e.eventType === 'contact_form').length,
        conversions: weeklyEvents.filter(e => e.eventType === 'conversion').length,
        socialClicks: weeklyEvents.filter(e => e.eventType === 'social_click').length
      },
      monthly: {
        pageViews: monthlyEvents.filter(e => e.eventType === 'page_view').length,
        playStoreClicks: monthlyEvents.filter(e => e.eventType === 'play_store_click').length,
        appStoreClicks: monthlyEvents.filter(e => e.eventType === 'app_store_click').length,
        appDownloads: monthlyEvents.filter(e => e.eventType === 'app_download').length,
        newsletterSignups: monthlyEvents.filter(e => e.eventType === 'newsletter_signup').length,
        contactForms: monthlyEvents.filter(e => e.eventType === 'contact_form').length,
        conversions: monthlyEvents.filter(e => e.eventType === 'conversion').length,
        socialClicks: monthlyEvents.filter(e => e.eventType === 'social_click').length
      }
    };

    // Calculate conversion rates
    const conversionRates = {
      playStoreConversion: eventCounts.total.playStoreClicks > 0 ? 
        (eventCounts.total.appDownloads / eventCounts.total.playStoreClicks * 100).toFixed(2) : '0',
      appStoreConversion: eventCounts.total.appStoreClicks > 0 ? 
        (eventCounts.total.appDownloads / eventCounts.total.appStoreClicks * 100).toFixed(2) : '0',
      pageToSignup: eventCounts.total.pageViews > 0 ? 
        (eventCounts.total.newsletterSignups / eventCounts.total.pageViews * 100).toFixed(2) : '0',
      pageToContact: eventCounts.total.pageViews > 0 ? 
        (eventCounts.total.contactForms / eventCounts.total.pageViews * 100).toFixed(2) : '0'
    };

    // Top referral sources
    const referralSources = allEvents
      .filter(e => e.referrer)
      .reduce((acc, event) => {
        const domain = new URL(event.referrer!).hostname;
        acc[domain] = (acc[domain] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Top UTM sources
    const utmSources = allEvents
      .filter(e => e.utmSource)
      .reduce((acc, event) => {
        acc[event.utmSource!] = (acc[event.utmSource!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Social media platform breakdown
    const socialPlatforms = allEvents
      .filter(e => e.socialPlatform)
      .reduce((acc, event) => {
        acc[event.socialPlatform!] = (acc[event.socialPlatform!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Top countries
    const topCountries = allEvents
      .filter(e => e.country)
      .reduce((acc, event) => {
        acc[event.country!] = (acc[event.country!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Recent activity (last 50 events)
    const recentActivity = allEvents
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)
      .map(event => ({
        eventType: event.eventType,
        country: event.country,
        city: event.city,
        referrer: event.referrer,
        utmSource: event.utmSource,
        timestamp: event.createdAt.toISOString()
      }));

    return {
      eventCounts,
      conversionRates,
      referralSources: Object.entries(referralSources)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([source, count]) => ({ source, count })),
      utmSources: Object.entries(utmSources)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([source, count]) => ({ source, count })),
      socialPlatforms: Object.entries(socialPlatforms)
        .sort(([,a], [,b]) => b - a)
        .map(([platform, count]) => ({ platform, count })),
      topCountries: Object.entries(topCountries)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([country, count]) => ({ country, count })),
      recentActivity
    };
  } catch (error) {
    console.error('Failed to get analytics metrics:', error);
    throw error;
  }
}