import { sendEmail } from './domain-email';

export async function sendConsistencyHacksEmail(email: string): Promise<boolean> {
  // Log the email attempt for development and production readiness
  console.log(`Consistency Hacks Email Request for: ${email}`);
  console.log('Email system configured with Launch branding and anti-spam measures');
  
  const emailParams = {
    to: email,
    from: { name: 'Coach Keegs - LAUNCH Fitness', email: 'app@launchfit.app' },
    replyTo: { name: 'Coach Keegs', email: 'keegan.launch@gmail.com' },
    subject: '🎯 Your 5 Consistency Hacks for Fitness Success',
    text: `TOP 5 CONSISTENCY HACKS - LAUNCH LIFESTYLE

Transform Your Fitness Journey with Proven Strategies

HACK #1: START STUPIDLY SMALL
The biggest mistake people make is going from 0 to 100 overnight. Your brain resists massive changes, but it loves tiny wins. Start with 5 push-ups, not 50. Walk for 10 minutes, not an hour. Once the habit sticks, scaling up becomes natural. Remember: 1% better every day compounds into life-changing results over time.

HACK #2: STACK YOUR HABITS
Attach your new workout habit to something you already do religiously. "After I brush my teeth in the morning, I'll do 10 squats." "Before I check my phone at night, I'll do a 2-minute plank." This psychological trick hijacks your existing routine and makes the new habit feel automatic.

HACK #3: THE 2-MINUTE RULE
Any habit should take less than 2 minutes to start. "Exercise for 30 minutes" becomes "Put on my workout clothes." "Do a full workout" becomes "Do one push-up." Once you start, momentum takes over. The hardest part is always beginning – make it ridiculously easy to start.

HACK #4: TRACK YOUR STREAK, NOT RESULTS
Don't obsess over the scale or mirror. Focus on showing up. Mark an X on a calendar every day you exercise, no matter how small. Seeing that chain of X's becomes addictive – you won't want to break it. Consistency beats intensity every single time. A mediocre workout you actually do beats a perfect workout you skip.

HACK #5: DESIGN YOUR ENVIRONMENT
Make good choices easier and bad choices harder. Lay out your workout clothes the night before. Keep your dumbbells visible. Put your phone in another room during workout time. Your environment shapes your behavior more than willpower ever will. Set up your space for success, and success becomes inevitable.

READY TO BUILD UNSTOPPABLE CONSISTENCY?
Join thousands who've transformed their lives with Launch Lifestyle

Download the Launch Lifestyle App:
iOS: https://apps.apple.com/za/app/launch-lifestyle/id6743004197
Android: https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share

Follow us:
Instagram: @launchlifestyle
Facebook: Launch Lifestyle
TikTok: @launchlifestyle

Contact: keegan.launch@gmail.com

Launch Lifestyle - Transforming lives through intelligent fitness coaching
You received this because you requested our consistency hacks guide.
This is exactly what helps our 1000+ members stay consistent every day.

To unsubscribe, reply with "UNSUBSCRIBE" or email keegan.launch@gmail.com
Launch Lifestyle, Fitness Coaching Services
Physical Address: South Africa

This email complies with CAN-SPAM regulations.`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Consistency Hacks Guide - Launch Lifestyle</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .hack-box { margin: 0 10px 20px 10px !important; }
            .button-container { display: block !important; }
        }
        /* Reset styles for better email client compatibility */
        table, td, div, h1, h2, h3, p, a { margin: 0; padding: 0; }
        table { border-collapse: collapse; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        a { color: #FFD600; text-decoration: none; }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial Black', Impact, Arial, sans-serif; background-color: #FFFFFF; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF;">
        <tr>
            <td align="center" style="padding: 0;">
                <table class="container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #FFFFFF; max-width: 600px; border: 3px solid #000000;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background-color: #FFFFFF; border-bottom: 3px solid #FFD600;">
                            <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 2px; font-family: 'Arial Black', Impact, Arial, sans-serif; line-height: 1.1;">
                                LAUNCH LIFESTYLE
                            </h1>
                            <div style="display: inline-block; background-color: #FFD600; color: #000000; padding: 6px 16px; margin: 12px 0; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; border: 2px solid #000000;">
                                FITNESS
                            </div>
                            <p style="margin: 8px 0 0 0; font-size: 14px; color: #1A1A1A; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif; font-weight: bold;">
                                Transform Your Fitness Journey
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center; background-color: #FFFFFF;">
                            <h2 style="margin: 0; font-size: 28px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial Black', Impact, Arial, sans-serif;">
                                TOP 5 CONSISTENCY HACKS
                            </h2>
                            <div style="width: 100px; height: 4px; background-color: #FFD600; margin: 15px auto 0 auto;"></div>
                        </td>
                    </tr>
                    
                    <!-- Hack 1 -->
                    <tr>
                        <td style="padding: 0 30px 25px 30px; background-color: #FFFFFF;">
                            <table class="hack-box" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; border: 3px solid #000000; border-radius: 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <div style="background: #FFD600; color: #000000; width: 32px; height: 32px; border-radius: 0; text-align: center; line-height: 32px; font-weight: 900; font-size: 16px; margin-bottom: 15px; display: inline-block; border: 2px solid #000000; font-family: 'Arial Black', Arial, sans-serif;">1</div>
                                        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial Black', Impact, Arial, sans-serif;">
                                            START STUPIDLY SMALL
                                        </h3>
                                        <p style="margin: 0; color: #1A1A1A; font-size: 15px; line-height: 1.5; font-family: Arial, sans-serif; font-weight: normal;">
                                            The biggest mistake people make is going from 0 to 100 overnight. Your brain resists massive changes, but it loves tiny wins. Start with 5 push-ups, not 50. Walk for 10 minutes, not an hour. Once the habit sticks, scaling up becomes natural.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Hack 2 -->
                    <tr>
                        <td style="padding: 0 30px 25px 30px; background-color: #FFFFFF;">
                            <table class="hack-box" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; border: 3px solid #000000; border-radius: 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <div style="background: #FFD600; color: #000000; width: 32px; height: 32px; border-radius: 0; text-align: center; line-height: 32px; font-weight: 900; font-size: 16px; margin-bottom: 15px; display: inline-block; border: 2px solid #000000; font-family: 'Arial Black', Arial, sans-serif;">2</div>
                                        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial Black', Impact, Arial, sans-serif;">
                                            STACK YOUR HABITS
                                        </h3>
                                        <p style="margin: 0; color: #1A1A1A; font-size: 15px; line-height: 1.5; font-family: Arial, sans-serif; font-weight: normal;">
                                            Attach your new workout habit to something you already do religiously. "After I brush my teeth in the morning, I'll do 10 squats." This psychological trick hijacks your existing routine and makes the new habit feel automatic.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Hack 3 -->
                    <tr>
                        <td style="padding: 0 30px 25px 30px; background-color: #FFFFFF;">
                            <table class="hack-box" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; border: 3px solid #000000; border-radius: 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <div style="background: #FFD600; color: #000000; width: 32px; height: 32px; border-radius: 0; text-align: center; line-height: 32px; font-weight: 900; font-size: 16px; margin-bottom: 15px; display: inline-block; border: 2px solid #000000; font-family: 'Arial Black', Arial, sans-serif;">3</div>
                                        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial Black', Impact, Arial, sans-serif;">
                                            THE 2-MINUTE RULE
                                        </h3>
                                        <p style="margin: 0; color: #1A1A1A; font-size: 15px; line-height: 1.5; font-family: Arial, sans-serif; font-weight: normal;">
                                            Any habit should take less than 2 minutes to start. "Exercise for 30 minutes" becomes "Put on my workout clothes." Once you start, momentum takes over. The hardest part is always beginning.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Hack 4 -->
                    <tr>
                        <td style="padding: 0 30px 25px 30px; background-color: #FFFFFF;">
                            <table class="hack-box" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; border: 3px solid #000000; border-radius: 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <div style="background: #FFD600; color: #000000; width: 32px; height: 32px; border-radius: 0; text-align: center; line-height: 32px; font-weight: 900; font-size: 16px; margin-bottom: 15px; display: inline-block; border: 2px solid #000000; font-family: 'Arial Black', Arial, sans-serif;">4</div>
                                        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial Black', Impact, Arial, sans-serif;">
                                            TRACK YOUR STREAK, NOT RESULTS
                                        </h3>
                                        <p style="margin: 0; color: #1A1A1A; font-size: 15px; line-height: 1.5; font-family: Arial, sans-serif; font-weight: normal;">
                                            Don't obsess over the scale or mirror. Focus on showing up. Mark an X on a calendar every day you exercise, no matter how small. Consistency beats intensity every single time.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Hack 5 -->
                    <tr>
                        <td style="padding: 0 30px 25px 30px; background-color: #FFFFFF;">
                            <table class="hack-box" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFFFFF; border: 3px solid #000000; border-radius: 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <div style="background: #FFD600; color: #000000; width: 32px; height: 32px; border-radius: 0; text-align: center; line-height: 32px; font-weight: 900; font-size: 16px; margin-bottom: 15px; display: inline-block; border: 2px solid #000000; font-family: 'Arial Black', Arial, sans-serif;">5</div>
                                        <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial Black', Impact, Arial, sans-serif;">
                                            DESIGN YOUR ENVIRONMENT
                                        </h3>
                                        <p style="margin: 0; color: #1A1A1A; font-size: 15px; line-height: 1.5; font-family: Arial, sans-serif; font-weight: normal;">
                                            Make good choices easier and bad choices harder. Lay out your workout clothes the night before. Keep your dumbbells visible. Your environment shapes your behavior more than willpower ever will.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA Section -->
                    <tr>
                        <td style="padding: 40px 30px; background-color: #FFFFFF;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #FFD600; border: 3px solid #000000; border-radius: 0;">
                                <tr>
                                    <td style="padding: 30px 25px; text-align: center;">
                                        <h3 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 900; color: #000000; text-transform: uppercase; letter-spacing: 1px; font-family: 'Arial Black', Impact, Arial, sans-serif; line-height: 1.2;">
                                            Ready to Build Unstoppable Consistency?
                                        </h3>
                                        <p style="margin: 0 0 25px 0; font-size: 16px; color: #000000; font-weight: bold; font-family: Arial, sans-serif;">
                                            Join thousands who've transformed their lives with Launch Lifestyle
                                        </p>
                                        
                                        <table style="margin: 20px auto; border-collapse: separate; border-spacing: 10px;">
                                            <tr>
                                                <td><a href="https://apps.apple.com/za/app/launch-lifestyle/id6743004197" target="_blank" style="text-decoration: none; display: block; background: #000000; border-radius: 8px; padding: 8px 16px; color: white; font-family: Arial, sans-serif; text-align: center; width: 120px; height: 40px; border: 1px solid #000000;">
                                                    <div style="font-size: 10px; line-height: 12px; margin-bottom: 2px;">Download on the</div>
                                                    <div style="font-size: 16px; font-weight: bold; line-height: 18px;">App Store</div>
                                                </a></td>
                                                <td><a href="https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share" target="_blank" style="text-decoration: none; display: block; background: #000000; border-radius: 8px; padding: 8px 16px; color: white; font-family: Arial, sans-serif; text-align: center; width: 120px; height: 40px; border: 1px solid #000000;">
                                                    <div style="font-size: 10px; line-height: 12px; margin-bottom: 2px;">GET IT ON</div>
                                                    <div style="font-size: 16px; font-weight: bold; line-height: 18px;">Google Play</div>
                                                </a></td>
                                            </tr>
                                        </table>
                                        
                                        <table style="margin: 20px auto; border-collapse: separate; border-spacing: 10px;">
                                            <tr>
                                                <td><a href="https://www.facebook.com/launch.lifestyle.fitness" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #1877f2; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Facebook</a></td>
                                                <td><a href="https://www.instagram.com/launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #E4405F; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">Instagram</a></td>
                                                <td><a href="https://www.tiktok.com/@launch_lifestyle" target="_blank" style="text-decoration: none; display: block; padding: 8px; background: #000000; border-radius: 8px; text-align: center; min-width: 80px; color: white; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">TikTok</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #FFFFFF; border-top: 3px solid #FFD600;">
                            

                            
                            <div style="width: 100px; height: 3px; background-color: #FFD600; margin: 20px auto;"></div>
                            
                            <p style="margin: 0; color: #1A1A1A; font-size: 13px; line-height: 1.5; font-family: Arial, sans-serif; font-weight: normal;">
                                <strong style="color: #000000; font-weight: 900; font-family: 'Arial Black', Arial, sans-serif;">LAUNCH LIFESTYLE</strong><br>
                                Transforming lives through intelligent fitness coaching<br>
                                Contact: <a href="mailto:keegan.launch@gmail.com" style="color: #000000; text-decoration: underline;">keegan.launch@gmail.com</a><br><br>
                                You received this because you requested our consistency hacks guide.<br>
                                This is exactly what helps our 1000+ members stay consistent every day.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
  };

  return sendEmail(emailParams);
}