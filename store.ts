import { useState, useEffect, useCallback } from 'react';
import { Item, CategoryDef } from './types';
import { INITIAL_ITEMS, DEFAULT_CATEGORIES } from './constants';

const STORAGE_KEY_ITEMS = 'collectibles_data_items_v1';
const STORAGE_KEY_CATS = 'collectibles_data_cats_v1';

export const useStore = () => {
  // Items State
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ITEMS);
      return stored ? JSON.parse(stored) : INITIAL_ITEMS;
    } catch (e) {
      console.error("Failed to load items", e);
      return INITIAL_ITEMS;
    }
  });

  // Categories State
  const [categories, setCategories] = useState<CategoryDef[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CATS);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch (e) {
      console.error("Failed to load categories", e);
      return DEFAULT_CATEGORIES;
    }
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CATS, JSON.stringify(categories));
  }, [categories]);

  // Item Actions
  const addItem = useCallback((item: Item) => {
    setItems(prev => [item, ...prev]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }, []);

  const getItemsByCategory = useCallback((categoryType: string) => {
    return items.filter(i => i.category === categoryType);
  }, [items]);

  const getCounts = useCallback(() => {
    const counts: Record<string, number> = {};
    items.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Category Actions
  const addCategory = useCallback((cat: CategoryDef) => {
    setCategories(prev => [...prev, cat]);
  }, []);

  const removeCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Also optional: remove items in this category? 
    // Keeping items for now to avoid data loss mistakes.
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<CategoryDef>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  return {
    items,
    categories,
    addItem,
    removeItem,
    updateItem,
    getItemsByCategory,
    getCounts,
    addCategory,
    removeCategory,
    updateCategory
  };
};
