import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalBlob } from '../backend';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ImageUploadFieldProps {
  onUpload: (blob: ExternalBlob) => void;
  label: string;
}

export default function ImageUploadField({ onUpload, label }: ImageUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const previewUrl = blob.getDirectURL();
      setPreview(previewUrl);
      onUpload(blob);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview ? (
        <Button
          type="button"
          variant="outline"
          className="w-full h-32 border-dashed"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <div className="flex flex-col items-center gap-2">
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">Click to select image</span>
              </>
            )}
          </div>
        </Button>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {uploading && uploadProgress > 0 && (
        <Progress value={uploadProgress} className="w-full" />
      )}
    </div>
  );
}
