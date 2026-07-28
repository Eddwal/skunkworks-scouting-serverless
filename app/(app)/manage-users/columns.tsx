'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UserData } from '@/app/actions/rbac';
import { MoreHorizontal, ShieldAlert, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

// Create a component for the actions to handle their own loading states
const ActionCell = ({ row, onPromote, onDemote, onDelete }: { 
  row: any, 
  onPromote: (uid: string) => Promise<void>,
  onDemote: (uid: string) => Promise<void>,
  onDelete: (uid: string) => Promise<void>
}) => {
  const user = row.original as UserData;
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: () => Promise<void>) => {
    try {
      setIsLoading(true);
      await action();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      } />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        
        {user.admin ? (
          <DropdownMenuItem 
            onClick={() => handleAction(() => onDemote(user.uid))}
            className="text-amber-600"
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            Revoke Admin
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={() => handleAction(() => onPromote(user.uid))}
            className="text-emerald-600"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Make Admin
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={() => {
            if (confirm(`Are you sure you want to delete ${user.email}?`)) {
              handleAction(() => onDelete(user.uid));
            }
          }}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const getColumns = (
  onPromote: (uid: string) => Promise<void>,
  onDemote: (uid: string) => Promise<void>,
  onDelete: (uid: string) => Promise<void>
): ColumnDef<UserData>[] => [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'displayName',
    header: 'Name',
    cell: ({ row }) => row.original.displayName || <span className="text-muted-foreground italic">No Name</span>,
  },
  {
    accessorKey: 'admin',
    header: 'Role',
    cell: ({ row }) => {
      const isAdmin = row.original.admin;
      return (
        <Badge variant={isAdmin ? 'default' : 'secondary'}>
          {isAdmin ? 'Admin' : 'User'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'creationTime',
    header: 'Joined',
    cell: ({ row }) => {
      const date = new Date(row.original.creationTime);
      return date.toLocaleDateString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ActionCell 
        row={row} 
        onPromote={onPromote} 
        onDemote={onDemote} 
        onDelete={onDelete} 
      />
    ),
  },
];
