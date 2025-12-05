import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LogOut, 
  RefreshCw, 
  UtensilsCrossed, 
  ClipboardList, 
  Clock, 
  CheckCircle,
  XCircle,
  ChefHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderCard } from '@/components/admin/OrderCard';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/services/api';
import type { Order, OrderStatus } from '@/types';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadOrders = async () => {
    if (!user?.restaurant_id) return;
    
    setIsLoading(true);
    try {
      const data = await adminApi.getOrders(user.restaurant_id);
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurant_id) {
      loadOrders();
    }
  }, [user?.restaurant_id]);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success(`Order ${orderId} updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const filterOrders = (status?: string) => {
    if (!status || status === 'all') return orders;
    return orders.filter(o => o.status === status);
  };

  const getStatusCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      preparing: orders.filter(o => o.status === 'preparing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };
  };

  const counts = getStatusCounts();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  {user?.restaurant_name || 'Dashboard'}
                </h1>
                <p className="text-xs text-muted-foreground">Staff Panel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/admin/menu">
                <Button variant="outline" size="sm">
                  <ChefHat className="w-4 h-4 mr-2" />
                  Menu
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2 text-warning mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{counts.pending}</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2 text-info mb-1">
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Preparing</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{counts.preparing}</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2 text-success mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Ready</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{counts.ready}</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ClipboardList className="w-4 h-4" />
              <span className="text-sm font-medium">Total Today</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{counts.all}</p>
          </div>
        </div>

        {/* Orders list */}
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Orders</h2>
            <Button variant="outline" size="sm" onClick={loadOrders} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-border px-4">
              <TabsList className="h-12 w-full justify-start gap-2 bg-transparent p-0">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/10">
                  All
                  <Badge variant="secondary" className="ml-1">{counts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-warning/10">
                  Pending
                  {counts.pending > 0 && (
                    <Badge variant="pending" className="ml-1">{counts.pending}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="preparing" className="data-[state=active]:bg-info/10">
                  Preparing
                  {counts.preparing > 0 && (
                    <Badge variant="preparing" className="ml-1">{counts.preparing}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="ready" className="data-[state=active]:bg-success/10">
                  Ready
                  {counts.ready > 0 && (
                    <Badge variant="ready" className="ml-1">{counts.ready}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              {['all', 'pending', 'preparing', 'ready', 'completed'].map((status) => (
                <TabsContent key={status} value={status} className="mt-0 space-y-4">
                  {filterOrders(status).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No {status === 'all' ? '' : status} orders</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filterOrders(status).map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onUpdateStatus={handleUpdateStatus}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
