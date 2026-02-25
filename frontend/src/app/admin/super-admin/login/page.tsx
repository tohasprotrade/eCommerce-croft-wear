"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAgent, getStoredAgent } from '@/services/api';
import styles from './SuperAdminLogin.module.css';

export default function SuperAdminLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const agent = getStoredAgent();
        if (agent && agent.role === 'super_agent') {
            router.push('/admin/dashboard');
        } else if (agent) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const agent = await loginAgent(formData);
            if (agent.role !== 'super_agent') {
                setError('Access denied. Super admin only.');
                localStorage.removeItem('agentToken');
                localStorage.removeItem('agentInfo');
                setLoading(false);
                return;
            }
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.crownIcon}>
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path fill="#D97706" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                    </svg>
                </div>
                <h1 className={styles.title}>Super Admin</h1>
                <p className={styles.subtitle}>CraftWear Owner Access</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="superadmin@craftwear.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Login as Super Admin'}
                    </button>
                </form>

                <div className={styles.links}>
                    <a href="/admin/login" className={styles.link}>Login as Agent</a>
                    <span className={styles.separator}>|</span>
                    <a href="/" className={styles.link}>Back to Home</a>
                </div>
            </div>
        </div>
    );
}
