"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginAgent, getStoredAgent } from '@/services/api';
import styles from './Login.module.css';

export default function AdminLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const agent = getStoredAgent();
        if (agent) {
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
            if (agent.role === 'super_agent' || agent.role === 'super_admin') {
                router.push('/admin/dashboard');
            } else {
                router.push('/admin/warehouse');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.logoIcon}>
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <path fill="#4F46E5" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <h1 className={styles.title}>Agent Login</h1>
                <p className={styles.subtitle}>CraftWear Management</p>

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
                            placeholder="agent@craftwear.com"
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
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className={styles.links}>
                    <a href="/admin/super-admin/login" className={styles.link}>Super Admin?</a>
                    <span className={styles.separator}>|</span>
                    <a href="/" className={styles.link}>Back to Home</a>
                </div>
            </div>
        </div>
    );
}
