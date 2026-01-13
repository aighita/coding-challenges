'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import CodeEditor from '@/components/CodeEditor';
import { Code2, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, Send, History, FileCode2, ChevronDown, ChevronUp, Terminal, Bug, Zap } from 'lucide-react';

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
    const [polling, setPolling] = useState(false);
    const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

    const fetchSubmissions = useCallback(async (id: string) => {
        if (!session?.accessToken) return;
        try {
            const response = await axios.get(`/api/proxy/challenges/${id}/submissions`, {
                headers: { Authorization: `Bearer ${session.accessToken}` }
            });
            setSubmissions(response.data);
            
            // Check if any submission is still pending
            const hasPending = response.data.some((sub: Submission) => sub.status === 'PENDING');
            setPolling(hasPending);
        } catch (error) {
            console.error('Error fetching submissions', error);
        }
    }, [session?.accessToken]);

    useEffect(() => {
        if (params.id) {
            fetchChallenge(params.id as string);
            if (session) {
                fetchSubmissions(params.id as string);
            }
        }
    }, [params.id, session, fetchSubmissions]);

    // Polling for pending submissions
    useEffect(() => {
        if (!polling || !params.id || !session) return;
        
        const interval = setInterval(() => {
            fetchSubmissions(params.id as string);
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, [polling, params.id, session, fetchSubmissions]);

    const fetchChallenge = async (id: string) => {
        try {
            const response = await axios.get(`/api/proxy/challenges/${id}`);
            setChallenge(response.data);
            setCode(response.data.template);
        } catch (error) {
            console.error('Error fetching challenge:', error);
        }
    };

    const handleSubmit = async () => {
        if (!session) {
            toast.error('Please sign in to submit');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`/api/proxy/challenges/${params.id}/submit`,
                { code },
                { headers: { Authorization: `Bearer ${session.accessToken}` } }
            );
            toast.success('Solution submitted!');
            setPolling(true); // Start polling for results
            fetchSubmissions(params.id as string);
        } catch (error) {
            toast.error('Submission failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getVerdictIcon = (verdict: string, status: string) => {
        if (status === 'PENDING') return <Loader2 className="w-4 h-4 animate-spin text-amber-400" />;
        switch (verdict) {
            case 'PASSED': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            case 'FAILED':
            case 'WRONG_ANSWER': return <XCircle className="w-4 h-4 text-red-400" />;
            case 'RUNTIME_ERROR':
            case 'TIME_LIMIT_EXCEEDED': return <AlertCircle className="w-4 h-4 text-orange-400" />;
            default: return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getVerdictStyle = (verdict: string, status: string) => {
        if (status === 'PENDING') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        switch (verdict) {
            case 'PASSED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'FAILED':
            case 'WRONG_ANSWER': return 'text-red-400 bg-red-500/10 border-red-500/20';
            case 'RUNTIME_ERROR':
            case 'TIME_LIMIT_EXCEEDED': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getDifficultyStyle = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case 'easy': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'hard': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    if (!challenge) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-gray-500 text-sm">Loading challenge...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Challenge Info */}
                <div className="space-y-6">
                    {/* Challenge Header */}
                    <div className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <h1 className="text-2xl font-bold text-white">{challenge.title}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyStyle(challenge.difficulty)}`}>
                                {challenge.difficulty}
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{challenge.description}</p>
                    </div>

                    {/* Submission History */}
                    <div className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="w-5 h-5 text-indigo-400" />
                            <h3 className="text-lg font-semibold text-white">Submission History</h3>
                            {polling && (
                                <div className="ml-auto flex items-center gap-2 text-xs text-amber-400">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Processing...
                                </div>
                            )}
                        </div>
                        
                        {submissions.length === 0 ? (
                            <div className="text-center py-8">
                                <FileCode2 className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No submissions yet</p>
                                <p className="text-gray-600 text-xs mt-1">Submit your solution to see results</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {submissions.map(sub => {
                                    const isExpanded = expandedSubmission === sub.id;
                                    const canExpand = sub.status !== 'PENDING' && sub.output;
                                    
                                    return (
                                        <div 
                                            key={sub.id} 
                                            className={`rounded-xl border transition-all ${getVerdictStyle(sub.verdict, sub.status)}`}
                                        >
                                            {/* Submission Header - Clickable */}
                                            <button
                                                onClick={() => canExpand && setExpandedSubmission(isExpanded ? null : sub.id)}
                                                disabled={!canExpand}
                                                className={`w-full p-3 flex items-center justify-between ${canExpand ? 'cursor-pointer hover:bg-white/5' : 'cursor-default'} rounded-xl transition-all`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {getVerdictIcon(sub.verdict, sub.status)}
                                                    <span className="text-sm font-mono text-gray-300">
                                                        {new Date(sub.createdAt).toLocaleTimeString()}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(sub.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">
                                                        {sub.status === 'PENDING' ? 'PENDING' : sub.verdict}
                                                    </span>
                                                    {canExpand && (
                                                        isExpanded ? 
                                                            <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </button>
                                            
                                            {/* Expanded Details */}
                                            {isExpanded && sub.output && (
                                                <div className="px-3 pb-3 space-y-3 border-t border-white/5">
                                                    {/* Result Summary */}
                                                    <div className="mt-3 flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            {sub.verdict === 'PASSED' ? (
                                                                <Zap className="w-4 h-4 text-emerald-400" />
                                                            ) : (
                                                                <Bug className="w-4 h-4 text-red-400" />
                                                            )}
                                                            <span className="text-xs text-gray-400">
                                                                {sub.verdict === 'PASSED' ? 'All tests passed' : 'Tests failed'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Output/Error Details */}
                                                    <div className="rounded-lg bg-black/40 border border-white/5 overflow-hidden">
                                                        <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/5">
                                                            <Terminal className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="text-xs font-medium text-gray-400">
                                                                {sub.verdict === 'PASSED' ? 'Output' : 
                                                                 sub.verdict === 'RUNTIME_ERROR' ? 'Error Details' : 
                                                                 'Test Results'}
                                                            </span>
                                                        </div>
                                                        <pre className="p-3 text-xs font-mono text-gray-300 whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                                                            {sub.output}
                                                        </pre>
                                                    </div>
                                                    
                                                    {/* Verdict Badge */}
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-500">Submission ID: {sub.id.slice(0, 8)}...</span>
                                                        <span className={`px-2 py-1 rounded-md font-medium ${
                                                            sub.verdict === 'PASSED' ? 'bg-emerald-500/20 text-emerald-400' :
                                                            sub.verdict === 'WRONG_ANSWER' ? 'bg-red-500/20 text-red-400' :
                                                            sub.verdict === 'RUNTIME_ERROR' ? 'bg-orange-500/20 text-orange-400' :
                                                            sub.verdict === 'TIME_LIMIT_EXCEEDED' ? 'bg-amber-500/20 text-amber-400' :
                                                            'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                            {sub.verdict?.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Code Editor */}
                <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 overflow-hidden backdrop-blur-xl">
                        {/* Editor Header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                            <Code2 className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-medium text-gray-300">Solution</span>
                            <span className="text-xs text-gray-500 ml-auto">Python</span>
                        </div>
                        
                        {/* Code Editor */}
                        <div className="h-[400px]">
                            <CodeEditor
                                code={code}
                                onChange={(value) => setCode(value || '')}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !session}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Solution
                            </>
                        )}
                    </button>

                    {!session && (
                        <p className="text-center text-sm text-gray-500">
                            Please sign in to submit your solution
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
