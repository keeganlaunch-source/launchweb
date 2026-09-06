import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Zap, Heart, Target, Trophy, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useMetaPixel } from '@/hooks/useMetaPixel';
import { trackLaunchAIInteraction, getUserLocation } from '@/lib/analytics';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  category?: string;
  timestamp: Date;
  rating?: number;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
  category: string;
}

const quickActions: QuickAction[] = [
  {
    icon: <Zap className="h-4 w-4" />,
    label: "Workout Plan",
    prompt: "Create a personalized workout plan for me",
    category: "fitness"
  },
  {
    icon: <Heart className="h-4 w-4" />,
    label: "Nutrition",
    prompt: "Give me nutrition advice for my fitness goals",
    category: "nutrition"
  },
  {
    icon: <Target className="h-4 w-4" />,
    label: "Goals",
    prompt: "Help me set realistic fitness goals",
    category: "goals"
  },
  {
    icon: <Trophy className="h-4 w-4" />,
    label: "Progress",
    prompt: "How can I track my fitness progress effectively?",
    category: "progress"
  }
];

export default function LaunchAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ country?: string; city?: string; region?: string }>();
  const { toast } = useToast();
  const metaPixel = useMetaPixel();
  
  // Get user location on component mount
  useEffect(() => {
    getUserLocation().then(setUserLocation);
  }, []);

  // Listen for custom event from "TRY LAUNCH AI" button
  useEffect(() => {
    const handleSwitchToChatView = () => {
      setIsOpen(true);
    };

    window.addEventListener('switchToChatView', handleSwitchToChatView);
    
    return () => {
      window.removeEventListener('switchToChatView', handleSwitchToChatView);
    };
  }, []);
  
  const trackEvent = (eventName: string, params?: any) => {
    if (metaPixel?.trackEvent) {
      metaPixel.trackEvent(eventName, params);
    }
  };
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Chat mutation for sending messages
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('/api/chat', {
        method: 'POST',
        body: { message, location: userLocation }
      });
      return response;
    },
    onSuccess: (response) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        type: 'ai',
        message: response.message,
        category: response.category || 'general',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setIsTyping(false);
      toast({
        title: "Connection Error",
        description: "Unable to reach Launch AI. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Track interaction
    trackEvent('launch_ai_message_sent', {
      message_length: text.length,
      location: userLocation?.country
    });

    await trackLaunchAIInteraction('message_sent', text, userLocation);
    chatMutation.mutate(text.trim());
  };

  const handleQuickAction = (action: QuickAction) => {
    trackEvent('launch_ai_quick_action', {
      action: action.label,
      category: action.category
    });
    handleSendMessage(action.prompt);
  };

  const handleRating = async (messageId: string, rating: number) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );

    trackEvent('launch_ai_rating', {
      rating,
      message_id: messageId
    });

    await trackLaunchAIInteraction('rating', `${rating}/5`, userLocation);

    toast({
      title: "Thank you!",
      description: `You rated this response ${rating}/5 stars`,
    });
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initialize chat with greeting when opened
  const initializeChat = () => {
    if (messages.length === 0) {
      const greeting: ChatMessage = {
        id: '1',
        type: 'ai',
        message: "Hi! I'm Launch AI, your personal fitness coach. I'm here to help you achieve your fitness goals with personalized workout plans, nutrition advice, and motivation. What would you like to work on today?",
        category: 'greeting',
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Launch AI Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex flex-col items-center justify-center gap-0 px-2 py-2 md:px-3 md:py-2 bg-black border-2 border-white text-white font-bold text-xs md:text-sm rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl ${
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

      {/* Chat Interface */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-md h-[600px] bg-black border-2 border-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Chat Header */}
            <div className="bg-black text-white px-3 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-black">
                  <img 
                    src="/attached_assets/Untitled design_1749834815956.png" 
                    alt="Launch Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-grunge text-lg uppercase tracking-tight text-white">Launch AI</h3>
                  <p className="text-xs text-white/60 font-medium">Online now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Messages - WhatsApp Style */}
          <div className="h-full overflow-y-auto p-4 space-y-3" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${
                  message.type === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {message.type === 'ai' && (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-black flex items-center justify-center">
                    <img 
                      src="/attached_assets/Untitled design_1749834815956.png" 
                      alt="Launch AI" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                )}
                
                <div className={`flex flex-col max-w-[75%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2 text-sm relative ${
                      message.type === 'user'
                        ? 'bg-[#dcf8c6] text-black rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                        : 'bg-white text-black rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
                    {message.category && message.type === 'ai' && (
                      <Badge variant="secondary" className="mt-2 text-xs bg-gray-100 text-gray-600 border-0">
                        {message.category}
                      </Badge>
                    )}
                    
                    {/* WhatsApp-style message tail */}
                    {message.type === 'user' ? (
                      <div className="absolute -bottom-0 -right-1 w-0 h-0 border-l-[8px] border-l-[#dcf8c6] border-b-[8px] border-b-transparent"></div>
                    ) : (
                      <div className="absolute -bottom-0 -left-1 w-0 h-0 border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>
                    )}
                  </div>
                  
                  <div className={`text-xs text-white/60 mt-1 px-2 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-black flex items-center justify-center">
                  <img 
                    src="/attached_assets/Untitled design_1749834815956.png" 
                    alt="Launch AI" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div className="bg-white text-black rounded-tl-2xl rounded-tr-2xl rounded-br-2xl px-4 py-3 text-sm shadow-sm relative">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                  <div className="absolute -bottom-0 -left-1 w-0 h-0 border-r-[8px] border-r-white border-b-[8px] border-b-transparent"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/20">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Launch AI anything..."
                className="flex-1 bg-white text-black border-0 rounded-xl"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputMessage);
                  }
                }}
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim() || chatMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-black rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}