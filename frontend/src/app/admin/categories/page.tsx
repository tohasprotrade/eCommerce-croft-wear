"use client";

import { useState, useEffect } from 'react';
import { 
    Category, 
    MeasurementField,
    getCategories, 
    getMeasurementFields,
    createCategory,
    deleteCategory 
} from '@/services/api';
import styles from './Categories.module.css';

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [measurementFields, setMeasurementFields] = useState<MeasurementField[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    
    const [newCategory, setNewCategory] = useState({
        name: '',
        measurementFields: [] as string[],
        description: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, fields] = await Promise.all([
                    getCategories(),
                    getMeasurementFields()
                ]);
                setCategories(cats);
                setMeasurementFields(fields);
            } catch (error) {
                console.error('Failed to load data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggleField = (key: string) => {
        setNewCategory(prev => ({
            ...prev,
            measurementFields: prev.measurementFields.includes(key)
                ? prev.measurementFields.filter(f => f !== key)
                : [...prev.measurementFields, key]
        }));
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newCategory.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        try {
            await createCategory(newCategory);
            const createdCategory = await getCategories();
            setCategories(createdCategory);
            setNewCategory({ name: '', measurementFields: [], description: '' });
            setIsCreating(false);
            alert('Category created successfully!');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create category');
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await deleteCategory(id);
            setCategories(prev => prev.filter(c => c._id !== id));
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete category');
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Category Management</h1>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className={isCreating ? styles.createBtnSecondary : styles.createBtn}
                >
                    {isCreating ? 'Cancel' : 'Create Category'}
                </button>
            </div>

            {isCreating && (
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>Create New Category</h2>
                    <form onSubmit={handleCreateCategory}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category Name</label>
                            <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                className={styles.input}
                                placeholder="e.g., shirts, pants"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Measurement Fields</label>
                            <div className={styles.checkboxGrid}>
                                {measurementFields.map(field => (
                                    <label 
                                        key={field.key} 
                                        className={`${styles.checkboxLabel} ${newCategory.measurementFields.includes(field.key) ? styles.checkboxLabelChecked : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={newCategory.measurementFields.includes(field.key)}
                                            onChange={() => handleToggleField(field.key)}
                                            className={styles.checkbox}
                                        />
                                        <span>{field.label}</span>
                                        {field.unit && <span className="text-gray-500">({field.unit})</span>}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description (optional)</label>
                            <textarea
                                value={newCategory.description}
                                onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                className={styles.textarea}
                                rows={2}
                                placeholder="Brief description of this category"
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.saveBtn}
                        >
                            Save Category
                        </button>
                    </form>
                </div>
            )}

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Measurements</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category._id}>
                                <td className={styles.categoryName}>
                                    {category.name}
                                </td>
                                <td>
                                    <div className={styles.measurementTags}>
                                        {category.measurementFields.length > 0 ? (
                                            category.measurementFields.map(fieldKey => {
                                                const field = measurementFields.find(f => f.key === fieldKey);
                                                return (
                                                    <span 
                                                        key={fieldKey}
                                                        className={styles.measurementTag}
                                                    >
                                                        {field?.label || fieldKey}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span className={styles.noMeasurements}>No measurements</span>
                                        )}
                                    </div>
                                </td>
                                <td className={styles.description}>
                                    {category.description || '-'}
                                </td>
                                <td className={styles.actions}>
                                    <button
                                        onClick={() => handleDeleteCategory(category._id)}
                                        className={styles.deleteBtn}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {categories.length === 0 && (
                    <div className={styles.emptyState}>
                        No categories found. Create one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
