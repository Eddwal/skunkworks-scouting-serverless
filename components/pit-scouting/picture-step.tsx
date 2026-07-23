import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, X } from '@phosphor-icons/react';
import imageCompression from 'browser-image-compression';
import { toast } from 'sonner';

interface PictureStepProps {
  photoFile: File | null;
  setPhotoFile: (file: File | null) => void;
  photoPreview: string | null;
  setPhotoPreview: (url: string | null) => void;
}

export function PictureStep({ photoFile, setPhotoFile, photoPreview, setPhotoPreview }: PictureStepProps) {
  const [isCompressing, setIsCompressing] = useState(false);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: false,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      
      const previewUrl = URL.createObjectURL(compressedFile);
      setPhotoFile(compressedFile);
      setPhotoPreview(previewUrl);
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Failed to process image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleClear = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Robot Photo</Label>
        
        {!photoPreview ? (
          <div className="flex items-center justify-center w-full">
            <Label 
              htmlFor="camera-input" 
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera size={48} className="mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to take a picture</span>
                </p>
                <p className="text-xs text-muted-foreground">(or select from gallery)</p>
                {isCompressing && <p className="mt-4 text-sm text-primary">Processing image...</p>}
              </div>
              <Input 
                id="camera-input" 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                onChange={handleCapture}
                disabled={isCompressing}
              />
            </Label>
          </div>
        ) : (
          <div className="relative mt-4 border rounded-lg overflow-hidden flex justify-center bg-muted/30 p-2">
            <img src={photoPreview} alt="Robot preview" className="max-h-80 object-contain rounded" />
            <Button 
              type="button"
              variant="destructive" 
              size="icon" 
              className="absolute top-4 right-4" 
              onClick={handleClear}
            >
              <X size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
