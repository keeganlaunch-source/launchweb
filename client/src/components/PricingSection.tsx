import { Check, Smartphone, X } from "lucide-react";
import { SiAppstore, SiGoogleplay } from "react-icons/si";
import { useState, useEffect } from "react";

export default function PricingSection() {
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [currency, setCurrency] = useState('ZAR');
  const [exchangeRates, setExchangeRates] = useState<{[key: string]: number}>({});
  const [userCountry, setUserCountry] = useState('ZA');

  // Base prices in South African Rands
  const basePrices = {
    basic: 300,
    premium: 450
  };

  const currencySymbols: {[key: string]: string} = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'ZAR': 'R',
    'AUD': 'A$',
    'CAD': 'C$',
    'JPY': '¥'
  };

  useEffect(() => {
    // Get user's location and currency
    const getUserLocation = async () => {
      try {
        // Get user's country from their IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        setUserCountry(countryCode);

        // Set currency based on country
        const currencyMap: {[key: string]: string} = {
          'US': 'USD',
          'GB': 'GBP', 
          'DE': 'EUR', 'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR',
          'AU': 'AUD',
          'CA': 'CAD',
          'JP': 'JPY',
          'ZA': 'ZAR'
        };
        
        const userCurrency = currencyMap[countryCode] || 'USD';
        setCurrency(userCurrency);

        // Get exchange rates from ZAR to other currencies
        if (userCurrency !== 'ZAR') {
          const ratesResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/ZAR`);
          const ratesData = await ratesResponse.json();
          setExchangeRates(ratesData.rates);
        }
      } catch (error) {
        console.log('Could not determine location, defaulting to ZAR');
        setCurrency('ZAR');
      }
    };

    getUserLocation();
  }, []);

  const formatPrice = (basePrice: number) => {
    if (currency === 'ZAR') {
      return `R${basePrice}`;
    }

    const rate = exchangeRates[currency];
    if (rate) {
      const convertedPrice = Math.round(basePrice * rate);
      const symbol = currencySymbols[currency] || currency;
      return `${symbol}${convertedPrice}`;
    }

    return `R${basePrice}`;
  };

  const plans = [
    {
      name: "Basic Plan",
      price: formatPrice(basePrices.basic),
      period: "/month",
      features: [
        "Custom workout plans",
        "Mobile app access",
        "Progress tracking",
        "Community access"
      ],
      featured: false
    },
    {
      name: "Premium Plan", 
      price: formatPrice(basePrices.premium),
      period: "/month",
      features: [
        "Everything in Basic",
        "1-on-1 coaching sessions",
        "Nutrition planning",
        "Priority support",
        "Advanced analytics"
      ],
      featured: true
    }
  ];

  const handlePlanSelect = (planName: string) => {
    // Track plan selection for analytics
    if (window.gtag) {
      window.gtag('event', 'plan_selected', {
        event_category: 'pricing',
        event_label: planName,
        value: planName === 'Basic Plan' ? basePrices.basic : basePrices.premium
      });
    }
    // Redirect to embedded signup flow instead of app download
    const planType = planName === 'Basic Plan' ? 'basic' : 'premium';
    window.location.href = `/signup?plan=${planType}`;
  };

  const handleSubscribe = (planName: string) => {
    // Track subscription intent
    if (window.gtag) {
      window.gtag('event', 'subscribe_intent', {
        event_category: 'conversion',
        event_label: planName
      });
    }
    // Redirect to embedded signup flow instead of app download
    const planType = planName === 'Basic Plan' ? 'basic' : 'premium';
    window.location.href = `/signup?plan=${planType}`;
  };

  const handleAppDownload = (platform: 'apple' | 'android') => {
    const links = {
      apple: 'https://apps.apple.com/za/app/launch-lifestyle/id6743004197',
      android: 'https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share'
    };
    window.open(links[platform], '_blank');
    setShowAppDownloadModal(false);
  };

  return (
    <section id="pricing" className="py-20 px-4 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Pricing Header */}
        <div className="text-center mb-16">
          <h2 className="font-grunge text-4xl lg:text-6xl uppercase tracking-tight mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Start your transformation today with our flexible pricing options.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              onClick={() => handlePlanSelect(plan.name)}
              className={`border-2 border-border p-8 text-center transition-all duration-300 card-shadow relative cursor-pointer ${
                plan.featured 
                  ? 'bg-primary text-primary-foreground transform scale-105' 
                  : 'bg-background text-foreground'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-foreground text-primary px-6 py-2 font-black uppercase text-sm">
                  Most Popular
                </div>
              )}
              
              <h3 className={`font-black text-2xl uppercase mb-4 ${plan.featured ? 'pt-4' : ''}`}>
                {plan.name}
              </h3>
              
              <div className="mb-6">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className={`text-lg ${plan.featured ? 'text-primary-foreground opacity-80' : 'text-muted-foreground'}`}>
                  {plan.period}
                </span>
              </div>
              
              {/* Plan Features */}
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.featured ? 'text-foreground' : 'text-primary'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribe(plan.name);
                }}
                className={`w-full px-8 py-4 font-semibold uppercase tracking-wide border-2 border-border transition-all duration-300 ${
                  plan.featured
                    ? 'bg-foreground text-primary hover:bg-muted-foreground font-black'
                    : 'bg-background text-foreground hover:bg-muted'
                }`}
              >
                {plan.featured ? 'Start Premium' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Launch AI Plan Selector */}


        {/* Pricing Guarantee */}
        <div className="text-center mt-12">
          <p className="text-lg font-semibold">
            30-day money-back guarantee. Cancel anytime.
          </p>
        </div>
      </div>

      {/* App Download Modal */}
      {showAppDownloadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-background border-2 border-border p-8 max-w-md w-full relative">
            <button 
              onClick={() => setShowAppDownloadModal(false)}
              className="absolute top-4 right-4 text-foreground hover:text-primary"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center mb-6">
              <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h3 className="font-grunge text-2xl uppercase mb-2">Download Launch App</h3>
              <p className="text-muted-foreground">Choose your platform to start your subscription</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handleAppDownload('apple')}
                className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                Download for iPhone
              </button>
              
              <button 
                onClick={() => handleAppDownload('android')}
                className="w-full bg-white text-black px-6 py-4 font-semibold border-2 border-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-50 flex items-center justify-center gap-3"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                </div>
                Download for Android
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
