import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Code2, Database, ShieldCheck, Terminal, Server, Users, ArrowRight, ArrowDown, Lock, Layers, MessageSquare, CheckCircle } from 'lucide-react';
import ColorBends from '@/components/ColorBends';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#020202] text-foreground overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Background Effect */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <ColorBends
          colors={["#4f46e5", "#7c3aed", "#06b6d4"]}
          rotation={20}
          speed={0.2}
          scale={0.4}
          frequency={1.2}
          warpStrength={0.8}
          mouseInfluence={0.3}
          parallax={0.4}
          noise={0.05}
          transparent
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202]/90 via-[#020202]/70 to-[#020202]/95" />
      </div>

      {/* Header Section */}
      <section className="relative z-10 pt-60 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-4xl font-bold tracking-tight mb-6 text-white leading-tight">
            Distributed Coding Challenge Platform
          </h1>
          
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto mb-6">
            A microservices-based architecture for executing and evaluating code submissions 
            in isolated sandbox environments. Built with Docker Swarm for orchestration and scalability.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-gray-400">Distributed Systems Project</span>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="relative z-10 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">System Architecture</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              The platform consists of multiple microservices communicating through an API Gateway, 
              with RabbitMQ handling asynchronous task distribution.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="relative">
            {/* Flow Arrows for Desktop */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* User to Gateway */}
                <path d="M 200,120 L 200,180" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="2" strokeDasharray="6 4" />
                {/* Gateway to Services */}
                <path d="M 140,280 L 80,340" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="2" strokeDasharray="6 4" />
                <path d="M 200,280 L 200,340" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="2" strokeDasharray="6 4" />
                <path d="M 260,280 L 320,340" fill="none" stroke="rgba(99,102,241,0.3)" strokeWidth="2" strokeDasharray="6 4" />
              </svg>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column - Client & Gateway */}
              <div className="lg:col-span-1 space-y-6">
                {/* Frontend Client */}
                <Card className="bg-[#0c0c0e] border-white/10 p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Frontend Client</h3>
                      <p className="text-xs text-gray-500">Next.js Application</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    React-based web interface where users browse challenges, write code in the integrated editor, 
                    and submit solutions for evaluation.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">Next.js 14</span>
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">TypeScript</span>
                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">TailwindCSS</span>
                  </div>
                </Card>

                <div className="flex justify-center lg:hidden">
                  <ArrowDown className="w-6 h-6 text-indigo-400/50" />
                </div>

                {/* API Gateway */}
                <Card className="bg-[#0c0c0e] border-indigo-500/30 p-6 ring-1 ring-indigo-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                      <Server className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">API Gateway</h3>
                      <p className="text-xs text-gray-500">FastAPI Service</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Central entry point that routes incoming requests to appropriate microservices. 
                    Handles authentication validation and request forwarding.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-indigo-400" />
                      <span>Request routing & load balancing</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-indigo-400" />
                      <span>JWT token validation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3 h-3 text-indigo-400" />
                      <span>Service discovery</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Center Column - Microservices */}
              <div className="lg:col-span-1 space-y-6">
                <div className="text-center mb-4 lg:hidden">
                  <ArrowDown className="w-6 h-6 text-indigo-400/50 mx-auto" />
                </div>
                
                <h4 className="text-xs uppercase tracking-wider text-gray-500 text-center font-semibold mb-4">
                  Microservices Layer
                </h4>

                {/* Users Service */}
                <Card className="bg-[#0c0c0e] border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Users Service</h3>
                      <p className="text-xs text-gray-500">User management & profiles</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Manages user data, profiles, and submission history. Stores data in PostgreSQL.
                  </p>
                </Card>

                {/* Challenges Service */}
                <Card className="bg-[#0c0c0e] border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-amber-500/10">
                      <Code2 className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Challenges Service</h3>
                      <p className="text-xs text-gray-500">Problem repository</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Stores and serves coding challenges with test cases, descriptions, and metadata.
                  </p>
                </Card>

                {/* Auth Service */}
                <Card className="bg-[#0c0c0e] border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <Lock className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Auth Service</h3>
                      <p className="text-xs text-gray-500">Keycloak Identity Provider</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Handles authentication via OAuth 2.0 / OpenID Connect. Issues and validates JWT tokens.
                  </p>
                </Card>
              </div>

              {/* Right Column - Execution Pipeline */}
              <div className="lg:col-span-1 space-y-6">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 text-center font-semibold mb-4">
                  Execution Pipeline
                </h4>

                {/* Message Queue */}
                <Card className="bg-[#0c0c0e] border-orange-500/30 p-5 ring-1 ring-orange-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <MessageSquare className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">RabbitMQ</h3>
                      <p className="text-xs text-gray-500">Message Broker</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Distributes code execution tasks to available sandbox workers using task queues for async processing.
                  </p>
                </Card>

                <div className="flex justify-center">
                  <ArrowDown className="w-5 h-5 text-orange-400/50" />
                </div>

                {/* Sandbox Runner */}
                <Card className="bg-[#0c0c0e] border-emerald-500/30 p-6 ring-1 ring-emerald-500/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Terminal className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Sandbox Runner</h3>
                      <p className="text-xs text-gray-500">Isolated Execution Environment</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">
                    Worker processes that execute user code in isolated Docker containers with resource limits and security constraints.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Container isolation</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>CPU & memory limits</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Execution timeout</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="relative z-10 py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Code Submission Workflow</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Step-by-step flow of how a code submission is processed through the system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white z-10">
                1
              </div>
              <Card className="bg-[#0c0c0e] border-white/10 p-5 h-full">
                <h3 className="font-semibold text-white mb-2 mt-2">Submit Code</h3>
                <p className="text-sm text-gray-400">
                  User writes solution in the web-based code editor and submits for evaluation.
                </p>
              </Card>
              <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-white/20" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white z-10">
                2
              </div>
              <Card className="bg-[#0c0c0e] border-white/10 p-5 h-full">
                <h3 className="font-semibold text-white mb-2 mt-2">Gateway Routes</h3>
                <p className="text-sm text-gray-400">
                  API Gateway validates the request and publishes a task to the RabbitMQ queue.
                </p>
              </Card>
              <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-white/20" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white z-10">
                3
              </div>
              <Card className="bg-[#0c0c0e] border-white/10 p-5 h-full">
                <h3 className="font-semibold text-white mb-2 mt-2">Sandbox Executes</h3>
                <p className="text-sm text-gray-400">
                  A worker picks up the task and runs the code in an isolated container against test cases.
                </p>
              </Card>
              <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2">
                <ArrowRight className="w-6 h-6 text-white/20" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-sm font-bold text-white z-10">
                4
              </div>
              <Card className="bg-[#0c0c0e] border-white/10 p-5 h-full">
                <h3 className="font-semibold text-white mb-2 mt-2">Results Returned</h3>
                <p className="text-sm text-gray-400">
                  Execution results are stored and returned to the user with pass/fail status.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="relative z-10 py-16 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Technology Stack</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Docker Swarm', desc: 'Orchestration' },
              { name: 'FastAPI', desc: 'Backend APIs' },
              { name: 'Next.js', desc: 'Frontend' },
              { name: 'PostgreSQL', desc: 'Database' },
              { name: 'RabbitMQ', desc: 'Message Queue' },
              { name: 'Keycloak', desc: 'Auth Provider' },
              { name: 'Python', desc: 'Services' },
              { name: 'TypeScript', desc: 'Frontend' },
            ].map((tech) => (
              <div key={tech.name} className="bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-colors">
                <div className="font-medium text-white text-sm">{tech.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

