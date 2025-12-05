export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  address?: string;
  phone?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  restaurant_id: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category_id: string;
  restaurant_id: string;
  is_veg: boolean;
  is_jain: boolean;
  is_chefs_special: boolean;
  is_available: boolean;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  special_instructions?: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  restaurant_id: string;
  table_number: string;
  customer_phone: string;
  customer_name?: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  estimated_time?: number; // minutes
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  restaurant_id: string;
  restaurant_name?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}
