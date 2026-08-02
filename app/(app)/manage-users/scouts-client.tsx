'use client';

import { useState } from 'react';
import { ScoutData, bulkCreateScouts, bulkDeleteScouts, deleteScout } from '@/app/actions/scouts';
import { getScoutColumns } from './scout-columns';
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
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export function ScoutsClient({ initialScouts }: { initialScouts: ScoutData[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newScoutName, setNewScoutName] = useState('');
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteScout(id);
      toast.success("Scout deleted");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete scout");
    }
  };

  const handleBulkCreateScouts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScoutName) {
      toast.error("Name is required");
      return;
    }

    const names = newScoutName.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 0);
    
    if (names.length === 0) {
      toast.error("Valid names are required");
      return;
    }
    
    try {
      setIsCreating(true);
      await bulkCreateScouts(names);
      toast.success(`Successfully created ${names.length} scout(s)`);
      setIsDialogOpen(false);
      setNewScoutName('');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to create scouts");
    } finally {
      setIsCreating(false);
    }
  };

  const handleBulkDelete = async (selectedRows: any[]) => {
    if (selectedRows.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedRows.length} scout(s)?`)) {
      return;
    }
    
    try {
      const ids = selectedRows.map(row => (row.original as ScoutData).id);
      await bulkDeleteScouts(ids);
      toast.success(`Successfully deleted ${selectedRows.length} scout(s)`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete scouts");
    }
  };

  const columns = getScoutColumns(handleDelete);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scout Roster</h2>
          <p className="text-muted-foreground">
            Manage the global list of scouts.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button>Add Scout</Button>} />
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleBulkCreateScouts}>
              <DialogHeader>
                <DialogTitle>Add Scout(s)</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="scoutName">Scout Name(s)</Label>
                  <Textarea 
                    id="scoutName" 
                    value={newScoutName} 
                    onChange={(e) => setNewScoutName(e.target.value)} 
                    placeholder="John Doe&#10;Jane Smith" 
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">Separate multiple names with commas or newlines.</p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Adding...' : 'Add Scout(s)'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable 
        columns={columns} 
        data={initialScouts} 
        searchKey="name"
        renderToolbar={(table) => {
          const selectedRows = table.getFilteredSelectedRowModel().rows;
          if (selectedRows.length === 0) return null;
          
          return (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => handleBulkDelete(selectedRows)}
            >
              Delete {selectedRows.length} Selected
            </Button>
          );
        }}
      />
    </div>
  );
}
