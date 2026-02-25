"use client";

import Navbar from '@/components/Navbar/Navbar';
import { getProducts } from '@/services/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './Shop.module.css';

export default function Shop() {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        getProducts().then(setProducts).catch(console.error);
    }, []);

    return (
        <main>
            <Navbar />
            <section className={styles.container}>
                <h1 className={styles.title}>Shop All</h1>
                <p className={styles.subtitle}>Browse our complete catalog of premium wear.</p>
                <div className={styles.grid}>
                    {products.map((product) => (
                        <Link
                            key={product._id}
                            href={`/product/${product.slug}`}
                            className={styles.card}
                        >
                            <div className={styles.imageWrapper}>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.productName}>
                                    {product.name}
                                </h3>
                                <p className={styles.category}>{product.category}</p>
                                <p className={styles.price}>
                                    ${product.price}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
