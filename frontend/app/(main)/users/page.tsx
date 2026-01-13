'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Shield, UserCheck, Loader2 } from 'lucide-react';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export default function UsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.roles?.includes('admin')) {
            fetchUsers();
        }
    }, [session]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/proxy/users', {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await axios.put(`/api/proxy/users/${userId}/role`, 
                { role: newRole },
                { headers: { Authorization: `Bearer ${session?.accessToken}` } }
            );
            
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            ));
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'editor': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        }
    };

    if (!session?.roles?.includes('admin')) {
        return (
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center py-16 rounded-xl border border-red-500/20 bg-red-500/5">
                    <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <p className="text-red-400">Access Denied: Admin privileges required.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center py-16 rounded-xl border border-white/5 bg-white/[0.01]">
                    <Loader2 className="w-8 h-8 text-indigo-400 mx-auto mb-4 animate-spin" />
                    <p className="text-gray-400">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-gray-400">Manage user roles and permissions</p>
            </div>

            {/* Users Table */}
            <div className="rounded-xl bg-[#0c0c0e] border border-white/10 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                    <div className="col-span-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Username</div>
                    <div className="col-span-4 text-xs uppercase tracking-wider text-gray-500 font-semibold">Email</div>
                    <div className="col-span-1 text-xs uppercase tracking-wider text-gray-500 font-semibold text-center">Student</div>
                    <div className="col-span-1 text-xs uppercase tracking-wider text-gray-500 font-semibold text-center">Editor</div>
                    <div className="col-span-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Role</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {users.map((user) => (
                        <div 
                            key={user.id} 
                            className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors"
                        >
                            {/* Username */}
                            <div className="col-span-3 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-500/10">
                                    <Users className="w-4 h-4 text-indigo-400" />
                                </div>
                                <span className="text-white font-medium truncate">{user.username}</span>
                            </div>

                            {/* Email */}
                            <div className="col-span-4 text-gray-400 text-sm truncate">
                                {user.email}
                            </div>

                            {/* Student Checkbox */}
                            <div className="col-span-1 flex justify-center">
                                <Checkbox 
                                    checked={user.role === 'student' || user.role === 'editor' || user.role === 'admin'}
                                    disabled={true}
                                    className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                />
                            </div>

                            {/* Editor Checkbox */}
                            <div className="col-span-1 flex justify-center">
                                <Checkbox 
                                    checked={user.role === 'editor' || user.role === 'admin'}
                                    onCheckedChange={(checked) => {
                                        if (user.role === 'admin') return;
                                        const newRole = checked ? 'editor' : 'student';
                                        handleRoleChange(user.id, newRole);
                                    }}
                                    disabled={user.role === 'admin'}
                                    className="border-white/20 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 disabled:opacity-50"
                                />
                            </div>

                            {/* Role Badge */}
                            <div className="col-span-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                    {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                    {user.role === 'editor' && <UserCheck className="w-3 h-3" />}
                                    <span className="capitalize">{user.role}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="text-center py-16">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No users found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
