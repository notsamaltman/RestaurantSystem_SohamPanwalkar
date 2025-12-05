import { Plus, Minus, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import type { MenuItem } from '@/types';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  
  const cartItem = items.find(i => i.menu_item.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-300 animate-fade-in">
      <div className="flex">
        {/* Image */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-xs">No image</span>
            </div>
          )}
          
          {/* Veg/Non-veg indicator */}
          <div className={cn(
            "absolute top-2 left-2 w-4 h-4 border-2 rounded-sm flex items-center justify-center",
            item.is_veg ? "border-veg" : "border-nonveg"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              item.is_veg ? "bg-veg" : "bg-nonveg"
            )} />
          </div>

          {/* Chef's special star */}
          {item.is_chefs_special && (
            <div className="absolute top-2 right-2">
              <Star className="w-5 h-5 fill-accent text-accent" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-1 mt-1">
              {item.is_jain && <Badge variant="jain" className="text-[10px] px-1.5 py-0">Jain</Badge>}
              {item.is_chefs_special && <Badge variant="special" className="text-[10px] px-1.5 py-0">Chef's Special</Badge>}
            </div>

            {item.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Price and Add button */}
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-foreground">{formatPrice(item.price)}</span>
            
            {!item.is_available ? (
              <span className="text-xs text-muted-foreground">Unavailable</span>
            ) : quantity === 0 ? (
              <Button
                variant="addToCart"
                size="sm"
                onClick={() => addItem(item)}
                className="h-8 px-3"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-primary rounded-lg p-0.5">
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => updateQuantity(item.id, quantity - 1)}
                  className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-primary-foreground font-semibold min-w-[20px] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => addItem(item)}
                  className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
