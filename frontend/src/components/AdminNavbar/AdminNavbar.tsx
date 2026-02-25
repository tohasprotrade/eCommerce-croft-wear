"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaCrown } from 'react-icons/fa';
import { getStoredAgent, logoutAgent } from '@/services/api';
import styles from './AdminNavbar.module.css';

const AdminNavbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [agent, setAgent] = useState<any>(null);

    useEffect(() => {
        const storedAgent = getStoredAgent();
        setAgent(storedAgent);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const handleLogout = () => {
        logoutAgent();
        if (agent?.role === 'super_agent' || agent?.role === 'super_admin') {
            router.push('/admin/super-admin/login');
        } else {
            router.push('/admin/login');
        }
    };

    const isActive = (path: string) => pathname === path;
    const isSuperAdmin = agent?.role === 'super_agent' || agent?.role === 'super_admin';

    return (
        <nav className={styles.adminNavbar}>
            <Link href="/admin/dashboard" className={styles.logo}>
                {isSuperAdmin && <FaCrown className={styles.crownIcon} />}
                CraftWear Admin
            </Link>

            <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
                <li>
                    <Link
                        href="/"
                        className={styles.navItem}
                        onClick={closeMenu}
                    >
                        Home
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/dashboard"
                        className={`${styles.navItem} ${isActive('/admin/dashboard') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/warehouse"
                        className={`${styles.navItem} ${isActive('/admin/warehouse') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Warehouse
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/accounts"
                        className={`${styles.navItem} ${isActive('/admin/accounts') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Accounts
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/order-requests"
                        className={`${styles.navItem} ${isActive('/admin/order-requests') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Order Requests
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/orders"
                        className={`${styles.navItem} ${isActive('/admin/orders') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Orders
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/products"
                        className={`${styles.navItem} ${isActive('/admin/products') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Products
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/collections"
                        className={`${styles.navItem} ${isActive('/admin/collections') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Collections
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/categories"
                        className={`${styles.navItem} ${isActive('/admin/categories') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Categories
                    </Link>
                </li>

                <li>
                    <Link
                        href="/admin/header"
                        className={`${styles.navItem} ${isActive('/admin/header') ? styles.active : ''}`}
                        onClick={closeMenu}
                    >
                        Header
                    </Link>
                </li>

                {isSuperAdmin && (
                    <li>
                        <Link
                            href="/admin/agents"
                            className={`${styles.navItem} ${isActive('/admin/agents') ? styles.active : ''}`}
                            onClick={closeMenu}
                        >
                            Agents
                        </Link>
                    </li>
                )}

                <li>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Log Out
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
