import { getUsers } from '@/app/actions/rbac';
import { UsersClient } from './users-client';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'Manage Users',
};

export default async function AdminUsersPage() {
  let users;
  let errorMsg = null;

  try {
    users = await getUsers();
  } catch (error: any) {
    errorMsg = error.message;
  }

  if (errorMsg) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-full">
        <Card className="w-full max-w-md border-destructive/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            {errorMsg === 'Unauthorized' || errorMsg.includes('Forbidden') 
              ? 'This page is restricted to administrators only.' 
              : errorMsg}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <UsersClient initialUsers={users!} />
    </div>
  );
}
