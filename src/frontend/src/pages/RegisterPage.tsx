import RegistrationForm from '../components/RegistrationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <UserCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-primary mb-2">Complete Your Registration</h1>
        <p className="text-muted-foreground">
          Please provide your details to complete your community registration
        </p>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Registration Form</CardTitle>
          <CardDescription>
            All fields are required for community verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}
