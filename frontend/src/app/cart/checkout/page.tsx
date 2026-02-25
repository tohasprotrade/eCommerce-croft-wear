"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import { useCartStore } from '@/services/cart';
import { createOrder } from '@/services/api';
import styles from './Checkout.module.css';

interface FormData {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    postalCode: string;
    country: string;
    region: string;
    notes: string;
}

const SHIPPING_OPTIONS = [
    { id: 'dhaka', label: 'Inside Dhaka', price: 70 },
    { id: 'dhaka_suburban', label: 'Dhaka Sub-urban', price: 100 },
    { id: 'outside_dhaka', label: 'Outside Dhaka', price: 130 },
];

export default function CheckoutPage() {
    const router = useRouter();
    const { items, clearCart, getTotalPrice } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [selectedShipping, setSelectedShipping] = useState('dhaka');
    const [formData, setFormData] = useState<FormData>({
        email: '',
        phone: '',
        firstName: '',
        lastName: '',
        address: '',
        postalCode: '',
        country: 'Bangladesh',
        region: '',
        notes: ''
    });

    const subtotal = getTotalPrice();
    const shippingCost = SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.price || 0;
    const total = subtotal + shippingCost;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        if (items.length === 0) {
            router.push('/shop');
        }
    }, [items, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.email && !formData.phone) {
            alert('Please provide either email or phone number');
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                customerInfo: {
                    email: formData.email,
                    phone: formData.phone
                },
                deliveryInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    address: formData.address,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    region: formData.region
                },
                items: items.map(item => ({
                    productId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.selectedSize,
                    image: item.image
                })),
                subtotal,
                shippingCost,
                total,
                shippingMethod: selectedShipping,
                paymentMethod: 'cod',
                notes: formData.notes
            };

            const order = await createOrder(orderData);
            clearCart();
            setOrderId(order.orderId || 'TEST-123');
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            <Navbar />
            <div className={styles.main}>
                <h1 className={styles.title}>
                    Checkout
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.leftColumn}>
                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.stepNumber}>1</div>
                                    <h2 className={styles.cardTitle}>Contact Information</h2>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Email (optional)</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="01XXXXXXXXX"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.stepNumber}>2</div>
                                    <h2 className={styles.cardTitle}>Delivery Address</h2>
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="House #, Road #, Area, City"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Postal Code</label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="1200"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Country/Region</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={styles.select}
                                        >
                                            <option value="Bangladesh">Bangladesh</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Region/District</label>
                                    <input
                                        type="text"
                                        name="region"
                                        value={formData.region}
                                        onChange={handleChange}
                                        placeholder="e.g., Dhaka, Chattogram"
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.stepNumber}>3</div>
                                    <h2 className={styles.cardTitle}>Shipping Method</h2>
                                </div>

                                <div className={styles.shippingOptions}>
                                    {SHIPPING_OPTIONS.map((option) => (
                                        <label
                                            key={option.id}
                                            className={`${styles.shippingOption} ${selectedShipping === option.id ? styles.selected : ''}`}
                                        >
                                            <div className={styles.shippingOptionLeft}>
                                                <input
                                                    type="radio"
                                                    name="shipping"
                                                    value={option.id}
                                                    checked={selectedShipping === option.id}
                                                    onChange={() => setSelectedShipping(option.id)}
                                                    className={styles.radioInput}
                                                />
                                                <span className={styles.shippingLabel}>{option.label}</span>
                                            </div>
                                            <span className={styles.shippingPrice}>৳{option.price}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.stepNumber}>4</div>
                                    <h2 className={styles.cardTitle}>Payment Method</h2>
                                </div>

                                <div className={styles.paymentBox}>
                                    <div className={styles.shippingOptionLeft}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            checked
                                            readOnly
                                            className={styles.radioInput}
                                        />
                                        <span className={styles.shippingLabel}>Cash on Delivery (COD)</span>
                                    </div>
                                </div>

                                <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                                    <label className={styles.label}>Order Notes (optional)</label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Special instructions for delivery..."
                                        rows={3}
                                        className={styles.textarea}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.rightColumn}>
                            <div className={styles.summaryCard}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>

                                <div className={styles.itemsList}>
                                    {items.map((item) => (
                                        <div key={`${item._id}-${item.selectedSize}`} className={styles.orderItem}>
                                            <div className={styles.itemImage}>
                                                <img src={item.image} alt={item.name} />
                                            </div>
                                            <div className={styles.itemInfo}>
                                                <h4 className={styles.itemName}>{item.name}</h4>
                                                <p className={styles.itemMeta}>Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                                <p className={styles.itemPrice}>৳{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>৳{subtotal}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping</span>
                                    <span>৳{shippingCost}</span>
                                </div>
                                <div className={styles.summaryTotal}>
                                    <span>Total</span>
                                    <span className={styles.totalAmount}>৳{total}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={styles.submitBtn}
                                >
                                    {loading ? 'Processing...' : 'Complete Order'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {showSuccessModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.successIcon}>✓</div>
                        <h2 className={styles.modalTitle}>Order Placed!</h2>
                        <p className={styles.modalText}>Thank you for your order</p>
                        <div className={styles.orderIdBox}>Order ID: {orderId}</div>
                        <p className={styles.modalTextSmall}>We have received your order and will process it shortly.</p>
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                router.push('/');
                            }}
                            className={styles.dismissBtn}
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
