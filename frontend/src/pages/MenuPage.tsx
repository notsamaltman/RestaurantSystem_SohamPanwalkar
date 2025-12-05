import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Leaf, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MenuItemCard } from '@/components/customer/MenuItemCard';
import { CategoryNav } from '@/components/customer/CategoryNav';
import { StickyCart } from '@/components/customer/StickyCart';
import { useCart } from '@/contexts/CartContext';
import { customerApi } from '@/services/api';
import type { Restaurant, MenuCategory, MenuItem } from '@/types';
import { cn } from '@/lib/utils';

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('restaurant') || '1';
  const tableNumber = searchParams.get('table') || '';

  const { setRestaurant, setTable } = useCart();

  const [restaurant, setRestaurantData] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    setRestaurant(restaurantId);
    if (tableNumber) setTable(tableNumber);
  }, [restaurantId, tableNumber, setRestaurant, setTable]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [restaurantData, menuData] = await Promise.all([
          customerApi.getRestaurant(restaurantId),
          customerApi.getMenu(restaurantId),
        ]);
        
        setRestaurantData(restaurantData);
        setCategories(menuData.categories.sort((a, b) => a.sort_order - b.sort_order));
        setMenuItems(menuData.items);
        
        if (menuData.categories.length > 0) {
          setActiveCategory(menuData.categories[0].id);
        }
      } catch (error) {
        console.error('Failed to load menu:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [restaurantId]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (activeCategory && item.category_id !== activeCategory) return false;
      if (vegOnly && !item.is_veg) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [menuItems, activeCategory, vegOnly, searchQuery]);

  const itemsByCategory = useMemo(() => {
    if (searchQuery || activeCategory) {
      return { [activeCategory || 'search']: filteredItems };
    }
    
    const grouped: Record<string, MenuItem[]> = {};
    categories.forEach((cat) => {
      const items = menuItems.filter((item) => 
        item.category_id === cat.id && (!vegOnly || item.is_veg)
      );
      if (items.length > 0) {
        grouped[cat.id] = items;
      }
    });
    return grouped;
  }, [categories, menuItems, filteredItems, searchQuery, activeCategory, vegOnly]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4 space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="bg-card shadow-soft sticky top-0 z-40">
        <div className="p-4">
          {/* Restaurant info */}
          <div className="flex items-center gap-3 mb-4">
            {restaurant?.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
              />
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl font-semibold text-foreground truncate">
                {restaurant?.name}
              </h1>
              {tableNumber && (
                <p className="text-sm text-muted-foreground">Table {tableNumber}</p>
              )}
            </div>
          </div>

          {/* Search and filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={vegOnly ? 'default' : 'outline'}
              size="icon"
              onClick={() => setVegOnly(!vegOnly)}
              className={cn(vegOnly && 'bg-veg hover:bg-veg/90')}
            >
              <Leaf className="w-4 h-4" />
            </Button>
          </div>

          {/* Category navigation */}
          {!searchQuery && (
            <CategoryNav
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          )}
        </div>
      </header>

      {/* Menu items */}
      <main className="p-4">
        {searchQuery && filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(itemsByCategory).map(([categoryId, items]) => {
              const category = categories.find((c) => c.id === categoryId);
              return (
                <section key={categoryId}>
                  {!searchQuery && category && (
                    <h2 className="font-display text-lg font-semibold text-foreground mb-3">
                      {category.name}
                    </h2>
                  )}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Sticky cart */}
      <StickyCart />
    </div>
  );
}
