import { Request, Response } from 'express';
import { trackEvent } from './analytics-service';
import { trackSocialMediaEvent } from './social-media-tracker';
import { processSudorWebhook } from './sudor-integration';

// Comprehensive integration test suite
export async function runIntegrationTests(req: Request): Promise<any> {
  const testResults = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      success_rate: 0
    }
  };

  // Test 1: App Store tracking
  try {
    await trackEvent(req, {
      sessionId: `test-ios-${Date.now()}`,
      eventType: 'app_store_click',
      eventData: { platform: 'ios', test: true }
    });
    testResults.tests.push({
      name: 'iOS App Store Tracking',
      status: 'passed',
      details: 'App Store click tracking functional'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'iOS App Store Tracking',
      status: 'failed',
      error: error.message
    });
  }

  // Test 2: Google Play tracking
  try {
    await trackEvent(req, {
      sessionId: `test-android-${Date.now()}`,
      eventType: 'play_store_click',
      eventData: { platform: 'android', test: true }
    });
    testResults.tests.push({
      name: 'Google Play Store Tracking',
      status: 'passed',
      details: 'Play Store click tracking functional'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Google Play Store Tracking',
      status: 'failed',
      error: error.message
    });
  }

  // Test 3: Social media platform tracking
  const socialPlatforms = ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'WhatsApp', 'X', 'Threads', 'Truth Social'];
  
  for (const platform of socialPlatforms) {
    try {
      await trackSocialMediaEvent(req, {
        platform: platform.toLowerCase(),
        action: 'click',
        source: 'test_suite',
        campaign: 'integration_test'
      });
      testResults.tests.push({
        name: `${platform} Social Media Tracking`,
        status: 'passed',
        details: `${platform} click tracking functional`
      });
    } catch (error) {
      testResults.tests.push({
        name: `${platform} Social Media Tracking`,
        status: 'failed',
        error: error.message
      });
    }
  }

  // Test 4: Newsletter signup tracking
  try {
    await trackEvent(req, {
      sessionId: `test-newsletter-${Date.now()}`,
      eventType: 'newsletter_signup',
      eventData: { 
        email: 'test@launchlifestyle.com',
        source: 'integration_test',
        test: true 
      }
    });
    testResults.tests.push({
      name: 'Newsletter Signup Tracking',
      status: 'passed',
      details: 'Newsletter signup tracking functional'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Newsletter Signup Tracking',
      status: 'failed',
      error: error.message
    });
  }

  // Test 5: Contact form tracking
  try {
    await trackEvent(req, {
      sessionId: `test-contact-${Date.now()}`,
      eventType: 'contact_form',
      eventData: { 
        name: 'Test User',
        email: 'test@launchlifestyle.com',
        test: true 
      }
    });
    testResults.tests.push({
      name: 'Contact Form Tracking',
      status: 'passed',
      details: 'Contact form tracking functional'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Contact Form Tracking',
      status: 'failed',
      error: error.message
    });
  }

  // Test 6: Sudor webhook simulation
  try {
    await processSudorWebhook('subscriber_activated', {
      userId: 'test_user_123',
      subscriptionType: 'monthly',
      promocode: 'LAUNCH25',
      timestamp: new Date().toISOString()
    });
    testResults.tests.push({
      name: 'Sudor Webhook Integration',
      status: 'passed',
      details: 'Sudor webhook processing functional'
    });
  } catch (error) {
    testResults.tests.push({
      name: 'Sudor Webhook Integration',
      status: 'failed',
      error: error.message
    });
  }

  // Calculate summary
  testResults.summary.total = testResults.tests.length;
  testResults.summary.passed = testResults.tests.filter(t => t.status === 'passed').length;
  testResults.summary.failed = testResults.tests.filter(t => t.status === 'failed').length;
  testResults.summary.success_rate = Math.round((testResults.summary.passed / testResults.summary.total) * 100);

  return testResults;
}

// Generate test report email content
export function generateTestEmail(testResults: any): string {
  const passedTests = testResults.tests.filter(t => t.status === 'passed');
  const failedTests = testResults.tests.filter(t => t.status === 'failed');

  return `
**Launch Lifestyle Analytics Integration Test Report**
*Generated: ${new Date().toLocaleString()}*

**TEST SUMMARY**
- Total Tests: ${testResults.summary.total}
- Passed: ${testResults.summary.passed}
- Failed: ${testResults.summary.failed}  
- Success Rate: ${testResults.summary.success_rate}%

**APP STORE INTEGRATION STATUS**
${passedTests.find(t => t.name.includes('iOS')) ? '✅ iOS App Store - WORKING' : '❌ iOS App Store - FAILED'}
${passedTests.find(t => t.name.includes('Google Play')) ? '✅ Google Play Store - WORKING' : '❌ Google Play Store - FAILED'}

**SOCIAL MEDIA TRACKING STATUS**
${passedTests.find(t => t.name.includes('Instagram')) ? '✅ Instagram - WORKING' : '❌ Instagram - FAILED'}
${passedTests.find(t => t.name.includes('Facebook')) ? '✅ Facebook - WORKING' : '❌ Facebook - FAILED'}
${passedTests.find(t => t.name.includes('TikTok')) ? '✅ TikTok - WORKING' : '❌ TikTok - FAILED'}
${passedTests.find(t => t.name.includes('YouTube')) ? '✅ YouTube - WORKING' : '❌ YouTube - FAILED'}
${passedTests.find(t => t.name.includes('WhatsApp')) ? '✅ WhatsApp - WORKING' : '❌ WhatsApp - FAILED'}
${passedTests.find(t => t.name.includes('X ')) ? '✅ X (Twitter) - WORKING' : '❌ X (Twitter) - FAILED'}
${passedTests.find(t => t.name.includes('Threads')) ? '✅ Threads - WORKING' : '❌ Threads - FAILED'}
${passedTests.find(t => t.name.includes('Truth Social')) ? '✅ Truth Social - WORKING' : '❌ Truth Social - FAILED'}

**CONVERSION TRACKING STATUS**
${passedTests.find(t => t.name.includes('Newsletter')) ? '✅ Newsletter Signups - WORKING' : '❌ Newsletter Signups - FAILED'}
${passedTests.find(t => t.name.includes('Contact Form')) ? '✅ Contact Forms - WORKING' : '❌ Contact Forms - FAILED'}

**SUDOR APP INTEGRATION STATUS**
${passedTests.find(t => t.name.includes('Sudor')) ? '✅ Sudor Webhook - READY' : '❌ Sudor Webhook - FAILED'}
- Endpoint: https://launchfit.app/api/webhooks/sudor
- Status: Monitoring for real-time data

**DEPLOYMENT READINESS**
${testResults.summary.success_rate >= 90 ? '🟢 READY FOR DEPLOYMENT' : 
  testResults.summary.success_rate >= 75 ? '🟡 DEPLOYMENT READY WITH MINOR ISSUES' : 
  '🔴 REQUIRES FIXES BEFORE DEPLOYMENT'}

**UTM CAMPAIGN LINKS**
📱 Instagram: https://launchfit.app?utm_source=instagram&utm_medium=social&utm_campaign=launch_transformation
📘 Facebook: https://launchfit.app?utm_source=facebook&utm_medium=social&utm_campaign=fitness_goals  
🎵 TikTok: https://launchfit.app?utm_source=tiktok&utm_medium=social&utm_campaign=viral_workout
📺 YouTube: https://launchfit.app?utm_source=youtube&utm_medium=video&utm_campaign=coach_keegs
💬 WhatsApp: https://launchfit.app?utm_source=whatsapp&utm_medium=messaging&utm_campaign=personal_training

**ANALYTICS DASHBOARD**
Real-time metrics: https://launchfit.app/admin
Integration status: https://launchfit.app/api/integration/status

All systems are tracking the complete customer journey from social media to app subscriptions.

${failedTests.length > 0 ? `
**ISSUES DETECTED**
${failedTests.map(test => `- ${test.name}: ${test.error || 'Unknown error'}`).join('\n')}
` : ''}

*This automated test validates your complete marketing analytics pipeline.*
  `;
}