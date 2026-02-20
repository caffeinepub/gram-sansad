import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { UserCircle } from 'lucide-react';
import { ExternalBlob } from '../backend';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      console.log('[ProfileSetup] Creating profile with name:', name.trim());
      
      // Create an empty ExternalBlob for aadharPhoto (will be filled during registration)
      // Use a 32-byte zero array to ensure proper hash generation
      const emptyBytes = new Uint8Array(32).fill(0);
      const emptyBlob = ExternalBlob.fromBytes(emptyBytes);
      
      const profile = {
        name: name.trim(),
        fatherName: '',
        age: BigInt(0),
        mobileNumber: '',
        whatsappNumber: '',
        state: '',
        district: '',
        village: '',
        aadharPhoto: emptyBlob,
      };
      
      console.log('[ProfileSetup] Submitting profile:', { ...profile, aadharPhoto: '[ExternalBlob with 32-byte placeholder]' });
      
      await saveProfile.mutateAsync(profile);
      
      console.log('[ProfileSetup] Profile created successfully');
      toast.success('Profile created! Please complete your registration.');
    } catch (error: any) {
      console.error('[ProfileSetup] Failed to create profile:', error);
      console.error('[ProfileSetup] Error details:', {
        message: error?.message,
        stack: error?.stack,
        cause: error?.cause,
      });
      
      const errorMessage = error?.message || 'Failed to create profile';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto mb-4">
            <UserCircle className="w-16 h-16 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to Gram Sansad!</DialogTitle>
          <DialogDescription className="text-center">
            Let's start by setting up your profile. What should we call you?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
