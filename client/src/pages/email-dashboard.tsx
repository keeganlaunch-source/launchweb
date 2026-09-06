import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, MapPin, Calendar, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSignup {
  id: number;
  email: string;
  name?: string;
  country?: string;
  city?: string;
  region?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function EmailDashboard() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: newsletterSignups = [], isLoading: loadingSignups, refetch: refetchSignups } = useQuery({
    queryKey: ['/api/admin/newsletter-signups'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: contactMessages = [], isLoading: loadingMessages, refetch: refetchMessages } = useQuery({
    queryKey: ['/api/admin/contact-messages'],
    refetchInterval: 30000,
  });

  const filteredSignups = newsletterSignups.filter((signup: NewsletterSignup) =>
    signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (signup.name && signup.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMessages = contactMessages.filter((message: ContactMessage) =>
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No data available to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `${filename} exported successfully.`,
    });
  };

  const exportCompleteMetrics = async () => {
    try {
      const response = await fetch('/api/export-complete-metrics');
      if (!response.ok) {
        throw new Error('Failed to generate complete metrics');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `launch-complete-metrics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Complete Export Ready",
        description: "All authentic metrics exported in one comprehensive file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate complete metrics export.",
        variant: "destructive",
      });
    }
  };

  const refreshAll = () => {
    refetchSignups();
    refetchMessages();
    toast({
      title: "Data Refreshed",
      description: "Email data has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Email Capture Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            View and manage all captured emails from your Launch website
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={refreshAll} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button 
              onClick={exportCompleteMetrics}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Complete Metrics
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search emails, names, or subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Newsletter Subscribers</p>
                  <p className="text-2xl font-bold text-blue-600">{newsletterSignups.length}</p>
                </div>
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Messages</p>
                  <p className="text-2xl font-bold text-green-600">{contactMessages.length}</p>
                </div>
                <User className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Captures</p>
                  <p className="text-2xl font-bold text-purple-600">{newsletterSignups.length + contactMessages.length}</p>
                </div>
                <Download className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Newsletter Signups */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Newsletter Subscribers ({filteredSignups.length})
              </CardTitle>
              <Button 
                onClick={() => exportToCSV(filteredSignups, 'newsletter-subscribers')}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingSignups ? (
              <p className="text-center py-8 text-gray-500">Loading newsletter signups...</p>
            ) : filteredSignups.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No newsletter signups found.</p>
            ) : (
              <div className="space-y-4">
                {filteredSignups.map((signup: NewsletterSignup) => (
                  <div key={signup.id} className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{signup.email}</span>
                          {signup.name && (
                            <Badge variant="secondary">{signup.name}</Badge>
                          )}
                        </div>
                        {(signup.city || signup.country) && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {[signup.city, signup.region, signup.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(signup.createdAt).toLocaleDateString()}</span>
                        <span>{new Date(signup.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Messages */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Contact Messages ({filteredMessages.length})
              </CardTitle>
              <Button 
                onClick={() => exportToCSV(filteredMessages, 'contact-messages')}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingMessages ? (
              <p className="text-center py-8 text-gray-500">Loading contact messages...</p>
            ) : filteredMessages.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No contact messages found.</p>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message: ContactMessage) => (
                  <div key={message.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{message.name}</span>
                          <Badge variant="outline">{message.email}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Subject: {message.subject}</p>
                        <p className="text-gray-600 mt-1">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}