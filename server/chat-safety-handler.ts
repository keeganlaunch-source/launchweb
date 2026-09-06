// Critical safety response handler for injury screening and email capture
import { sendConsistencyHacksEmail } from './email-consistency-hacks';

export async function getCriticalSafetyResponse(
  message: string, 
  conversationHistory: any[], 
  sessionId: string
): Promise<string | null> {
  const lowercaseMessage = message.toLowerCase();
  
  // Handle email capture for free guide (high priority for lead generation)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = message.match(emailRegex);
  
  if (emailMatch) {
    const email = emailMatch[0];
    
    // Send consistency hacks email
    sendConsistencyHacksEmail(email).then(success => {
      if (success) {
        console.log(`Consistency hacks guide sent to: ${email}`);
      } else {
        console.error(`Failed to send consistency hacks guide to: ${email}`);
      }
    }).catch(error => {
      console.error('Error sending consistency hacks email:', error);
    });
    
    return `Perfect! I've sent the TOP 5 CONSISTENCY HACKS guide to ${email}

Check your inbox (and spam folder) for "Your FREE Consistency Hacks Guide - Launch Lifestyle"

This is the exact blueprint that keeps my 1000+ members consistent every single day. These aren't just tips - they're proven strategies backed by behavioral science.

While you're checking that out, want to build some immediate momentum? Just say "workout" and I'll create a personalized routine for you!

Consistency is everything. Let's launch your transformation!`;
  }

  // Critical safety check for workout requests
  if ((lowercaseMessage.includes('workout') || lowercaseMessage.includes('exercise') || 
       lowercaseMessage.includes('train') || lowercaseMessage.includes('routine')) &&
      !lowercaseMessage.includes('no injuries') && !lowercaseMessage.includes('all clear')) {
    
    // Check if this is a safety clearance response
    if (lowercaseMessage.includes('no injuries') || lowercaseMessage.includes('no injury') || 
        lowercaseMessage.includes('all clear') || lowercaseMessage.includes('healthy') || 
        lowercaseMessage.includes('good to go')) {
      return null; // Let the smart chat manager handle workout generation
    }
    
    return `Safety first! Before I can create any workout plan, I need to know: Do you have any injuries or physical limitations I should know about?

Type "NO INJURIES" if you're all clear to train.

Once I know you're safe, I'll ask about your equipment and experience level to create the perfect workout for YOU!

Small actions, big results - that's the Launch way.`;
  }

  // App download requests (high conversion priority)
  if (lowercaseMessage.includes('download') || lowercaseMessage.includes('app') || 
      lowercaseMessage.includes('install')) {
    return `Launch time! Ready to upgrade from our chat to the full Launch experience?

The app has everything you need:
• Personalized workout plans
• Progress tracking
• Nutrition guidance  
• Direct access to Coach Keegs
• Community support

[DOWNLOAD_BUTTONS]

Think of it as going from texting to having your own personal fitness coach in your pocket!`;
  }

  return null; // No critical safety response needed
}