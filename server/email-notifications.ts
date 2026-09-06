import { sendEmail as sendDomainEmail, type EmailParams } from "./domain-email";

// Use the working domain email system that was functioning properly
export async function sendEmail(params: EmailParams): Promise<boolean> {
  return sendDomainEmail(params);
}

export async function sendAdminNotification(type: 'newsletter' | 'contact', data: any): Promise<boolean> {
  try {
    let subject: string;
    let content: string;
    
    if (type === 'newsletter') {
      subject = '🎯 New Newsletter Signup - Launch Lifestyle';
      content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #FFD600 0%, #E6C100 100%); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #000000; margin: 0; font-size: 24px; font-weight: bold;">Launch Lifestyle</h1>
            <p style="color: #000000; margin: 5px 0 0 0; font-size: 16px;">New Newsletter Signup Alert</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">📧 Newsletter Subscription</h2>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 4px solid #FFD600;">
              <p style="margin: 0; color: #333333;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 10px 0 0 0; color: #666666; font-size: 14px;"><strong>Signed up:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="color: #666666; margin: 0; font-size: 14px;">
              New subscriber successfully added to your newsletter list.
            </p>
          </div>
        </div>
      `;
    } else {
      subject = '💬 New Contact Message - Launch Lifestyle';
      content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #FFD600 0%, #E6C100 100%); padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #000000; margin: 0; font-size: 24px; font-weight: bold;">Launch Lifestyle</h1>
            <p style="color: #000000; margin: 5px 0 0 0; font-size: 16px;">New Contact Message Alert</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">📩 Contact Form Submission</h2>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border-left: 4px solid #FFD600;">
              <p style="margin: 0; color: #333333;"><strong>Name:</strong> ${data.name}</p>
              <p style="margin: 10px 0; color: #333333;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 10px 0 0 0; color: #666666; font-size: 14px;"><strong>Received:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0 0 10px 0; color: #333333; font-weight: bold;">Message:</p>
              <p style="margin: 0; color: #444444; line-height: 1.5;">${data.message}</p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="color: #666666; margin: 0; font-size: 14px;">
              New message received and stored securely.
            </p>
          </div>
        </div>
      `;
    }

    const emailParams: EmailParams = {
      to: 'keegan.launch@gmail.com', // Your email
      from: 'Launch Lifestyle <keegan.launch@gmail.com>',
      replyTo: type === 'contact' ? data.email : 'keegan.launch@gmail.com',
      subject,
      html: content,
      categories: ['admin-notification', type],
      customArgs: {
        type: 'admin_notification',
        data_type: type,
        timestamp: new Date().toISOString()
      }
    };

    return await sendEmail(emailParams);
  } catch (error) {
    console.error(`Failed to send ${type} notification:`, error);
    return false;
  }
}

export async function sendWeeklyReport(): Promise<boolean> {
  try {
    const { storage } = await import("./storage");
    const baseUrl = process.env.PUBLIC_BASE_URL || 'https://launchfit.app';
    
    // Get all data
    const newsletterSignups = await storage.getAllNewsletterSignups();
    const contactMessages = await storage.getAllContactMessages();
    const consultationEntries = await storage.getAllConsultationDrawEntries();
    
    // Calculate date ranges
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Filter by time periods
    const thisWeekSignups = newsletterSignups.filter(s => new Date(s.createdAt) >= weekAgo);
    const thisWeekMessages = contactMessages.filter(m => new Date(m.createdAt) >= weekAgo);
    const thisWeekConsultations = consultationEntries.filter(c => new Date(c.createdAt) >= weekAgo);
    
    const thisMonthSignups = newsletterSignups.filter(s => new Date(s.createdAt) >= monthAgo);
    const thisMonthMessages = contactMessages.filter(m => new Date(m.createdAt) >= monthAgo);
    const thisMonthConsultations = consultationEntries.filter(c => new Date(c.createdAt) >= monthAgo);
    
    // Get unique locations
    const allData = [...newsletterSignups, ...contactMessages, ...consultationEntries];
    const uniqueCountries = Array.from(new Set(allData.filter(d => d.country).map(d => d.country)));
    const uniqueCities = Array.from(new Set(allData.filter(d => d.city).map(d => d.city)));
    
    // Pending consultation entries for draw
    const pendingConsultations = consultationEntries.filter(c => c.isWinner === 'pending');
    
    const emailParams: EmailParams = {
      to: 'keegan.launch@gmail.com',
      from: 'Launch Lifestyle <keegan.launch@gmail.com>',
      subject: `Launch Hub Weekly Report - ${now.toLocaleDateString()}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Launch Hub Weekly Report</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f7fa;">
            <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff;">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #FFD600 0%, #E6C100 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #000000; margin: 0; font-size: 28px; font-weight: bold;">Launch Hub</h1>
                    <p style="color: #000000; margin: 8px 0 0 0; font-size: 16px;">Weekly Performance Report</p>
                    <p style="color: #333333; margin: 5px 0 0 0; font-size: 14px;">${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <!-- Key Metrics Dashboard -->
                <div style="padding: 30px;">
                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px; border-bottom: 3px solid #FFD600; padding-bottom: 10px;">📊 Key Metrics Overview</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-bottom: 30px;">
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #10b981;">
                            <div style="font-size: 24px; font-weight: bold; color: #10b981;">${newsletterSignups.length}</div>
                            <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">Total Subscribers</div>
                            <div style="color: #059669; font-size: 12px; margin-top: 3px;">+${thisWeekSignups.length} this week</div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #3b82f6;">
                            <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${contactMessages.length}</div>
                            <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">Contact Messages</div>
                            <div style="color: #2563eb; font-size: 12px; margin-top: 3px;">+${thisWeekMessages.length} this week</div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #f59e0b;">
                            <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${consultationEntries.length}</div>
                            <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">Consultation Entries</div>
                            <div style="color: #d97706; font-size: 12px; margin-top: 3px;">+${thisWeekConsultations.length} this week</div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; border-left: 4px solid #8b5cf6;">
                            <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">${uniqueCountries.length}</div>
                            <div style="color: #6b7280; font-size: 14px; margin-top: 5px;">Countries Reached</div>
                            <div style="color: #7c3aed; font-size: 12px; margin-top: 3px;">${uniqueCities.length} cities</div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px;">⚡ Quick Actions</h3>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <a href="${baseUrl}/api/email-dashboard" style="background: #FFD600; color: #000000; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">📧 Email Dashboard</a>
                            <a href="${baseUrl}/api/admin/consultation-draw" style="background: #10b981; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">🎯 Draw Entries</a>
                            <a href="${baseUrl}/api/admin/newsletter-signups" style="background: #3b82f6; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">📊 All Subscribers</a>
                            <a href="${baseUrl}/api/admin/contact-messages" style="background: #f59e0b; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">💬 Messages</a>
                        </div>
                    </div>

                    <!-- Consultation Draw Section -->
                    ${pendingConsultations.length > 0 ? `
                    <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                        <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">🎯 Free Consultation Draw - ${pendingConsultations.length} Entries</h3>
                        <p style="color: #92400e; margin: 0 0 15px 0; font-size: 14px;">Draw ends last day of month. Select 3 winners from these entries:</p>
                        <div style="background: #ffffff; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
                            ${pendingConsultations.map(entry => `
                                <div style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <strong style="color: #1f2937;">${entry.email}</strong>
                                        <div style="color: #6b7280; font-size: 12px;">${entry.city ? `${entry.city}, ` : ''}${entry.country || 'Unknown location'} • ${new Date(entry.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="margin-top: 15px; text-align: center;">
                            <a href="${baseUrl}/api/admin/consultation-draw" style="background: #f59e0b; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Manage Draw Results</a>
                        </div>
                    </div>
                    ` : ''}

                    <!-- Recent Newsletter Signups -->
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #10b981; padding-bottom: 8px;">📧 Recent Newsletter Signups (${thisWeekSignups.length} this week)</h3>
                        ${thisWeekSignups.length > 0 ? `
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                            ${thisWeekSignups.slice(0, 10).map(signup => `
                                <div style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <strong style="color: #1f2937;">${signup.email}</strong>
                                        <div style="color: #6b7280; font-size: 12px;">${signup.city ? `${signup.city}, ` : ''}${signup.country || 'Unknown location'}</div>
                                    </div>
                                    <div style="color: #6b7280; font-size: 12px;">${new Date(signup.createdAt).toLocaleDateString()}</div>
                                </div>
                            `).join('')}
                            ${thisWeekSignups.length > 10 ? `<div style="text-align: center; margin-top: 15px; color: #6b7280; font-size: 14px;">... and ${thisWeekSignups.length - 10} more</div>` : ''}
                        </div>
                        ` : '<p style="color: #6b7280; font-style: italic;">No new signups this week</p>'}
                    </div>

                    <!-- Recent Contact Messages -->
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">💬 Recent Contact Messages (${thisWeekMessages.length} this week)</h3>
                        ${thisWeekMessages.length > 0 ? `
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                            ${thisWeekMessages.slice(0, 5).map(message => `
                                <div style="background: #ffffff; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #3b82f6;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                        <strong style="color: #1f2937;">${message.name} (${message.email})</strong>
                                        <span style="color: #6b7280; font-size: 12px;">${new Date(message.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div style="color: #4b5563; font-size: 14px; line-height: 1.5;">${message.message.substring(0, 150)}${message.message.length > 150 ? '...' : ''}</div>
                                    ${message.city || message.country ? `<div style="color: #6b7280; font-size: 12px; margin-top: 8px;">${message.city ? `${message.city}, ` : ''}${message.country || ''}</div>` : ''}
                                </div>
                            `).join('')}
                            ${thisWeekMessages.length > 5 ? `<div style="text-align: center; margin-top: 15px; color: #6b7280; font-size: 14px;">... and ${thisWeekMessages.length - 5} more messages</div>` : ''}
                        </div>
                        ` : '<p style="color: #6b7280; font-style: italic;">No new messages this week</p>'}
                    </div>

                    <!-- Geographic Distribution -->
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #8b5cf6; padding-bottom: 8px;">🌍 Geographic Distribution</h3>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                <div>
                                    <h4 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">Top Countries</h4>
                                    ${uniqueCountries.slice(0, 5).map(country => {
                                        const count = allData.filter(d => d.country === country).length;
                                        return `<div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #374151;">${country}</span><span style="color: #6b7280; font-weight: bold;">${count}</span></div>`;
                                    }).join('')}
                                </div>
                                <div>
                                    <h4 style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px;">Top Cities</h4>
                                    ${uniqueCities.slice(0, 5).map(city => {
                                        const count = allData.filter(d => d.city === city).length;
                                        return `<div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #e5e7eb;"><span style="color: #374151;">${city}</span><span style="color: #6b7280; font-weight: bold;">${count}</span></div>`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- All Email Addresses Section -->
                    <div style="margin-bottom: 30px;">
                        <h3 style="color: #1f2937; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #ef4444; padding-bottom: 8px;">📋 All Email Addresses (${newsletterSignups.length + consultationEntries.length} total)</h3>
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
                            <div style="background: #ffffff; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
                                ${[...newsletterSignups.map(s => ({ email: s.email, type: 'Newsletter', date: s.createdAt })), 
                                   ...consultationEntries.map(c => ({ email: c.email, type: 'Consultation Draw', date: c.createdAt }))]
                                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .map(item => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                                        <div>
                                            <strong style="color: #1f2937;">${item.email}</strong>
                                            <span style="background: ${item.type === 'Newsletter' ? '#10b981' : '#f59e0b'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-left: 10px;">${item.type}</span>
                                        </div>
                                        <span style="color: #6b7280; font-size: 12px;">${new Date(item.date).toLocaleDateString()}</span>
                                    </div>
                                  `).join('')}
                            </div>
                            <div style="text-align: center; margin-top: 15px;">
                                <a href="${baseUrl}/api/email-dashboard" style="background: #ef4444; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Export All Emails</a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background: #1f2937; color: #ffffff; padding: 30px; text-align: center;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">Launch Lifestyle Hub</p>
                    <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 14px;">Automated weekly report • ${now.toLocaleDateString()}</p>
                    <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
                        <a href="${baseUrl}" style="color: #FFD600; text-decoration: none; font-size: 14px;">🏠 Website</a>
                        <a href="mailto:keegan.launch@gmail.com" style="color: #FFD600; text-decoration: none; font-size: 14px;">📧 Email</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `,
      categories: ['weekly-report'],
      customArgs: {
        type: 'weekly_report',
        week: `${now.getFullYear()}-W${Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`,
        total_subscribers: newsletterSignups.length,
        total_consultations: consultationEntries.length,
        total_messages: contactMessages.length
      }
    };

    return await sendEmail(emailParams);
  } catch (error) {
    console.error('Failed to send weekly report:', error);
    return false;
  }
}