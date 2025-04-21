import { Users } from 'lucide-react';
import { EmptyState } from '../empty-state';

export function EmptyGroups() {
  return (
    <EmptyState
      icon={<Users className="h-6 w-6 text-primary" />}
      title="No groups yet"
      description="Create your first group to start sharing expenses with friends, roommates, or travel companions."
      actionText="Create Group"
      actionLink="/groups/new"
      secondaryActionText="Join a Group"
      secondaryActionOnClick={() => {}}
    />
  );
}
