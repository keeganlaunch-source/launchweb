import { useEffect, useState } from 'react';
import { CheckCircle, Download, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Success() {
  const [downloadToken, setDownloadToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check URL for success parameters from Paystack
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    const productId = urlParams.get('product_id');
    
    if (reference && productId) {
      // Verify Paystack payment and get download token
      verifyPaystackPaymentAndGetDownload(reference, productId);
    }
  }, []);

  const verifyPaystackPaymentAndGetDownload = async (reference: string, productId: string) => {
    try {
      const response = await fetch('/api/verify-paystack-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, productId })
      });

      const data = await response.json();
      
      if (data.success && data.downloadToken) {
        setDownloadToken(data.downloadToken);
      } else {
        toast({
          title: "Download Issue",
          description: "Please check your email for the download link, or contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Download Issue", 
        description: "Please check your email for the download link, or contact support.",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (downloadToken) {
      window.open(`/api/download/${downloadToken}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Thank you for your purchase from Launch Lifestyle
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Check Your Email
            </CardTitle>
            <CardDescription>
              A confirmation email with your download link has been sent to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The email includes your receipt and a secure download link that will be valid for 24 hours.
            </p>
          </CardContent>
        </Card>

        {downloadToken && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Instant Download
              </CardTitle>
              <CardDescription>
                Your digital product is ready for immediate download.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleDownload} className="w-full" size="lg">
                <Download className="w-4 h-4 mr-2" />
                Download Your PDF Now
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Need help? Contact Coach Keegan at support@launchlifestyle.com
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Return to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
}