"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import styles from './Success.module.css';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.successIcon}>✓</div>
                
                <h1 className={styles.title}>Order Placed Successfully!</h1>
                
                <p className={styles.subtitle}>Thank you for your order</p>
                
                <p className={styles.orderId}>
                    Order ID: <span>{orderId}</span>
                </p>

                <p className={styles.description}>
                    We have received your order and will process it shortly. 
                    You will receive a confirmation message with delivery details.
                </p>

                <div className={styles.buttons}>
                    <Link href="/shop" className={styles.shopBtn}>
                        Continue Shopping
                    </Link>
                    <Link href="/" className={styles.homeBtn}>
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div>
            <Navbar />
            <Suspense fallback={
                <div className={styles.loading}>Loading...</div>
            }>
                <CheckoutSuccessContent />
            </Suspense>
        </div>
    );
}
