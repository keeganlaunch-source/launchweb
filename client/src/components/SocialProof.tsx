export default function SocialProof() {
  return (
    <div className="bg-gray-50 py-8 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-black">1000+</div>
            <div className="text-sm font-medium text-gray-600">Active Members</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-black">5/5</div>
            <div className="text-sm font-medium text-gray-600">Average Rating</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-black">100%</div>
            <div className="text-sm font-medium text-gray-600">Satisfied Clients</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold text-black">12 Weeks</div>
            <div className="text-sm font-medium text-gray-600">Avg Goal Time</div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-700 text-base font-medium">"Coach Keegs transformed my entire approach to fitness" - Recent Member</p>
        </div>
      </div>
    </div>
  );
}