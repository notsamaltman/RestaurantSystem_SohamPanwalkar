import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Upload, 
  Edit2, 
  Trash2, 
  MoreVertical,
  UtensilsCrossed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MenuItemForm } from '@/components/admin/MenuItemForm';
import { CSVUpload } from '@/components/admin/CSVUpload';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/services/api';
import type { MenuItem, MenuCategory } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AdminMenu() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCSVOpen, setIsCSVOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadData = async () => {
    if (!user?.restaurant_id) return;
    
    setIsLoading(true);
    try {
      const [items, cats] = await Promise.all([
        adminApi.getMenuItems(user.restaurant_id),
        adminApi.getCategories(user.restaurant_id),
      ]);
      setMenuItems(items);
      setCategories(cats);
    } catch (error) {
      toast.error('Failed to load menu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.restaurant_id) {
      loadData();
    }
  }, [user?.restaurant_id]);

  const handleSubmit = async (data: Omit<MenuItem, 'id'>) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        const updated = await adminApi.updateMenuItem(editingItem.id, data);
        setMenuItems(menuItems.map(i => i.id === editingItem.id ? updated : i));
        toast.success('Item updated successfully');
      } else {
        const newItem = await adminApi.addMenuItem(data);
        setMenuItems([...menuItems, newItem]);
        toast.success('Item added successfully');
      }
      setIsFormOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to save item');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    
    try {
      await adminApi.deleteMenuItem(deletingItem.id);
      setMenuItems(menuItems.filter(i => i.id !== deletingItem.id));
      toast.success('Item deleted');
      setDeletingItem(null);
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleCSVUpload = async (csvData: string) => {
    if (!user?.restaurant_id) return { imported: 0, errors: ['No restaurant ID'] };
    
    const result = await adminApi.importMenuFromCSV(user.restaurant_id, csvData);
    if (result.imported > 0) {
      loadData();
    }
    return result;
  };

  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <UtensilsCrossed className="w-8 h-8 animate-pulse text-primary" />
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
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Menu Management
                </h1>
                <p className="text-xs text-muted-foreground">
                  {menuItems.length} items
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsCSVOpen(true)}>
                <Upload className="w-4 h-4 mr-2" />
                CSV Import
              </Button>
              <Button size="sm" onClick={() => { setEditingItem(null); setIsFormOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Menu items table */}
        <div className="bg-card rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Item</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Price</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Tags</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {getCategoryName(item.category_id)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-foreground">{formatPrice(item.price)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={item.is_veg ? 'veg' : 'nonveg'} className="text-[10px]">
                          {item.is_veg ? 'Veg' : 'Non-veg'}
                        </Badge>
                        {item.is_jain && (
                          <Badge variant="jain" className="text-[10px]">Jain</Badge>
                        )}
                        {item.is_chefs_special && (
                          <Badge variant="special" className="text-[10px]">Special</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={item.is_available ? 'default' : 'secondary'}>
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="iconSm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingItem(item); setIsFormOpen(true); }}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeletingItem(item)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <UtensilsCrossed className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>{searchQuery ? 'No items found' : 'No menu items yet'}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) setEditingItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          <MenuItemForm
            item={editingItem}
            categories={categories}
            restaurantId={user?.restaurant_id || ''}
            onSubmit={handleSubmit}
            onCancel={() => { setIsFormOpen(false); setEditingItem(null); }}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>

      {/* CSV Upload Dialog */}
      <Dialog open={isCSVOpen} onOpenChange={setIsCSVOpen}>
        <DialogContent className="max-w-lg">
          <CSVUpload
            onUpload={handleCSVUpload}
            onClose={() => setIsCSVOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deletingItem?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The item will be permanently removed from your menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
