import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    _id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
    selectedSize: string;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string, size: string) => void;
    updateQuantity: (id: string, size: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find(
                    i => i._id === item._id && i.selectedSize === item.selectedSize
                );
                if (existingItem) {
                    set({
                        items: items.map(i =>
                            i._id === item._id && i.selectedSize === item.selectedSize
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        )
                    });
                } else {
                    set({ items: [...items, item] });
                }
            },
            removeItem: (id, size) => {
                set({ items: get().items.filter(i => !(i._id === id && i.selectedSize === size)) });
            },
            updateQuantity: (id, size, quantity) => {
                set({
                    items: get().items.map(i =>
                        i._id === id && i.selectedSize === size ? { ...i, quantity } : i
                    )
                });
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
            getTotalPrice: () => get().items.reduce((acc, i) => acc + (i.price * i.quantity), 0),
        }),
        {
            name: 'cart-storage',
        }
    )
);

export const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity: number }) => {
    useCartStore.getState().addItem(item as CartItem);
};
