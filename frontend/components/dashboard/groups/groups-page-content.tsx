'use client';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function GroupsPageContent() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            className="pl-8"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
