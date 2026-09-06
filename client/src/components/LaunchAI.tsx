import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { trackMetaPixelEvent } from '@/lib/meta-pixel';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  category?: string;
  timestamp: Date;
}

// User location utility
const getUserLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    return await response.json();
  } catch {
    return null;
  }
};

interface LaunchAIProps {
  initialQuestion?: string;
}

export default function LaunchAI({ initialQuestion }: LaunchAIProps = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'ai',
      message: "Hey legend 👋 I'm Launch AI - your digital fitness wingman. Need help with training, structure, or signing up? Let's launch!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ country?: string; city?: string; region?: string }>();
  const { toast } = useToast();
  
  // Get user location on component mount
  useEffect(() => {
    getUserLocation().then(setUserLocation);
  }, []);

  // Listen for custom events from "TRY LAUNCH AI" button and topic buttons
  useEffect(() => {
    const handleSwitchToChatView = () => {
      setIsOpen(true);
    };

    const handleOpenLaunchAI = (event: CustomEvent) => {
      const { question } = event.detail;
      setIsOpen(true);
      
      // Auto-send the question after opening
      if (question) {
        setTimeout(() => {
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            message: question,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, userMessage]);
          setIsTyping(true);

          // Send to API
          fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: question, location: userLocation })
          })
          .then(response => response.json())
          .then(response => {
            const aiMessage: ChatMessage = {
              id: Date.now().toString() + '-ai',
              type: 'ai',
              message: response.response || response.message,
              category: response.category || 'general',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
          })
          .catch(error => {
            console.error('Chat error:', error);
            setIsTyping(false);
          });
        }, 500);
      }
    };

    window.addEventListener('switchToChatView', handleSwitchToChatView);
    window.addEventListener('openLaunchAI', handleOpenLaunchAI as EventListener);
    
    return () => {
      window.removeEventListener('switchToChatView', handleSwitchToChatView);
      window.removeEventListener('openLaunchAI', handleOpenLaunchAI as EventListener);
    };
  }, [userLocation]);

  // Handle initial question if provided
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim()) {
      // Create user message immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        message: initialQuestion.trim(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // Track interaction
      trackMetaPixelEvent({
        eventName: 'launch_ai_message_sent',
        parameters: {
          message_length: initialQuestion.length,
          location: userLocation?.country
        }
      });

      // Send to API
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: initialQuestion.trim(), location: userLocation })
      })
      .then(response => response.json())
      .then(response => {
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '-ai',
          type: 'ai',
          message: response.response || response.message,
          category: response.category || 'general',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      })
      .catch(error => {
        console.error('Chat error:', error);
        setIsTyping(false);
      });
    }
  }, [initialQuestion, userLocation]);
  
  const trackEvent = (eventName: string, params?: any) => {
    trackMetaPixelEvent({
      eventName,
      parameters: params
    });
  };
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Chat mutation for sending messages
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, location: userLocation })
      });
      return response.json();
    },
    onSuccess: (response) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        type: 'ai',
        message: response.response || response.message,
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

    // Track message sent event
    chatMutation.mutate(text.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const openChat = () => {
    if (!isOpen) {
      trackEvent('launch_ai_opened', {
        location: userLocation?.country
      });
      // Track chat opened event
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Launch AI Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <div 
          className="bg-black border-2 border-white rounded-xl px-3 py-2 shadow-lg cursor-pointer hover:scale-105 transition-transform text-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Top row with LAUNCH AI */}
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="bg-primary text-black px-2 py-1 rounded text-xs font-black transform -rotate-2">LAUNCH</span>
            <span className="text-white text-xs font-black">AI</span>
          </div>
          {/* Bottom row with Need help? */}
          <div className="text-white text-xs">
            Need help?
          </div>
        </div>
      </div>

      {/* Chat Interface - Centered Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="w-full max-w-lg h-[80vh] max-h-[700px] min-h-[500px] bg-black rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-white">
            {/* Chat Header - Fixed positioning for visibility */}
            <div className="bg-black text-white px-6 py-4 flex-shrink-0 border-b border-white/20 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <img 
                      src="/attached_assets/Untitled design_1749834815956.png" 
                      alt="Launch Logo" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Launch AI</h3>
                    <p className="text-sm text-green-400 font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Online now
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-6 bg-black" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 1 && (
                  <div className="space-y-3 mb-6">
                    <p className="text-white text-sm font-medium">Try these popular questions:</p>
                    {[
                      { question: "Create a 4-week workout plan for building muscle at home", category: "FITNESS" },
                      { question: "What should I eat to support my fitness goals?", category: "NUTRITION" },
                      { question: "I'm struggling to stay consistent with my workouts", category: "MOTIVATION" },
                      { question: "How do I track my fitness progress effectively?", category: "PROGRESS" }
                    ].map((demo, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl border border-white/20 hover:border-primary cursor-pointer transition-colors bg-white/5"
                        onClick={() => handleSendMessage(demo.question)}
                      >
                        <p className="text-sm text-white font-medium mb-1">{demo.question}</p>
                        <span className="text-xs text-primary font-semibold uppercase">{demo.category}</span>
                      </div>
                    ))}
                  </div>
                )}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.type === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-black flex items-center justify-center">
                        <img 
                          src="/attached_assets/Untitled design_1749834815956.png" 
                          alt="Launch AI" 
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-primary text-black rounded-br-sm'
                          : 'bg-white text-black rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-black flex items-center justify-center">
                      <img 
                        src="/attached_assets/Untitled design_1749834815956.png" 
                        alt="Launch AI" 
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div className="bg-white text-black p-3 rounded-2xl rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input - Fixed positioning for visibility */}
            <div className="p-6 border-t border-white/20 flex-shrink-0 bg-black z-10">
              <div className="flex gap-3 items-center">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-white text-black border-0 rounded-full px-4 py-3 h-12 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  disabled={chatMutation.isPending}
                />
                <Button
                  onClick={() => handleSendMessage(inputMessage)}
                  disabled={!inputMessage.trim() || chatMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-black rounded-full w-12 h-12 p-0 flex items-center justify-center transition-colors shrink-0"
                >
                  {chatMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}