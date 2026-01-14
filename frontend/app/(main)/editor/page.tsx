'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useServiceStatus } from '@/lib/serviceStatus';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code2, FileCode, FileText, TestTube, Sparkles, WifiOff } from 'lucide-react';

export default function EditorPage() {
    const { data: session } = useSession();
    const { isOnline, isChecking } = useServiceStatus();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [template, setTemplate] = useState('def solution():\n    pass');
    const [tests, setTests] = useState('[{"input": "...", "output": "..."}]');
    const [difficulty, setDifficulty] = useState('Easy');
    const [loading, setLoading] = useState(false);

    // simple protection check - only editors can access this page
    if (session && !session.roles?.includes('editor')) {
        return (
            <div className="max-w-[1200px] mx-auto p-8">
                <div className="text-center py-16 rounded-xl border border-red-500/20 bg-red-500/5">
                    <p className="text-red-400">Access Denied: You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isOnline) {
            toast.error('Cannot create challenges - services are offline');
            return;
        }

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

            await axios.post('/api/proxy/challenges', {
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

    const getDifficultyColor = (diff: string) => {
        switch (diff) {
            case 'Easy': return 'text-emerald-400';
            case 'Medium': return 'text-amber-400';
            case 'Hard': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Offline Warning */}
            {!isOnline && !isChecking && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
                    <WifiOff className="w-5 h-5 text-amber-400" />
                    <div>
                        <p className="text-amber-400 font-medium">Demo Mode</p>
                        <p className="text-amber-400/70 text-sm">Services are offline. Challenge creation is disabled.</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">Challenge Editor</h1>
                <p className="text-gray-400">Create a new coding challenge</p>
            </div>

            {/* Form */}
            <div className="rounded-xl bg-[#0c0c0e] border border-white/10 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title & Difficulty Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                <Sparkles className="w-4 h-4 text-indigo-400" />
                                Title
                            </label>
                            <Input 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                required 
                                placeholder="e.g., Two Sum"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                Difficulty
                            </label>
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-indigo-500/20">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0c0c0e] border-white/10">
                                    <SelectItem value="Easy" className="text-emerald-400 focus:bg-white/10 focus:text-emerald-400">Easy</SelectItem>
                                    <SelectItem value="Medium" className="text-amber-400 focus:bg-white/10 focus:text-amber-400">Medium</SelectItem>
                                    <SelectItem value="Hard" className="text-red-400 focus:bg-white/10 focus:text-red-400">Hard</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <FileText className="w-4 h-4 text-indigo-400" />
                            Description
                        </label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Describe the challenge, constraints, and examples..."
                            className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                        />
                    </div>

                    {/* Template Code */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <FileCode className="w-4 h-4 text-indigo-400" />
                            Template Code
                        </label>
                        <Textarea
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                            required
                            className="font-mono min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                        />
                    </div>

                    {/* Tests */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                            <TestTube className="w-4 h-4 text-indigo-400" />
                            Tests (JSON Array)
                        </label>
                        <Textarea
                            value={tests}
                            onChange={(e) => setTests(e.target.value)}
                            required
                            className="font-mono min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                        />
                        <p className="text-xs text-gray-500">
                            Example: {`[{"input": "abc", "output": "cba"}]`}
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
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Code2 className="w-5 h-5" />
                                Create Challenge
                            </span>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
