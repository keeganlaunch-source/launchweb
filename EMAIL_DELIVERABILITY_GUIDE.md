# Email Deliverability Setup for Launch Weekly Emails

## Critical Steps to Avoid Spam Folder

### 1. Domain Authentication (Most Important)

#### SPF Record
Add this TXT record to your DNS:
```
Name: @
Type: TXT
Value: v=spf1 include:sendgrid.net ~all
```

#### DKIM Authentication
In SendGrid dashboard:
1. Go to Settings > Sender Authentication
2. Add your domain: launchfit.app
3. Follow verification steps
4. Add the provided CNAME records to your DNS

#### DMARC Policy
Add this TXT record:
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:coach@launchfit.app
```

### 2. Sender Reputation Setup

#### Dedicated IP (Recommended)
- Request dedicated IP from SendGrid
- Warm up the IP gradually over 2-4 weeks
- Start with small batches, increase volume slowly

#### From Address Configuration
Currently using: coach@launchfit.app
- Ensure this email exists and can receive replies
- Set up auto-responder for out-of-office replies

### 3. Content Optimization

#### Subject Line Best Practices
✓ Current: "🚀 LAUNCH Monday: [Topic]"
- Keep under 50 characters
- Avoid spam trigger words: "FREE", "GUARANTEED", etc.
- Use personalization when possible

#### Email Content Guidelines
✓ Good text-to-image ratio (current emails are text-heavy)
✓ Proper HTML structure
✓ Clear unsubscribe link
⚠️ Add physical mailing address (required by CAN-SPAM)

### 4. List Management

#### Engagement Tracking
- Monitor open rates, click rates
- Remove unengaged subscribers after 6 months
- Use re-engagement campaigns before removing

#### Segmentation
- Send to engaged subscribers first
- Gradually expand to full list
- Track performance by segment

### 5. Technical Configuration

#### Email Headers
Current implementation needs these additions:
- List-Unsubscribe header
- Return-Path configuration
- Message-ID consistency

#### Bounce Handling
- Set up automatic bounce processing
- Remove hard bounces immediately
- Monitor soft bounces

### 6. Reputation Monitoring

#### Tools to Use
- Google Postmaster Tools
- Microsoft SNDS
- SendGrid reputation dashboard

#### Key Metrics
- Bounce rate < 2%
- Complaint rate < 0.1%
- Open rate > 20%
- Click rate > 2%

### 7. Gradual Volume Increase

#### Week 1: Send to 25% of list
#### Week 2: Send to 50% of list  
#### Week 3: Send to 75% of list
#### Week 4+: Send to full list

### 8. Legal Compliance

#### Required Elements
✓ Clear sender identification
✓ Unsubscribe mechanism
⚠️ Physical mailing address
✓ Honest subject lines

#### CAN-SPAM Compliance
- Honor unsubscribe requests within 10 days
- Don't sell email addresses
- Monitor third-party email practices

## Immediate Action Items

1. **Set up domain authentication in SendGrid**
2. **Add DNS records for SPF, DKIM, DMARC**
3. **Add physical address to email template**
4. **Configure List-Unsubscribe header**
5. **Set up dedicated IP warming schedule**

## Expected Timeline

- **Week 1**: Complete DNS setup, start IP warming
- **Week 2-4**: Gradual volume increase
- **Month 2**: Full deliverability optimization
- **Month 3+**: Maintain 95%+ inbox placement

## Warning Signs to Monitor

- Sudden drop in open rates
- Increase in bounce rates
- Subscriber complaints
- Blacklist notifications

Following this guide will ensure your Launch weekly emails reach subscribers' inboxes consistently.