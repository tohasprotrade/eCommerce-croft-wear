"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAgents, createAgent, deleteAgent, updateAgent, getStoredAgent, logoutAgent } from '@/services/api';
import styles from './Agents.module.css';

interface Agent {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export default function AgentsPage() {
    const router = useRouter();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'agent'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentAgent, setCurrentAgent] = useState<any>(null);

    useEffect(() => {
        const agent = getStoredAgent();
        if (!agent) {
            router.push('/admin/super-admin/login');
            return;
        }
        if (agent.role !== 'super_agent' && agent.role !== 'super_admin') {
            router.push('/admin/warehouse');
            return;
        }
        setCurrentAgent(agent);
        fetchAgents();
    }, [router]);

    const fetchAgents = async () => {
        try {
            const data = await getAllAgents();
            setAgents(data);
        } catch (err) {
            console.error('Failed to fetch agents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await createAgent(formData);
            setSuccess('Agent created successfully!');
            setFormData({ name: '', email: '', password: '', role: 'agent' });
            setShowForm(false);
            fetchAgents();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create agent');
        }
    };

    const handleToggleActive = async (agent: Agent) => {
        try {
            await updateAgent(agent._id, { isActive: !agent.isActive });
            fetchAgents();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update agent');
        }
    };

    const handleDelete = async (agentId: string) => {
        if (!confirm('Are you sure you want to delete this agent?')) return;
        
        try {
            await deleteAgent(agentId);
            fetchAgents();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete agent');
        }
    };

    const handleLogout = () => {
        logoutAgent();
        router.push('/admin/super-admin/login');
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Agent Management</h1>
                <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
            </header>

            {currentAgent?.role === 'super_agent' && (
                <div className={styles.actions}>
                    <button 
                        onClick={() => setShowForm(!showForm)} 
                        className={styles.addBtn}
                    >
                        {showForm ? 'Cancel' : '+ Add New Agent'}
                    </button>
                </div>
            )}

            {showForm && (
                <div className={styles.formCard}>
                    <h2>Create New Agent</h2>
                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}
                    
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="Agent name"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={styles.select}
                                >
                                    <option value="agent">Agent</option>
                                    <option value="super_agent">Super Agent</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="agent@example.com"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={styles.input}
                                placeholder="Password"
                            />
                        </div>
                        <button type="submit" className={styles.submitBtn}>
                            Create Agent
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.tableCard}>
                <h2>All Agents ({agents.length})</h2>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map(agent => (
                                <tr key={agent._id}>
                                    <td>{agent.name}</td>
                                    <td>{agent.email}</td>
                                    <td>
                                        <span className={`${styles.badge} ${agent.role === 'super_agent' ? styles.superAgent : styles.agent}`}>
                                            {agent.role === 'super_agent' ? 'Super Agent' : 'Agent'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.status} ${agent.isActive ? styles.active : styles.inactive}`}>
                                            {agent.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.actionsCell}>
                                            <button 
                                                onClick={() => handleToggleActive(agent)}
                                                className={agent.isActive ? styles.deactivateBtn : styles.activateBtn}
                                            >
                                                {agent.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            {agent.role !== 'super_agent' && (
                                                <button 
                                                    onClick={() => handleDelete(agent._id)}
                                                    className={styles.deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {agents.length === 0 && (
                                <tr>
                                    <td colSpan={6} className={styles.noData}>No agents found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
