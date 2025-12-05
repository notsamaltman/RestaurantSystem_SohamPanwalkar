import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Phone, User, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CartItemCard } from '@/components/customer/CartItemCard';
import { useCart } from '@/contexts/CartContext';
import { customerApi } from '@/services/api';
import { toast } from 'sonner';

export default function CartPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurant') || '1';
  const tableFromUrl = searchParams.get('table') || '';

  const { items, totalAmount, tableNumber, clearCart } = useCart();
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [table, setTable] = useState(tableNumber || tableFromUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!table.trim()) {
      toast.error('Please enter your table number');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await customerApi.placeOrder(restaurantId, {
        table_number: table,
        customer_phone: phone,
        customer_name: name || undefined,
        items: items.map((item) => ({
          menu_item_id: item.menu_item.id,
          quantity: item.quantity,
          special_instructions: item.special_instructions,
        })),
      });

      clearCart();
      navigate(`/order/${order.id}?restaurant=${restaurantId}&table=${table}`);
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    params.set('restaurant', restaurantId);
    if (table) params.set('table', table);
    navigate(`/menu?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-xl font-semibold text-foreground">Your Cart</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 pb-32">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some delicious items from the menu
            </p>
            <Button onClick={handleBack}>Browse Menu</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart items */}
            <section className="space-y-3">
              {items.map((item) => (
                <CartItemCard key={item.menu_item.id} item={item} />
              ))}
            </section>

            {/* Customer details */}
            <section className="bg-card rounded-xl p-4 shadow-soft space-y-4">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <Info className="w-4 h-4" />
                Your Details
              </h2>
              
              <div className="bg-primary/5 rounded-lg p-3 text-sm text-muted-foreground">
                No login needed, just your phone number!
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Your Name (optional)
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="table">Table Number *</Label>
                  <Input
                    id="table"
                    placeholder="e.g., 5"
                    value={table}
                    onChange={(e) => setTable(e.target.value)}
                    required
                    disabled={!!tableFromUrl}
                  />
                </div>
              </div>
            </section>

            {/* Order summary */}
            <section className="bg-card rounded-xl p-4 shadow-soft">
              <h2 className="font-semibold text-foreground mb-3">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="text-foreground">Included</span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary text-lg">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Place order button */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-background/80 backdrop-blur-sm">
          <Button
            variant="cart"
            size="xl"
            className="w-full max-w-lg mx-auto"
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : `Place Order • ${formatPrice(totalAmount)}`}
          </Button>
        </div>
      )}
    </div>
  );
}
