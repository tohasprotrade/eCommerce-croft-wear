"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMonthlyReport, getAllMonths, getTransactions, getStoredAgent, logoutAgent } from '@/services/api';
import styles from './Accounts.module.css';

interface MonthlyReport {
    month: string;
    sales: any[];
    purchases: any[];
    summary: {
        totalSales: number;
        totalSalesQuantity: number;
        totalProfit: number;
        totalPurchases: number;
        totalPurchaseQuantity: number;
    };
}

interface Transaction {
    _id: string;
    productName: string;
    type: string;
    quantity: number;
    amount: number;
    profit: number;
    size: string;
    orderId: string;
    date: string;
}

export default function AccountsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentAgent, setCurrentAgent] = useState<any>(null);
    const [months, setMonths] = useState<string[]>([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [report, setReport] = useState<MonthlyReport | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [showTransactions, setShowTransactions] = useState(false);

    useEffect(() => {
        const agent = getStoredAgent();
        if (!agent) {
            router.push('/admin/login');
            return;
        }
        setCurrentAgent(agent);
        fetchData();
    }, [router]);

    const handleLogout = () => {
        logoutAgent();
        if (currentAgent?.role === 'super_agent' || currentAgent?.role === 'super_admin') {
            router.push('/admin/super-admin/login');
        } else {
            router.push('/admin/login');
        }
    };

    const fetchData = async () => {
        try {
            const monthsData = await getAllMonths();
            setMonths(monthsData);
            
            if (monthsData.length > 0) {
                const currentMonth = monthsData[0];
                setSelectedMonth(currentMonth);
                await fetchReport(currentMonth);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReport = async (month: string) => {
        try {
            const data = await getMonthlyReport(month);
            setReport(data);
        } catch (err) {
            console.error('Failed to fetch report:', err);
        }
    };

    const fetchTransactions = async () => {
        try {
            const data = await getTransactions({ month: selectedMonth, limit: 100 });
            setTransactions(data.items);
            setShowTransactions(true);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        }
    };

    const handleMonthChange = async (month: string) => {
        setSelectedMonth(month);
        setShowTransactions(false);
        await fetchReport(month);
    };

    const formatMonth = (monthStr: string) => {
        const [year, month] = monthStr.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const formatCurrency = (amount: number) => {
        return 'Tk ' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Accounts & Reports</h1>
                <div className={styles.headerActions}>
                    <span className={styles.welcome}>Welcome, {currentAgent?.name}</span>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <div className={styles.controls}>
                <div className={styles.monthSelector}>
                    <label>Select Month:</label>
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => handleMonthChange(e.target.value)}
                        className={styles.select}
                    >
                        {months.map(month => (
                            <option key={month} value={month}>{formatMonth(month)}</option>
                        ))}
                    </select>
                </div>
                <button onClick={fetchTransactions} className={styles.viewBtn}>
                    View All Transactions
                </button>
            </div>

            {report && (
                <>
                    <div className={styles.summaryCards}>
                        <div className={styles.card}>
                            <div className={styles.cardIcon} style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                                <span>Tk</span>
                            </div>
                            <div className={styles.cardContent}>
                                <p>Total Sales</p>
                                <h3>{formatCurrency(report.summary.totalSales)}</h3>
                                <span className={styles.cardMeta}>{report.summary.totalSalesQuantity} items sold</span>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                                <span>Tk</span>
                            </div>
                            <div className={styles.cardContent}>
                                <p>Total Profit</p>
                                <h3 className={styles.profit}>{formatCurrency(report.summary.totalProfit)}</h3>
                                <span className={styles.cardMeta}>Net profit this month</span>
                            </div>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.cardIcon} style={{ background: '#fee2e2', color: '#dc2626' }}>
                                <span>Tk</span>
                            </div>
                            <div className={styles.cardContent}>
                                <p>Total Purchases</p>
                                <h3>{formatCurrency(report.summary.totalPurchases)}</h3>
                                <span className={styles.cardMeta}>{report.summary.totalPurchaseQuantity} items purchased</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2>Sales by Product</h2>
                        {report.sales.length > 0 ? (
                            <div className={styles.tableCard}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity Sold</th>
                                            <th>Total Amount</th>
                                            <th>Total Profit</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.sales.map((sale: any, index: number) => (
                                            <tr key={index}>
                                                <td>{sale._id.productName}</td>
                                                <td>{sale.totalQuantity}</td>
                                                <td>{formatCurrency(sale.totalAmount)}</td>
                                                <td className={styles.profitCell}>{formatCurrency(sale.totalProfit)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className={styles.noData}>No sales this month</div>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h2>Purchases by Product</h2>
                        {report.purchases.length > 0 ? (
                            <div className={styles.tableCard}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity Purchased</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {report.purchases.map((purchase: any, index: number) => (
                                            <tr key={index}>
                                                <td>{purchase._id.productName}</td>
                                                <td>{purchase.totalQuantity}</td>
                                                <td>{formatCurrency(purchase.totalAmount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className={styles.noData}>No purchases this month</div>
                        )}
                    </div>
                </>
            )}

            {showTransactions && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>All Transactions - {formatMonth(selectedMonth)}</h2>
                            <button onClick={() => setShowTransactions(false)} className={styles.closeBtn}>×</button>
                        </div>
                        <div className={styles.tableCard}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Product</th>
                                        <th>Type</th>
                                        <th>Size</th>
                                        <th>Qty</th>
                                        <th>Amount</th>
                                        <th>Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => (
                                        <tr key={tx._id}>
                                            <td>{new Date(tx.date).toLocaleDateString()}</td>
                                            <td>{tx.productName}</td>
                                            <td>
                                                <span className={`${styles.typeTag} ${styles[tx.type]}`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td>{tx.size || '-'}</td>
                                            <td>{tx.quantity}</td>
                                            <td>{formatCurrency(tx.amount)}</td>
                                            <td className={tx.profit > 0 ? styles.profitCell : ''}>
                                                {tx.type === 'sale' ? formatCurrency(tx.profit) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className={styles.noData}>No transactions</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {months.length === 0 && (
                <div className={styles.emptyState}>
                    <p>No transaction data available yet.</p>
                    <p>Transactions will appear once sales are made.</p>
                </div>
            )}
        </div>
    );
}
