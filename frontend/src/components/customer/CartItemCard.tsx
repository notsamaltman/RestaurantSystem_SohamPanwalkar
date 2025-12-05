import { Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import type { CartItem } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, updateInstructions, removeItem } = useCart();
  const [showInstructions, setShowInstructions] = useState(!!item.special_instructions);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-soft animate-fade-in">
      <div className="flex gap-3">
        {/* Image */}
        {item.menu_item.image && (
          <img
            src={item.menu_item.image}
            alt={item.menu_item.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Veg/Non-veg indicator */}
              <div className={cn(
                "w-3.5 h-3.5 border rounded-sm flex items-center justify-center flex-shrink-0",
                item.menu_item.is_veg ? "border-veg" : "border-nonveg"
              )}>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  item.menu_item.is_veg ? "bg-veg" : "bg-nonveg"
                )} />
              </div>
              <h3 className="font-medium text-foreground truncate">{item.menu_item.name}</h3>
            </div>
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => removeItem(item.menu_item.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-foreground">
              {formatPrice(item.menu_item.price * item.quantity)}
            </span>

            {/* Quantity controls */}
            <div className="flex items-center gap-2 bg-secondary rounded-lg p-0.5">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={() => updateQuantity(item.menu_item.id, item.quantity - 1)}
                className="h-7 w-7"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold min-w-[20px] text-center">
                {item.quantity}
              </span>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={() => updateQuantity(item.menu_item.id, item.quantity + 1)}
                className="h-7 w-7"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Special instructions toggle */}
          {!showInstructions && (
            <button
              onClick={() => setShowInstructions(true)}
              className="text-xs text-primary mt-2 hover:underline"
            >
              + Add special instructions
            </button>
          )}
        </div>
      </div>

      {/* Special instructions textarea */}
      {showInstructions && (
        <div className="mt-3">
          <Textarea
            placeholder="Any special instructions? (e.g., less spicy, no onions)"
            value={item.special_instructions || ''}
            onChange={(e) => updateInstructions(item.menu_item.id, e.target.value)}
            className="text-sm resize-none"
            rows={2}
          />
        </div>
      )}
    </div>
  );
}
