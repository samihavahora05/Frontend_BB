import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  thumbnail: string;
  type: 'course' | 'session';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

interface AppState {
  user?: any;
  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  
  // Notification State
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationsRead: () => void;
  clearNotifications: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      // Initial Cart State
      cart: [],
      
      // Cart Actions
      addToCart: (item) => set((state) => {
        if (state.cart.some(cartItem => cartItem.id === item.id)) {
          return state;
        }
        
        state.addNotification({
          title: "Added to Cart",
          message: `${item.title} has been added to your cart.`
        });
        
        return { cart: [...state.cart, item] };
      }),
      
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id)
      })),
      
      clearCart: () => set({ cart: [] }),
      
      // Initial Notification State
      notifications: [
        {
          id: '1',
          title: 'Welcome to Blueboxx',
          message: 'Explore our latest courses and start learning today!',
          read: false,
          timestamp: new Date().toISOString()
        }
      ],
      
      // Notification Actions
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Date.now().toString(),
            read: false,
            timestamp: new Date().toISOString()
          },
          ...state.notifications
        ]
      })),
      
      markNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      })),
      
      clearNotifications: () => set({ notifications: [] })
    }),
    {
      name: 'blueboxx-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
