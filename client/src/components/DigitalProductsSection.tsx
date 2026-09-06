import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Star, Clock, Globe, Mail, CreditCard, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  badge?: string;
}

interface LocationData {
  country: string;
  currency: string;
  exchangeRate: number;
}

export default function DigitalProductsSection() {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const products: Product[] = [
    {
      id: 1,
      name: "Launch Digital Recipe Book",
      description: "60 macro-friendly, high-protein recipes with complete nutritional breakdowns. Crafted by Coach Keegan with his signature cheeky humor, playful recipe titles, and that authentic Keegs touch throughout.",
      price: 10,
      features: [
        "60 high-protein, macro-friendly recipes with personality",
        "Complete macro breakdown (protein, carbs, fats, calories)",
        "Multiple dietary options: Paleo, Vegan, Vegetarian, Carnivore, Lactose-free, Banting",
        "Organized by meal types: Breakfast, Lunch, Dinner, Snacks",
        "Coach Keegan's cheeky humor and playful titles throughout",
        "High-quality food photography for each recipe",
        "Step-by-step instructions with that authentic Keegs approach",
        "Clean, fun, and approachable - professional with personality"
      ],
      badge: "BESTSELLER"
    }
  ];

  useEffect(() => {
    // Fetch user location and currency data
    // Add ?test=za to URL to test South African pricing
    const testMode = window.location.search.includes('test=za') ? '&test=za' : '';
    fetch(`/api/user-location?t=${Date.now()}${testMode}`)
      .then(res => res.json())
      .then(data => {
        console.log('Location data received:', data);
        setLocationData(data);
      })
      .catch(err => {
        console.error('Location detection failed:', err);
        // Default to USD if location detection fails
        setLocationData({
          country: 'US',
          currency: 'USD',
          exchangeRate: 1
        });
      });
  }, []);

  const formatPrice = (usdPrice: number) => {
    if (!locationData) return `$${usdPrice}`;
    
    const localPrice = usdPrice * locationData.exchangeRate;
    
    if (locationData.currency === 'ZAR') {
      return `R${Math.round(localPrice)}`;
    }
    
    return `$${usdPrice}`;
  };

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: number; name: string } | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');

  const handlePurchase = async (productId: number, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setShowEmailModal(true);
  };

  const processPurchase = async () => {
    if (!customerEmail || !customerEmail.includes('@')) {
      toast({
        title: "Email Required",
        description: "Please enter a valid email address to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedProduct) return;
    
    setShowEmailModal(false);
    
    setIsLoading(true);
    
    try {
      // Use Paystack for all customers with inline payment (stays on website)
      const response = await fetch('/api/create-paystack-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          customerEmail,
          productName: selectedProduct.name
        })
      });
      
      const paymentData = await response.json();
      
      if (paymentData.status) {
        // Initialize Paystack inline payment (stays on your website)
        const handler = (window as any).PaystackPop.setup({
          key: paymentData.publicKey,
          email: customerEmail,
          amount: paymentData.data.amount,
          currency: paymentData.data.currency,
          reference: paymentData.data.reference,
          callback: function(response: any) {
            // Payment successful - verify and download
            window.location.href = `/success?reference=${response.reference}&product_id=${selectedProduct.id}`;
          },
          onClose: function() {
            setIsLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You can try again when ready.",
              variant: "default"
            });
          }
        });
        
        handler.openIframe();
      } else {
        throw new Error('Payment initialization failed');
      }
      
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Transform Your Health Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get instant access to our evidence-based digital resources and start your transformation journey right now.
          </p>
          {locationData && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <Globe className="w-4 h-4" />
              <span>Pricing shown in your local currency ({locationData.currency})</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <Card key={product.id} className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              {product.badge && (
                <Badge 
                  className="absolute top-4 right-4 z-10 text-xs font-bold"
                  variant={product.badge === 'BESTSELLER' ? 'default' : 'secondary'}
                >
                  {product.badge}
                </Badge>
              )}
              
              <CardHeader className="pb-4 pr-20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-primary mb-1">
                    <Clock className="w-4 h-4" />
                    <span>Instant Digital Download</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Access your purchase immediately after payment confirmation
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-6">
                <div className="w-full space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {formatPrice(product.price)}
                    </div>
                    {locationData?.currency === 'ZAR' && (
                      <div className="text-sm text-gray-500">
                        (${product.price} USD)
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={() => handlePurchase(product.id, product.name)}
                    disabled={isLoading}
                    className="w-full h-12 text-lg font-semibold"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {isLoading ? 'Processing...' : 'Download Now'}
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    Secure payment • 30-day money-back guarantee
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            All digital products are delivered instantly via email after successful payment. 
            No physical shipping required. Compatible with all devices.
          </p>
        </div>
      </div>

      {/* Professional Email Collection Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Complete Your Purchase
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {selectedProduct && (
                <>You're purchasing <strong>{selectedProduct.name}</strong> for {formatPrice(10)}.</>
              )}
              <br />Enter your email to continue with secure payment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="pl-10 h-12"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEmailModal(false);
                  setCustomerEmail('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={processPurchase}
                disabled={isLoading || !customerEmail.includes('@')}
                className="flex-1"
              >
                {isLoading ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </div>
            
            <p className="text-xs text-center text-gray-500 mt-4">
              Your email will be used for purchase confirmation and PDF delivery.
              <br />Secure payment powered by Paystack.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}