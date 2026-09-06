import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Zap, Heart, Target, Trophy, X, Minimize2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
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
    icon: <Target className="h-4 w-4" />,
    label: "Workout Plan",
    prompt: "Create a personalized workout plan for my fitness goals",
    category: "fitness"
  },
  {
    icon: <Heart className="h-4 w-4" />,
    label: "Nutrition Guide",
    prompt: "Give me nutrition advice for my fitness journey",
    category: "nutrition"
  },
  {
    icon: <Zap className="h-4 w-4" />,
    label: "Motivation",
    prompt: "I need motivation to stay consistent with my fitness routine",
    category: "motivation"
  },
  {
    icon: <Trophy className="h-4 w-4" />,
    label: "Goals",
    prompt: "Help me set and achieve my fitness goals",
    category: "goals"
  }
];

export default function FloatingLaunchAI() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [userLocation, setUserLocation] = useState<any>(null);
  const { toast } = useToast();
  const metaPixel = useMetaPixel();

  // Track events
  const trackEvent = (eventName: string, params?: any) => {
    if (metaPixel?.trackEvent) {
      metaPixel.trackEvent(eventName, params);
    }
  };
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get user location on mount
  useEffect(() => {
    getUserLocation().then(setUserLocation);
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; category?: string }) => {
      const response = await apiRequest('/api/ai/chat', 'POST', data);
      return response;
    },
    onSuccess: (response: any) => {
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        message: response.response || 'I received your message but had trouble responding. Please try again.',
        category: response.category || 'general',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      trackEvent('LaunchAIInteraction', {
        content_name: response.category || 'general',
        content_category: 'AI Chat',
        value: 50,
        currency: 'USD'
      });
      
      trackLaunchAIInteraction('ai_response', response.category, userLocation);
    },
    onError: (error) => {
      console.error('AI Chat error:', error);
      setIsTyping(false);
      toast({
        title: "AI Unavailable",
        description: "Launch AI is currently being enhanced. Please try again shortly.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = (messageText: string, category?: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    trackEvent('LaunchAIQuestion', {
      content_name: category || 'general',
      content_category: 'AI Chat',
      value: 25,
      currency: 'USD'
    });

    trackLaunchAIInteraction('user_question', category, userLocation);

    chatMutation.mutate({ message: messageText, category });
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt, action.category);
  };

  const handleRating = async (messageId: string, rating: number) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, rating } : msg
      )
    );

    try {
      await apiRequest('/api/ai/rate', 'POST', { messageId, rating });
      toast({
        title: "Thanks for your feedback!",
        description: `You rated this response ${rating} stars`,
      });
    } catch (error) {
      console.error('Rating error:', error);
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
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="lg"
          title="Chat with Launch AI"
        >
          <Bot className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className={`w-96 bg-black/95 border-yellow-400/30 text-white shadow-2xl shadow-yellow-400/20 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-[500px]'
        }`}>
          <CardHeader className="pb-3 border-b border-yellow-400/20 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <Bot className="h-5 w-5" />
              Launch AI
              <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                BETA
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-yellow-400 hover:bg-yellow-400/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-yellow-400 hover:bg-yellow-400/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex flex-col p-0 h-[calc(100%-4rem)]">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                      <p className="text-lg font-semibold text-yellow-400">Hey there! I'm Launch AI</p>
                      <p className="text-sm mt-2">Your personal fitness coach. Ask me anything about workouts, nutrition, or motivation!</p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start gap-3 ${
                        message.type === 'user' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8 border border-yellow-400/30">
                        {message.type === 'user' ? (
                          <AvatarFallback className="bg-blue-600 text-white">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-yellow-400 text-black">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div
                          className={`inline-block p-3 rounded-lg max-w-[85%] ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-white border border-yellow-400/20'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap">{message.message}</div>
                          {message.category && message.type === 'ai' && (
                            <Badge variant="secondary" className="mt-2 text-xs bg-yellow-400/20 text-yellow-400">
                              {message.category}
                            </Badge>
                          )}
                        </div>

                        {message.type === 'ai' && !message.rating && (
                          <div className="mt-2 flex gap-1">
                            <span className="text-xs text-gray-400 mr-2">Rate this response:</span>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <Button
                                key={rating}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-yellow-400"
                                onClick={() => handleRating(message.id, rating)}
                              >
                                ⭐
                              </Button>
                            ))}
                          </div>
                        )}

                        {message.rating && (
                          <div className="mt-1 text-xs text-yellow-400">
                            Rated: {'⭐'.repeat(message.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border border-yellow-400/30">
                        <AvatarFallback className="bg-yellow-400 text-black">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-800 text-white border border-yellow-400/20 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t border-yellow-400/20">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask Launch AI anything..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                    disabled={chatMutation.isPending}
                    className="bg-gray-800 border-yellow-400/30 text-white placeholder:text-gray-400"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputMessage)}
                    disabled={!inputMessage.trim() || chatMutation.isPending}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {userLocation && (
                  <div className="text-xs text-gray-400 mt-2 text-center">
                    <span className="text-yellow-400">🌍</span> Connecting from: {userLocation.city || 'Unknown City'}, {userLocation.country || 'Unknown Country'}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Launch AI is powered by advanced fitness knowledge and Coach Keegs' expertise
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}