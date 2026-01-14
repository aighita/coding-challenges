'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ServiceStatusContextType {
    isOnline: boolean;
    isChecking: boolean;
    checkStatus: () => Promise<boolean>;
    lastChecked: Date | null;
}

const ServiceStatusContext = createContext<ServiceStatusContextType>({
    isOnline: true,
    isChecking: true,
    checkStatus: async () => true,
    lastChecked: null
});

export function useServiceStatus() {
    return useContext(ServiceStatusContext);
}

interface ServiceStatusProviderProps {
    children: ReactNode;
}

export function ServiceStatusProvider({ children }: ServiceStatusProviderProps) {
    const [isOnline, setIsOnline] = useState(true);
    const [isChecking, setIsChecking] = useState(true);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);

    const checkStatus = useCallback(async (): Promise<boolean> => {
        setIsChecking(true);
        try {
            // Try to reach the gateway health endpoint or challenges endpoint
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch('/api/proxy/challenges', {
                method: 'GET',
                signal: controller.signal,
                cache: 'no-store'
            });
            
            clearTimeout(timeoutId);
            
            const online = response.ok;
            setIsOnline(online);
            setLastChecked(new Date());
            return online;
        } catch (error) {
            console.log('Services appear to be offline:', error);
            setIsOnline(false);
            setLastChecked(new Date());
            return false;
        } finally {
            setIsChecking(false);
        }
    }, []);

    useEffect(() => {
        // Check status on mount
        checkStatus();

        // Optionally re-check periodically (every 30 seconds)
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, [checkStatus]);

    return (
        <ServiceStatusContext.Provider value={{ isOnline, isChecking, checkStatus, lastChecked }}>
            {children}
        </ServiceStatusContext.Provider>
    );
}
