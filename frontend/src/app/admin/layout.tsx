"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar/AdminNavbar';
import { getStoredAgent } from '@/services/api';

const PUBLIC_PATHS = ['/admin/login', '/admin/super-admin/login'];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [agent, setAgent] = useState<any>(null);

    useEffect(() => {
        const storedAgent = getStoredAgent();
        setAgent(storedAgent);
        
        if (!storedAgent && !PUBLIC_PATHS.includes(pathname)) {
            router.push('/admin/login');
        } else if (storedAgent && PUBLIC_PATHS.includes(pathname)) {
            router.push('/admin/dashboard');
        } else {
            setLoading(false);
        }
    }, [pathname, router]);

    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: '#f8fafc'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '3px solid #e2e8f0',
                        borderTopColor: '#4F46E5',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px'
                    }} />
                    <style jsx>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (isPublicPath) {
        return <>{children}</>;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <AdminNavbar />
            <div style={{ padding: '2rem' }}>
                {children}
            </div>
        </div>
    );
}
