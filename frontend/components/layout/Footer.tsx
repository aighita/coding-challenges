'use client';
import { motion } from 'framer-motion';
import { Gamepad2, GraduationCap, Code2, Terminal } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative w-full py-8 mt-auto overflow-hidden">
            {/* Cyberpunk Top Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            
            {/* Subtle Ambient Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center justify-center gap-6">
               
               {/* Floating Icons */}
               <div className="flex items-center gap-10">
                   <FooterIcon icon={<Terminal className="w-4 h-4" />} delay={0} color="text-emerald-400" />
                   <FooterIcon icon={<GraduationCap className="w-5 h-5" />} delay={0.2} color="text-purple-400" />
                   <FooterIcon icon={<Gamepad2 className="w-4 h-4" />} delay={0.4} color="text-blue-400" />
               </div>

                {/* Minimalist Tech Text */}
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] select-none"
                >
                    <span>System</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>Online</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                    <span>v1.0.0</span>
                </motion.div>
            </div>
        </footer>
    );
};

const FooterIcon = ({ icon, delay, color }: { icon: React.ReactNode, delay: number, color: string }) => (
    <motion.div
        animate={{ 
            y: [0, -6, 0],
            opacity: [0.3, 0.8, 0.3]
        }}
        transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: delay 
        }}
        className={`${color}`}
        whileHover={{ scale: 1.2, opacity: 1, filter: "brightness(1.5)" }}
    >
        {icon}
    </motion.div>
);

export default Footer;
