'use client';

import { SessionProvider } from "next-auth/react";
import { ServiceStatusProvider } from "@/lib/serviceStatus";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ServiceStatusProvider>
                {children}
            </ServiceStatusProvider>
        </SessionProvider>
    );
}
