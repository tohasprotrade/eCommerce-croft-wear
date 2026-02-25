"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaShoppingBag, FaUser } from 'react-icons/fa';
import { useCartStore } from '@/services/cart';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const { data: session, status } = useSession();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                CraftWear
            </Link>

            <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu">
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
                <li>
                    <Link href="/" className={styles.navItem} onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/shop" className={styles.navItem} onClick={() => setIsOpen(false)}>
                        Shop
                    </Link>
                </li>
                <li>
                    <Link href="/collections" className={styles.navItem} onClick={() => setIsOpen(false)}>
                        Collections
                    </Link>
                </li>
                <li>
                    <Link href="/about" className={styles.navItem} onClick={() => setIsOpen(false)}>
                        About
                    </Link>
                </li>
                <li>
                    {status === 'loading' ? (
                        <span className={styles.navItem} style={{ cursor: 'default' }}>Loading...</span>
                    ) : session ? (
                        <div className={styles.userMenu}>
                            <span className={styles.navItem} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FaUser /> {session.user?.name || session.user?.email?.split('@')[0]}
                            </span>
                            <div className={styles.dropdown}>
                                <button onClick={handleSignOut} className={styles.dropdownItem}>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth/signin" className={styles.navItem} onClick={() => setIsOpen(false)}>
                            Login
                        </Link>
                    )}
                </li>
                <li>
                    <Link href="/cart" className={styles.navItem} onClick={() => setIsOpen(false)} style={{ position: 'relative' }}>
                        <FaShoppingBag />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: '#000',
                                color: '#fff',
                                fontSize: '0.7rem',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
