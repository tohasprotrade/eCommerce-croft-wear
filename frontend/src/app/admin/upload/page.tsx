"use client";

import { useState, useEffect } from 'react';
import { createProduct, uploadImage, Category } from '@/services/api';
import CategorySelector from '@/components/CategorySelector/CategorySelector';
import MeasurementForm from '@/components/MeasurementForm/MeasurementForm';
import styles from './AdminUpload.module.css';

export default function AdminUpload() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        image: ''
    });

    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [measurements, setMeasurements] = useState<Record<string, number | string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        setIsSubmitting(true);
        try {
            const productData = {
                ...formData,
                category: selectedCategory._id,
                measurements
            };

            await createProduct(productData);
            alert('Product uploaded successfully!');
            setFormData({ name: '', price: '', description: '', image: '' });
            setSelectedCategory(null);
            setMeasurements({});
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to upload product';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Upload New Product</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="Enter product name"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className={styles.input}
                        placeholder="0.00"
                    />
                </div>

                <CategorySelector
                    selectedCategory={selectedCategory}
                    onChange={setSelectedCategory}
                />

                {selectedCategory && (
                    <div className={styles.measurementSection}>
                        <h3 className={styles.measurementTitle}>Measurements</h3>
                        <div className={styles.measurementGrid}>
                            {selectedCategory.measurementFields.length > 0 ? (
                                <MeasurementFormForUpload
                                    selectedCategory={selectedCategory}
                                    measurements={measurements}
                                    onChange={setMeasurements}
                                />
                            ) : (
                                <p className={styles.noCategoryMessage}>No measurement fields defined for this category</p>
                            )}
                        </div>
                    </div>
                )}

                <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                        className={styles.textarea}
                        placeholder="Enter product description"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Product Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    />
                    <input
                        type="text"
                        name="image"
                        value={formData.image}
                        readOnly
                        placeholder="Image URL will appear here after upload"
                        className={styles.imagePreview}
                    />
                </div>

                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Uploading...' : 'Upload Product'}
                </button>
            </form>
        </div>
    );
}

function MeasurementFormForUpload({
    selectedCategory,
    measurements,
    onChange
}: {
    selectedCategory: Category;
    measurements: Record<string, number | string>;
    onChange: (m: Record<string, number | string>) => void;
}) {
    const [registry, setRegistry] = useState<any[]>([]);

    useEffect(() => {
        import('@/services/api').then(api => {
            api.getMeasurementFields().then(setRegistry);
        });
    }, []);

    const availableFields = registry.filter((field: any) => 
        selectedCategory.measurementFields.includes(field.key)
    );

    if (availableFields.length === 0) {
        return null;
    }

    const handleChange = (key: string, value: string | number) => {
        const newMeasurements = { ...measurements };
        if (value === '' || value === undefined) {
            delete newMeasurements[key];
        } else {
            newMeasurements[key] = value;
        }
        onChange(newMeasurements);
    };

    return (
        <>
            {availableFields.map((field: any) => (
                <div key={field.key} className={styles.measurementField}>
                    <label className={styles.measurementLabel}>
                        {field.label}
                        {field.unit && <span className={styles.measurementUnit}>({field.unit})</span>}
                    </label>
                    
                    {field.inputType === 'select' && field.options ? (
                        <select
                            value={measurements[field.key] as string || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className={styles.measurementSelect}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option: string) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    ) : field.inputType === 'number' ? (
                        <input
                            type="number"
                            step="any"
                            min="0"
                            value={measurements[field.key] as number || ''}
                            onChange={(e) => handleChange(field.key, parseFloat(e.target.value) || '')}
                            className={styles.measurementInput}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                    ) : (
                        <input
                            type="text"
                            value={measurements[field.key] as string || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className={styles.measurementInput}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                    )}
                </div>
            ))}
        </>
    );
}
