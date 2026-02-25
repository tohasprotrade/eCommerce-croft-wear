"use client";

import { useEffect, useState } from 'react';
import { getHeaderSlides, createHeaderSlide, deleteHeaderSlide, uploadImage } from '@/services/api';

interface HeaderSlide {
    _id: string;
    title: string;
    subtitle: string;
    image: string;
    order: number;
    isActive: boolean;
}

export default function HeaderSettingsPage() {
    const [slides, setSlides] = useState<HeaderSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newSlide, setNewSlide] = useState({
        title: '',
        subtitle: '',
        image: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const data = await getHeaderSlides();
            setSlides(data);
        } catch (error) {
            console.error('Error fetching slides:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const res = await uploadImage(formData);
                const fullImageUrl = `http://localhost:5001${res.image}`;
                setNewSlide(prev => ({ ...prev, image: fullImageUrl }));
            } catch (error) {
                console.error('Image upload failed', error);
                alert('Image upload failed');
            }
        }
    };

    const handleAddSlide = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSlide.image) {
            alert('Please upload an image');
            return;
        }
        setIsAdding(true);
        try {
            await createHeaderSlide({
                ...newSlide,
                order: slides.length
            });
            setMessage('Slide added successfully!');
            setNewSlide({ title: '', subtitle: '', image: '' });
            const fileInput = document.getElementById('slide-image-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            fetchSlides();
        } catch (error) {
            console.error('Error adding slide:', error);
            setMessage('Failed to add slide');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteSlide = async (id: string) => {
        if (!confirm('Are you sure you want to delete this slide?')) return;
        try {
            await deleteHeaderSlide(id);
            setMessage('Slide deleted successfully!');
            fetchSlides();
        } catch (error: any) {
            console.error('Error deleting slide:', error);
            alert(error.message || 'Failed to delete slide');
        }
    };

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>
        );
    }

    return (
        <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', borderLeft: '4px solid black', paddingLeft: '1rem' }}>
                Header Slider Settings
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
                    Add New Slide
                </h2>
                
                <form onSubmit={handleAddSlide}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            Slide Title
                        </label>
                        <input
                            type="text"
                            value={newSlide.title}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Elevate Your Style"
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
                            Slide Subtitle / Button Text
                        </label>
                        <input
                            type="text"
                            value={newSlide.subtitle}
                            onChange={(e) => setNewSlide(prev => ({ ...prev, subtitle: e.target.value }))}
                            placeholder="e.g., Visit Our Collections"
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
                            Slide Image
                        </label>
                        {newSlide.image && (
                            <div style={{ marginBottom: '1rem', position: 'relative' }}>
                                <img
                                    src={newSlide.image}
                                    alt="Slide Preview"
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
                            id="slide-image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                borderRadius: '8px',
                                border: '1px solid #ddd'
                            }}
                        />
                        <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                            Recommended size: 1920x1080 pixels
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
                        {isAdding ? 'Adding...' : 'Add Slide'}
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
                    Existing Slides ({slides.length})
                </h2>

                {slides.length === 0 ? (
                    <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                        No slides added yet. Add your first slide above.
                    </p>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                        gap: '1.5rem'
                    }}>
                        {slides.map((slide, index) => (
                            <div 
                                key={slide._id} 
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
                                    left: '10px',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: '#fff',
                                    padding: '4px 10px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    zIndex: 10
                                }}>
                                    Slide {index + 1}
                                </div>
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    style={{
                                        width: '100%',
                                        height: '180px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{ padding: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        {slide.title || 'No title'}
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
                                        {slide.subtitle || 'No subtitle'}
                                    </p>
                                    <button
                                        onClick={() => handleDeleteSlide(slide._id)}
                                        style={{
                                            width: '100%',
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
