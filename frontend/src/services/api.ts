import axios from 'axios';

// Get API URL from environment variables or use default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('agentToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('agentToken');
                localStorage.removeItem('agentInfo');
                if (!window.location.pathname.includes('/admin/login')) {
                    window.location.href = '/admin/login';
                }
            }
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network Error:', error.message);
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                error,
            });
        }

        return Promise.reject(error);
    }
);

// ============ ADMIN APIs ============

export const createProduct = async (productData: any) => {
    try {
        const response = await api.post('/admin/products', productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProduct = async (id: string, productData: any) => {
    try {
        const response = await api.put(`/admin/products/${id}`, productData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============ USER APIs ============

export const getProducts = async () => {
    try {
        const response = await api.get('/user/products');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProductsByCategory = async (category: string) => {
    try {
        const response = await api.get(`/user/products/category/${category}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProductById = async (id: string) => {
    try {
        const response = await api.get(`/admin/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============ UPLOAD API ============

export const uploadImage = async (formData: FormData) => {
    try {
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// ============ HEADER APIs ============

export const getHeaderSettings = async () => {
    try {
        const response = await api.get('/admin/header');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateHeaderSettings = async (settings: { title?: string; subtitle?: string; sliderImages?: string[] }) => {
    try {
        const response = await api.put('/admin/header', settings);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Header Slides API
export const getHeaderSlides = async () => {
    try {
        const response = await api.get('/admin/header/slides');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createHeaderSlide = async (slide: { title: string; subtitle: string; image: string; order?: number }) => {
    try {
        const response = await api.post('/admin/header/slides', slide);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateHeaderSlide = async (id: string, slide: { title?: string; subtitle?: string; image?: string; order?: number; isActive?: boolean }) => {
    try {
        const response = await api.put(`/admin/header/slides/${id}`, slide);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteHeaderSlide = async (id: string) => {
    try {
        const response = await api.delete(`/admin/header/slides/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Order APIs
export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
}

export interface CustomerInfo {
    email: string;
    phone: string;
}

export interface DeliveryInfo {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    postalCode: string;
    country: string;
    region: string;
}

export const createOrder = async (orderData: {
    customerInfo: CustomerInfo;
    deliveryInfo: DeliveryInfo;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    shippingMethod: string;
    paymentMethod: string;
    notes?: string;
}) => {
    try {
        const response = await api.post('/admin/orders', orderData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrders = async () => {
    try {
        const response = await api.get('/admin/orders');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getOrderById = async (id: string) => {
    try {
        const response = await api.get(`/admin/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateOrderStatus = async (id: string, status: string, notes?: string) => {
    try {
        const response = await api.put(`/admin/orders/${id}`, { status, notes });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const acceptOrder = async (id: string) => {
    try {
        const response = await api.put(`/admin/orders/${id}/accept`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteOrder = async (id: string) => {
    try {
        const response = await api.delete(`/admin/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Collection APIs
export const getCollections = async () => {
    try {
        const response = await api.get('/collections');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getActiveCollections = async () => {
    try {
        const response = await api.get('/collections/active');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCollection = async (collectionData: { name: string; coverImage: string }) => {
    try {
        const response = await api.post('/admin/collections', collectionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCollection = async (id: string, collectionData: { name?: string; coverImage?: string; isActive?: boolean }) => {
    try {
        const response = await api.put(`/admin/collections/${id}`, collectionData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCollection = async (id: string) => {
    try {
        const response = await api.delete(`/admin/collections/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCollectionWithProducts = async (id: string) => {
    try {
        const response = await api.get(`/admin/collections/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const addProductToCollection = async (collectionId: string, productId: string) => {
    try {
        const response = await api.post(`/admin/collections/${collectionId}/products`, { productId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeProductFromCollection = async (collectionId: string, productId: string) => {
    try {
        const response = await api.post(`/admin/collections/${collectionId}/products/remove`, { productId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Measurement Field Registry API
export interface MeasurementField {
    key: string;
    label: string;
    unit: string | null;
    inputType: 'number' | 'text' | 'select';
    options?: string[];
}

export const getMeasurementFields = async (): Promise<MeasurementField[]> => {
    try {
        const response = await api.get('/admin/categories/measurement-fields');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Category APIs
export interface Category {
    _id: string;
    name: string;
    measurementFields: string[];
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get('/admin/categories');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCategoryById = async (id: string): Promise<Category> => {
    try {
        const response = await api.get(`/admin/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCategory = async (categoryData: { 
    name: string; 
    measurementFields: string[]; 
    description?: string 
}): Promise<Category> => {
    try {
        const response = await api.post('/admin/categories', categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCategory = async (id: string, categoryData: { 
    name?: string; 
    measurementFields?: string[]; 
    description?: string;
    isActive?: boolean 
}): Promise<Category> => {
    try {
        const response = await api.put(`/admin/categories/${id}`, categoryData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteCategory = async (id: string) => {
    try {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Agent Authentication APIs
export const loginAgent = async (credentials: { email: string; password: string }) => {
    try {
        const response = await api.post('/agents/login', credentials);
        if (response.data.token) {
            localStorage.setItem('agentToken', response.data.token);
            localStorage.setItem('agentInfo', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentAgent = async () => {
    try {
        const response = await api.get('/agents/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutAgent = () => {
    localStorage.removeItem('agentToken');
    localStorage.removeItem('agentInfo');
};

export const getStoredAgent = () => {
    const info = localStorage.getItem('agentInfo');
    return info ? JSON.parse(info) : null;
};

export const getAgentToken = () => {
    return localStorage.getItem('agentToken');
};

// Agent Management APIs (Super Agent only)
export const createAgent = async (agentData: { 
    name: string; 
    email: string; 
    password: string; 
    role?: string 
}) => {
    try {
        const response = await api.post('/agents', agentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllAgents = async () => {
    try {
        const response = await api.get('/agents');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAgent = async (id: string, agentData: { 
    name?: string; 
    email?: string; 
    role?: string;
    isActive?: boolean 
}) => {
    try {
        const response = await api.put(`/agents/${id}`, agentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteAgent = async (id: string) => {
    try {
        const response = await api.delete(`/agents/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Warehouse APIs
export interface WarehouseSizes {
    [key: string]: number;
}

export interface WarehouseData {
    productName: string;
    description?: string;
    category?: string;
    image?: string;
    sizes: WarehouseSizes;
    purchasePrice: number;
    sellingPrice?: number;
    measurements?: Record<string, any>;
}

export const createWarehouseItem = async (data: WarehouseData) => {
    try {
        const response = await api.post('/warehouse', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getWarehouseItems = async (params?: { isPublic?: boolean; page?: number; limit?: number }) => {
    try {
        const response = await api.get('/warehouse', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getWarehouseItemById = async (id: string) => {
    try {
        const response = await api.get(`/warehouse/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateWarehouseItem = async (id: string, data: Partial<WarehouseData>) => {
    try {
        const response = await api.put(`/warehouse/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const togglePublicStatus = async (id: string) => {
    try {
        const response = await api.patch(`/warehouse/${id}/toggle-public`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteWarehouseItem = async (id: string) => {
    try {
        const response = await api.delete(`/warehouse/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getPublicProducts = async (params?: { category?: string; page?: number; limit?: number }) => {
    try {
        const response = await api.get('/warehouse/public', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Transaction APIs
export interface TransactionData {
    warehouseId?: string;
    productName: string;
    type: 'purchase' | 'sale' | 'adjustment';
    quantity: number;
    amount: number;
    profit?: number;
    size?: string;
    orderId?: string;
    notes?: string;
}

export const getTransactions = async (params?: { type?: string; month?: string; page?: number; limit?: number }) => {
    try {
        const response = await api.get('/transactions', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMonthlyReport = async (month: string) => {
    try {
        const response = await api.get('/transactions/report', { params: { month } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllMonths = async () => {
    try {
        const response = await api.get('/transactions/months');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
