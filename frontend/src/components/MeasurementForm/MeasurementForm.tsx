"use client";

import { useState, useEffect } from 'react';
import { MeasurementField, getMeasurementFields, Category } from '@/services/api';

interface MeasurementFormProps {
    selectedCategory: Category | null;
    measurements: Record<string, number | string>;
    onChange: (measurements: Record<string, number | string>) => void;
    disabled?: boolean;
}

export default function MeasurementForm({
    selectedCategory,
    measurements,
    onChange,
    disabled = false
}: MeasurementFormProps) {
    const [registry, setRegistry] = useState<MeasurementField[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                const fields = await getMeasurementFields();
                setRegistry(fields);
            } catch (error) {
                console.error('Failed to load measurement fields', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistry();
    }, []);

    if (loading) {
        return <div className="text-gray-500">Loading measurement fields...</div>;
    }

    if (!selectedCategory) {
        return <div className="text-gray-500">Please select a category to see measurement fields</div>;
    }

    const availableFields = registry.filter(field => 
        selectedCategory.measurementFields.includes(field.key)
    );

    if (availableFields.length === 0) {
        return <div className="text-gray-500">No measurement fields defined for this category</div>;
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
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFields.map(field => (
                    <div key={field.key} className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.unit && <span className="text-gray-500 ml-1">({field.unit})</span>}
                        </label>
                        
                        {field.inputType === 'select' && field.options ? (
                            <select
                                value={measurements[field.key] as string || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                disabled={disabled}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select {field.label}</option>
                                {field.options.map(option => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : field.inputType === 'number' ? (
                            <input
                                type="number"
                                step="any"
                                min="0"
                                value={measurements[field.key] as number || ''}
                                onChange={(e) => handleChange(field.key, parseFloat(e.target.value) || '')}
                                disabled={disabled}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                        ) : (
                            <input
                                type="text"
                                value={measurements[field.key] as string || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                disabled={disabled}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
