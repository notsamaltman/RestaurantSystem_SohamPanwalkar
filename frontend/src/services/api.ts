import type { 
  Restaurant, 
  MenuCategory, 
  MenuItem, 
  Order, 
  OrderStatus,
  AuthTokens,
  AdminUser 
} from '@/types';

// Configure your Django backend URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Token management
let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

export const setTokens = (tokens: AuthTokens) => {
  accessToken = tokens.access;
  refreshToken = tokens.refresh;
  localStorage.setItem('access_token', tokens.access);
  localStorage.setItem('refresh_token', tokens.refresh);
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getAccessToken = () => accessToken;

// Generic fetch wrapper
async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (requiresAuth && accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || error.detail || 'Request failed');
  }

  return response.json();
}

// ============================================
// MOCK DATA - Replace with real API calls
// ============================================

const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Spice Garden',
  description: 'Authentic Indian cuisine with a modern twist',
  logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
  address: '123 Food Street, Culinary City',
  phone: '+91 98765 43210',
};

const mockCategories: MenuCategory[] = [
  { id: '1', name: 'Starters', description: 'Begin your culinary journey', restaurant_id: '1', sort_order: 1 },
  { id: '2', name: 'Main Course', description: 'Signature dishes', restaurant_id: '1', sort_order: 2 },
  { id: '3', name: 'Breads', description: 'Fresh from the tandoor', restaurant_id: '1', sort_order: 3 },
  { id: '4', name: 'Desserts', description: 'Sweet endings', restaurant_id: '1', sort_order: 4 },
  { id: '5', name: 'Beverages', description: 'Refreshing drinks', restaurant_id: '1', sort_order: 5 },
];

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese grilled to perfection with spices',
    price: 320,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
    category_id: '1',
    restaurant_id: '1',
    is_veg: true,
    is_jain: false,
    is_chefs_special: true,
    is_available: true,
  },
  {
    id: '2',
    name: 'Chicken Seekh Kebab',
    description: 'Minced chicken skewers with aromatic herbs',
    price: 380,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
    category_id: '1',
    restaurant_id: '1',
    is_veg: false,
    is_jain: false,
    is_chefs_special: false,
    is_available: true,
  },
  {
    id: '3',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight',
    price: 280,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
    category_id: '2',
    restaurant_id: '1',
    is_veg: true,
    is_jain: false,
    is_chefs_special: true,
    is_available: true,
  },
  {
    id: '4',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato and butter gravy',
    price: 420,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    category_id: '2',
    restaurant_id: '1',
    is_veg: false,
    is_jain: false,
    is_chefs_special: true,
    is_available: true,
  },
  {
    id: '5',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes in creamy spinach gravy',
    price: 300,
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=400&h=300&fit=crop',
    category_id: '2',
    restaurant_id: '1',
    is_veg: true,
    is_jain: true,
    is_chefs_special: false,
    is_available: true,
  },
  {
    id: '6',
    name: 'Garlic Naan',
    description: 'Soft leavened bread with fresh garlic',
    price: 80,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    category_id: '3',
    restaurant_id: '1',
    is_veg: true,
    is_jain: false,
    is_chefs_special: false,
    is_available: true,
  },
  {
    id: '7',
    name: 'Gulab Jamun',
    description: 'Deep-fried milk dumplings in rose syrup',
    price: 120,
    image: 'https://images.unsplash.com/photo-1666190060946-a8e13b4ed5b3?w=400&h=300&fit=crop',
    category_id: '4',
    restaurant_id: '1',
    is_veg: true,
    is_jain: false,
    is_chefs_special: false,
    is_available: true,
  },
  {
    id: '8',
    name: 'Mango Lassi',
    description: 'Creamy yogurt drink with fresh mango',
    price: 100,
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&h=300&fit=crop',
    category_id: '5',
    restaurant_id: '1',
    is_veg: true,
    is_jain: false,
    is_chefs_special: false,
    is_available: true,
  },
];

let mockOrders: Order[] = [
  {
    id: 'ORD001',
    restaurant_id: '1',
    table_number: '5',
    customer_phone: '+91 98765 43210',
    customer_name: 'Rahul',
    items: [
      { id: '1', menu_item_id: '1', menu_item_name: 'Paneer Tikka', quantity: 2, price: 320 },
      { id: '2', menu_item_id: '3', menu_item_name: 'Dal Makhani', quantity: 1, price: 280 },
    ],
    total_amount: 920,
    status: 'pending',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
    estimated_time: 25,
  },
  {
    id: 'ORD002',
    restaurant_id: '1',
    table_number: '3',
    customer_phone: '+91 87654 32109',
    customer_name: 'Priya',
    items: [
      { id: '3', menu_item_id: '4', menu_item_name: 'Butter Chicken', quantity: 1, price: 420 },
      { id: '4', menu_item_id: '6', menu_item_name: 'Garlic Naan', quantity: 3, price: 80 },
    ],
    total_amount: 660,
    status: 'preparing',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 60000).toISOString(),
    estimated_time: 15,
  },
  {
    id: 'ORD003',
    restaurant_id: '1',
    table_number: '7',
    customer_phone: '+91 76543 21098',
    items: [
      { id: '5', menu_item_id: '7', menu_item_name: 'Gulab Jamun', quantity: 2, price: 120 },
    ],
    total_amount: 240,
    status: 'completed',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
];

// ============================================
// Customer APIs (No Auth)
// ============================================

export const customerApi = {
  getRestaurant: async (restaurantId: string): Promise<Restaurant> => {
    // Replace with: return apiFetch<Restaurant>(`/restaurants/${restaurantId}/`);
    await new Promise(r => setTimeout(r, 300));
    return mockRestaurant;
  },

  getMenu: async (restaurantId: string): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> => {
    // Replace with: return apiFetch(`/restaurants/${restaurantId}/menu/`);
    await new Promise(r => setTimeout(r, 500));
    return {
      categories: mockCategories.filter(c => c.restaurant_id === restaurantId),
      items: mockMenuItems.filter(i => i.restaurant_id === restaurantId),
    };
  },

  placeOrder: async (
    restaurantId: string,
    orderData: {
      table_number: string;
      customer_phone: string;
      customer_name?: string;
      items: { menu_item_id: string; quantity: number; special_instructions?: string }[];
    }
  ): Promise<Order> => {
    // Replace with: return apiFetch(`/restaurants/${restaurantId}/orders/`, { method: 'POST', body: JSON.stringify(orderData) });
    await new Promise(r => setTimeout(r, 800));
    
    const orderItems = orderData.items.map((item, idx) => {
      const menuItem = mockMenuItems.find(m => m.id === item.menu_item_id)!;
      return {
        id: `item-${Date.now()}-${idx}`,
        menu_item_id: item.menu_item_id,
        menu_item_name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
        special_instructions: item.special_instructions,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder: Order = {
      id: `ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
      restaurant_id: restaurantId,
      table_number: orderData.table_number,
      customer_phone: orderData.customer_phone,
      customer_name: orderData.customer_name,
      items: orderItems,
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimated_time: Math.floor(Math.random() * 20) + 15,
    };

    mockOrders.unshift(newOrder);
    return newOrder;
  },

  getOrderStatus: async (orderId: string): Promise<Order | null> => {
    await new Promise(r => setTimeout(r, 300));
    return mockOrders.find(o => o.id === orderId) || null;
  },
};

// ============================================
// Admin APIs (JWT Protected)
// ============================================

export const adminApi = {
  login: async (username: string, password: string): Promise<{ tokens: AuthTokens; user: AdminUser }> => {
    // Replace with: return apiFetch('/admin/auth/login/', { method: 'POST', body: JSON.stringify({ username, password }) });
    await new Promise(r => setTimeout(r, 600));
    
    if (username === 'admin' && password === 'admin123') {
      const tokens = {
        access: 'mock-access-token-' + Date.now(),
        refresh: 'mock-refresh-token-' + Date.now(),
      };
      setTokens(tokens);
      return {
        tokens,
        user: {
          id: '1',
          username: 'admin',
          restaurant_id: '1',
          restaurant_name: 'Spice Garden',
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  logout: () => {
    clearTokens();
  },

  refreshToken: async (): Promise<AuthTokens> => {
    // Replace with: return apiFetch('/admin/auth/refresh/', { method: 'POST', body: JSON.stringify({ refresh: refreshToken }) });
    throw new Error('Token refresh not implemented in mock');
  },

  getOrders: async (restaurantId: string, status?: OrderStatus): Promise<Order[]> => {
    // Replace with: return apiFetch(`/admin/orders/?status=${status || ''}`, {}, true);
    await new Promise(r => setTimeout(r, 400));
    let orders = mockOrders.filter(o => o.restaurant_id === restaurantId);
    if (status) {
      orders = orders.filter(o => o.status === status);
    }
    return orders;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    // Replace with: return apiFetch(`/admin/orders/${orderId}/`, { method: 'PUT', body: JSON.stringify({ status }) }, true);
    await new Promise(r => setTimeout(r, 300));
    const order = mockOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updated_at = new Date().toISOString();
    return order;
  },

  getMenuItems: async (restaurantId: string): Promise<MenuItem[]> => {
    // Replace with: return apiFetch(`/admin/menu/?restaurant=${restaurantId}`, {}, true);
    await new Promise(r => setTimeout(r, 300));
    return mockMenuItems.filter(i => i.restaurant_id === restaurantId);
  },

  addMenuItem: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    // Replace with: return apiFetch('/admin/menu/', { method: 'POST', body: JSON.stringify(item) }, true);
    await new Promise(r => setTimeout(r, 400));
    const newItem: MenuItem = {
      ...item,
      id: `item-${Date.now()}`,
    };
    mockMenuItems.push(newItem);
    return newItem;
  },

  updateMenuItem: async (itemId: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
    // Replace with: return apiFetch(`/admin/menu/${itemId}/`, { method: 'PUT', body: JSON.stringify(updates) }, true);
    await new Promise(r => setTimeout(r, 300));
    const index = mockMenuItems.findIndex(i => i.id === itemId);
    if (index === -1) throw new Error('Item not found');
    mockMenuItems[index] = { ...mockMenuItems[index], ...updates };
    return mockMenuItems[index];
  },

  deleteMenuItem: async (itemId: string): Promise<void> => {
    // Replace with: return apiFetch(`/admin/menu/${itemId}/`, { method: 'DELETE' }, true);
    await new Promise(r => setTimeout(r, 300));
    const index = mockMenuItems.findIndex(i => i.id === itemId);
    if (index !== -1) mockMenuItems.splice(index, 1);
  },

  importMenuFromCSV: async (restaurantId: string, csvData: string): Promise<{ imported: number; errors: string[] }> => {
    // Replace with: return apiFetch('/admin/menu/csv-upload/', { method: 'POST', body: JSON.stringify({ restaurant_id: restaurantId, csv_data: csvData }) }, true);
    await new Promise(r => setTimeout(r, 1000));
    
    const lines = csvData.trim().split('\n');
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const errors: string[] = [];
    let imported = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        const item: Partial<MenuItem> = {
          restaurant_id: restaurantId,
          is_available: true,
        };

        headers.forEach((header, idx) => {
          const value = values[idx];
          switch (header) {
            case 'name': item.name = value; break;
            case 'description': item.description = value; break;
            case 'price': item.price = parseFloat(value); break;
            case 'category_id': item.category_id = value; break;
            case 'is_veg': item.is_veg = value.toLowerCase() === 'true'; break;
            case 'is_jain': item.is_jain = value.toLowerCase() === 'true'; break;
            case 'is_chefs_special': item.is_chefs_special = value.toLowerCase() === 'true'; break;
          }
        });

        if (item.name && item.price && item.category_id) {
          mockMenuItems.push({ ...item, id: `csv-${Date.now()}-${i}` } as MenuItem);
          imported++;
        } else {
          errors.push(`Row ${i + 1}: Missing required fields`);
        }
      } catch (e) {
        errors.push(`Row ${i + 1}: Invalid format`);
      }
    }

    return { imported, errors };
  },

  getCategories: async (restaurantId: string): Promise<MenuCategory[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockCategories.filter(c => c.restaurant_id === restaurantId);
  },
};
