'use client';

import Link from 'next/link';
import { 
    Code2, 
    Server, 
    Shield, 
    Database, 
    TestTube, 
    GitBranch, 
    Terminal, 
    ExternalLink,
    CheckCircle2,
    Layers,
    Zap,
    Users,
    FileCode,
    Play,
    Container
} from 'lucide-react';
import { GITHUB_REPO_URL } from '@/lib/mockData';

export default function AboutPage() {
    return (
        <div className="max-w-[1000px] mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-white">About Coding Challenges</h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    A full-stack distributed coding challenge platform built with modern technologies,
                    featuring microservices architecture, secure authentication, and sandboxed code execution.
                </p>
            </div>

            {/* Overview Section */}
            <section className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Layers className="w-6 h-6 text-indigo-400" />
                    Project Overview
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                    This platform allows users to solve coding challenges, submit solutions, and receive instant feedback 
                    through automated test execution. It&apos;s designed as a distributed system with multiple microservices 
                    communicating via a central gateway.
                </p>
                <p className="text-gray-300 leading-relaxed">
                    The project demonstrates modern software engineering practices including containerization with Docker, 
                    orchestration with Docker Swarm, secure authentication with Keycloak, message queuing with RabbitMQ, 
                    and comprehensive testing.
                </p>
            </section>

            {/* Architecture Section */}
            <section className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Server className="w-6 h-6 text-indigo-400" />
                    Architecture
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: Code2, name: 'Frontend', desc: 'Next.js 16 with React, TypeScript, Tailwind CSS' },
                        { icon: Zap, name: 'Gateway', desc: 'FastAPI gateway routing requests to microservices' },
                        { icon: FileCode, name: 'Challenges Service', desc: 'FastAPI service managing coding challenges' },
                        { icon: Users, name: 'Users Service', desc: 'FastAPI service for user management' },
                        { icon: Play, name: 'Sandbox Runner', desc: 'Isolated Python code execution worker' },
                        { icon: Shield, name: 'Keycloak', desc: 'Identity and access management (OAuth2/OIDC)' },
                        { icon: Database, name: 'PostgreSQL', desc: 'Persistent data storage for services' },
                        { icon: Container, name: 'RabbitMQ', desc: 'Message broker for async code execution' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="p-2 rounded-lg bg-indigo-500/10">
                                <item.icon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">{item.name}</h3>
                                <p className="text-sm text-gray-400">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                        'User authentication with Keycloak (OAuth2/OIDC)',
                        'Role-based access control (Student, Editor, Admin)',
                        'Browse and solve coding challenges',
                        'Real-time code editor with syntax highlighting',
                        'Sandboxed code execution with resource limits',
                        'Automated test case validation',
                        'Submission history with detailed results',
                        'Challenge creation for editors',
                        'User management for admins',
                        'Demo mode for offline deployment',
                        'Responsive design for all devices',
                        'Docker Swarm deployment ready',
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-gray-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testing Section */}
            <section className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <TestTube className="w-6 h-6 text-amber-400" />
                    Testing
                </h2>
                <p className="text-gray-300 mb-4">
                    The project includes comprehensive test suites for both frontend and backend services:
                </p>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h3 className="font-semibold text-white mb-2">Frontend Tests (Jest)</h3>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• Component unit tests for UI elements</li>
                            <li>• Page integration tests</li>
                            <li>• Run with: <code className="px-2 py-0.5 bg-white/10 rounded text-indigo-300">npm test</code></li>
                        </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <h3 className="font-semibold text-white mb-2">Backend Tests (Pytest)</h3>
                        <ul className="text-sm text-gray-400 space-y-1">
                            <li>• API endpoint tests for Gateway, Challenges, Users services</li>
                            <li>• Sandbox runner logic tests</li>
                            <li>• Model and schema validation tests</li>
                            <li>• Run all: <code className="px-2 py-0.5 bg-white/10 rounded text-indigo-300">./run-tests.sh</code></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Local Deployment Section */}
            <section className="rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Terminal className="w-6 h-6 text-cyan-400" />
                    Local Deployment
                </h2>
                <p className="text-gray-300 mb-6">
                    Follow these steps to run the project locally using Docker Swarm:
                </p>
                
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">1. Prerequisites</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Docker & Docker Compose installed</li>
                            <li>• Docker Swarm initialized (<code className="px-2 py-0.5 bg-white/10 rounded text-cyan-300">docker swarm init</code>)</li>
                            <li>• Node.js 18+ (for frontend development)</li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">2. Clone the repository</h3>
                        <pre className="text-sm text-cyan-300 overflow-x-auto">
{`git clone https://github.com/aighita/coding-challenges.git
cd coding-challenges`}
                        </pre>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">3. Deploy with Docker Swarm</h3>
                        <pre className="text-sm text-cyan-300 overflow-x-auto">
{`# Deploy the stack
./deploy.sh

# Or manually:
docker stack deploy -c docker-swarm-stack.yml coding-challenges`}
                        </pre>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">4. Access the services</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Frontend: <code className="px-2 py-0.5 bg-white/10 rounded text-cyan-300">http://localhost:3000</code></li>
                            <li>• Gateway API: <code className="px-2 py-0.5 bg-white/10 rounded text-cyan-300">http://localhost:8080</code></li>
                            <li>• Keycloak: <code className="px-2 py-0.5 bg-white/10 rounded text-cyan-300">http://localhost:8081</code></li>
                            <li>• RabbitMQ Management: <code className="px-2 py-0.5 bg-white/10 rounded text-cyan-300">http://localhost:15672</code></li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">5. Seed sample data (optional)</h3>
                        <pre className="text-sm text-cyan-300 overflow-x-auto">
{`cd fixtures
./run_fixtures.sh`}
                        </pre>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0d1117] border border-white/10">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">6. Cleanup</h3>
                        <pre className="text-sm text-cyan-300 overflow-x-auto">
{`./cleanup.sh`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* Demo Mode Section */}
            <section className="rounded-2xl bg-gradient-to-b from-amber-500/10 to-amber-500/5 border border-amber-500/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Zap className="w-6 h-6 text-amber-400" />
                    Demo Mode
                </h2>
                <p className="text-gray-300 mb-4">
                    When backend services are offline (like on this Vercel deployment), the app automatically 
                    switches to demo mode with mock data. You can log in with these demo accounts:
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-2 text-gray-400 font-medium">Username</th>
                                <th className="text-left py-2 text-gray-400 font-medium">Password</th>
                                <th className="text-left py-2 text-gray-400 font-medium">Role</th>
                                <th className="text-left py-2 text-gray-400 font-medium">Access</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-300">
                            <tr className="border-b border-white/5">
                                <td className="py-2"><code className="text-emerald-400">student</code></td>
                                <td className="py-2"><code className="text-gray-400">demo</code></td>
                                <td className="py-2">Student</td>
                                <td className="py-2">Challenges only</td>
                            </tr>
                            <tr className="border-b border-white/5">
                                <td className="py-2"><code className="text-amber-400">editor</code></td>
                                <td className="py-2"><code className="text-gray-400">demo</code></td>
                                <td className="py-2">Editor</td>
                                <td className="py-2">Challenges + Editor page</td>
                            </tr>
                            <tr>
                                <td className="py-2"><code className="text-red-400">admin</code></td>
                                <td className="py-2"><code className="text-gray-400">demo</code></td>
                                <td className="py-2">Admin</td>
                                <td className="py-2">Full access</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* GitHub Link */}
            <section className="text-center">
                <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
                >
                    <GitBranch className="w-5 h-5" />
                    View on GitHub
                    <ExternalLink className="w-4 h-4" />
                </a>
            </section>
        </div>
    );
}
