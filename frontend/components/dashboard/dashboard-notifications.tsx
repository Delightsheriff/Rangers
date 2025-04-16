import { Bell } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid gap-2 p-2">
          <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback>TS</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">
                <span className="font-semibold">Taylor</span> added &quot;Dinner at Seafood
                Palace&quot; ($145.75)
              </p>
              <p className="text-xs text-muted-foreground">Just now</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback>MC</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">
                <span className="font-semibold">Morgan</span> requested $58.50 for &quot;Airport
                Taxi&quot;
              </p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg p-2 hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium">
                <span className="font-semibold">Jordan</span> settled up with you ($120.00)
              </p>
              <p className="text-xs text-muted-foreground">Yesterday</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center" asChild>
          <Link href="/notifications">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
