"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import { getActiveCollections, getCollectionWithProducts } from '@/services/api';
import styles from './Collections.module.css';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    description: string;
}

interface Collection {
    _id: string;
    name: string;
    coverImage: string;
    isActive: boolean;
    products: Product[];
}

export default function Collections() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [collectionLoading, setCollectionLoading] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const data = await getActiveCollections();
            setCollections(data);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCollectionClick = async (collection: Collection) => {
        setCollectionLoading(true);
        try {
            const data = await getCollectionWithProducts(collection._id);
            setSelectedCollection(data);
        } catch (error) {
            console.error('Error fetching collection products:', error);
        } finally {
            setCollectionLoading(false);
        }
    };

    const handleBackToCollections = () => {
        setSelectedCollection(null);
    };

    if (loading) {
        return (
            <main>
                <Navbar />
                <div className={styles.loading}>Loading collections...</div>
            </main>
        );
    }

    if (selectedCollection) {
        return (
            <main>
                <Navbar />
                <section className={styles.container}>
                    <button
                        onClick={handleBackToCollections}
                        className={styles.backBtn}
                    >
                        ← Back to Collections
                    </button>
                    
                    <h1 className={styles.title}>{selectedCollection.name}</h1>
                    <p className={styles.productCount}>
                        {selectedCollection.products?.length || 0} products
                    </p>

                    {collectionLoading ? (
                        <div className={styles.loading}>Loading products...</div>
                    ) : selectedCollection.products && selectedCollection.products.length > 0 ? (
                        <div className={styles.grid}>
                            {selectedCollection.products.map((product) => (
                                <Link 
                                    key={product._id} 
                                    href={`/product/${product.slug}`}
                                    className={styles.productCard}
                                >
                                    <div className={styles.productCardInner}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={styles.productImage}
                                        />
                                        <div className={styles.productInfo}>
                                            <h3 className={styles.productName}>
                                                {product.name}
                                            </h3>
                                            <p className={styles.productPrice}>
                                                ${product.price}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            No products in this collection yet.
                        </div>
                    )}
                </section>
            </main>
        );
    }

    return (
        <main>
            <Navbar />
            <section className={styles.container}>
                <h1 className={styles.title}>Our Collections</h1>
                <p className={styles.subtitle}>Curated selections for every season.</p>

                {collections.length === 0 ? (
                    <div className={styles.emptyCollections}>
                        No collections available at the moment. Check back soon!
                    </div>
                ) : (
                    <div className={styles.collectionsContainer}>
                        {collections.map((collection, i) => (
                            <div 
                                key={collection._id}
                                onClick={() => handleCollectionClick(collection)}
                                className={styles.collectionCard}
                                style={{
                                    backgroundImage: `url(${collection.coverImage})`,
                                }}
                            >
                                <span className={styles.collectionName}>
                                    {collection.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
