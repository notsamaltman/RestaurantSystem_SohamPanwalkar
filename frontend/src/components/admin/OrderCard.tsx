import { Clock, Phone, MapPin, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' }> = {
  pending: { label: 'New Order', variant: 'pending' },
  preparing: { label: 'Preparing', variant: 'preparing' },
  ready: { label: 'Ready', variant: 'ready' },
  completed: { label: 'Completed', variant: 'completed' },
  cancelled: { label: 'Cancelled', variant: 'cancelled' },
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const config = statusConfig[order.status];
  const next = nextStatus[order.status];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <div className={cn(
      "bg-card rounded-xl shadow-soft overflow-hidden transition-shadow hover:shadow-medium",
      order.status === 'pending' && "ring-2 ring-warning/50",
      order.status === 'preparing' && "ring-2 ring-info/50"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">#{order.id}</span>
              <Badge variant={config.variant}>{config.label}</Badge>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Table {order.table_number}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {getTimeAgo(order.created_at)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold text-lg text-foreground">{formatPrice(order.total_amount)}</span>
            <div className="text-xs text-muted-foreground">{formatTime(order.created_at)}</div>
          </div>
        </div>

        {/* Customer info */}
        <div className="flex items-center gap-3 mt-3 text-sm">
          {order.customer_name && (
            <span className="flex items-center gap-1 text-foreground">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              {order.customer_name}
            </span>
          )}
          <span className="flex items-center gap-1 text-foreground">
            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
            {order.customer_phone}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
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

      {/* Actions */}
      {order.status !== 'completed' && order.status !== 'cancelled' && (
        <div className="p-4 pt-0 flex gap-2">
          {next && (
            <Button
              variant={order.status === 'pending' ? 'default' : 'success'}
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus(order.id, next)}
            >
              {order.status === 'pending' && 'Start Preparing'}
              {order.status === 'preparing' && 'Mark Ready'}
              {order.status === 'ready' && 'Complete Order'}
            </Button>
          )}
          {order.status === 'pending' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
