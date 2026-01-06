'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

    if (!session?.roles?.includes('admin')) {
        return <div className="p-8 text-center">Access Denied: Admin privileges required.</div>;
    }

    if (loading) {
        return <div className="p-8 text-center">Loading users...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Student</TableHead>
                                <TableHead>Editor</TableHead>
                                <TableHead>Current Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Checkbox 
                                            checked={user.role === 'student' || user.role === 'editor' || user.role === 'admin'}
                                            disabled={true} // Everyone is at least a student basically
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox 
                                            checked={user.role === 'editor' || user.role === 'admin'}
                                            onCheckedChange={(checked) => {
                                                // If checking, promote to editor. If unchecking, demote to student.
                                                // Admin role is not toggleable here to prevent locking oneself out easily, 
                                                // or maybe we treat admin as super-editor.
                                                if (user.role === 'admin') return; // Don't demote admins via this UI
                                                
                                                const newRole = checked ? 'editor' : 'student';
                                                handleRoleChange(user.id, newRole);
                                            }}
                                            disabled={user.role === 'admin'}
                                        />
                                    </TableCell>
                                    <TableCell className="capitalize">{user.role}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
