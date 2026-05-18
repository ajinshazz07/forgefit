
'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { Navigation } from '@/components/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen pb-24 md:pt-24 px-4 md:px-8">
      <Navigation />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-headline font-black mb-8 uppercase text-white tracking-tighter text-center">
          Athlete <span className="text-primary italic">Profile</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="md:col-span-1 bg-card border-border candy-red-glow">
            <CardHeader className="text-center border-b border-border bg-secondary/10">
              <div className="mx-auto relative w-24 h-24 mb-4">
                <Avatar className="w-24 h-24 border-2 border-primary">
                  <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                  <AvatarFallback className="bg-secondary text-2xl font-bold">
                    {user.displayName?.[0] || <User />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-primary p-1.5 rounded-full border-2 border-background">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              <CardTitle className="font-headline font-bold text-xl">{user.displayName}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/50">
                <Settings className="w-4 h-4" /> Account Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-secondary/50">
                <ShieldCheck className="w-4 h-4" /> Privacy & Security
              </Button>
            </CardContent>
            <CardFooter className="pt-4 border-t border-border">
              <Button onClick={handleSignOut} variant="destructive" className="w-full gap-2 font-bold uppercase italic tracking-widest text-xs">
                Terminate Session <LogOut className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="md:col-span-2 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-headline font-black uppercase italic">Performance Ledger</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Account Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Status</span>
                    <span className="text-primary font-bold">Active Elite</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Joined</span>
                    <span className="font-bold">{new Date(user.metadata.creationTime || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Industrial Verification</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your identity is cryptographically secured. Session persistence is managed via calculated 
                  auth tokens to ensure your metrics remain confidential.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
