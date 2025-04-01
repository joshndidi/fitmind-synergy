import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Trophy, Users, Settings, Brain, Flame, Award, User } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Workouts',
      description: 'Create and track your personalized workout plans',
      icon: Dumbbell,
      href: '/workouts'
    },
    {
      title: 'AI Workout Generator',
      description: 'Get personalized workout plans powered by AI',
      icon: Brain,
      href: '/workout-ai'
    },
    {
      title: 'Calorie Tracker',
      description: 'Monitor your nutrition and calorie intake',
      icon: Flame,
      href: '/calories'
    },
    {
      title: 'Social',
      description: 'Connect with other fitness enthusiasts',
      icon: Users,
      href: '/social'
    },
    {
      title: 'Achievements',
      description: 'Earn badges and track your milestones',
      icon: Trophy,
      href: '/achievements'
    },
    {
      title: 'Leaderboard',
      description: 'Compete with others and stay motivated',
      icon: Award,
      href: '/leaderboard'
    },
    {
      title: 'Profile',
      description: 'Manage your personal fitness journey',
      icon: User,
      href: '/profile'
    },
    {
      title: 'Settings',
      description: 'Customize your app experience',
      icon: Settings,
      href: '/settings'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
            FitMind Synergy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your all-in-one fitness companion that combines physical training with mental wellness
          </p>
          <div className="mt-8 space-x-4">
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/subscription')}>
              View Plans
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => navigate(feature.href)}
            >
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="ml-4">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to transform your fitness journey?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users who have already achieved their fitness goals with FitMind Synergy
          </p>
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
} 