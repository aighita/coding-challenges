'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function EditorPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [template, setTemplate] = useState('def solution():\n    pass');
    const [tests, setTests] = useState('[{"input": "...", "output": "..."}]');
    const [difficulty, setDifficulty] = useState('Easy');
    const [loading, setLoading] = useState(false);

    // simple protection check
    if (session && !session.roles?.includes('editor')) {
        return <div className="p-8">Access Denied: You do not have permission to view this page.</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let parsedTests;
            try {
                parsedTests = JSON.parse(tests);
            } catch (err) {
                toast.error('Invalid JSON for Tests');
                setLoading(false);
                return;
            }

            await axios.post('http://localhost:8080/challenges', {
                title,
                description,
                template,
                tests: parsedTests,
                difficulty
            }, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            });

            toast.success('Challenge created successfully!');
            router.push('/challenges');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create challenge');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Create New Challenge</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Difficulty</label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Easy">Easy</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="Hard">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="min-h-[100px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Template Code</label>
                            <Textarea
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                required
                                className="font-mono min-h-[100px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Tests (JSON Array)</label>
                            <Textarea
                                value={tests}
                                onChange={(e) => setTests(e.target.value)}
                                required
                                className="font-mono min-h-[100px]"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Example: {`[{"input": "abc", "output": "cba"}]`}
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Challenge'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
