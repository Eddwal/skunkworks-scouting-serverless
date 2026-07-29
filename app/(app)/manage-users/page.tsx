import { getUsers } from '@/app/actions/rbac';
import { UsersClient } from './users-client';
import { AdminAuthGuard } from '@/components/admin-auth-guard';

export const metadata = {
  title: 'Manage Users',
};

async function UsersPageContent() {
  const users = await getUsers();
  return (
    <div className="container mx-auto py-8">
      <UsersClient initialUsers={users} />
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
