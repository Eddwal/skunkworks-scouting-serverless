'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Trash, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { uploadMatchScoutData } from './upload-action';

export function SavedQRCodes() {
  const [savedCodes, setSavedCodes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadCodes = () => {
      const stored = localStorage.getItem('matchScoutQRCodes');
      if (stored) {
        try {
          setSavedCodes(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse saved QR codes");
        }
      } else {
        setSavedCodes([]);
      }
    };
    loadCodes();
    
    window.addEventListener('qrCodesUpdated', loadCodes);
    return () => window.removeEventListener('qrCodesUpdated', loadCodes);
  }, []);

  const handleDelete = (id: string) => {
    const newCodes = savedCodes.filter(c => c.id !== id);
    setSavedCodes(newCodes);
    localStorage.setItem('matchScoutQRCodes', JSON.stringify(newCodes));
    setDeletingId(null);
  };

  const handleUploadAll = async () => {
    if (savedCodes.length === 0) return;
    
    setIsUploading(true);
    let successCount = 0;
    let currentCodes = [...savedCodes];
    
    try {
      for (const code of savedCodes) {
        try {
          const data = JSON.parse(code.data);
          await uploadMatchScoutData(data);
          // Remove from list after successful upload
          currentCodes = currentCodes.filter(c => c.id !== code.id);
          localStorage.setItem('matchScoutQRCodes', JSON.stringify(currentCodes));
          successCount++;
        } catch (err: any) {
          toast.error(`Failed to upload match ${code.matchKey}: ${err.message}`);
        }
      }
      
      setSavedCodes(currentCodes);
      
      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} matches`);
      }
      
      if (currentCodes.length === 0) {
        setOpen(false);
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (savedCodes.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline">
          Saved QR Codes ({savedCodes.length})
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center pr-8">
            <DialogTitle>Saved QR Codes</DialogTitle>
            <Button 
              variant="default" 
              size="sm" 
              className="flex gap-2" 
              onClick={handleUploadAll}
              disabled={isUploading}
            >
              <UploadCloud className="w-4 h-4" />
              {isUploading ? "Uploading..." : "Upload All"}
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {savedCodes.map((code) => (
            <div key={code.id} className="border p-4 rounded-lg flex flex-col items-center gap-4">
              <div className="flex justify-between w-full items-center">
                <div className="font-bold">{code.matchKey} - Team {code.teamId.replace('frc', '')}</div>
                {deletingId === code.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Are you sure?</span>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(code.id)}>Yes</Button>
                    <Button variant="outline" size="sm" onClick={() => setDeletingId(null)}>No</Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => setDeletingId(code.id)}>
                    <Trash className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
              <div className="bg-white p-2 rounded-md">
                <QRCodeSVG value={code.data} size={200} />
              </div>
              <div className="text-xs text-muted-foreground">{new Date(code.timestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
