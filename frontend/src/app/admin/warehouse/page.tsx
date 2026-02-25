"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    getWarehouseItems, 
    createWarehouseItem, 
    updateWarehouseItem, 
    deleteWarehouseItem,
    togglePublicStatus,
    uploadImage,
    getStoredAgent,
    logoutAgent
} from '@/services/api';
import styles from './Warehouse.module.css';

interface WarehouseItem {
    _id: string;
    productName: string;
    description: string;
    category: string;
    image: string;
    sizes: { [key: string]: number };
    purchasePrice: number;
    sellingPrice: number;
    isPublic: boolean;
    totalQuantity: number;
    createdAt: string;
}

const DEFAULT_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

export default function WarehousePage() {
    const router = useRouter();
    const [items, setItems] = useState<WarehouseItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [currentAgent, setCurrentAgent] = useState<any>(null);
    const [formData, setFormData] = useState({
        productName: '',
        description: '',
        category: '',
        image: '',
        sizes: {} as { [key: string]: number },
        purchasePrice: '',
        sellingPrice: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const agent = getStoredAgent();
        if (!agent) {
            router.push('/admin/login');
            return;
        }
        setCurrentAgent(agent);
        fetchItems();
    }, [router]);

    const handleLogout = () => {
        logoutAgent();
        if (currentAgent?.role === 'super_agent' || currentAgent?.role === 'super_admin') {
            router.push('/admin/super-admin/login');
        } else {
            router.push('/admin/login');
        }
    };

    const fetchItems = async () => {
        try {
            const data = await getWarehouseItems({ limit: 100 });
            setItems(data.items);
        } catch (err) {
            console.error('Failed to fetch warehouse items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeChange = (size: string, value: string) => {
        const qty = parseInt(value) || 0;
        setFormData(prev => ({
            ...prev,
            sizes: { ...prev.sizes, [size]: qty }
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const data = new FormData();
            data.append('image', file);
            try {
                const res = await uploadImage(data);
                const fullImageUrl = `http://localhost:5001${res.image}`;
                setFormData(prev => ({ ...prev, image: fullImageUrl }));
            } catch (err) {
                console.error('Image upload failed', err);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const payload = {
                productName: formData.productName,
                description: formData.description,
                category: formData.category,
                image: formData.image,
                sizes: formData.sizes,
                purchasePrice: parseFloat(formData.purchasePrice),
                sellingPrice: parseFloat(formData.sellingPrice) || 0
            };

            if (editingId) {
                await updateWarehouseItem(editingId, payload);
                setSuccess('Item updated successfully!');
            } else {
                await createWarehouseItem(payload);
                setSuccess('Item added to warehouse successfully!');
            }

            setFormData({
                productName: '',
                description: '',
                category: '',
                image: '',
                sizes: {},
                purchasePrice: '',
                sellingPrice: ''
            });
            setShowForm(false);
            setEditingId(null);
            fetchItems();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save item');
        }
    };

    const handleEdit = (item: WarehouseItem) => {
        setFormData({
            productName: item.productName,
            description: item.description,
            category: item.category,
            image: item.image,
            sizes: item.sizes,
            purchasePrice: item.purchasePrice.toString(),
            sellingPrice: item.sellingPrice.toString()
        });
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        
        try {
            await deleteWarehouseItem(id);
            fetchItems();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete item');
        }
    };

    const handleTogglePublic = async (id: string) => {
        try {
            await togglePublicStatus(id);
            fetchItems();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to toggle visibility');
        }
    };

    const getTotalQuantity = (sizes: { [key: string]: number }) => {
        return Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Warehouse Inventory</h1>
                <div className={styles.headerActions}>
                    <span className={styles.welcome}>Welcome, {currentAgent?.name}</span>
                    <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <div className={styles.actions}>
                <button 
                    onClick={() => {
                        setShowForm(!showForm);
                        if (!showForm) {
                            setEditingId(null);
                            setFormData({
                                productName: '',
                                description: '',
                                category: '',
                                image: '',
                                sizes: {},
                                purchasePrice: '',
                                sellingPrice: ''
                            });
                        }
                    }} 
                    className={styles.addBtn}
                >
                    {showForm ? 'Cancel' : '+ Add New Item'}
                </button>
            </div>

            {showForm && (
                <div className={styles.formCard}>
                    <h2>{editingId ? 'Edit Item' : 'Add New Item to Warehouse'}</h2>
                    {error && <div className={styles.error}>{error}</div>}
                    {success && <div className={styles.success}>{success}</div>}
                    
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Product Name *</label>
                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="Enter product name"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="e.g., Shirt, Pants"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={styles.textarea}
                                rows={3}
                                placeholder="Product description"
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Purchase Price (Tk) *</label>
                                <input
                                    type="number"
                                    name="purchasePrice"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    required
                                    className={styles.input}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Selling Price (Tk)</label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                    className={styles.input}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Stock Quantity by Size</label>
                            <div className={styles.sizeGrid}>
                                {DEFAULT_SIZES.map(size => (
                                    <div key={size} className={styles.sizeInput}>
                                        <span className={styles.sizeLabel}>{size}</span>
                                        <input
                                            type="number"
                                            value={formData.sizes[size] || ''}
                                            onChange={(e) => handleSizeChange(size, e.target.value)}
                                            className={styles.sizeField}
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            {formData.image && (
                                <div className={styles.imagePreview}>
                                    <img src={formData.image} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            {editingId ? 'Update Item' : 'Add to Warehouse'}
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.tableCard}>
                <h2>Inventory List ({items.length})</h2>
                <div className={styles.grid}>
                    {items.map(item => (
                        <div key={item._id} className={styles.itemCard}>
                            <div className={styles.itemImage}>
                                {item.image ? (
                                    <img src={item.image} alt={item.productName} />
                                ) : (
                                    <div className={styles.noImage}>No Image</div>
                                )}
                            </div>
                            <div className={styles.itemInfo}>
                                <h3>{item.productName}</h3>
                                <p className={styles.category}>{item.category || 'Uncategorized'}</p>
                                <div className={styles.priceRow}>
                                    <span>Purchase: <strong>Tk {item.purchasePrice}</strong></span>
                                    <span>Selling: <strong>Tk {item.sellingPrice}</strong></span>
                                </div>
                                <div className={styles.stockRow}>
                                    <span className={styles.totalStock}>
                                        Total Stock: {getTotalQuantity(item.sizes)}
                                    </span>
                                </div>
                                <div className={styles.sizesRow}>
                                    {Object.entries(item.sizes).map(([size, qty]) => (
                                        <span key={size} className={styles.sizeTag}>
                                            {size}: {qty}
                                        </span>
                                    ))}
                                </div>
                                <div className={styles.statusRow}>
                                    <span className={`${styles.status} ${item.isPublic ? styles.public : styles.private}`}>
                                        {item.isPublic ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                <div className={styles.itemActions}>
                                    <button onClick={() => handleEdit(item)} className={styles.editBtn}>
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => handleTogglePublic(item._id)} 
                                        className={item.isPublic ? styles.hideBtn : styles.showBtn}
                                    >
                                        {item.isPublic ? 'Hide' : 'Show'}
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className={styles.deleteBtn}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className={styles.noData}>No items in warehouse</div>
                    )}
                </div>
            </div>
        </div>
    );
}
