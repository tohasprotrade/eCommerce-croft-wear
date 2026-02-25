"use client";

import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, acceptOrder, deleteOrder, OrderItem, CustomerInfo, DeliveryInfo } from '@/services/api';
import Navbar from '@/components/Navbar/Navbar';
import styles from './Orders.module.css';

interface Order {
    _id: string;
    orderId: string;
    customerInfo: CustomerInfo;
    deliveryInfo: DeliveryInfo;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    shippingMethod: string;
    paymentMethod: string;
    status: string;
    notes: string;
    createdAt: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
    pending_acceptance: { bg: '#fff3cd', text: '#856404' },
    accepted: { bg: '#cce5ff', text: '#004085' },
    processing: { bg: '#cce5ff', text: '#004085' },
    shipped: { bg: '#d1ecf1', text: '#0c5460' },
    delivered: { bg: '#d4edda', text: '#155724' },
    cancelled: { bg: '#f8d7da', text: '#721c24' },
    returned: { bg: '#f8d7da', text: '#721c24' }
};

const SHIPPING_LABELS: Record<string, string> = {
    dhaka: 'Inside Dhaka',
    dhaka_suburban: 'Dhaka Sub-urban',
    outside_dhaka: 'Outside Dhaka'
};

export default function OrderRequestsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filter, setFilter] = useState('pending_acceptance');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOrder = async (orderId: string) => {
        setActionLoading(orderId);
        try {
            const result = await acceptOrder(orderId);
            alert(result.message || 'Order accepted successfully!');
            fetchOrders();
            setSelectedOrder(null);
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to accept order';
            const errors = error.response?.data?.errors;
            if (errors) {
                alert(`${message}:\n${errors.map((e: any) => e.message || e).join('\n')}`);
            } else {
                alert(message);
            }
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to reject this order?')) return;
        
        setActionLoading(orderId);
        try {
            await updateOrderStatus(orderId, 'cancelled');
            alert('Order rejected successfully!');
            fetchOrders();
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error rejecting order:', error);
            alert('Failed to reject order');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;
        try {
            await deleteOrder(orderId);
            fetchOrders();
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder(null);
            }
        } catch (error: any) {
            alert(error.response?.data?.message || 'Cannot delete processed orders');
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesFilter = filter === 'all' || order.status === filter;
        const matchesSearch = searchQuery === '' || 
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryInfo.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryInfo.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryInfo.phone.includes(searchQuery) ||
            order.customerInfo.email?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusCounts = () => ({
        all: orders.length,
        pending_acceptance: orders.filter(o => o.status === 'pending_acceptance').length,
        accepted: orders.filter(o => o.status === 'accepted').length,
        processing: orders.filter(o => o.status === 'processing').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    });

    const statusCounts = getStatusCounts();

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending_acceptance: 'Pending',
            accepted: 'Accepted',
            processing: 'Processing',
            shipped: 'Shipped',
            delivered: 'Delivered',
            cancelled: 'Cancelled',
            returned: 'Returned'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className={styles.loadingContainer}>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>
                    Order Requests
                </h1>

                <div className={styles.searchContainer}>
                    <div className={styles.searchWrapper}>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Name, Phone, or Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <span className={styles.searchIcon}>🔍</span>
                    </div>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className={styles.clearBtn}
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                <div className={styles.filterTabs}>
                    {['all', 'pending_acceptance', 'accepted', 'processing', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`${styles.filterTab} ${filter === status ? styles.active : ''}`}
                        >
                            {status === 'pending_acceptance' ? 'Pending' : status.charAt(0).toUpperCase() + status.slice(1)} 
                            <span className={styles.filterCount}>
                                {statusCounts[status as keyof typeof statusCounts]}
                            </span>
                        </button>
                    ))}
                </div>

                <div className={styles.content}>
                    <div className={styles.ordersPanel}>
                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className={styles.emptyState}>
                                                No orders found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <tr 
                                                key={order._id}
                                                onClick={() => setSelectedOrder(order)}
                                                className={selectedOrder?._id === order._id ? styles.selected : ''}
                                            >
                                                <td className={styles.orderId}>
                                                    {order.orderId}
                                                </td>
                                                <td>
                                                    <div className={styles.customerName}>{order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</div>
                                                    <div className={styles.customerPhone}>{order.customerInfo.phone}</div>
                                                </td>
                                                <td className={styles.orderTotal}>৳{order.total}</td>
                                                <td>
                                                    <span className={styles.statusBadge} style={{
                                                        backgroundColor: STATUS_COLORS[order.status]?.bg || '#f0f0f0',
                                                        color: STATUS_COLORS[order.status]?.text || '#666'
                                                    }}>
                                                        {getStatusLabel(order.status)}
                                                    </span>
                                                </td>
                                                <td className={styles.orderDate}>
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td>
                                                    {order.status === 'pending_acceptance' && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAcceptOrder(order._id);
                                                                }}
                                                                className={styles.acceptBtn}
                                                                disabled={actionLoading === order._id}
                                                            >
                                                                {actionLoading === order._id ? 'Processing...' : 'Accept'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRejectOrder(order._id);
                                                                }}
                                                                className={styles.rejectBtn}
                                                                disabled={actionLoading === order._id}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {order.status !== 'pending_acceptance' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteOrder(order._id);
                                                            }}
                                                            className={styles.deleteBtn}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedOrder && (
                        <div className={styles.detailsPanel}>
                            <div className={styles.detailsHeader}>
                                <div>
                                    <h2 className={styles.detailsTitle}>Order Details</h2>
                                    <p className={styles.detailsOrderId}>{selectedOrder.orderId}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className={styles.closeBtn}
                                >
                                    ×
                                </button>
                            </div>

                            {selectedOrder.status === 'pending_acceptance' && (
                                <div className={styles.actionButtons}>
                                    <button
                                        onClick={() => handleAcceptOrder(selectedOrder._id)}
                                        className={styles.acceptBtnLarge}
                                        disabled={actionLoading === selectedOrder._id}
                                    >
                                        {actionLoading === selectedOrder._id ? 'Processing...' : 'Accept Order'}
                                    </button>
                                    <button
                                        onClick={() => handleRejectOrder(selectedOrder._id)}
                                        className={styles.rejectBtnLarge}
                                        disabled={actionLoading === selectedOrder._id}
                                    >
                                        Reject Order
                                    </button>
                                </div>
                            )}

                            <div className={styles.statusSection}>
                                <label className={styles.sectionLabel}>Status</label>
                                <span className={styles.statusBadge} style={{
                                    backgroundColor: STATUS_COLORS[selectedOrder.status]?.bg || '#f0f0f0',
                                    color: STATUS_COLORS[selectedOrder.status]?.text || '#666'
                                }}>
                                    {getStatusLabel(selectedOrder.status)}
                                </span>
                            </div>

                            <div className={styles.infoSection}>
                                <h3 className={styles.infoTitle}>Customer Information</h3>
                                <div className={styles.infoBox}>
                                    <p className={styles.infoText}><strong>Name:</strong> {selectedOrder.deliveryInfo.firstName} {selectedOrder.deliveryInfo.lastName}</p>
                                    <p className={styles.infoText}><strong>Phone:</strong> {selectedOrder.deliveryInfo.phone}</p>
                                    <p className={styles.infoText}><strong>Email:</strong> {selectedOrder.customerInfo.email || 'N/A'}</p>
                                    <p className={styles.infoText}><strong>Address:</strong> {selectedOrder.deliveryInfo.address}</p>
                                    <p className={styles.infoText}><strong>Region:</strong> {selectedOrder.deliveryInfo.region || 'N/A'}</p>
                                    <p className={styles.infoText}><strong>Postal Code:</strong> {selectedOrder.deliveryInfo.postalCode || 'N/A'}</p>
                                </div>
                            </div>

                            <div className={styles.infoSection}>
                                <h3 className={styles.infoTitle}>Order Items</h3>
                                <div className={styles.itemsList}>
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className={styles.orderItem}>
                                            <img src={item.image} alt={item.name} className={styles.itemImage} />
                                            <div className={styles.itemInfo}>
                                                <p className={styles.itemName}>{item.name}</p>
                                                <p className={styles.itemMeta}>Size: {item.size} | Qty: {item.quantity}</p>
                                                <p className={styles.itemPrice}>৳{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.summaryBox}>
                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>৳{selectedOrder.subtotal}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Shipping ({SHIPPING_LABELS[selectedOrder.shippingMethod]})</span>
                                    <span>৳{selectedOrder.shippingCost}</span>
                                </div>
                                <div className={styles.summaryTotal}>
                                    <span>Total</span>
                                    <span className={styles.totalAmount}>৳{selectedOrder.total}</span>
                                </div>
                            </div>

                            {selectedOrder.notes && (
                                <div className={styles.notesSection}>
                                    <h3 className={styles.notesTitle}>Order Notes</h3>
                                    <p className={styles.notesText}>{selectedOrder.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
