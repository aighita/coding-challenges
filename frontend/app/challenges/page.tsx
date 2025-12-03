'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Challenge {
    id: string;
    title: string;
    difficulty: string;
}

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        // In a real app, this would call the Gateway URL
        // For now, we assume the frontend can access the gateway via localhost:8080 if running locally
        // Or we configure a proxy in next.config.js
        const fetchChallenges = async () => {
            try {
                // Assuming Gateway is at localhost:8080
                const response = await axios.get('http://localhost:8080/challenges');
                setChallenges(response.data);
            } catch (error) {
                console.error('Error fetching challenges:', error);
            }
        };

        fetchChallenges();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Challenges</h1>
            <div className="grid gap-4">
                {challenges.map((challenge) => (
                    <Link
                        key={challenge.id}
                        href={`/challenges/${challenge.id}`}
                        className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition border border-gray-200 dark:border-gray-700"
                    >
                        <h2 className="text-xl font-semibold">{challenge.title}</h2>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                            }`}>
                            {challenge.difficulty}
                        </span>
                    </Link>
                ))}
                {challenges.length === 0 && (
                    <p>No challenges found. (Make sure backend is running)</p>
                )}
            </div>
        </div>
    );
}
