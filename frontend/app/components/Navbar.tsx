'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Coding Challenges
                </Link>
                <div className="space-x-4">
                    <Link href="/challenges" className="hover:text-gray-300">
                        Challenges
                    </Link>
                    {session ? (
                        <>
                            <span className="text-gray-300">Hello, {session.user?.name || session.user?.email}</span>
                            <button
                                onClick={() => signOut()}
                                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => signIn('keycloak')}
                            className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
