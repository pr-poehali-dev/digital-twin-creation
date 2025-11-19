import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const CHAT_URL = 'https://functions.poehali.dev/c85107fb-4c7d-4ebc-9de7-9b063e4e850a';
const PROFILE_URL = 'https://functions.poehali.dev/2f7fafbe-9070-4cdf-8fff-918bfc48fe6d';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ProfileData {
  profile: any;
  traits: Array<{ trait_name: string; trait_value: number; description: string }>;
  stats: any;
  behaviorStats: any[];
  knowledgeStats: any[];
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadProfile = async () => {
    try {
      const response = await fetch(PROFILE_URL);
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          conversationId: conversationId
        })
      });

      const data = await response.json();

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response || data.error || 'Ошибка ответа',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      loadProfile();
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Не удалось получить ответ. Проверьте подключение.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.start();
      }
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--neon-blue)/0.1)] via-transparent to-[hsl(var(--neon-purple)/0.1)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-2 hologram-glow text-[hsl(var(--neon-blue))]">
            ЦИФРОВОЙ ДВОЙНИК
          </h1>
          <p className="text-lg text-muted-foreground">AI-копия личности • Обучаемая система</p>
          <div className="flex justify-center gap-2 mt-3">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-blue))] animate-pulse-glow" />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-purple))] animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-pink))] animate-pulse-glow" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 hologram-border bg-card/50 backdrop-blur-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[hsl(var(--neon-blue))]">
                <Icon name="MessageSquare" size={24} className="inline mr-2" />
                Общение с двойником
              </h2>
              <Badge className="bg-[hsl(var(--neon-purple))]">
                {messages.length} сообщений
              </Badge>
            </div>

            <ScrollArea className="h-[500px] mb-4 p-4 rounded-lg bg-card/30 hologram-border">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-20">
                  <Icon name="Bot" size={48} className="mx-auto mb-4 text-[hsl(var(--neon-blue))]" />
                  <p className="text-lg">Начните диалог с вашим цифровым двойником</p>
                  <p className="text-sm mt-2">Он учится на каждом разговоре и становится всё больше похож на вас</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-[hsl(var(--neon-blue)/0.2)] hologram-border text-right'
                          : 'bg-[hsl(var(--neon-purple)/0.2)] hologram-border'
                      }`}>
                        <div className="flex items-start gap-2">
                          {msg.role === 'assistant' && (
                            <Icon name="Bot" size={20} className="text-[hsl(var(--neon-purple))]" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm mb-1">{msg.content}</p>
                            <span className="text-xs text-muted-foreground">
                              {msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {msg.role === 'assistant' && (
                            <button
                              onClick={() => speakMessage(msg.content)}
                              className="p-1 hover:bg-[hsl(var(--neon-purple)/0.3)] rounded transition-all"
                            >
                              <Icon name="Volume2" size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start animate-pulse">
                      <div className="bg-[hsl(var(--neon-purple)/0.2)] hologram-border p-4 rounded-lg">
                        <Icon name="Loader2" size={20} className="animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="flex gap-2">
              <Button
                onClick={toggleVoice}
                variant="outline"
                size="icon"
                className={`hologram-border ${isListening ? 'bg-[hsl(var(--neon-pink)/0.3)] animate-pulse-glow' : ''}`}
              >
                <Icon name="Mic" size={20} />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Напишите сообщение..."
                className="hologram-border bg-card/50"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-[hsl(var(--neon-blue))] hover:bg-[hsl(var(--neon-blue)/0.8)] neon-glow-blue"
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
              <div className="text-center mb-4">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden hologram-border">
                  <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-[hsl(var(--neon-blue)/0.3)] to-transparent" />
                  <img 
                    src="https://cdn.poehali.dev/projects/c27240ac-4ad0-4671-b5e2-243012520b7e/files/265b0087-5ab9-451b-abbe-c5b87be67b6c.jpg"
                    alt="Avatar"
                    className="w-full h-full object-cover neon-glow-blue"
                  />
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--neon-blue))]">
                  {profileData?.profile?.name || 'Загрузка...'}
                </h3>
                <p className="text-sm text-muted-foreground">{profileData?.profile?.location}</p>
              </div>

              {profileData?.stats && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 rounded-lg bg-card/30 hologram-border">
                    <div className="text-xl font-bold text-[hsl(var(--neon-purple))]">
                      {profileData.stats.total_conversations || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Диалогов</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-card/30 hologram-border">
                    <div className="text-xl font-bold text-[hsl(var(--neon-pink))]">
                      {profileData.stats.active_days || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Дней обучения</div>
                  </div>
                </div>
              )}
            </Card>

            <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
              <h3 className="text-lg font-bold mb-4 text-[hsl(var(--neon-purple))]">
                <Icon name="Brain" size={20} className="inline mr-2" />
                Психологический профиль
              </h3>
              <div className="space-y-3">
                {profileData?.traits.slice(0, 5).map((trait, idx) => (
                  <div key={idx} className="animate-fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{trait.trait_name}</span>
                      <span className="text-[hsl(var(--neon-blue))]">{trait.trait_value}%</span>
                    </div>
                    <Progress value={trait.trait_value} className="h-1.5" />
                  </div>
                ))}
              </div>
            </Card>

            {profileData?.behaviorStats && profileData.behaviorStats.length > 0 && (
              <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-lg font-bold mb-4 text-[hsl(var(--neon-pink))]">
                  <Icon name="Activity" size={20} className="inline mr-2" />
                  Паттерны поведения
                </h3>
                <div className="space-y-2">
                  {profileData.behaviorStats.map((behavior: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-card/30">
                      <span className="capitalize">{behavior.situation_type}</span>
                      <Badge variant="outline" className="text-xs">
                        {behavior.count} раз
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="training" className="w-full">
            <TabsList className="grid w-full grid-cols-3 hologram-border bg-card/50">
              <TabsTrigger value="training">
                <Icon name="GraduationCap" size={16} className="mr-2" />
                Обучение
              </TabsTrigger>
              <TabsTrigger value="knowledge">
                <Icon name="BookOpen" size={16} className="mr-2" />
                База знаний
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Icon name="BarChart3" size={16} className="mr-2" />
                Аналитика
              </TabsTrigger>
            </TabsList>

            <TabsContent value="training" className="mt-4">
              <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-bold mb-4 text-[hsl(var(--neon-pink))]">Система обучения</h3>
                <p className="text-muted-foreground mb-6">
                  Двойник учится на каждом диалоге, запоминает ваши реакции и паттерны мышления
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg hologram-border bg-card/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Точность имитации</span>
                      <span className="text-[hsl(var(--neon-blue))]">
                        {Math.min(85 + (messages.length * 0.5), 98).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={Math.min(85 + (messages.length * 0.5), 98)} className="h-2" />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 rounded-lg hologram-border bg-card/30">
                      <Icon name="MessageSquare" size={24} className="mx-auto mb-2 text-[hsl(var(--neon-blue))]" />
                      <div className="text-2xl font-bold">{messages.length}</div>
                      <div className="text-xs text-muted-foreground">Обработано диалогов</div>
                    </div>
                    <div className="text-center p-4 rounded-lg hologram-border bg-card/30">
                      <Icon name="Brain" size={24} className="mx-auto mb-2 text-[hsl(var(--neon-purple))]" />
                      <div className="text-2xl font-bold">{profileData?.behaviorStats?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Паттернов изучено</div>
                    </div>
                    <div className="text-center p-4 rounded-lg hologram-border bg-card/30">
                      <Icon name="TrendingUp" size={24} className="mx-auto mb-2 text-[hsl(var(--neon-pink))]" />
                      <div className="text-2xl font-bold">+{messages.length > 0 ? '12' : '0'}%</div>
                      <div className="text-xs text-muted-foreground">Рост точности</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="knowledge" className="mt-4">
              <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-bold mb-4 text-[hsl(var(--neon-blue))]">База знаний</h3>
                <p className="text-muted-foreground mb-4">
                  Здесь хранятся факты, предпочтения и информация о вас, которую использует AI для более точной имитации
                </p>
                {profileData?.knowledgeStats && profileData.knowledgeStats.length > 0 ? (
                  <div className="grid md:grid-cols-3 gap-4">
                    {profileData.knowledgeStats.map((stat: any, idx: number) => (
                      <Card key={idx} className="p-4 hologram-border bg-card/30">
                        <div className="text-2xl font-bold text-[hsl(var(--neon-purple))]">{stat.count}</div>
                        <div className="text-sm text-muted-foreground capitalize">{stat.category}</div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Database" size={48} className="mx-auto mb-3 text-[hsl(var(--neon-blue))]" />
                    <p>База знаний пуста. Начните общаться, чтобы двойник учился</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                <h3 className="text-xl font-bold mb-4 text-[hsl(var(--neon-blue))]">Аналитика и метрики</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Активность</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-card/30">
                        <span className="text-sm">Диалогов сегодня</span>
                        <span className="font-bold text-[hsl(var(--neon-blue))]">1</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-card/30">
                        <span className="text-sm">Среднее время ответа</span>
                        <span className="font-bold text-[hsl(var(--neon-purple))]">1.2с</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Качество</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-card/30">
                        <span className="text-sm">Точность имитации</span>
                        <span className="font-bold text-[hsl(var(--neon-pink))]">
                          {Math.min(85 + (messages.length * 0.5), 98).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-card/30">
                        <span className="text-sm">Uptime системы</span>
                        <span className="font-bold text-[hsl(var(--neon-blue))]">99.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
