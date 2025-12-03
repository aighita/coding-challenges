import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background text-foreground">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to <span className="text-primary">Coding Challenges</span>
        </h1>

        <p className="mt-3 text-2xl mb-12 text-muted-foreground">
          Improve your coding skills by solving algorithmic problems.
        </p>

        <div className="flex gap-4">
          <Link href="/challenges">
            <Button size="lg" className="text-lg px-8">
              Browse Challenges
            </Button>
          </Link>
          <Link href="/api/auth/signin">
            <Button variant="outline" size="lg" className="text-lg px-8">
              Sign In
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
