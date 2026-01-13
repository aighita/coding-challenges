'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Shield, Save, Loader2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (session?.user) {
            setUsername(session.user.name || '');
            setEmail(session.user.email || '');
        }
    }, [session]);

    if (!session) {
        return (
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center py-16 rounded-xl border border-white/5 bg-white/[0.01]">
                    <User className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Please sign in to view your profile.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.put('/api/proxy/users/me', 
                { username, email },
                { headers: { Authorization: `Bearer ${session?.accessToken}` } }
            );

            // Update the session with new data
            await update({ name: username, email });
            
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'editor': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        }
    };

    const userRole = session.roles?.[0] || 'student';

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-gray-400">Manage your account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl bg-[#0c0c0e] border border-white/10 p-6 text-center">
                        {/* Avatar */}
                        <div className="mb-6">
                            <Avatar className="w-24 h-24 mx-auto border-2 border-white/10">
                                <AvatarImage src={session.user?.image || ''} alt={session.user?.name || 'User'} />
                                <AvatarFallback className="bg-indigo-500/20 text-indigo-400 text-2xl font-bold">
                                    {session.user?.name 
                                        ? session.user.name.substring(0, 2).toUpperCase() 
                                        : session.user?.email?.substring(0, 2).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* User Info */}
                        <h2 className="text-xl font-semibold text-white mb-1">
                            {session.user?.name || 'User'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {session.user?.email}
                        </p>

                        {/* Role Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(userRole)}">
                            <Shield className="w-3 h-3" />
                            <span className="capitalize">{userRole}</span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/5 my-6" />

                        {/* Sign Out Button */}
                        <Button 
                            variant="outline" 
                            className="w-full bg-transparent border-white/10 text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/20"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl bg-[#0c0c0e] border border-white/10 p-6 md:p-8">
                        <h3 className="text-lg font-semibold text-white mb-6">Edit Profile</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <User className="w-4 h-4 text-indigo-400" />
                                    Username
                                </label>
                                <Input 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    placeholder="Your username"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Mail className="w-4 h-4 text-indigo-400" />
                                    Email
                                </label>
                                <Input 
                                    type="email"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="your@email.com"
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                                />
                            </div>

                            {/* Role (Read-only) */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                    <Shield className="w-4 h-4 text-indigo-400" />
                                    Role
                                </label>
                                <Input 
                                    value={userRole}
                                    disabled
                                    className="bg-white/5 border-white/10 text-gray-500 capitalize cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500">
                                    Contact an administrator to change your role.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Account Stats */}
                    <div className="rounded-xl bg-[#0c0c0e] border border-white/10 p-6 mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account ID</p>
                                <p className="text-sm text-gray-300 font-mono truncate">{session.user?.id || 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                <p className="text-sm text-emerald-400 font-medium">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
