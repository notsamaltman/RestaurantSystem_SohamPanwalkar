import { ShoppingCart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

export function StickyCart() {
  const { totalItems, totalAmount, restaurantId, tableNumber } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (totalItems === 0) return null;

  const handleViewCart = () => {
    const params = new URLSearchParams();
    if (restaurantId) params.set('restaurant', restaurantId);
    if (tableNumber) params.set('table', tableNumber);
    navigate(`/cart?${params.toString()}`);
  };

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up",
      "bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm"
    )}>
      <Button 
        variant="cart" 
        size="xl" 
        onClick={handleViewCart}
        className="w-full max-w-lg mx-auto flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-in">
              {totalItems}
            </span>
          </div>
          <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">{formatPrice(totalAmount)}</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </Button>
    </div>
  );
}
