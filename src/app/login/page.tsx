
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Dumbbell, Chrome } from 'lucide-react';
import { Navigation } from '@/components/navigation';

export default function LoginPage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Navigation />
      <Card className="w-full max-w-md border-primary/20 bg-card candy-red-glow">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center candy-red-glow">
            <Dumbbell className="text-white w-7 h-7" />
          </div>
          <CardTitle className="text-3xl font-headline font-black uppercase italic tracking-tighter">
            Join The <span className="text-primary">Forge</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Sign in to sync your AI plans and track your legacy.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Button 
            onClick={handleGoogleSignIn} 
            variant="outline" 
            className="w-full h-12 border-primary/30 hover:bg-primary/10 gap-3 font-bold text-lg"
          >
            <Chrome className="w-5 h-5 text-primary" />
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="text-center justify-center pb-8">
          <p className="text-xs text-muted-foreground px-8">
            By joining, you agree to the industrial terms of service and calculated privacy guidelines.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
