"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, User, Lock, LogIn, Sparkles } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const registered = searchParams.get("registered");
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                username: credentials.username,
                password: credentials.password,
                redirect: false,
                callbackUrl,
            });

            if (result?.error) {
                setError("Invalid username or password");
                setLoading(false);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md relative">
            {/* Decorative glow */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-500/15 rounded-full blur-[80px] pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-6 relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
                    <Sparkles className="w-3 h-3" />
                    Welcome back
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Sign in to your account</h1>
                <p className="text-sm text-gray-500">Enter your credentials below to continue</p>
            </div>

            {/* Form Card */}
            <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl shadow-2xl shadow-black/20">
                {/* Card inner glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                
                <div className="relative">
                    {registered && (
                        <div className="mb-4 p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Registration successful! Please sign in.
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                <div className="p-1 rounded-full bg-red-500/20">
                                    <AlertCircle className="h-3 w-3" />
                                </div>
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-1.5">
                            <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <User className="w-3.5 h-3.5 text-indigo-400" />
                                Username or Email
                            </label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Enter your username"
                                required
                                value={credentials.username}
                                onChange={handleChange}
                                disabled={loading}
                                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={credentials.password}
                                onChange={handleChange}
                                disabled={loading}
                                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 rounded-xl transition-all"
                            />
                        </div>
                        
                        <Button 
                            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98]" 
                            type="submit" 
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <LogIn className="h-4 w-4" />
                                    Sign In
                                </span>
                            )}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors hover:underline underline-offset-4">
                    Create one
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
            
            <Suspense fallback={
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    </div>
                </div>
            }>
                <LoginForm />
            </Suspense>
        </div>
    );
}
