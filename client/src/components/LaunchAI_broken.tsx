import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, BarChart3, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import launchLogo from "@assets/Untitled design.png";
import StreakVisualization from "./StreakVisualization";
import ProgressRing from "./ProgressRing";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Generate a unique session ID for this chat session
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function LaunchAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const [showStreakView, setShowStreakView] = useState(false);

  // Fetch real streak data for the progress ring
  const { data: streakData } = useQuery({
    queryKey: ['/api/streak', sessionId],
    enabled: !!sessionId && isOpen,
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey legend 👋 I'm Launch AI - your digital fitness wingman. Need help with training, structure, or signing up? Let's launch!",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatStartTime, setChatStartTime] = useState<Date | null>(null);
  const [hasShownTimeGatedOffer, setHasShownTimeGatedOffer] = useState(false);
  const [emailCapture, setEmailCapture] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Start tracking engagement time when chat opens
    if (isOpen && !chatStartTime) {
      setChatStartTime(new Date());
    }
  }, [isOpen]);

  // Set up periodic check for time-gated offer when chat opens
  useEffect(() => {
    if (!isOpen || hasShownTimeGatedOffer) return;

    const interval = setInterval(() => {
      checkTimeGatedOffer();
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [isOpen, chatStartTime, hasShownTimeGatedOffer]);

  // Track chat engagement time
  const checkTimeGatedOffer = () => {
    if (!chatStartTime || hasShownTimeGatedOffer) return;
    
    const engagementTime = Date.now() - chatStartTime.getTime();
    const oneMinute = 60 * 1000; // 1 minute in milliseconds
    
    if (engagementTime > oneMinute) {
      setHasShownTimeGatedOffer(true);
      
      const timeGatedMessage: Message = {
        id: `time-gated-${Date.now()}`,
        content: "Looks like you're serious 🔒 Try out the Launch App. Want the link?\n\n[DOWNLOAD_BUTTONS]\n\nKnow someone who needs this energy too? Share the Launch experience with them!\n\n[REFERRAL_SHARE]",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, timeGatedMessage]);
    }
  };

  const submitEmail = async (email: string) => {
    if (!email.trim() || isSubmittingEmail) return;
    
    setIsSubmittingEmail(true);
    
    try {
      const response = await fetch('/api/freebie-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit email');
      }

      const confirmationMessage: Message = {
        id: `email-confirmation-${Date.now()}`,
        content: "Perfect! 🎯 Keegs' Top 5 Consistency Hacks are heading your way. Check your inbox in the next few minutes!\n\nWhile you're waiting, want to see what the full Launch experience looks like?\n\n[DOWNLOAD_BUTTONS]\n\nKnow someone who needs this energy too? Share the Launch experience with them!\n\n[REFERRAL_SHARE]",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
      setEmailCapture('');
    } catch (error) {
      const errorMessage: Message = {
        id: `email-error-${Date.now()}`,
        content: "Oops! Something went wrong. Try again or hit up Coach Keegs directly: keegan.launch@gmail.com",
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const copyAndShareReferral = async () => {
    const websiteUrl = 'https://launchfit.app/';
    const shareMessage = `Check out Launch Lifestyle! I just tried Launch AI and it's incredible 💪 ${websiteUrl} - Launch AI sent you!`;
    
    try {
      // Copy to clipboard
      await navigator.clipboard.writeText(websiteUrl);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
      
      // Check if on mobile and WhatsApp is available
      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: 'Launch Lifestyle - AI Fitness Coach',
          text: shareMessage,
          url: websiteUrl,
        });
      } else {
        // Fallback to WhatsApp Web
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      // Fallback for clipboard errors
      const textArea = document.createElement('textarea');
      textArea.value = websiteUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
      
      // Still try WhatsApp sharing
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
          sessionId: sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Oops! Something went wrong. Coach Keegs said I stay in my lane 💪 For help, shoot him an email at keegan.launch@gmail.com or check out the app!",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex flex-col items-center justify-center gap-0 px-3 py-2 bg-black border-2 border-white text-white font-bold text-sm rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
            isOpen ? 'bg-black text-white' : ''
          }`}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5 text-white" />
              <span className="uppercase">CLOSE</span>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-1">
                <span className="font-grunge text-base uppercase text-white" style={{letterSpacing: '0.1rem'}}>
                  <span className="inline-block bg-primary text-black px-1 transform -rotate-2">LAUNCH</span> AI
                </span>
              </div>
              <span className="text-xs text-white font-semibold">Need help?</span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-black border-2 border-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-black text-white px-6 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                  <img 
                    src={launchLogo} 
                    alt="Launch Logo" 
                    className="w-10 h-10 object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-grunge text-lg uppercase tracking-tight text-white">Launch AI</h3>
                  <p className="text-xs text-white/60 font-medium">Online now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Progress Ring Indicator - matches X button styling */}
                <button
                  onClick={() => {
                    // Add workout challenge message to chat
                    const challengeMessage = {
                      id: `challenge-${Date.now()}`,
                      content: "🔥 Ready to track your fitness journey? I can help you build an epic workout streak! Tap the streak view to see your progress and complete today's workout. Let's get after it! 💪",
                      role: 'assistant' as const,
                      timestamp: new Date()
                    };
                    setMessages(prev => [...prev, challengeMessage]);
                    
                    // Switch to streak view after a short delay
                    setTimeout(() => {
                      setShowStreakView(true);
                    }, 1500);
                  }}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center relative group"
                  title="Workout Streak"
                >
                  <ProgressRing
                    progress={(streakData as any)?.streak?.currentStreak ? 
                      Math.min(100, ((streakData as any).streak.currentStreak / 30) * 100) : 0}
                    size={24}
                    strokeWidth={2}
                    color="#10b981"
                    backgroundColor="#6b7280"
                    className="opacity-80 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="text-[8px] font-bold text-white">
                      {(streakData as any)?.streak?.currentStreak || 0}
                    </div>
                  </ProgressRing>
                </button>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content Area - Chat or Streak View */}
          <div className="flex-1 bg-black">
            {showStreakView ? (
              // Streak Visualization View
              <div className="h-full flex items-center justify-center p-4">
                <StreakVisualization 
                  sessionId={sessionId} 
                  className="w-full max-w-sm"
                />
              </div>
            ) : (
              // Chat Messages View
              <div className="h-full overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 text-sm shadow-lg ${
                    message.role === 'user'
                      ? 'bg-white text-black rounded-2xl rounded-br-md ml-auto'
                      : 'bg-primary text-black rounded-2xl rounded-bl-md'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                        <img 
                          src={launchLogo} 
                          alt="Launch Logo" 
                          className="w-6 h-6 object-cover"
                        />
                      </div>
                      <span className="font-grunge text-xs uppercase tracking-tight text-black">Launch AI</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed font-grunge font-light">
                    {(() => {
                      const content = message.content;
                      
                      // Handle EMAIL_CAPTURE
                      if (content.includes('[EMAIL_CAPTURE]')) {
                        const parts = content.split('[EMAIL_CAPTURE]');
                        return (
                          <div>
                            {parts[0]}
                            <div className="my-4">
                              <div className="flex gap-2">
                                <input
                                  type="email"
                                  placeholder="your@email.com"
                                  value={emailCapture}
                                  onChange={(e) => setEmailCapture(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      submitEmail(emailCapture);
                                    }
                                  }}
                                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-black text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                  disabled={isSubmittingEmail}
                                />
                                <button
                                  onClick={() => submitEmail(emailCapture)}
                                  disabled={isSubmittingEmail || !emailCapture.trim()}
                                  className="bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isSubmittingEmail ? '...' : 'Send'}
                                </button>
                              </div>
                            </div>
                            {parts[1]}
                          </div>
                        );
                      }
                      
                      // Handle DOWNLOAD_BUTTONS
                      if (content.includes('[DOWNLOAD_BUTTONS]')) {
                        const parts = content.split('[DOWNLOAD_BUTTONS]');
                        return (
                          <div>
                            {parts[0]}
                            <div className="flex gap-3 my-4">
                              <a
                                href="https://apps.apple.com/za/app/launch-lifestyle/id6743004197"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <img
                                  src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                                  alt="Download on the App Store"
                                  className="h-12 w-auto hover:opacity-80 transition-opacity"
                                />
                              </a>
                              <a
                                href="https://play.google.com/store/apps/details?id=fit.sudor.launch&pcampaignid=web_share"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <img
                                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                  alt="Get it on Google Play"
                                  className="h-12 w-auto hover:opacity-80 transition-opacity"
                                />
                              </a>
                            </div>
                            {parts[1]}
                          </div>
                        );
                      }
                      
                      // Handle REFERRAL_SHARE
                      if (content.includes('[REFERRAL_SHARE]')) {
                        const parts = content.split('[REFERRAL_SHARE]');
                        return (
                          <div>
                            {parts[0]}
                            <div className="my-4">
                              <button
                                onClick={copyAndShareReferral}
                                className="bg-gray-900 text-white px-3 py-2 rounded-2xl text-xs font-grunge hover:bg-gray-800 transition-colors flex items-center gap-2 w-fit mx-auto uppercase tracking-tight"
                              >
                                {showCopySuccess ? (
                                  <>
                                    <span className="text-green-400">✓</span>
                                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                                    </svg>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                                    </svg>
                                    <span>Share</span>
                                  </>
                                )}
                              </button>
                            </div>
                            {parts[1]}
                          </div>
                        );
                      }
                      
                      return content;
                    })()}
                  </div>
                  <div className="text-xs text-black/60 mt-1 text-right">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-primary text-black rounded-2xl rounded-bl-md px-4 py-3 text-sm shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
                      <img 
                        src={launchLogo} 
                        alt="Launch Logo" 
                        className="w-6 h-6 object-cover"
                      />
                    </div>
                    <span className="font-grunge text-xs uppercase tracking-tight text-black">Launch AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span className="text-black font-medium">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input - only show in chat mode */}
          {!showStreakView && (
            <div className="p-4 bg-black rounded-b-3xl">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 text-sm bg-white text-black rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors font-grunge font-light"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-12 h-12 bg-primary text-black rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-black shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}