import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

interface PrivateAnalyticsLoginProps {
  onAuthenticated: () => void;
}

export default function PrivateAnalyticsLogin({ onAuthenticated }: PrivateAnalyticsLoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check - you can change this password
    if (password === "LaunchLifestyle2025!") {
      onAuthenticated();
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="w-12 h-12 text-blue-500" />
          </div>
          <CardTitle className="text-white text-2xl">Private Analytics Access</CardTitle>
          <p className="text-gray-400">Enter password to view Launch Lifestyle analytics</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Access Analytics
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}