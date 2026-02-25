"use client";

import { useEffect, useState } from 'react';
import { 
    getCollections, 
    createCollection, 
    deleteCollection, 
    updateCollection, 
    uploadImage,
    getProducts,
    getCollectionWithProducts,
    addProductToCollection,
    removeProductFromCollection
} from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';

interface Product {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
}

interface Collection {
    _id: string;
    name: string;
    coverImage: string;
    isActive: boolean;
    createdAt: string;
    products: Product[];
}

export default function CollectionManagementPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showProductModal, setShowProductModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [collectionProducts, setCollectionProducts] = useState<Product[]>([]);
    const [newCollection, setNewCollection] = useState({
        name: '',
        coverImage: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCollections();
        fetchProducts();
    }, []);

    const fetchCollections = async () => {
        try {
            const data = await getCollections();
            setCollections(data);
        } catch (error) {
            console.error('Error fetching collections:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await uploadImage(formData);
                const fullImageUrl = `http://localhost:5001${res.image}`;
                if (isEdit && editingId) {
                    const collection = collections.find(c => c._id === editingId);
                    if (collection) {
                        setCollections(collections.map(c => 
                            c._id === editingId ? { ...c, coverImage: fullImageUrl } : c
                        ));
                    }
                } else {
                    setNewCollection(prev => ({ ...prev, coverImage: fullImageUrl }));
                }
            } catch (error) {
                console.error('Image upload failed', error);
                alert('Image upload failed');
            }
        }
    };

    const handleAddCollection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCollection.name || !newCollection.coverImage) {
            alert('Please provide collection name and cover image');
            return;
        }
        setIsAdding(true);
        try {
            await createCollection(newCollection);
            setMessage('Collection added successfully!');
            setNewCollection({ name: '', coverImage: '' });
            const fileInput = document.getElementById('collection-image-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            fetchCollections();
        } catch (error) {
            console.error('Error adding collection:', error);
            setMessage('Failed to add collection');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteCollection = async (id: string) => {
        if (!confirm('Are you sure you want to delete this collection?')) return;
        try {
            await deleteCollection(id);
            setMessage('Collection deleted successfully!');
            fetchCollections();
        } catch (error) {
            console.error('Error deleting collection:', error);
            setMessage('Failed to delete collection');
        }
    };

    const handleToggleActive = async (collection: Collection) => {
        try {
            await updateCollection(collection._id, { isActive: !collection.isActive });
            setMessage(`Collection ${!collection.isActive ? 'activated' : 'deactivated'} successfully!`);
            fetchCollections();
        } catch (error) {
            console.error('Error updating collection:', error);
            setMessage('Failed to update collection');
        }
    };

    const handleUpdateName = async (id: string, newName: string) => {
        if (!newName.trim()) return;
        try {
            await updateCollection(id, { name: newName });
            setMessage('Collection name updated successfully!');
            setEditingId(null);
            fetchCollections();
        } catch (error) {
            console.error('Error updating collection:', error);
            setMessage('Failed to update collection');
        }
    };

    const openProductModal = async (collection: Collection) => {
        setSelectedCollection(collection);
        setShowProductModal(true);
        try {
            const data = await getCollectionWithProducts(collection._id);
            setCollectionProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching collection products:', error);
            setCollectionProducts([]);
        }
    };

    const handleAddProduct = async (productId: string) => {
        if (!selectedCollection) return;
        try {
            await addProductToCollection(selectedCollection._id, productId);
            const data = await getCollectionWithProducts(selectedCollection._id);
            setCollectionProducts(data.products || []);
            setCollections(collections.map(c => 
                c._id === selectedCollection._id ? { ...c, products: data.products } : c
            ));
            setMessage('Product added to collection!');
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage('Failed to add product');
        }
    };

    const handleRemoveProduct = async (productId: string) => {
        if (!selectedCollection) return;
        try {
            await removeProductFromCollection(selectedCollection._id, productId);
            const data = await getCollectionWithProducts(selectedCollection._id);
            setCollectionProducts(data.products || []);
            setCollections(collections.map(c => 
                c._id === selectedCollection._id ? { ...c, products: data.products } : c
            ));
            setMessage('Product removed from collection!');
        } catch (error) {
            console.error('Error removing product:', error);
            setMessage('Failed to remove product');
        }
    };

    const isProductInCollection = (productId: string) => {
        return collectionProducts.some(p => p._id === productId);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: '4px solid black', paddingLeft: '1rem' }}>
                    Collection Management
                </h1>

                {message && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1rem',
                        borderRadius: '8px',
                        backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
                        color: message.includes('success') ? '#155724' : '#721c24'
                    }}>
                        {message}
                    </div>
                )}

                <div style={{
                    backgroundColor: '#fff',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600' }}>
                        Add New Collection
                    </h2>
                    
                    <form onSubmit={handleAddCollection}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Collection Name
                            </label>
                            <input
                                type="text"
                                value={newCollection.name}
                                onChange={(e) => setNewCollection(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="e.g., Summer Breeze, Urban Winter"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Cover Image
                            </label>
                            {newCollection.coverImage && (
                                <div style={{ marginBottom: '1rem', position: 'relative' }}>
                                    <img
                                        src={newCollection.coverImage}
                                        alt="Collection Preview"
                                        style={{
                                            width: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}
                            <input
                                id="collection-image-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, false)}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                }}
                            />
                            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                                Recommended size: 1200x600 pixels
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isAdding}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#000',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: isAdding ? 'not-allowed' : 'pointer',
                                opacity: isAdding ? 0.7 : 1
                            }}
                        >
                            {isAdding ? 'Adding...' : 'Add Collection'}
                        </button>
                    </form>
                </div>

                <div style={{
                    backgroundColor: '#fff',
                    padding: '2rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600' }}>
                        Existing Collections ({collections.length})
                    </h2>

                    {collections.length === 0 ? (
                        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                            No collections added yet. Add your first collection above.
                        </p>
                    ) : (
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                            gap: '1.5rem'
                        }}>
                            {collections.map((collection) => (
                                <div 
                                    key={collection._id} 
                                    style={{ 
                                        border: '1px solid #eee', 
                                        borderRadius: '12px', 
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: collection.isActive ? '#4caf50' : '#9e9e9e',
                                        color: '#fff',
                                        padding: '4px 10px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        zIndex: 10
                                    }}>
                                        {collection.isActive ? 'Active' : 'Inactive'}
                                    </div>
                                    <img
                                        src={collection.coverImage}
                                        alt={collection.name}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{ padding: '1rem' }}>
                                        {editingId === collection._id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    defaultValue={collection.name}
                                                    id={`edit-name-${collection._id}`}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.5rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #ddd',
                                                        marginBottom: '0.5rem',
                                                        fontSize: '1rem'
                                                    }}
                                                />
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => {
                                                            const input = document.getElementById(`edit-name-${collection._id}`) as HTMLInputElement;
                                                            handleUpdateName(collection._id, input.value);
                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.5rem',
                                                            backgroundColor: '#4caf50',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.5rem',
                                                            backgroundColor: '#9e9e9e',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                    {collection.name}
                                                </h3>
                                                <p style={{ fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>
                                                    Created: {new Date(collection.createdAt).toLocaleDateString()}
                                                </p>
                                                <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '1rem' }}>
                                                    Products: {collection.products?.length || 0}
                                                </p>
                                            </>
                                        )}
                                        
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <button
                                                onClick={() => setEditingId(collection._id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.6rem',
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Edit Name
                                            </button>
                                            <button
                                                onClick={() => openProductModal(collection)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.6rem',
                                                    backgroundColor: '#e8f5e9',
                                                    color: '#388e3c',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Add Products
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(collection)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.6rem',
                                                    backgroundColor: collection.isActive ? '#fff3e0' : '#e8f5e9',
                                                    color: collection.isActive ? '#f57c00' : '#388e3c',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {collection.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCollection(collection._id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.6rem',
                                                    backgroundColor: '#ffdede',
                                                    color: '#d32f2f',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showProductModal && selectedCollection && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: '#fff',
                        borderRadius: '12px',
                        padding: '2rem',
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '80vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: '600' }}>
                                Manage Products - {selectedCollection.name}
                            </h2>
                            <button
                                onClick={() => setShowProductModal(false)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: '#f5f5f5',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                Close
                            </button>
                        </div>

                        {collectionProducts.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#4caf50' }}>
                                    Products in Collection ({collectionProducts.length})
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                    {collectionProducts.map((product) => (
                                        <div key={product._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.5rem', position: 'relative' }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
                                            />
                                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {product.name}
                                            </p>
                                            <button
                                                onClick={() => handleRemoveProduct(product._id)}
                                                style={{
                                                    width: '100%',
                                                    marginTop: '0.5rem',
                                                    padding: '0.3rem',
                                                    backgroundColor: '#ffdede',
                                                    color: '#d32f2f',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.7rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                                Available Products
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                                {products.filter(p => !isProductInCollection(p._id)).map((product) => (
                                    <div key={product._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '0.5rem' }}>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }}
                                        />
                                        <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {product.name}
                                        </p>
                                        <button
                                            onClick={() => handleAddProduct(product._id)}
                                            style={{
                                                width: '100%',
                                                marginTop: '0.5rem',
                                                padding: '0.3rem',
                                                backgroundColor: '#e8f5e9',
                                                color: '#388e3c',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '0.7rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Add to Collection
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {products.filter(p => !isProductInCollection(p._id)).length === 0 && (
                                <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
                                    All products are already in this collection.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
