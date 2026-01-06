import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Code2, Globe, Cpu, ShieldCheck, Terminal, Server, Users, Zap, Lock, CheckCircle2 } from 'lucide-react';
import ColorBends from '@/components/ColorBends';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020202] text-foreground overflow-x-hidden selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-start min-h-screen pt-32 pb-20 px-4 text-center overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <ColorBends
            colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
            rotation={30}
            speed={0.3}
            scale={0.5}
            frequency={1.4}
            warpStrength={1.2}
            mouseInfluence={0.8}
            parallax={0.6}
            noise={0.08}
            transparent
          />
          {/* Vignette for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-6xl mx-auto w-full mt-20">
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white max-w-4xl mx-auto leading-tight">
            Master Algorithms with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x">
              Distributed Computing
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-400 leading-relaxed px-4">
            A scalable, distributed platform for coding challenges. Run your code in isolated sandboxes, compete with peers, and improve your skills in realtime.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-20 w-full sm:w-auto">
            <Link href="/challenges" className="w-full sm:w-auto">
              <Button size="lg" className="h-12 px-8 w-full sm:w-auto text-base bg-white text-black hover:bg-gray-200 border-0 rounded-full font-medium transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                Start Coding
              </Button>
            </Link>
            <div className="flex gap-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-12 w-full sm:w-auto px-8 text-base border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent rounded-full backdrop-blur-sm transition-all hover:scale-105 active:scale-95">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>

          {/* Diagram Section */}
          <div className="relative w-full max-w-5xl mx-auto perspective-[1000px]">
             {/* Large connecting lines SVG - Visible on Desktop */}
             <svg className="absolute top-1/2 left-0 w-full h-[400px] -translate-y-1/2 -z-10 hidden md:block opacity-40 pointer-events-none stroke-white/10" preserveAspectRatio="none">
               {/* Left to Center */}
               <path d="M 250,200 C 400,200 400,200 562,200" fill="none" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_30s_linear_infinite]" />
               {/* Center to Right */}
               <path d="M 562,200 C 700,200 700,200 874,200" fill="none" strokeWidth="2" strokeDasharray="8 8" className="animate-[dash_30s_linear_infinite]" />
             </svg>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-center px-4">
              
              {/* Left Column: Developers */}
              <div className="flex flex-col gap-6 relative group md:translate-y-12 transition-transform duration-500 hover:translate-y-8">
                {/* Floating Stats Pill */}
                <div className="absolute -top-10 -left-2 bg-[#121214] border border-white/10 rounded-full py-2 px-4 flex items-center gap-3 shadow-2xl transform transition-transform hover:-translate-y-1 z-20">
                    <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                             <div key={i} className={`w-5 h-5 rounded-full border border-[#121214] bg-gradient-to-br from-blue-500 to-purple-500`} />
                         ))}
                    </div>
                     <span className="text-xs font-medium text-gray-300">1.2k+ Peers</span>
                </div>

                <Card className="bg-[#0c0c0e] border-white/10 shadow-2xl overflow-hidden relative group/card hover:border-white/20 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="p-5 relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            <h3 className="font-semibold text-white/90 text-sm tracking-wide">ACTIVE CHALLENGERS</h3>
                        </div>
                        <div className="space-y-2">
                           {[1,2,3].map((i) => (
                               <div key={i} className="flex items-center gap-3 bg-white/5 p-2 rounded-md border border-white/5 hover:bg-white/10 transition-colors">
                                   <Avatar className="w-6 h-6 rounded-full border border-white/10">
                                       <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-[8px] text-white">U{i}</AvatarFallback>
                                   </Avatar>
                                   <div className="flex flex-col gap-1.5 w-full">
                                       <div className="h-1.5 w-16 bg-white/20 rounded-full"></div>
                                       <div className="h-1.5 w-10 bg-white/10 rounded-full"></div>
                                   </div>
                               </div>
                           ))}
                        </div>
                    </div>
                </Card>
              </div>

              {/* Center Column: Core Platform */}
              <div className="flex flex-col items-center justify-center relative z-10">
                <div className="relative w-40 h-40 flex items-center justify-center group cursor-pointer">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[50px] animate-pulse-slow group-hover:bg-indigo-500/30 transition-all duration-500"></div>
                    <div className="relative w-28 h-28 bg-[#0c0c0e] border border-white/20 rounded-2xl shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] flex flex-col items-center justify-center z-10 transform transition-transform group-hover:scale-105 duration-500 gap-2">
                         <div className="p-2 bg-indigo-500/10 rounded-lg">
                             <Server className="w-8 h-8 text-indigo-400" /> 
                         </div>
                         <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200/50">Gateway</span>
                    </div>
                    
                    {/* Orbiting Elements */}
                    <div className="absolute inset-0 animate-spin-slow opacity-60">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0c0c0e] border border-white/10 p-2 rounded-full shadow-lg">
                            <Code2 className="w-4 h-4 text-indigo-400" />
                        </div>
                    </div>
                    <div className="absolute inset-0 animate-spin-reverse-slow opacity-60">
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#0c0c0e] border border-white/10 p-2 rounded-full shadow-lg">
                            <Globe className="w-4 h-4 text-purple-400" />
                        </div>
                    </div>
                </div>
                
                <div className="mt-10 bg-[#0c0c0e] border border-white/10 px-6 py-2 rounded-full flex items-center gap-2 shadow-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-300 tracking-wide">Load Balancing</span>
                </div>
              </div>

              {/* Right Column: Execution */}
              <div className="flex flex-col gap-6 relative group md:translate-y-12 transition-transform duration-500 hover:translate-y-8">
                 {/* Floating Security Pill */}
                 <div className="absolute -bottom-8 -right-2 bg-[#121214] border border-white/10 rounded-full py-2 px-4 flex items-center gap-3 shadow-2xl transform transition-transform hover:translate-y-1 z-20">
                    <div className="p-1 rounded-full bg-emerald-500/20">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-0.5">Sandbox</div>
                        <div className="text-xs font-bold text-white leading-none">Secure Env</div>
                    </div>
                </div>

                <Card className="bg-[#0c0c0e] border-white/10 shadow-2xl overflow-hidden relative group/card hover:border-white/20 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-bl from-emerald-500/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div className="p-5 relative">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white/90 text-sm tracking-wide">EXECUTION NODES</h3>
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
                            </div>
                        </div>
                        <div className="space-y-2">
                           {['sw-10', 'sw-20', 'sw-30'].map((id) => (
                               <div key={id} className="flex items-center justify-between bg-white/5 p-2 rounded-md border border-white/5 group/item hover:bg-white/10 transition-colors">
                                   <div className="flex items-center gap-3">
                                       <Terminal className="w-3.5 h-3.5 text-gray-500 group-hover/item:text-gray-300 transition-colors" />
                                       <span className="text-xs font-mono text-gray-400 group-hover/item:text-gray-200 transition-colors">node-{id}</span>
                                   </div>
                                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover/item:bg-emerald-400 transition-colors"></div>
                               </div>
                           ))}
                        </div>
                    </div>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

