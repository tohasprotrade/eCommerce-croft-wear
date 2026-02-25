"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredAgent } from '@/services/api';

export default function AdminIndex() {
    const router = useRouter();

    useEffect(() => {
        const agent = getStoredAgent();
        if (!agent) {
            router.push('/admin/login');
        } else if (agent.role === 'super_agent' || agent.role === 'super_admin') {
            router.push('/admin/dashboard');
        } else {
            router.push('/admin/warehouse');
        }
    }, [router]);

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
                <p style={{ color: '#64748b' }}>Redirecting...</p>
            </div>
        </div>
    );
}
