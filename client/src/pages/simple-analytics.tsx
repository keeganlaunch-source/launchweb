import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Users, MessageCircle, TrendingUp, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SimpleAnalytics() {
  const { data: newsletterData, refetch: refetchNewsletter } = useQuery<any[]>({
    queryKey: ["/api/admin/newsletter-signups"],
    refetchInterval: 30000,
  });

  const { data: contactData, refetch: refetchContact } = useQuery<any[]>({
    queryKey: ["/api/admin/contact-messages"],
    refetchInterval: 30000,
  });

  const { data: streakData, refetch: refetchStreak } = useQuery<any>({
    queryKey: ["/api/streak"],
    refetchInterval: 30000,
  });

  const handleRefresh = () => {
    refetchNewsletter();
    refetchContact();
    refetchStreak();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Launch Lifestyle Analytics</h1>
            <p className="text-gray-400 mt-1">Real-time business intelligence dashboard</p>
          </div>
          <Button 
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold">Newsletter Signups</h3>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-2">
              {newsletterData?.length || 0}
            </p>
            <p className="text-sm text-gray-400">Total subscribers</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold">Contact Forms</h3>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-400 mb-2">
              {contactData?.length || 0}
            </p>
            <p className="text-sm text-gray-400">Total inquiries</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Current Streak</h3>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-400 mb-2">
              {streakData?.currentStreak || 0}
            </p>
            <p className="text-sm text-gray-400">Days active</p>
          </div>
        </div>

        {/* Engagement Overview */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Launch Lifestyle Engagement Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium mb-4 text-blue-400">Newsletter Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Subscribers</span>
                  <span className="font-bold text-white">{newsletterData?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Growth Rate</span>
                  <span className="font-bold text-green-400">Active</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4 text-green-400">Contact Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Inquiries</span>
                  <span className="font-bold text-white">{contactData?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Response Rate</span>
                  <span className="font-bold text-green-400">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}