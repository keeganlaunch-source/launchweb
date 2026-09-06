const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve analytics dashboard at root
app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'launch-analytics-dashboard.html');
  res.sendFile(htmlPath);
});

// Mock GA4 API endpoint with your real data
app.get('/api/ga4/analytics', (req, res) => {
  res.json({
    realtimeUsers: 2,
    activeUsers30min: 15,
    totalPageViews: 740,
    appDownloads: 7,
    newsletterSignups: 34,
    socialClicks: 843,
    ctaClicks: 27,
    conversionRate: 3.6,
    socialBreakdown: {
      instagram: 245,
      facebook: 189,
      tiktok: 156,
      youtube: 98,
      whatsapp: 87,
      threads: 45,
      twitter: 23
    }
  });
});

app.listen(PORT, () => {
  console.log(`Analytics Dashboard running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});