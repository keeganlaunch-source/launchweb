import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Star, CheckCircle, DollarSign, Globe } from "lucide-react";
import { useState } from "react";

interface PdfProduct {
  id: number;
  name: string;
  description: string;
  filename: string;
  priceUsd: number;
  downloadCount: number;
}

export default function Products() {
  const [selectedProduct, setSelectedProduct] = useState<PdfProduct | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: products, isLoading } = useQuery<PdfProduct[]>({
    queryKey: ['/api/pdf-products'],
  });

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const handlePurchase = async (product: PdfProduct) => {
    setSelectedProduct(product);
    setIsProcessing(true);

    // Get customer details
    const customerEmail = prompt('Please enter your email address for the download link:');
    if (!customerEmail) {
      setIsProcessing(false);
      setSelectedProduct(null);
      return;
    }

    const customerName = prompt('Please enter your full name:') || 'Customer';

    // Check if customer is in South Africa (for PayFast) or international (for Stripe)
    const isInSouthAfrica = confirm('Are you located in South Africa? Click OK for Yes, Cancel for No (international)');

    try {
      if (isInSouthAfrica) {
        // Use Paystack for South African customers
        const response = await fetch('/api/create-paystack-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            customerEmail,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Payment failed');
        }

        if (data.status && data.data.authorization_url) {
          // Redirect to Paystack checkout
          window.open(data.data.authorization_url, '_blank');
          alert(`🇿🇦 Paystack Payment Ready!\n\nProduct: ${product.name}\nPrice: R${(product.priceUsd / 100 * 18.5).toFixed(2)} (approx)\nEmail: ${customerEmail}\n\nYou'll be redirected to Paystack for secure payment with local SA banking options including EFT, cards, and more!`);
        } else {
          alert(`💳 Paystack Demo Mode\n\nProduct: ${product.name}\nPrice: R${(product.priceUsd / 100 * 18.5).toFixed(2)}\nEmail: ${customerEmail}\n\nOnce you add your PAYSTACK_SECRET_KEY, South African customers will get secure local payment options!`);
        }

      } else {
        // Use Stripe for international customers
        const response = await fetch('/api/create-pdf-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            customerEmail,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Payment failed');
        }

        if (data.clientSecret) {
          // Payment system is ready - show success message for now
          alert(`💳 Stripe Payment Ready!\n\nProduct: ${product.name}\nPrice: $${(product.priceUsd / 100).toFixed(2)} USD\nEmail: ${customerEmail}\n\nOnce you add your Stripe API keys, international customers will be redirected to secure checkout with automatic currency conversion!`);
        }
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.message.includes('Payment system not configured')) {
        alert('💳 Setup Required\n\nThe payment system needs configuration. For South African customers, we can use PayFast. For international customers, we need Stripe API keys.');
      } else {
        alert('Payment failed: ' + error.message);
      }
    } finally {
      setIsProcessing(false);
      setSelectedProduct(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
            <p className="text-white mt-4">Loading premium products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Premium Digital Products
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Evidence-based guides and blueprints for optimal health, nutrition, and lifestyle optimization.
            Instant download after secure payment.
          </p>
        </div>

        {/* Features Banner */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-12">
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Instant Download</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              <span>Auto Currency Conversion</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span>Secure Stripe Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              <span>Evidence-Based Content</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {products?.map((product) => (
            <Card key={product.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    Digital Download
                  </Badge>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(product.priceUsd)}
                    </div>
                    <div className="text-sm text-gray-400">
                      + auto conversion
                    </div>
                  </div>
                </div>
                <CardTitle className="text-white text-xl">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-gray-300 leading-relaxed">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">{product.downloadCount} downloads</span>
                  </div>
                  <Badge variant="outline" className="border-green-500/50 text-green-400">
                    PDF Format
                  </Badge>
                </div>

                <Button 
                  onClick={() => handlePurchase(product)}
                  disabled={isProcessing && selectedProduct?.id === product.id}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
                >
                  {isProcessing && selectedProduct?.id === product.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      Buy & Download Now
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Secure payment processed by Stripe • Instant download link via email
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-white mb-6">Why Choose Our Digital Products?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 rounded-xl p-6">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Evidence-Based</h4>
              <p className="text-gray-400 text-sm">All content backed by peer-reviewed research and scientific studies</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Instant Access</h4>
              <p className="text-gray-400 text-sm">Download immediately after payment - no waiting for shipping</p>
            </div>
            <div className="bg-white/5 rounded-xl p-6">
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Global Support</h4>
              <p className="text-gray-400 text-sm">Automatic currency conversion for customers worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}