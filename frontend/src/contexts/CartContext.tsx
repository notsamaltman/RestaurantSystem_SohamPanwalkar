import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  tableNumber: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_INSTRUCTIONS'; payload: { itemId: string; instructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_RESTAURANT'; payload: string }
  | { type: 'SET_TABLE'; payload: string }
  | { type: 'LOAD_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  restaurantId: null,
  tableNumber: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.menu_item.id === action.payload.id
      );
      
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
        };
        return { ...state, items: newItems };
      }
      
      return {
        ...state,
        items: [...state.items, { menu_item: action.payload, quantity: 1 }],
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.menu_item.id !== action.payload),
      };
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.menu_item.id !== action.payload.itemId),
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.menu_item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    
    case 'UPDATE_INSTRUCTIONS':
      return {
        ...state,
        items: state.items.map(item =>
          item.menu_item.id === action.payload.itemId
            ? { ...item, special_instructions: action.payload.instructions }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    case 'SET_RESTAURANT':
      if (state.restaurantId && state.restaurantId !== action.payload) {
        return { ...initialState, restaurantId: action.payload };
      }
      return { ...state, restaurantId: action.payload };
    
    case 'SET_TABLE':
      return { ...state, tableNumber: action.payload };
    
    case 'LOAD_CART':
      return action.payload;
    
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateInstructions: (itemId: string, instructions: string) => void;
  clearCart: () => void;
  setRestaurant: (restaurantId: string) => void;
  setTable: (tableNumber: string) => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'restaurant_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_CART', payload: parsed });
      }
    } catch (e) {
      console.error('Failed to load cart:', e);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [state]);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.items.reduce(
    (sum, item) => sum + item.menu_item.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    ...state,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (itemId) => dispatch({ type: 'REMOVE_ITEM', payload: itemId }),
    updateQuantity: (itemId, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } }),
    updateInstructions: (itemId, instructions) =>
      dispatch({ type: 'UPDATE_INSTRUCTIONS', payload: { itemId, instructions } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    setRestaurant: (restaurantId) =>
      dispatch({ type: 'SET_RESTAURANT', payload: restaurantId }),
    setTable: (tableNumber) => dispatch({ type: 'SET_TABLE', payload: tableNumber }),
    totalItems,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
