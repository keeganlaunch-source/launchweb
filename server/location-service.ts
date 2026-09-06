import { Request } from "express";

interface LocationData {
  country?: string;
  city?: string;
  region?: string;
  ipAddress?: string;
  userAgent?: string;
}

export function getLocationFromRequest(req: Request): LocationData {
  // Get IP address from various headers (handles proxies, load balancers)
  const ipAddress = (
    req.headers['x-forwarded-for'] as string ||
    req.headers['x-real-ip'] as string ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection as any)?.socket?.remoteAddress ||
    'unknown'
  )?.split(',')[0]?.trim();

  // Get user agent
  const userAgent = req.headers['user-agent'] || 'unknown';

  // Extract location from headers (if available from CDN/proxy)
  const country = req.headers['cf-ipcountry'] as string || 
                  req.headers['x-country-code'] as string ||
                  req.headers['cloudfront-viewer-country'] as string;

  const city = req.headers['cf-ipcity'] as string ||
               req.headers['x-city'] as string;

  const region = req.headers['cf-region'] as string ||
                 req.headers['x-region'] as string;

  return {
    country: country || undefined,
    city: city || undefined,
    region: region || undefined,
    ipAddress,
    userAgent
  };
}

// Fallback IP geolocation service (using a free service)
export async function enrichLocationData(locationData: LocationData): Promise<LocationData> {
  if (!locationData.country && locationData.ipAddress && locationData.ipAddress !== 'unknown') {
    try {
      // Using ipapi.co free service (1000 requests/day)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`https://ipapi.co/${locationData.ipAddress}/json/`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        return {
          ...locationData,
          country: data.country_name || locationData.country,
          city: data.city || locationData.city,
          region: data.region || locationData.region
        };
      }
    } catch (error) {
      console.warn('Failed to fetch location data:', error);
    }
  }
  
  return locationData;
}