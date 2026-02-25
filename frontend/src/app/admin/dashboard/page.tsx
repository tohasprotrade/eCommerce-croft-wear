"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getStoredAgent, logoutAgent, getAllAgents, getWarehouseItems, getMonthlyReport } from '@/services/api';
import styles from './Dashboard.module.css';

interface Agent {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface Stats {
    totalAgents: number;
    totalProducts: number;
    totalSales: number;
    totalProfit: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [agent, setAgent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        totalAgents: 0,
        totalProducts: 0,
        totalSales: 0,
        totalProfit: 0
    });

    useEffect(() => {
        const storedAgent = getStoredAgent();
        if (!storedAgent) {
            router.push('/admin/login');
            return;
        }
        setAgent(storedAgent);
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const isSuperAdmin = agent?.role === 'super_agent' || agent?.role === 'super_admin';
            
            let agentsData = [];
            if (isSuperAdmin) {
                try {
                    agentsData = await getAllAgents();
                } catch (e) {
                    console.log('Not authorized to view agents');
                }
            }

            const productsData = await getWarehouseItems({ limit: 1000 });

            const currentMonth = new Date().toISOString().slice(0, 7);
            let reportData = null;
            try {
                reportData = await getMonthlyReport(currentMonth);
            } catch (e) {
                console.log('No report data');
            }

            setStats({
                totalAgents: agentsData.length,
                totalProducts: productsData.total || 0,
                totalSales: reportData?.summary?.totalSales || 0,
                totalProfit: reportData?.summary?.totalProfit || 0
            });
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutAgent();
        router.push('/admin/login');
    };

    const isSuperAdmin = agent?.role === 'super_agent' || agent?.role === 'super_admin';

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.title}>{isSuperAdmin ? 'Super Admin' : 'Admin'} Dashboard</h1>
                    <span className={styles.welcome}>Welcome, {agent?.name}</span>
                </div>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    Logout
                </button>
            </header>

            <div className={styles.statsGrid}>
                {isSuperAdmin && (
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <p>Total Agents</p>
                        <h3>{stats.totalAgents}</h3>
                    </div>
                </div>
                )}

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                            <line x1="12" y1="22.08" x2="12" y2="12"/>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <p>Total Products</p>
                        <h3>{stats.totalProducts}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <p>Total Sales (This Month)</p>
                        <h3>Tk {stats.totalSales.toLocaleString()}</h3>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fce7f3', color: '#db2777' }}>
                        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                            <polyline points="17 6 23 6 23 12"/>
                        </svg>
                    </div>
                    <div className={styles.statContent}>
                        <p>Total Profit (This Month)</p>
                        <h3 className={styles.profit}>Tk {stats.totalProfit.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className={styles.quickActions}>
                <h2>Quick Actions</h2>
                <div className={styles.actionsGrid}>
                    {isSuperAdmin && (
                    <Link href="/admin/agents" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="8.5" cy="7" r="4"/>
                                <line x1="20" y1="8" x2="20" y2="14"/>
                                <line x1="23" y1="11" x2="17" y2="11"/>
                            </svg>
                        </div>
                        <span>Manage Agents</span>
                    </Link>
                    )}

                    <Link href="/admin/warehouse" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                            </svg>
                        </div>
                        <span>Warehouse</span>
                    </Link>

                    <Link href="/admin/accounts" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                <line x1="1" y1="10" x2="23" y2="10"/>
                            </svg>
                        </div>
                        <span>Accounts</span>
                    </Link>

                    <Link href="/admin/orders" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <path d="M16 10a4 4 0 0 1-8 0"/>
                            </svg>
                        </div>
                        <span>Orders</span>
                    </Link>

                    <Link href="/admin/products" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                            </svg>
                        </div>
                        <span>Products</span>
                    </Link>

                    <Link href="/admin/collections" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                                <polyline points="2 17 12 22 22 17"/>
                                <polyline points="2 12 12 17 22 12"/>
                            </svg>
                        </div>
                        <span>Collections</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
