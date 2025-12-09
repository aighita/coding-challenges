'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-2xl font-bold text-primary">
                    Coding Challenges
                </Link>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/challenges" className="text-foreground/60 transition-colors hover:text-foreground/80">Challenges</Link>
                        {session?.roles?.includes('editor') && (
                            <Link href="/editor" className="text-foreground/60 transition-colors hover:text-foreground/80">Editor</Link>
                        )}
                    </div>

                    <ThemeToggle />

                    {session ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden md:inline-block">
                                {session.user?.name || session.user?.email}
                            </span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => signOut()}
                            >
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            onClick={() => signIn('keycloak')}
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
