'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useServiceStatus } from '@/lib/serviceStatus';
import { MOCK_CHALLENGES } from '@/lib/mockData';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Code2, ChevronRight, Search, Trash2, WifiOff } from 'lucide-react';

interface Challenge {
    id: string;
    title: string;
    difficulty: string;
}

export default function ChallengesPage() {
    const { data: session } = useSession();
    const { isOnline, isChecking } = useServiceStatus();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [usingMockData, setUsingMockData] = useState(false);

    const canDelete = session?.roles?.includes('editor') || session?.roles?.includes('admin');

    const fetchChallenges = async () => {
        try {
            const response = await axios.get('/api/proxy/challenges');
            setChallenges(response.data);
            setUsingMockData(false);
        } catch (error) {
            console.error('Error fetching challenges, using mock data:', error);
            setChallenges(MOCK_CHALLENGES);
            setUsingMockData(true);
        }
    };

    useEffect(() => {
        if (!isChecking) {
            if (isOnline) {
                fetchChallenges();
            } else {
                setChallenges(MOCK_CHALLENGES);
                setUsingMockData(true);
            }
        }
    }, [isOnline, isChecking]);

    const handleDelete = async (e: React.MouseEvent, challengeId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (usingMockData) {
            alert('Cannot delete challenges in demo mode');
            return;
        }

        if (!confirm('Are you sure you want to delete this challenge?')) {
            return;
        }

        try {
            await axios.delete(`/api/proxy/challenges/${challengeId}`, {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            });
            fetchChallenges();
        } catch (error) {
            console.error('Error deleting challenge:', error);
            alert('Failed to delete challenge');
        }
    };

    const filteredChallenges = challenges.filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            challenge.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'All' || challenge.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Medium':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'Hard':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-white/5 text-gray-400 border-white/10';
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white">Challenges</h1>
                    {usingMockData && (
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
                            <WifiOff className="w-3 h-3 mr-1" />
                            Demo Mode
                        </Badge>
                    )}
                </div>
                <p className="text-gray-400">
                    {usingMockData 
                        ? 'Showing sample challenges - services are offline' 
                        : 'Select a challenge to start coding'}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search challenges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-indigo-500/20">
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0c0c0e] border-white/10">
                            <SelectItem value="All" className="text-gray-300 focus:bg-white/10 focus:text-white">All Difficulties</SelectItem>
                            <SelectItem value="Easy" className="text-emerald-400 focus:bg-white/10 focus:text-emerald-400">Easy</SelectItem>
                            <SelectItem value="Medium" className="text-amber-400 focus:bg-white/10 focus:text-amber-400">Medium</SelectItem>
                            <SelectItem value="Hard" className="text-red-400 focus:bg-white/10 focus:text-red-400">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Challenges List */}
            <div className="space-y-3">
                {filteredChallenges.map((challenge) => (
                    <Link
                        key={challenge.id}
                        href={`/challenges/${challenge.id}`}
                        className="group block"
                    >
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0c0c0e] border border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.02] transition-all duration-200">
                            {/* Icon */}
                            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                <Code2 className="w-5 h-5 text-indigo-400" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors truncate">
                                    {challenge.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">ID: {challenge.id}</p>
                            </div>

                            {/* Difficulty Badge */}
                            <Badge 
                                variant="outline" 
                                className={`${getDifficultyColor(challenge.difficulty)} border font-medium`}
                            >
                                {challenge.difficulty}
                            </Badge>

                            {/* Delete Button for Editors/Admins */}
                            {canDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleDelete(e, challenge.id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}

                            {/* Arrow */}
                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                ))}
                
                {filteredChallenges.length === 0 && (
                    <div className="text-center py-16 rounded-xl border border-white/5 bg-white/[0.01]">
                        <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No challenges found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
