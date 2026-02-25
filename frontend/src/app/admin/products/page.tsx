"use client";

import { useEffect, useState } from 'react';
import { getWarehouseItems, deleteWarehouseItem, getStoredAgent } from '@/services/api';
import { useRouter } from 'next/navigation';
import styles from './ProductDatabase.module.css';

export default function ProductDatabase() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const agent = getStoredAgent();
        if (!agent) {
            router.push('/admin/login');
            return;
        }
        
        const fetchProducts = async () => {
            try {
                const data = await getWarehouseItems({ limit: 1000 });
                setProducts(data.items || []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [router]);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this product from warehouse?')) {
            try {
                await deleteWarehouseItem(id);
                setProducts(products.filter(p => p._id !== id));
                alert('Product deleted from warehouse');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    const handleEdit = (id: string) => {
        router.push(`/admin/products/edit/${id}`);
    };

    const getTotalStock = (sizes: Record<string, number>) => {
        if (!sizes) return 0;
        return Object.values(sizes).reduce((sum: number, qty) => sum + (qty || 0), 0);
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Product Database</h1>
                <div className={styles.count}>Total Products: {products.length}</div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Purchase</th>
                            <th>Selling</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    {product.image ? (
                                        <img src={product.image} alt={product.productName} className={styles.image} />
                                    ) : (
                                        <div className={styles.noImage}>No Image</div>
                                    )}
                                </td>
                                <td className={styles.productName}>{product.productName}</td>
                                <td>{product.category || '-'}</td>
                                <td className={styles.productPrice}>Tk {product.purchasePrice || 0}</td>
                                <td className={styles.productPrice}>Tk {product.sellingPrice || 0}</td>
                                <td>{getTotalStock(product.sizes)}</td>
                                <td>
                                    <span className={`${styles.badge} ${product.isPublic ? styles.public : styles.private}`}>
                                        {product.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <button
                                            onClick={() => handleEdit(product._id)}
                                            className={styles.editBtn}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className={styles.deleteBtn}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className={styles.emptyState}>
                        No products found in warehouse. Go to Warehouse to add products.
                    </div>
                )}
            </div>
        </div>
    );
}
