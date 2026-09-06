// Launch Lifestyle authentic Meta Business configuration
export const LAUNCH_META_CONFIG = {
  // Facebook Page ID for Launch (owned by Bobs Bootcamp)
  facebookPageId: '461507487294269',
  
  // Meta Pixel ID (already configured)
  pixelId: '1181578407319125',
  
  // Instagram Business Account ID (to be added when available)
  instagramBusinessAccountId: '', // Will be filled when you provide it
  
  // Access token (to be provided securely)
  accessToken: '', // Will be provided via secrets
  
  // Page information
  pageInfo: {
    name: 'Launch',
    owner: 'Bobs Bootcamp',
    verified: true
  }
};

// Available Facebook Page insights metrics for Launch page
export const FACEBOOK_METRICS = [
  'page_impressions',
  'page_impressions_unique', 
  'page_reach',
  'page_views_total',
  'page_actions_post_reactions_total',
  'page_posts_impressions',
  'page_posts_impressions_unique',
  'page_fan_adds',
  'page_fan_removes',
  'page_video_views'
];

// Instagram Business metrics (when connected)
export const INSTAGRAM_METRICS = [
  'impressions',
  'reach',
  'profile_views',
  'website_clicks',
  'email_contacts',
  'phone_number_clicks',
  'get_directions_clicks'
];