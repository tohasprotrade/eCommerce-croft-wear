"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getWarehouseItemById, updateWarehouseItem, uploadImage, getStoredAgent } from '@/services/api';
import AdminNavbar from '@/components/AdminNavbar/AdminNavbar';

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        productName: '',
        sellingPrice: '',
        purchasePrice: '',
        description: '',
        category: '',
        image: '',
        sizes: {} as Record<string, number>
    });
    const [loading, setLoading] = useState(true);
    const [agent, setAgent] = useState<any>(null);

    useEffect(() => {
        const storedAgent = getStoredAgent();
        if (!storedAgent) {
            router.push('/admin/login');
            return;
        }
        setAgent(storedAgent);
    }, [router]);

    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        };
        resolveParams();
    }, [params]);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const product = await getWarehouseItemById(id);
                    setFormData({
                        productName: product.productName || '',
                        sellingPrice: product.sellingPrice?.toString() || '',
                        purchasePrice: product.purchasePrice?.toString() || '',
                        description: product.description || '',
                        category: product.category || '',
                        image: product.image || '',
                        sizes: product.sizes || {}
                    });
                } catch (error) {
                    console.error('Error fetching product:', error);
                    alert('Failed to fetch product details.');
                    router.push('/admin/warehouse');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (size: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            sizes: { ...prev.sizes, [size]: parseInt(value) || 0 }
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
            } catch (error) {
                console.error('Image upload failed', error);
                alert('Image upload failed');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        try {
            await updateWarehouseItem(id, {
                productName: formData.productName,
                description: formData.description,
                category: formData.category,
                image: formData.image,
                sizes: formData.sizes,
                purchasePrice: parseFloat(formData.purchasePrice),
                sellingPrice: parseFloat(formData.sellingPrice)
            });
            alert('Product updated successfully!');
            router.push('/admin/warehouse');
        } catch (error) {
            console.error(error);
            alert('Failed to update product.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('agentToken');
        localStorage.removeItem('agentInfo');
        router.push('/admin/login');
    };

    const defaultSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <AdminNavbar />
            <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <h1 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 'bold' }}>Edit Warehouse Product</h1>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
                            <input
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Purchase Price (Tk)</label>
                                <input
                                    type="number"
                                    name="purchasePrice"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Selling Price (Tk)</label>
                                <input
                                    type="number"
                                    name="sellingPrice"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock by Size</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem' }}>
                                {defaultSizes.map(size => (
                                    <div key={size} style={{ textAlign: 'center' }}>
                                        <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '4px' }}>{size}</label>
                                        <input
                                            type="number"
                                            value={formData.sizes[size] || ''}
                                            onChange={(e) => handleSizeChange(size, e.target.value)}
                                            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '2px solid #e0e0e0', textAlign: 'center' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #e0e0e0', resize: 'vertical' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Image</label>
                            {formData.image && (
                                <img src={formData.image} alt="Preview" style={{ width: '150px', marginBottom: '1rem', display: 'block', borderRadius: '8px' }} />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid #e0e0e0' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="submit"
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    backgroundColor: '#4F46E5',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                Update Product
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/admin/warehouse')}
                                style={{
                                    padding: '1rem 2rem',
                                    backgroundColor: '#6b7280',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
