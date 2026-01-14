'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Announcement from '@/components/Announcement';
import CircularText from '@/components/CircularText';

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const userSectionRef = useRef<HTMLDivElement>(null);

    const hasRole = (role: string) => session?.roles?.includes(role);
    const isAdmin = hasRole('admin');
    const isEditor = hasRole('editor');

    useEffect(() => {
        if (session && userSectionRef.current) {
            gsap.fromTo(
                userSectionRef.current,
                {
                    scale: 0,
                    opacity: 0,
                    x: 20
                },
                {
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    ease: 'back.out(1.7)'
                }
            );
        }
    }, [session]);

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center pointer-events-none bg-gradient-to-b from-[#060010] to-transparent backdrop-blur-md">
            <div className="w-full pointer-events-auto">
                <Announcement />
            </div>
            <div className="flex items-center justify-center w-full px-[1rem] sm:px-[2em] md:px-[4em] h-[80px] sm:h-[120px] md:h-[160px] bg-gradient-to-b from-[#060010] to-transparent transition-all duration-300">
                <div className="grid grid-cols-3 items-center w-full max-w-[1200px] mx-auto pointer-events-auto">
                    {/* Logo Section */}
                <div className="relative z-[2] group justify-self-start">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[160px] md:w-[200px] h-[80px] sm:h-[120px] md:h-[140px] bg-transparent backdrop-blur-[8px] -z-[1] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_0%,black_20%,transparent_80%)]"></div>
                    <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
                        <CircularText
                            text="CODING*CHALLENGES*"
                            onHover="speedUp"
                            spinDuration={25}
                            className="text-white !w-[50px] !h-[50px] text-[10px] sm:!w-[80px] sm:!h-[80px] sm:text-xs md:!w-[100px] md:!h-[100px] md:text-sm"
                        />
                    </Link>
                </div>

                {/* Navigation Items - Desktop */}
                <nav
                    ref={navRef}
                    className="hidden md:flex items-center justify-self-center gap-8 h-[60px] px-[2.4rem] pr-[calc(2.4rem+6px)] rounded-[50px] border border-white/[0.07] bg-white/[0.01] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-[15px] text-white"
                >
                    <Link 
                        href="/challenges"
                        className={cn(
                            "relative no-underline text-inherit font-normal opacity-60 transition-all duration-300 hover:opacity-100 hover:-translate-y-[1px]",
                            isActive('/challenges') && "opacity-100 before:content-[''] before:absolute before:w-[6px] before:h-[6px] before:bg-white before:rounded-full before:-left-[12px] before:top-1/2 before:-translate-y-1/2"
                        )}
                    >
                        Challenges
                    </Link>
                    
                    {isEditor && (
                        <Link 
                            href="/editor"
                            className={cn(
                                "relative no-underline text-inherit font-normal opacity-60 transition-all duration-300 hover:opacity-100 hover:-translate-y-[1px]",
                                isActive('/editor') && "opacity-100 before:content-[''] before:absolute before:w-[6px] before:h-[6px] before:bg-white before:rounded-full before:-left-[12px] before:top-1/2 before:-translate-y-1/2"
                            )}
                        >
                            Editor
                        </Link>
                    )}
                    
                    {isAdmin && (
                        <Link 
                            href="/users"
                            className={cn(
                                "relative no-underline text-inherit font-normal opacity-60 transition-all duration-300 hover:opacity-100 hover:-translate-y-[1px]",
                                isActive('/users') && "opacity-100 before:content-[''] before:absolute before:w-[6px] before:h-[6px] before:bg-white before:rounded-full before:-left-[12px] before:top-1/2 before:-translate-y-1/2"
                            )}
                        >
                            Users
                        </Link>
                    )}
                </nav>

                {/* CTA Group */}
                <nav className="flex items-center justify-self-end gap-4 sm:gap-6 h-[50px] sm:h-[60px] px-4 sm:px-8 rounded-[50px] border border-white/[0.07] border-none bg-white/[0.01] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-[15px] text-white transition-all duration-300">
                    {session ? (
                        <div className="flex items-center gap-3 sm:gap-4 group" ref={userSectionRef}>
                            <Link href="/profile" className="flex items-center gap-3 hover:scale-105 transition-transform">
                                <span className="text-sm font-medium text-white/90 hidden sm:block">
                                    {session.user?.name || 'User'}
                                </span>
                                <Avatar className="h-8 w-8 border border-white/20">
                                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
                                    <AvatarFallback className="bg-white/10 text-white">
                                        {session.user?.name 
                                            ? session.user.name.substring(0, 2).toUpperCase() 
                                            : session.user?.email?.substring(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <div className="max-w-0 overflow-hidden group-hover:max-w-[100px] opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                <button
                                    onClick={() => signOut()}
                                    className="bg-gradient-to-r from-[#7c3aed] to-[#182fff] px-5 py-2 whitespace-nowrap rounded-full text-xs font-bold hover:opacity-90 transition-opacity"
                                >
                                    Log Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link href="/register" className="bg-gradient-to-r from-[#7c3aed] to-[#182fff] px-6 py-2 rounded-full text-xs font-bold hover:opacity-90 transition-opacity">
                                Join
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
            </div>
        </div>
    );
}
