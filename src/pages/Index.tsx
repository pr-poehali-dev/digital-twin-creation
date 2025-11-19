import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const skills = [
    { name: 'Программирование', level: 95, icon: 'Code' },
    { name: 'Дизайн', level: 85, icon: 'Palette' },
    { name: 'Коммуникация', level: 90, icon: 'MessageSquare' },
    { name: 'Лидерство', level: 88, icon: 'Users' },
    { name: 'Аналитика', level: 92, icon: 'LineChart' },
    { name: 'Креативность', level: 87, icon: 'Lightbulb' },
  ];

  const achievements = [
    { title: '100+ Проектов', desc: 'Успешно завершено', icon: 'Trophy' },
    { title: '5 лет опыта', desc: 'В индустрии', icon: 'Calendar' },
    { title: '50+ Клиентов', desc: 'Довольных заказчиков', icon: 'Star' },
    { title: '10+ Наград', desc: 'За достижения', icon: 'Award' },
  ];

  const interests = [
    { name: 'Искусственный интеллект', color: 'bg-[hsl(var(--neon-blue))]' },
    { name: 'Веб-разработка', color: 'bg-[hsl(var(--neon-purple))]' },
    { name: 'Дизайн интерфейсов', color: 'bg-[hsl(var(--neon-pink))]' },
    { name: 'Машинное обучение', color: 'bg-[hsl(var(--neon-blue))]' },
    { name: 'Кибербезопасность', color: 'bg-[hsl(var(--neon-purple))]' },
    { name: 'Блокчейн', color: 'bg-[hsl(var(--neon-pink))]' },
  ];

  const personalityTraits = [
    { trait: 'Аналитичность', value: 94 },
    { trait: 'Эмпатия', value: 88 },
    { trait: 'Решительность', value: 91 },
    { trait: 'Адаптивность', value: 89 },
    { trait: 'Инновационность', value: 96 },
  ];

  return (
    <div className="min-h-screen bg-background grid-bg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--neon-blue)/0.1)] via-transparent to-[hsl(var(--neon-purple)/0.1)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 hologram-glow text-[hsl(var(--neon-blue))]">
            ЦИФРОВОЙ ДВОЙНИК
          </h1>
          <p className="text-xl text-muted-foreground">Версия 2.0 • Онлайн</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-blue))] animate-pulse-glow" />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-purple))] animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-pink))] animate-pulse-glow" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <Card className="lg:col-span-1 hologram-border bg-card/50 backdrop-blur-sm p-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--neon-blue)/0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
              <div className="relative w-full aspect-square mb-6 rounded-lg overflow-hidden">
                <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-[hsl(var(--neon-blue)/0.3)] to-transparent" />
                <img 
                  src="https://cdn.poehali.dev/projects/c27240ac-4ad0-4671-b5e2-243012520b7e/files/265b0087-5ab9-451b-abbe-c5b87be67b6c.jpg"
                  alt="Holographic Avatar"
                  className="w-full h-full object-cover animate-float neon-glow-blue"
                />
              </div>

              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-[hsl(var(--neon-blue))]">Александр</h2>
                <Badge className="bg-[hsl(var(--neon-purple))] text-white px-4 py-1">
                  <Icon name="Zap" size={16} className="mr-2" />
                  Активен
                </Badge>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Icon name="MapPin" size={16} />
                  <span>Москва, Россия</span>
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button className="p-3 rounded-lg hologram-border bg-card/80 hover:bg-[hsl(var(--neon-blue)/0.2)] transition-all hover:scale-110">
                    <Icon name="Github" size={20} />
                  </button>
                  <button className="p-3 rounded-lg hologram-border bg-card/80 hover:bg-[hsl(var(--neon-purple)/0.2)] transition-all hover:scale-110">
                    <Icon name="Linkedin" size={20} />
                  </button>
                  <button className="p-3 rounded-lg hologram-border bg-card/80 hover:bg-[hsl(var(--neon-pink)/0.2)] transition-all hover:scale-110">
                    <Icon name="Mail" size={20} />
                  </button>
                  <button className="p-3 rounded-lg hologram-border bg-card/80 hover:bg-[hsl(var(--neon-blue)/0.2)] transition-all hover:scale-110">
                    <Icon name="Phone" size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-card/30 hologram-border">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Mic" size={20} className="text-[hsl(var(--neon-pink))]" />
                  <span className="text-sm font-semibold">Голосовой интерфейс</span>
                </div>
                <div className="flex gap-1 h-12 items-end justify-center">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gradient-to-t from-[hsl(var(--neon-pink))] to-[hsl(var(--neon-purple))] rounded-full animate-pulse-glow"
                      style={{
                        height: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5 hologram-border bg-card/50">
                <TabsTrigger value="profile" className="data-[state=active]:bg-[hsl(var(--neon-blue)/0.3)]">
                  <Icon name="User" size={16} className="mr-2" />
                  Профиль
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-[hsl(var(--neon-purple)/0.3)]">
                  <Icon name="Zap" size={16} className="mr-2" />
                  Навыки
                </TabsTrigger>
                <TabsTrigger value="achievements" className="data-[state=active]:bg-[hsl(var(--neon-pink)/0.3)]">
                  <Icon name="Trophy" size={16} className="mr-2" />
                  Достижения
                </TabsTrigger>
                <TabsTrigger value="interests" className="data-[state=active]:bg-[hsl(var(--neon-blue)/0.3)]">
                  <Icon name="Sparkles" size={16} className="mr-2" />
                  Интересы
                </TabsTrigger>
                <TabsTrigger value="personality" className="data-[state=active]:bg-[hsl(var(--neon-purple)/0.3)]">
                  <Icon name="Brain" size={16} className="mr-2" />
                  Личность
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-6">
                <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--neon-blue))]">О себе</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Профессиональный разработчик и дизайнер с опытом создания инновационных цифровых решений. 
                    Специализируюсь на разработке пользовательских интерфейсов, искусственном интеллекте и веб-технологиях. 
                    Постоянно изучаю новые технологии и методологии для создания продуктов будущего.
                  </p>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Briefcase" size={24} className="text-[hsl(var(--neon-purple))]" />
                      <h4 className="font-semibold">Опыт работы</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Senior Developer • 5+ лет</p>
                  </Card>

                  <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="GraduationCap" size={24} className="text-[hsl(var(--neon-pink))]" />
                      <h4 className="font-semibold">Образование</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Магистр • Computer Science</p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4 mt-6">
                <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-2xl font-bold mb-6 text-[hsl(var(--neon-purple))]">Профессиональные навыки</h3>
                  <div className="space-y-6">
                    {skills.map((skill, index) => (
                      <div key={index} className="space-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon name={skill.icon as any} size={20} className="text-[hsl(var(--neon-blue))]" />
                            <span className="font-semibold">{skill.name}</span>
                          </div>
                          <span className="text-[hsl(var(--neon-blue))]">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2 hologram-border" />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card 
                      key={index}
                      className="hologram-border bg-card/50 backdrop-blur-sm p-6 hover:scale-105 transition-transform cursor-pointer animate-fade-in group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--neon-blue)/0.3)] to-[hsl(var(--neon-purple)/0.3)] group-hover:neon-glow-blue transition-all">
                          <Icon name={achievement.icon as any} size={24} className="text-[hsl(var(--neon-blue))]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xl mb-1">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.desc}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="interests" className="mt-6">
                <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-2xl font-bold mb-6 text-[hsl(var(--neon-pink))]">Области интересов</h3>
                  <div className="flex flex-wrap gap-3">
                    {interests.map((interest, index) => (
                      <Badge
                        key={index}
                        className={`${interest.color} text-white px-4 py-2 text-sm hover:scale-110 transition-transform cursor-pointer animate-fade-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {interest.name}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="personality" className="mt-6">
                <Card className="hologram-border bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-2xl font-bold mb-6 text-[hsl(var(--neon-purple))]">Характеристики личности</h3>
                  <div className="space-y-6">
                    {personalityTraits.map((trait, index) => (
                      <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{trait.trait}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-8 rounded-full hologram-border bg-card/30 overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[hsl(var(--neon-blue))] via-[hsl(var(--neon-purple))] to-[hsl(var(--neon-pink))] transition-all duration-1000"
                                style={{ width: `${trait.value}%` }}
                              />
                            </div>
                            <span className="text-[hsl(var(--neon-blue))] font-bold w-12">{trait.value}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 rounded-lg hologram-border bg-gradient-to-br from-[hsl(var(--neon-blue)/0.1)] to-[hsl(var(--neon-purple)/0.1)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Activity" size={20} className="text-[hsl(var(--neon-pink))]" />
                      <span className="font-semibold">Статус активности</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[hsl(var(--neon-blue))]">98.7%</div>
                        <div className="text-xs text-muted-foreground">Uptime</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[hsl(var(--neon-purple))]">1.2ms</div>
                        <div className="text-xs text-muted-foreground">Отклик</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[hsl(var(--neon-pink))]">365/7</div>
                        <div className="text-xs text-muted-foreground">Доступность</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <footer className="text-center text-sm text-muted-foreground py-6 border-t border-[hsl(var(--neon-blue)/0.3)]">
          <p>© 2025 Digital Twin v2.0 • Powered by Neural Network</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
