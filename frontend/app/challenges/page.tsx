'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Challenge {
    id: string;
    title: string;
    difficulty: string;
}

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');

    useEffect(() => {
        // TODO: In a real app, this would call the Gateway URL not hardcoded
        const fetchChallenges = async () => {
            try {
                const response = await axios.get('http://localhost:8080/challenges');
                setChallenges(response.data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            }
        };

        fetchChallenges();
    }, []);

    const filteredChallenges = challenges.filter(challenge => {
        const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            challenge.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'All' || challenge.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Challenges</h1>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search challenges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Difficulties</SelectItem>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredChallenges.map((challenge) => (
                    <Link
                        key={challenge.id}
                        href={`/challenges/${challenge.id}`}
                    >
                        <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle>{challenge.title}</CardTitle>
                                    <Badge variant={
                                        challenge.difficulty === 'Easy' ? 'default' :
                                            challenge.difficulty === 'Medium' ? 'secondary' :
                                                'destructive'
                                    }>
                                        {challenge.difficulty}
                                    </Badge>
                                </div>
                                <CardDescription className="line-clamp-1">ID: {challenge.id}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">Click to solve this challenge.</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {filteredChallenges.length === 0 && (
                    <p className="col-span-full text-center text-muted-foreground py-12">No challenges found matching your criteria.</p>
                )}
            </div>
        </div>
    );
}
