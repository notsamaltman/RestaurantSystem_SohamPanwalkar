import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { MenuItem, MenuCategory } from '@/types';

interface MenuItemFormProps {
  item?: MenuItem | null;
  categories: MenuCategory[];
  restaurantId: string;
  onSubmit: (data: Omit<MenuItem, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MenuItemForm({ 
  item, 
  categories, 
  restaurantId, 
  onSubmit, 
  onCancel,
  isLoading 
}: MenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category_id: '',
    is_veg: true,
    is_jain: false,
    is_chefs_special: false,
    is_available: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        image: item.image || '',
        category_id: item.category_id,
        is_veg: item.is_veg,
        is_jain: item.is_jain,
        is_chefs_special: item.is_chefs_special,
        is_available: item.is_available,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      image: formData.image || undefined,
      category_id: formData.category_id,
      restaurant_id: restaurantId,
      is_veg: formData.is_veg,
      is_jain: formData.is_jain,
      is_chefs_special: formData.is_chefs_special,
      is_available: formData.is_available,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Item Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Paneer Tikka"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (₹) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="250"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Marinated cottage cheese grilled to perfection"
          rows={2}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) => setFormData({ ...formData, category_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            type="url"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="is_veg" className="text-sm">Vegetarian</Label>
          <Switch
            id="is_veg"
            checked={formData.is_veg}
            onCheckedChange={(checked) => setFormData({ ...formData, is_veg: checked })}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="is_jain" className="text-sm">Jain</Label>
          <Switch
            id="is_jain"
            checked={formData.is_jain}
            onCheckedChange={(checked) => setFormData({ ...formData, is_jain: checked })}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="is_chefs_special" className="text-sm">Chef's Special</Label>
          <Switch
            id="is_chefs_special"
            checked={formData.is_chefs_special}
            onCheckedChange={(checked) => setFormData({ ...formData, is_chefs_special: checked })}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="is_available" className="text-sm">Available</Label>
          <Switch
            id="is_available"
            checked={formData.is_available}
            onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
        </Button>
      </div>
    </form>
  );
}
