'use client';

import { useState } from 'react';
import { UserData, promoteUser, demoteUser, deleteUser, createUser } from '@/app/actions/rbac';
import { getColumns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function UsersClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  const handlePromote = async (uid: string) => {
    try {
      await promoteUser(uid);
      toast.success("User promoted to admin");
    } catch (error: any) {
      toast.error(error.message || "Failed to promote user");
    }
  };

  const handleDemote = async (uid: string) => {
    try {
      await demoteUser(uid);
      toast.success("User admin privileges revoked");
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke admin");
    }
  };

  const handleDelete = async (uid: string) => {
    try {
      await deleteUser(uid);
      toast.success("User deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName || !newUserPassword) {
      toast.error("Email, Name, and Password are required");
      return;
    }
    
    try {
      setIsCreating(true);
      await createUser({
        email: newUserEmail,
        displayName: newUserName,
        password: newUserPassword || undefined,
      });
      toast.success("User created successfully");
      setIsDialogOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  const columns = getColumns(handlePromote, handleDemote, handleDelete);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts, roles, and permissions.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button>Create User</Button>} />
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleCreateUser}>
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newUserName} 
                    onChange={(e) => setNewUserName(e.target.value)} 
                    placeholder="Jane Doe" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newUserEmail} 
                    onChange={(e) => setNewUserEmail(e.target.value)} 
                    placeholder="jane@example.com" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password (Optional)</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={newUserPassword} 
                    onChange={(e) => setNewUserPassword(e.target.value)} 
                    placeholder="Password for user" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        columns={columns} 
        data={initialUsers} 
        searchKey="email"
      />
    </div>
  );
}
