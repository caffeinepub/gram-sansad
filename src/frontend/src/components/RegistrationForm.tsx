import { useState } from 'react';
import { useRegisterUser } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ImageUploadField from './ImageUploadField';
import { ExternalBlob } from '../backend';
import { CheckCircle2 } from 'lucide-react';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    age: '',
    mobileNumber: '',
    whatsappNumber: '',
    state: '',
    district: '',
    village: '',
  });
  const [aadharPhoto, setAadharPhoto] = useState<ExternalBlob | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const registerUser = useRegisterUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.fatherName.trim()) return "Father's name is required";
    if (!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 120) {
      return 'Age must be between 18 and 120';
    }
    if (!formData.mobileNumber.match(/^\d{10}$/)) {
      return 'Mobile number must be 10 digits';
    }
    if (!formData.whatsappNumber.match(/^\d{10}$/)) {
      return 'WhatsApp number must be 10 digits';
    }
    if (!formData.state.trim()) return 'State is required';
    if (!formData.district.trim()) return 'District is required';
    if (!formData.village.trim()) return 'Village is required';
    if (!aadharPhoto) return 'Aadhaar card photo is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      await registerUser.mutateAsync({
        name: formData.name.trim(),
        fatherName: formData.fatherName.trim(),
        age: BigInt(parseInt(formData.age)),
        mobileNumber: formData.mobileNumber,
        whatsappNumber: formData.whatsappNumber,
        state: formData.state.trim(),
        district: formData.district.trim(),
        village: formData.village.trim(),
        aadharPhoto: aadharPhoto!,
      });
      toast.success('Registration submitted successfully!');
      setSubmitted(true);
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        toast.error('You are already registered');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-primary mb-2">Registration Complete!</h3>
        <p className="text-muted-foreground">
          Your registration has been submitted successfully. You can now access all community features.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fatherName">Father's Name *</Label>
          <Input
            id="fatherName"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            placeholder="Enter father's name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            min="18"
            max="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobileNumber">Mobile Number *</Label>
          <Input
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            maxLength={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number *</Label>
          <Input
            id="whatsappNumber"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            onChange={handleChange}
            placeholder="10-digit WhatsApp number"
            maxLength={10}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Enter your state"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District *</Label>
          <Input
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="Enter your district"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="village">Village *</Label>
          <Input
            id="village"
            name="village"
            value={formData.village}
            onChange={handleChange}
            placeholder="Enter your village"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Aadhaar Card Photo *</Label>
        <p className="text-sm text-muted-foreground mb-2">
          Upload a clear photo of your Aadhaar card
        </p>
        <ImageUploadField
          onUpload={setAadharPhoto}
          label="Upload Aadhaar Card"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={registerUser.isPending}
      >
        {registerUser.isPending ? 'Submitting...' : 'Submit Registration'}
      </Button>
    </form>
  );
}
