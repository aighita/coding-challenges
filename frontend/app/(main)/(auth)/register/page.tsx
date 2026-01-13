"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, User, Mail, Lock, UserPlus, Rocket } from "lucide-react";
import CircularText from "@/components/CircularText";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            await axios.post("/api/auth/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            router.push("/login?registered=true");
        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#020202] p-4 overflow-hidden">
            {/* Background grid pattern */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />
            
            <div className="w-full max-w-md relative">
                {/* Decorative glow */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 right-0 w-48 h-48 bg-indigo-500/15 rounded-full blur-[80px] pointer-events-none" />
                
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="group">
                        <CircularText
                            text="CODING*CHALLENGES*"
                            onHover="speedUp"
                            spinDuration={25}
                            className="text-white !w-[80px] !h-[80px] text-[10px] group-hover:scale-110 transition-transform"
                        />
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8 relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
                        <Rocket className="w-3 h-3" />
                        Get started
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-gray-500">Join the platform and start solving challenges</p>
                </div>

                {/* Form Card */}
                <div className="relative rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-8 backdrop-blur-xl shadow-2xl shadow-black/20">
                    {/* Card inner glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
                    
                    <div className="relative">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-red-500/20">
                                        <AlertCircle className="h-4 w-4" />
                                    </div>
                                    {error}
                                </div>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="username" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <User className="w-4 h-4 text-purple-400" />
                                        Username
                                    </label>
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="johndoe"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                        <Mail className="w-4 h-4 text-purple-400" />
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@email.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Lock className="w-4 h-4 text-purple-400" />
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Lock className="w-4 h-4 text-purple-400" />
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all"
                                />
                            </div>
                            
                            <Button 
                                className="w-full h-12 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating account...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <UserPlus className="h-5 w-5" />
                                        Create Account
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </p>

                {/* Terms */}
                <p className="text-center text-xs text-gray-600 mt-4 max-w-xs mx-auto">
                    By creating an account, you agree to our terms of service and privacy policy.
                </p>
            </div>
        </div>
    );
}
