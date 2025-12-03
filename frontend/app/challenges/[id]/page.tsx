'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Challenge {
    id: string;
    title: string;
    description: string;
    template: string;
    difficulty: string;
}

interface Submission {
    id: string;
    status: string;
    verdict: string;
    output: string;
    createdAt: string;
}

export default function ChallengeDetailPage() {
    const params = useParams();
    const { data: session } = useSession();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [code, setCode] = useState('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchChallenge(params.id as string);
            if (session) {
                fetchSubmissions(params.id as string);
            }
        }
    }, [params.id, session]);

    const fetchChallenge = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/challenges/${id}`);
            setChallenge(response.data);
            setCode(response.data.template);
        } catch (error) {
            console.error('Error fetching challenge:', error);
        }
    };

    const fetchSubmissions = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/challenges/${id}/submissions`, {
                headers: { Authorization: `Bearer ${session?.accessToken}` }
            });
            setSubmissions(response.data);
        } catch (error) {
            console.error('Error fetching submissions', error);
        }
    }

    const handleSubmit = async () => {
        if (!session) {
            toast.error('Please sign in to submit');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`http://localhost:8080/challenges/${params.id}/submit`,
                { code },
                { headers: { Authorization: `Bearer ${session.accessToken}` } }
            );
            toast.success('Solution submitted!');
            fetchSubmissions(params.id as string);
        } catch (error) {
            toast.error('Submission failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!challenge) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
                <div className="prose dark:prose-invert mb-6">
                    <p>{challenge.description}</p>
                </div>

                <h3 className="text-xl font-bold mb-2">History</h3>
                <div className="space-y-2">
                    {submissions.map(sub => (
                        <div key={sub.id} className="p-2 border rounded text-sm flex justify-between">
                            <span>{new Date(sub.createdAt).toLocaleTimeString()}</span>
                            <span className={
                                sub.verdict === 'PASSED' ? 'text-green-500' :
                                    sub.verdict === 'FAILED' ? 'text-red-500' : 'text-yellow-500'
                            }>{sub.verdict || sub.status}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Code Solution (Python)</label>
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-96 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border rounded focus:ring-2 focus:ring-blue-500"
                        spellCheck={false}
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Solution'}
                </button>
            </div>
        </div>
    );
}
