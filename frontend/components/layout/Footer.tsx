const Footer = () => {
    return (
        <footer className="relative w-full py-6 mt-auto bg-[#020202] border-t border-white/5">
            <div className="relative z-10 flex flex-col items-center justify-center gap-3">
                {/* Minimalist Text */}
                <div className="flex items-center gap-3 text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em] select-none">
                    <span>Distributed Systems</span>
                    <span className="w-1 h-1 rounded-full bg-indigo-500/50"></span>
                    <span>University Project</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
