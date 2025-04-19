import GroupCreationForm from '@/components/dashboard/groups/group-creation-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function page() {
  const session = await getServerSession();
  console.log('🚀 ~ session:', session);
  return (
    <main className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create a New Group</h1>
        </div>
      </div>
      <GroupCreationForm creatorEmail={session?.user?.email ?? ''} />
    </main>
  );
}
