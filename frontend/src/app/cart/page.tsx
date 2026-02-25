"use client";

import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import { useCartStore } from '@/services/cart';
import styles from './Cart.module.css';

export default function Cart() {
    const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
    const total = getTotalPrice();

    const handleRemove = (id: string, size: string) => {
        removeItem(id, size);
    };

    const handleUpdateQuantity = (id: string, size: string, newQty: number) => {
        updateQuantity(id, size, newQty);
    };

    return (
        <main>
            <Navbar />
            <section className={styles.container}>
                <h1 className={styles.title}>
                    Your Shopping Bag
                </h1>

                {items.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>🛍️</div>
                        <p className={styles.emptyMessage}>Your bag is currently empty.</p>
                        <Link href="/shop" className={styles.shopBtn}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className={styles.content}>
                        <div className={styles.cartItems}>
                            {items.map((item) => (
                                <div key={`${item._id}-${item.selectedSize}`} className={styles.cartItem}>
                                    <div className={styles.itemImage}>
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <p className={styles.itemMeta}>Size: {item.selectedSize}</p>
                                        <p className={styles.itemPrice}>${item.price}</p>
                                        <div className={styles.itemActions}>
                                            <div className={styles.quantityControl}>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.selectedSize, Math.max(1, item.quantity - 1))}
                                                    className={styles.quantityBtn}
                                                >
                                                    -
                                                </button>
                                                <span className={styles.quantityValue}>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item._id, item.selectedSize, item.quantity + 1)}
                                                    className={styles.quantityBtn}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(item._id, item.selectedSize)}
                                                className={styles.removeBtn}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.summary}>
                            <h2 className={styles.summaryTitle}>Order Summary</h2>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className={styles.summaryTotal}>
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Link href="/cart/checkout" className={styles.checkoutBtn}>
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
