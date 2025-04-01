import { Achievement } from '@/types/achievement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
  className?: string;
}

const tierColors = {
  bronze: 'bg-amber-600',
  silver: 'bg-gray-400',
  gold: 'bg-yellow-500',
  platinum: 'bg-purple-500'
};

export default function AchievementCard({ achievement, className }: AchievementCardProps) {
  const progress = (achievement.progress / achievement.target) * 100;

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {achievement.title}
        </CardTitle>
        <Badge
          variant="secondary"
          className={cn(
            'text-xs font-medium',
            tierColors[achievement.tier]
          )}
        >
          {achievement.tier}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{achievement.icon}</span>
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">
              {achievement.description}
            </p>
            <Progress value={progress} className="h-1" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{achievement.progress}</span>
              <span>{achievement.target}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 