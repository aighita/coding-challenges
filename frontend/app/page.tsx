import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Globe, Cpu, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center lg:py-32">

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
          Master Algorithms with <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Distributed Computing
          </span>
        </h1>

        <p className="max-w-2xl mx-auto mb-10 text-lg sm:text-xl text-muted-foreground">
          A scalable, distributed platform for coding challenges.
          Run your code in isolated sandboxes, compete with peers, and improve your skills in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link href="/challenges">
            <Button size="lg" className="h-12 px-8 text-lg min-w-[200px]">
              Browse Challenges
            </Button>
          </Link>
          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 bg-muted/50 p-3 rounded-lg w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
