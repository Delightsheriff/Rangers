import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CurrentActivitiesProps {
  limit?: number;
}

export default function CurrentActivities({ limit = 10 }: CurrentActivitiesProps) {
  // This would come from an API in a real app
  const activities = [
    {
      id: 1,
      user: {
        name: 'Taylor Smith',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'TS',
      },
      action: 'added',
      expense: {
        name: 'Dinner at Seafood Palace',
        amount: 145.75,
        date: 'Just now',
        group: 'Cancun Trip 2025',
      },
    },
    {
      id: 2,
      user: {
        name: 'Morgan Chen',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'MC',
      },
      action: 'added',
      expense: {
        name: 'Airport Taxi',
        amount: 58.5,
        date: '2 hours ago',
        group: 'Cancun Trip 2025',
      },
    },
    {
      id: 3,
      user: {
        name: 'Jordan Lee',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'JL',
      },
      action: 'settled',
      expense: {
        name: 'Electricity Bill',
        amount: 120.0,
        date: 'Yesterday',
        group: 'Apartment 304',
      },
    },
    {
      id: 4,
      user: {
        name: 'Riley Davis',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'RD',
      },
      action: 'added',
      expense: {
        name: 'Groceries',
        amount: 85.2,
        date: '2 days ago',
        group: 'Apartment 304',
      },
    },
    {
      id: 5,
      user: {
        name: 'Alex Johnson',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'AJ',
      },
      action: 'added',
      expense: {
        name: 'Movie Tickets',
        amount: 48.0,
        date: '3 days ago',
        group: 'Dinner Club',
      },
    },
    {
      id: 6,
      user: {
        name: 'Taylor Smith',
        avatar: '/placeholder.svg?height=40&width=40',
        initials: 'TS',
      },
      action: 'settled',
      expense: {
        name: 'Lunch',
        amount: 32.5,
        date: '4 days ago',
        group: 'Office Lunch Group',
      },
    },
  ].slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span>{' '}
                  {activity.action === 'added' ? 'added' : 'settled'}{' '}
                  <span className="font-semibold">{activity.expense.name}</span>{' '}
                  {activity.action === 'added'
                    ? `($${activity.expense.amount.toFixed(2)})`
                    : `($${activity.expense.amount.toFixed(2)})`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.expense.date} • {activity.expense.group}
                </p>
              </div>
              <div
                className={`font-medium ${activity.action === 'settled' ? 'text-green-500' : ''}`}
              >
                {activity.action === 'added' ? `$${activity.expense.amount.toFixed(2)}` : `Settled`}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
