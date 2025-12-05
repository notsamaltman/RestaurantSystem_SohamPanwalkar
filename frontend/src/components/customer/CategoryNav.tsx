import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { MenuCategory } from '@/types';

interface CategoryNavProps {
  categories: MenuCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryNav({ categories, activeCategory, onCategoryChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const active = activeRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      
      const scrollLeft = active.offsetLeft - containerRect.width / 2 + activeRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <div 
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 -mx-1"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {categories.map((category) => (
        <button
          key={category.id}
          ref={category.id === activeCategory ? activeRef : undefined}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            category.id === activeCategory
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
