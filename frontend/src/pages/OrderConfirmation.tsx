import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, Phone, MapPin, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { customerApi } from '@/services/api';
import type { Order } from '@/types';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurant') || '1';
  const tableNumber = searchParams.get('table') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadOrder = async (showRefresh = false) => {
    if (!orderId) return;
    
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    
    try {
      const data = await customerApi.getOrderStatus(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const statusConfig = {
    pending: { icon: Clock, text: 'Order Received', color: 'text-warning' },
    preparing: { icon: RefreshCw, text: 'Being Prepared', color: 'text-info' },
    ready: { icon: CheckCircle, text: 'Ready for Pickup', color: 'text-success' },
    completed: { icon: CheckCircle, text: 'Completed', color: 'text-success' },
    cancelled: { icon: Clock, text: 'Cancelled', color: 'text-destructive' },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-64 w-full rounded-xl mb-4" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">We couldn't find this order.</p>
          <Link to={`/menu?restaurant=${restaurantId}&table=${tableNumber}`}>
            <Button>Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Success header */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-background p-6 text-center">
        <div className="animate-bounce-in">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground">
          Thank you for your order
        </p>
      </div>

      <main className="p-4 space-y-4">
        {/* Order ID and status */}
        <div className="bg-card rounded-xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-bold text-xl text-foreground">#{order.id}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadOrder(true)}
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
            <StatusIcon className={`w-6 h-6 ${statusConfig[order.status].color}`} />
            <div>
              <p className="font-semibold text-foreground">{statusConfig[order.status].text}</p>
              {order.estimated_time && order.status !== 'completed' && order.status !== 'cancelled' && (
                <p className="text-sm text-muted-foreground">
                  Estimated wait: ~{order.estimated_time} mins
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className="bg-card rounded-xl p-4 shadow-soft">
          <h2 className="font-semibold text-foreground mb-3">Order Details</h2>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Table {order.table_number}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {order.customer_phone}
            </span>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-secondary text-secondary-foreground font-medium w-6 h-6 rounded-full flex items-center justify-center text-xs">
                    {item.quantity}
                  </span>
                  <span className="text-foreground">{item.menu_item_name}</span>
                </div>
                <span className="text-muted-foreground">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 mt-3 flex justify-between font-semibold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatPrice(order.total_amount)}</span>
          </div>
        </div>

        {/* Back to menu */}
        <Link to={`/menu?restaurant=${restaurantId}&table=${tableNumber}`}>
          <Button variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Order More Items
          </Button>
        </Link>
      </main>
    </div>
  );
}
