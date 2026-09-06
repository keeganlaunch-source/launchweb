import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Shield, Zap } from "lucide-react";

interface CheckoutProps {
  productId?: string;
}

export default function Checkout({ productId }: CheckoutProps) {
  const [_, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Get product details if productId is provided
    if (productId) {
      fetch(`/api/pdf-products`)
        .then(res => res.json())
        .then(products => {
          const selectedProduct = products.find((p: any) => p.id.toString() === productId);
          setProduct(selectedProduct);
        })
        .catch(console.error);
    }
  }, [productId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !product) return;

    setIsProcessing(true);

    try {
      // Check if Stripe is configured
      const response = await fetch('/api/create-pdf-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          customerEmail: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      if (data.clientSecret) {
        // Stripe is configured - integrate with Stripe Elements here
        alert(`Stripe payment system ready!\nProduct: ${product.name}\nPrice: $${(product.priceUsd / 100).toFixed(2)}\n\nOnce you add your Stripe keys, customers will be redirected to secure Stripe checkout.`);
      }

    } catch (error: any) {
      if (error.message.includes('Payment system not configured')) {
        alert('Stripe payment system needs to be configured with your API keys. Please add STRIPE_SECRET_KEY and VITE_STRIPE_PUBLIC_KEY environment variables.');
      } else {
        alert('Payment failed: ' + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-white">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/products')}
            className="text-white/70 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold text-white mb-2">Secure Checkout</h1>
          <p className="text-gray-300">Complete your purchase in just a few clicks</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Summary */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold">{product.name}</h3>
                  <p className="text-gray-300 text-sm mt-1">{product.description}</p>
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-green-400">${(product.priceUsd / 100).toFixed(2)} USD</span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  + automatic currency conversion for international customers
                </p>
              </div>

              {/* Trust Signals */}
              <div className="space-y-3 pt-4 border-t border-white/20">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Secure payment by Stripe</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Instant download after payment</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <CreditCard className="w-4 h-4 text-purple-400" />
                  <span>All major payment methods accepted</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Payment Details</CardTitle>
              <CardDescription className="text-gray-300">
                Enter your email to receive the download link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Your download link will be sent to this email
                  </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <h4 className="text-yellow-300 font-semibold mb-2">Demo Mode Active</h4>
                  <p className="text-yellow-200 text-sm">
                    This is a demonstration of the payment system. Once you add your Stripe API keys, 
                    customers will be redirected to secure Stripe checkout for real payments.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isProcessing || !email}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Complete Purchase - ${(product.priceUsd / 100).toFixed(2)}
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  By completing this purchase, you agree to our terms of service.
                  You will receive an email with your download link immediately after payment.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}