import { getUsers } from '@/app/actions/rbac';
import { getScouts } from '@/app/actions/scouts';
import { UsersClient } from './users-client';
import { ScoutsClient } from './scouts-client';
import { AdminAuthGuard } from '@/components/admin-auth-guard';

export const metadata = {
  title: 'Manage Users',
};

async function UsersPageContent() {
  const [users, scouts] = await Promise.all([
    getUsers(),
    getScouts()
  ]);
  
  return (
    <div className="container mx-auto py-8 space-y-12">
      <ScoutsClient initialScouts={scouts} />
      
      <div className="border-t pt-12">
        <UsersClient initialUsers={users} />
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminAuthGuard>
      <UsersPageContent />
    </AdminAuthGuard>
  );
}
