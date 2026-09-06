import { sendEmail, EmailParams } from './domain-email';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

interface WeeklyAnalytics {
  weekRange: string;
  totalPageViews: number;
  totalVisitors: number;
  newsletterSignups: number;
  contactForms: number;
  socialClicks: number;
  topCountries: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  socialPlatforms: Array<{
    platform: string;
    visitors: number;
    clicks: number;
    conversions: number;
    conversionRate: number;
  }>;
  conversionMetrics: {
    websiteToNewsletter: number;
    websiteToContact: number;
    overallConversion: number;
  };
  appDownloads: {
    ios: number;
    android: number;
    total: number;
  };
  keyInsights: string[];
}

// Fetch real analytics from database
async function getWeeklyAnalytics(): Promise<WeeklyAnalytics> {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  
  // Import storage to query database
  const { storage } = await import('./storage');
  
  // Get real analytics data from the last 7 days
  const analytics = await storage.getAnalyticsSummary(lastWeekStart, now);
  
  // Calculate real metrics
  const pageViews = analytics.filter(a => a.eventType === 'page_view').length;
  const uniqueVisitors = new Set(analytics.map(a => a.ipAddress)).size;
  const newsletterSignups = analytics.filter(a => a.eventType === 'newsletter_signup').length;
  const contactForms = analytics.filter(a => a.eventType === 'contact_form').length;
  const socialClicks = analytics.filter(a => a.eventType === 'social_click').length;
  const appDownloadsIos = analytics.filter(a => a.eventType === 'app_download' && a.data?.platform === 'ios').length;
  const appDownloadsAndroid = analytics.filter(a => a.eventType === 'app_download' && a.data?.platform === 'android').length;
  
  // Calculate conversion metrics
  const conversionRate = uniqueVisitors > 0 ? ((newsletterSignups + contactForms) / uniqueVisitors * 100) : 0;
  
  // Generate insights based on real data
  const insights: string[] = [];
  if (pageViews > 100) insights.push(`Strong traffic with ${pageViews} page views this week`);
  if (newsletterSignups > 0) insights.push(`${newsletterSignups} new newsletter subscribers joined`);
  if (socialClicks > 10) insights.push(`High social media engagement with ${socialClicks} clicks`);
  if (conversionRate > 2) insights.push(`Excellent conversion rate of ${conversionRate.toFixed(1)}%`);
  if (insights.length === 0) {
    insights.push("Building momentum - focus on driving traffic");
    insights.push("Share content on social media for better reach");
  }
  
  const weeklyData: WeeklyAnalytics = {
    weekRange: `${format(lastWeekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`,
    totalPageViews: pageViews,
    totalVisitors: uniqueVisitors,
    newsletterSignups: newsletterSignups,
    contactForms: contactForms,
    socialClicks: socialClicks,
    topCountries: [], // Would need geographic data processing
    socialPlatforms: [], // Would need platform-specific tracking
    conversionMetrics: {
      websiteToNewsletter: uniqueVisitors > 0 ? (newsletterSignups / uniqueVisitors * 100) : 0,
      websiteToContact: uniqueVisitors > 0 ? (contactForms / uniqueVisitors * 100) : 0,
      overallConversion: conversionRate,
    },
    appDownloads: {
      ios: appDownloadsIos,
      android: appDownloadsAndroid,
      total: appDownloadsIos + appDownloadsAndroid,
    },
    keyInsights: insights
  };

  return weeklyData;
}

function generateWeeklyReportHTML(analytics: WeeklyAnalytics): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Launch Lifestyle - Weekly Analytics Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FFD700, #FFA500); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 30px; }
        .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #FFD700; }
        .metric-value { font-size: 32px; font-weight: bold; color: #333; margin-bottom: 5px; }
        .metric-label { color: #666; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .section { margin: 30px 0; }
        .section h3 { color: #333; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #FFD700; padding-bottom: 8px; }
        .country-item, .platform-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
        .insights { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; }
        .insights h4 { margin-top: 0; color: #856404; }
        .insights ul { margin: 10px 0; padding-left: 20px; }
        .insights li { margin: 5px 0; color: #856404; }
        .footer { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; color: #666; font-size: 14px; }
        .cta-button { display: inline-block; background: #FFD700; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 Launch Lifestyle</h1>
          <p>Weekly Analytics Report - ${analytics.weekRange}</p>
        </div>
        
        <div class="content">
          <div class="section">
            <h3>📊 Key Metrics</h3>
            <div class="metric-grid">
              <div class="metric-card">
                <div class="metric-value">${analytics.totalPageViews.toLocaleString()}</div>
                <div class="metric-label">Page Views</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analytics.totalVisitors.toLocaleString()}</div>
                <div class="metric-label">Unique Visitors</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analytics.newsletterSignups}</div>
                <div class="metric-label">Newsletter Signups</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analytics.contactForms}</div>
                <div class="metric-label">Contact Forms</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>🎯 Conversion Performance</h3>
            <div class="metric-grid">
              <div class="metric-card">
                <div class="metric-value">${analytics.conversionMetrics.websiteToNewsletter.toFixed(1)}%</div>
                <div class="metric-label">Newsletter Conversion</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analytics.conversionMetrics.websiteToContact.toFixed(1)}%</div>
                <div class="metric-label">Contact Conversion</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>🌍 Geographic Performance</h3>
            ${analytics.topCountries.slice(0, 5).map(country => `
              <div class="country-item">
                <span><strong>${country.country}</strong></span>
                <span>${country.visitors} visitors (${country.percentage.toFixed(1)}%)</span>
              </div>
            `).join('')}
            ${analytics.topCountries.length === 0 ? '<p>Connect geographic data sources for detailed country breakdown.</p>' : ''}
          </div>

          <div class="section">
            <h3>📱 Social Media Performance</h3>
            ${analytics.socialPlatforms.map(platform => `
              <div class="platform-item">
                <span><strong>${platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1)}</strong></span>
                <span>${platform.visitors} visitors • ${platform.conversionRate.toFixed(1)}% CVR</span>
              </div>
            `).join('')}
            ${analytics.socialPlatforms.length === 0 ? '<p>Connect social media analytics for detailed platform performance.</p>' : ''}
          </div>

          <div class="section">
            <h3>📲 App Downloads</h3>
            <div class="metric-grid">
              <div class="metric-card">
                <div class="metric-value">${analytics.appDownloads.ios}</div>
                <div class="metric-label">iOS Downloads</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analytics.appDownloads.android}</div>
                <div class="metric-label">Android Downloads</div>
              </div>
            </div>
          </div>

          <div class="insights">
            <h4>💡 Key Insights & Recommendations</h4>
            <ul>
              ${analytics.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
            </ul>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://launchfit.app/analytics" class="cta-button">View Full Dashboard</a>
          </div>
        </div>
        
        <div class="footer">
          <p>This report was automatically generated from your Launch Analytics Dashboard.</p>
          <p>Need help? Contact support or visit your dashboard for real-time data.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendWeeklyReport(): Promise<boolean> {
  try {
    const analytics = await getWeeklyAnalytics();
    const htmlContent = generateWeeklyReportHTML(analytics);
    
    const emailParams: EmailParams = {
      to: 'keegan.launch@gmail.com',
      from: {
        name: 'Launch Analytics',
        email: 'keegan.launch@gmail.com'
      },
      replyTo: {
        name: 'Coach Keegs',
        email: 'keegan.launch@gmail.com'
      },
      subject: `Launch Lifestyle Weekly Report - ${analytics.weekRange}`,
      html: htmlContent,
      text: `
Launch Lifestyle Weekly Analytics Report
${analytics.weekRange}

Key Metrics:
- Page Views: ${analytics.totalPageViews.toLocaleString()}
- Unique Visitors: ${analytics.totalVisitors.toLocaleString()}
- Newsletter Signups: ${analytics.newsletterSignups}
- Contact Forms: ${analytics.contactForms}

Conversion Rates:
- Newsletter: ${analytics.conversionMetrics.websiteToNewsletter.toFixed(1)}%
- Contact: ${analytics.conversionMetrics.websiteToContact.toFixed(1)}%

App Downloads:
- iOS: ${analytics.appDownloads.ios}
- Android: ${analytics.appDownloads.android}

Key Insights:
${analytics.keyInsights.map(insight => `- ${insight}`).join('\n')}

View full dashboard: https://launchfit.app/analytics
      `
    };

    const success = await sendEmail(emailParams);
    
    if (success) {
      console.log(`✅ Weekly report sent successfully to keegan.launch@gmail.com for week: ${analytics.weekRange}`);
    } else {
      console.error('❌ Failed to send weekly report');
    }
    
    return success;
  } catch (error) {
    console.error('Error sending weekly report:', error);
    return false;
  }
}

// Schedule weekly reports (this would typically be handled by a cron job or scheduler)
export function scheduleWeeklyReports() {
  // In a production environment, you would use a proper scheduler like node-cron
  // For now, we'll set up a simple interval that checks if it's time to send
  
  const checkAndSendReport = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();
    
    // Send report every Monday at 9 AM
    if (dayOfWeek === 1 && hour === 9) {
      console.log('🕘 Triggering weekly report...');
      sendWeeklyReport();
    }
  };
  
  // Check every hour
  setInterval(checkAndSendReport, 60 * 60 * 1000);
  
  console.log('📅 Weekly report scheduler initialized - reports will be sent every Monday at 9 AM');
}