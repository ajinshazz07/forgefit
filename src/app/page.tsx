
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Target, ShieldCheck, Flame, Dumbbell } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-gym');

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-16">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover opacity-40 grayscale"
              priority
              data-ai-hint="gym fitness"
            />
          )}
          <div className="absolute inset-0 castle-gradient" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-8xl font-headline font-black text-white mb-6 tracking-tighter uppercase italic">
            Forge Your <span className="text-primary candy-red-glow-strong">Legacy</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto font-body font-light tracking-wide">
            Elite fitness strategies meet industrial-grade gear. Calculated precision. 
            AI-driven results. No excuses.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold candy-red-glow">
              <Link href="/bmi">
                Get Started <Zap className="ml-2 w-5 h-5 fill-current" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-primary text-primary hover:bg-primary/10">
              <Link href="/shop">
                Browse The Vault <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats/Quick Actions */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card border-primary/20 hover:border-primary transition-colors group">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Target className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-3">AI Strategies</h3>
              <p className="text-muted-foreground">
                Get bespoke meal and workout plans tailored to your BMI and goals using our proprietary generative model.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-accent/20 hover:border-accent transition-colors group">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Flame className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-3 text-accent">Resilient Sync</h3>
              <p className="text-muted-foreground">
                Track reps and sessions offline. Our resilient sync architecture ensures your progress is never lost.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20 hover:border-primary transition-colors group">
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-2xl font-headline font-bold mb-3">The Vault</h3>
              <p className="text-muted-foreground">
                Industrial-grade gym equipment and supplements curated for elite performance seekers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Dumbbell className="text-white w-5 h-5" />
            </div>
            <span className="font-headline text-2xl font-bold tracking-tight text-primary">ForgeFit</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ForgeFit Industrial. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
