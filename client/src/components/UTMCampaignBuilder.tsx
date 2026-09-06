import { useState } from "react";
import { Copy, Check, ExternalLink, BarChart3 } from "lucide-react";
import { trackCustomEvent } from "../lib/firebase";

export default function UTMCampaignBuilder() {
  const [utmParams, setUtmParams] = useState({
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [copied, setCopied] = useState(false);

  const baseUrl = "https://launchfit.app";
  
  const generateUTMUrl = () => {
    const params = new URLSearchParams();
    if (utmParams.source) params.append('utm_source', utmParams.source);
    if (utmParams.medium) params.append('utm_medium', utmParams.medium);
    if (utmParams.campaign) params.append('utm_campaign', utmParams.campaign);
    if (utmParams.term) params.append('utm_term', utmParams.term);
    if (utmParams.content) params.append('utm_content', utmParams.content);
    
    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateUTMUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackCustomEvent('utm_url_copied', utmParams);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const presetCampaigns = [
    {
      name: "Instagram Story",
      params: { source: 'instagram', medium: 'social', campaign: 'brand_awareness', content: 'story' }
    },
    {
      name: "Facebook Ad",
      params: { source: 'facebook', medium: 'paid_social', campaign: 'app_downloads', content: 'video_ad' }
    },
    {
      name: "TikTok Bio Link",
      params: { source: 'tiktok', medium: 'social', campaign: 'profile_traffic', content: 'bio_link' }
    },
    {
      name: "YouTube Description",
      params: { source: 'youtube', medium: 'social', campaign: 'content_marketing', content: 'video_description' }
    },
    {
      name: "WhatsApp Share",
      params: { source: 'whatsapp', medium: 'messaging', campaign: 'referral', content: 'personal_share' }
    },
    {
      name: "Email Newsletter",
      params: { source: 'email', medium: 'email', campaign: 'newsletter', content: 'cta_button' }
    }
  ];

  const loadPreset = (preset: any) => {
    setUtmParams(preset.params);
    trackCustomEvent('utm_preset_loaded', { preset_name: preset.name });
  };

  return (
    <div className="bg-background p-6 rounded-lg border-2 border-border">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h3 className="font-grunge text-xl uppercase tracking-tight">
          Campaign Tracking Builder
        </h3>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* UTM Parameters Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Campaign Source *</label>
            <input
              type="text"
              placeholder="e.g., instagram, facebook, tiktok"
              value={utmParams.source}
              onChange={(e) => setUtmParams({...utmParams, source: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Campaign Medium *</label>
            <input
              type="text"
              placeholder="e.g., social, paid_social, email"
              value={utmParams.medium}
              onChange={(e) => setUtmParams({...utmParams, medium: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Campaign Name *</label>
            <input
              type="text"
              placeholder="e.g., app_downloads, brand_awareness"
              value={utmParams.campaign}
              onChange={(e) => setUtmParams({...utmParams, campaign: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Campaign Term</label>
            <input
              type="text"
              placeholder="e.g., fitness app, personal trainer"
              value={utmParams.term}
              onChange={(e) => setUtmParams({...utmParams, term: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Campaign Content</label>
            <input
              type="text"
              placeholder="e.g., story, video_ad, bio_link"
              value={utmParams.content}
              onChange={(e) => setUtmParams({...utmParams, content: e.target.value})}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Presets and Generated URL */}
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-sm mb-3">Quick Presets</h4>
            <div className="grid grid-cols-2 gap-2">
              {presetCampaigns.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => loadPreset(preset)}
                  className="text-xs p-2 bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors text-left"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3">Generated Tracking URL</h4>
            <div className="bg-muted p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground break-all mb-3">
                {generateUTMUrl()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy URL
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.open(generateUTMUrl(), '_blank')}
                  className="px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <h4 className="font-bold text-sm mb-2">Analytics Benefits</h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Track which social platforms drive most traffic</li>
              <li>• Measure campaign ROI and conversion rates</li>
              <li>• Optimize content based on performance data</li>
              <li>• Identify your most valuable traffic sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}