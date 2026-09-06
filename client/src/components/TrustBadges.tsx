import { Shield, Award, Heart, CheckCircle } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="py-6 bg-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-2 p-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xs text-white/80 font-medium">100% Secure</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4">
            <Award className="w-8 h-8 text-primary" />
            <span className="text-xs text-white/80 font-medium">Certified Coach</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xs text-white/80 font-medium">30-Day Guarantee</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 p-4">
            <CheckCircle className="w-8 h-8 text-primary" />
            <span className="text-xs text-white/80 font-medium">No Commitment</span>
          </div>
        </div>
      </div>
    </div>
  );
}