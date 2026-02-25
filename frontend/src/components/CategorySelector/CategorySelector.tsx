"use client";

import { useState, useEffect } from 'react';
import { Category, getCategories } from '@/services/api';

interface CategorySelectorProps {
    selectedCategory: Category | null;
    onChange: (category: Category | null) => void;
    disabled?: boolean;
}

export default function CategorySelector({
    selectedCategory,
    onChange,
    disabled = false
}: CategorySelectorProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Failed to load categories', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div className="text-gray-500">Loading categories...</div>;
    }

    return (
        <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
            </label>
            <select
                value={selectedCategory?._id || ''}
                onChange={(e) => {
                    const categoryId = e.target.value;
                    const category = categories.find(c => c._id === categoryId) || null;
                    onChange(category);
                }}
                disabled={disabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">Select a category</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                        {category.measurementFields.length > 0 && 
                            ` (${category.measurementFields.length} measurements)`}
                    </option>
                ))}
            </select>
        </div>
    );
}
