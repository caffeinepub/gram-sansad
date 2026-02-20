import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export default function LoginPrompt() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="Gram Sansad"
              className="h-24 w-24 mx-auto rounded-full shadow-md"
            />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-primary">Gram Sansad</CardTitle>
            <CardDescription className="text-base mt-2">
              Welcome to your community portal. Connect, communicate, and collaborate.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Login to Continue
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Secure authentication powered by Internet Identity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
