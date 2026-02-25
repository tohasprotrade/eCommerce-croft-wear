"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { addToCart } from "@/services/cart";
import { getMeasurementFields, MeasurementField } from "@/services/api";
import styles from "../ProductDetails.module.css";

type Props = {
    params: Promise<{
        slug: string
    }>
}

const SIZES = ["S", "M", "L", "XL", "XXL"];

const ProductDetailsPage = ({ params }: Props) => {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [measurementFields, setMeasurementFields] = useState<MeasurementField[]>([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const [resolvedParams, fields] = await Promise.all([
                    params,
                    getMeasurementFields()
                ]);
                setMeasurementFields(fields);

                const res = await fetch(
                    `http://localhost:5001/api/user/products/${resolvedParams.slug}`
                );
                if (!res.ok) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setProduct(data);
                setLoading(false);
            } catch {
                setError("Failed to load product");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params]);

    const getMeasurementLabel = (key: string) => {
        const field = measurementFields.find(f => f.key === key);
        return field?.label || key;
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        setIsAdding(true);
        addToCart({ ...product, selectedSize, quantity });
        setTimeout(() => {
            setIsAdding(false);
            alert("Added to cart!");
        }, 500);
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingText}>Loading...</div>
                </div>
            </div>
        );
    }

    if (notFound || error) {
        return (
            <div>
                <Navbar />
                <div className={styles.errorContainer}>
                    <div className={styles.errorContent}>
                        <h1 className={styles.errorCode}>404</h1>
                        <p className={styles.errorMessage}>Product not found</p>
                    </div>
                </div>
            </div>
        );
    }

    const measurements = (product?.measurements || {}) as Record<string, number | string>;
    const hasMeasurements = Object.keys(measurements).length > 0;

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.imageWrapper}>
                        <div className={styles.imageContainer}>
                            <img
                                src={product.image}
                                alt={product.name}
                                className={styles.image}
                            />
                        </div>
                    </div>

                    <div className={styles.content}>
                        <span className={styles.category}>
                            {product.categoryName || product.category}
                        </span>

                        <h1 className={styles.title}>
                            {product.name}
                        </h1>

                        <div className={styles.price}>
                            ${product.price}
                        </div>

                        <p className={styles.description}>
                            {product.description}
                        </p>

                        {hasMeasurements && (
                            <div className={styles.section}>
                                <label className={styles.label}>
                                    Specifications
                                </label>
                                <div className={styles.specGrid}>
                                    {Object.entries(measurements).map(([key, value]) => (
                                        <div key={key} className={styles.specItem}>
                                            <span className={styles.specLabel}>
                                                {getMeasurementLabel(key)}:
                                            </span>
                                            <span className={styles.specValue}>
                                                {String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={styles.section}>
                            <label className={styles.label}>
                                Select Size
                            </label>
                            <div className={styles.sizeButtons}>
                                {SIZES.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`${styles.sizeButton} ${selectedSize === size ? styles.selected : ''}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <label className={styles.label}>
                                Quantity
                            </label>
                            <div className={styles.quantityControl}>
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className={styles.quantityButton}
                                >
                                    -
                                </button>
                                <span className={styles.quantityValue}>
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className={styles.quantityButton}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={styles.addToCartBtn}
                        >
                            {isAdding ? "Adding..." : "Add to Cart"}
                        </button>

                        <p className={styles.productCode}>
                            Product Code: <span>{product.slug}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
