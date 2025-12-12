import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Globe, Cpu, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center lg:py-32">
        <div className="relative mb-8">
          <div className="absolute -inset-1 rounded-full blur opacity-25 bg-gradient-to-r from-primary to-purple-600"></div>
          <div className="relative px-4 py-1.5 text-sm font-semibold leading-6 text-foreground/80 bg-background rounded-full ring-1 ring-border">
            Announcing the new Fall 2025 semester challenges
          </div>
        </div>

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
            <Link href="/login">
              <Button size="lg" variant="ghost" className="h-12 px-8 text-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container px-4 py-24 mx-auto border-t bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Code2 className="w-10 h-10 text-blue-500" />}
            title="Multi-Language"
            description="Support for Python, with more languages coming soon. Write code in a powerful web-based editor."
          />
          <FeatureCard
            icon={<Cpu className="w-10 h-10 text-violet-500" />}
            title="Distributed Execution"
            description="Your code runs on a scalable cluster of workers, ensuring low latency and high availability."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-10 h-10 text-green-500" />}
            title="Secure Sandbox"
            description="Every submission is executed in an isolated environment for maximum security and fairness."
          />
          <FeatureCard
            icon={<Globe className="w-10 h-10 text-indigo-500" />}
            title="Global Leaderboards"
            description="Compete with students worldwide and track your progress on real-time leaderboards."
          />
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
