import { motion } from "framer-motion";
import { Sparkles, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FreeTrialSection() {
  const handleAppStoreClick = () => {
    window.open('https://apps.apple.com/za/app/launch-lifestyle/id6743004197', '_blank');
  };

  const handlePlayStoreClick = () => {
    window.open('https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share', '_blank');
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-gray-50">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/20 to-transparent" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            LIMITED TIME OFFER
            <Sparkles className="w-4 h-4" />
          </motion.div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Start Your{" "}
            <span className="relative">
              <span className="relative z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                7-Day FREE Trial
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-300 -rotate-1 rounded"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
              />
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant access to personalized workouts, nutrition plans, and expert coaching. 
            <span className="font-bold text-gray-900"> No credit card required!</span>
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
            >
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">4.9 Rating</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
            >
              <Clock className="w-5 h-5 text-green-500" />
              <span className="font-semibold">Full 7 Days Free</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-semibold">Premium Features</span>
            </motion.div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleAppStoreClick}
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-90">Download on the</div>
                    <div className="text-base font-bold">App Store</div>
                  </div>
                </div>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handlePlayStoreClick}
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-90">GET IT ON</div>
                    <div className="text-base font-bold">Google Play</div>
                  </div>
                </div>
              </Button>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-sm text-gray-600"
          >
            <p>✓ Cancel anytime ✓ No hidden fees ✓ Instant access</p>
          </motion.div>

          {/* Urgency indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-6 inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Only 47 trial spots left this week
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}