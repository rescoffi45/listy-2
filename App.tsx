import React, { useState, useEffect } from 'react';
import { useStore } from './store';
import { CategoryDef, Item, CategoryType } from './types';
import { GetIcon } from './components/Icons';
import { ContextMenu } from './components/ContextMenu';
import { AddItem } from './components/AddItem';
import { SearchResult } from './services/api';
import { Plus, Settings, Layout, Search, MoreHorizontal, ArrowUpDown, ChevronLeft } from 'lucide-react';

// --- Helper Components ---

const EditItemDialog: React.FC<{ item: Item; onClose: () => void; onSave: (id: string, updates: Partial<Item>) => void }> = ({ item, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title);
  const [subtitle, setSubtitle] = useState(item.subtitle || '');
  const [image, setImage] = useState(item.image || '');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-fade-in">
        <h3 className="text-xl font-bold mb-4">Edit Item</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full border rounded-lg p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input value={image} onChange={e => setImage(e.target.value)} className="w-full border rounded-lg p-2" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 text-gray-600 font-medium">Cancel</button>
          <button onClick={() => { onSave(item.id, { title, subtitle, image }); onClose(); }} className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium">Save</button>
        </div>
      </div>
    </div>
  );
};

const AddCategoryDialog: React.FC<{ onClose: () => void; onAdd: (cat: CategoryDef) => void }> = ({ onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState('Circle');

  const icons = ['Film', 'Tv', 'Book', 'Gamepad2', 'Mic', 'Music', 'Wine', 'Beer', 'LinkIcon', 'CheckSquare', 'Dices', 'Circle'];

  const handleAdd = () => {
    if (!label) return;
    onAdd({
      id: Date.now().toString(),
      type: label,
      label,
      icon,
      isSystem: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-4">New Category</h3>
        <input 
          autoFocus
          placeholder="Category Name" 
          value={label} 
          onChange={e => setLabel(e.target.value)} 
          className="w-full border rounded-lg p-3 text-lg mb-4" 
        />
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {icons.map(ic => (
              <button 
                key={ic} 
                onClick={() => setIcon(ic)}
                className={`p-2 rounded-lg flex items-center justify-center ${icon === ic ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}
              >
                <GetIcon name={ic} size={20} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 text-gray-600 font-medium">Cancel</button>
          <button onClick={handleAdd} disabled={!label} className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50">Create</button>
        </div>
      </div>
    </div>
  );
};

// --- Mobile Dashboard ---
const DashboardMobile: React.FC<{ 
  categories: CategoryDef[],
  counts: Record<string, number>, 
  onCategorySelect: (cat: CategoryDef) => void,
  onCategoryContext: (cat: CategoryDef) => void,
  onAddCategory: () => void
}> = ({ categories, counts, onCategorySelect, onCategoryContext, onAddCategory }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">All lists</h1>
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <GetIcon name="Search" className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-xl bg-gray-200/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-lg"
            placeholder="Search"
          />
        </div>
      </div>
      
      <div className="px-4 grid grid-cols-2 gap-4 pb-24">
        {categories.map(cat => (
          <div 
            key={cat.id}
            onClick={() => onCategorySelect(cat)}
            onContextMenu={(e) => { e.preventDefault(); onCategoryContext(cat); }}
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer h-32 flex flex-col justify-between relative group"
          >
            <div className="flex justify-between items-start">
              <GetIcon name={cat.icon} className="h-7 w-7 text-gray-900" strokeWidth={1.5} />
              <span className="text-gray-400 font-medium text-lg">{counts[cat.type] || 0}</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg truncate">{cat.label}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={onAddCategory}
        className="fixed bottom-8 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white active:scale-90 transition-transform z-40"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

// --- Desktop Sidebar ---
const SidebarDesktop: React.FC<{
  categories: CategoryDef[],
  counts: Record<string, number>,
  selectedCategory: CategoryDef | null,
  onCategorySelect: (cat: CategoryDef) => void,
  onCategoryContext: (cat: CategoryDef) => void,
  onAddCategory: () => void
}> = ({ categories, counts, selectedCategory, onCategorySelect, onCategoryContext, onAddCategory }) => {
  return (
    <div className="w-full h-full flex flex-col bg-gray-50/50 backdrop-blur-xl">
      <div className="h-14 flex items-center justify-between px-4">
         <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Layout size={20} /></button>
         <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Settings size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {categories.map(cat => {
          const isSelected = selectedCategory?.id === cat.id;
          return (
            <div 
              key={cat.id}
              onClick={() => onCategorySelect(cat)}
              onContextMenu={(e) => { e.preventDefault(); onCategoryContext(cat); }}
              className={`flex items-center justify-between px-3 py-2 mx-3 mb-0.5 rounded-lg cursor-pointer transition-colors group ${isSelected ? 'bg-blue-100/50' : 'hover:bg-gray-200/50'}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <GetIcon name={cat.icon} className={`h-5 w-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className={`text-[15px] font-medium truncate ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>{cat.label}</span>
              </div>
              <span className={`text-sm ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>{counts[cat.type] || 0}</span>
              <button 
                 onClick={(e) => { e.stopPropagation(); onCategoryContext(cat); }}
                 className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-800 absolute right-12 transition-opacity"
              >
                 <MoreHorizontal size={16} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="p-4">
        <button 
           onClick={onAddCategory}
           className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors w-full px-2 py-1"
        >
          <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center">
             <Plus size={12} strokeWidth={3} />
          </div>
          <span className="text-sm">New List</span>
        </button>
      </div>
    </div>
  );
};

// --- Shared Category View (CORRIGÉ) ---
const CategoryView: React.FC<{
  category: CategoryDef;
  items: Item[];
  isDesktop?: boolean;
  onBack?: () => void;
  onItemClick: (item: Item) => void;
  onAddItem: () => void;
}> = ({ category, items, isDesktop, onBack, onItemClick, onAddItem }) => {
  const isPosterLayout = [
    CategoryType.Movies, 
    CategoryType.TVShows, 
    CategoryType.Books, 
    CategoryType.Games,
    CategoryType.Beers,
    CategoryType.Wines
  ].includes(category.type as any);

  const containerPadding = isDesktop ? "px-8" : "px-4";

  return (
    <div className="h-full bg-white flex flex-col relative overflow-hidden">
      {/* Header Fixé en haut avec barre de recherche à droite */}
      <header className="flex-shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 h-16 w-full flex items-center justify-between px-4">
        <div className="flex items-center">
           {!isDesktop && (
              <button onClick={onBack} className="flex items-center text-blue-500 text-lg font-medium pr-2">
                <ChevronLeft className="h-7 w-7" />
                Back
              </button>
           )}
           {isDesktop && <span className="text-gray-400 font-medium text-sm ml-2">{category.label}</span>}
        </div>
        
        {/* Barre de recherche et options TOUJOURS à droite */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="text-gray-400 w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-9 pr-4 py-1.5 bg-gray-100 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-32 md:w-48 lg:w-64 transition-all focus:bg-gray-200/50"
            />
          </div>
          <div className="flex items-center gap-1 border-l pl-2 ml-1">
            {!isDesktop && (
              <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors">
                <ArrowUpDown className="h-5 w-5" />
              </button>
            )}
            <button className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
         {/* Title Area (Plus de barre de recherche ici) */}
         <div className={`${containerPadding} pt-8 pb-6`}>
           <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{category.label}</h1>
           <p className="text-gray-500 text-sm mt-1 font-medium">{items.length} items</p>
         </div>

         {/* Grid Content */}
         <div className={`${containerPadding} pb-32 ${isPosterLayout 
            ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10' 
            : 'grid grid-cols-1 gap-3'}`
         }>
           {items.map(item => (
             <div 
               key={item.id} 
               onClick={() => onItemClick(item)}
               className="relative group cursor-pointer transition-transform active:scale-95"
             >
                {isPosterLayout ? (
                  <div className="flex flex-col h-full">
                     <div className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 shadow-sm relative group-hover:shadow-md transition-all">
                       <img 
                         src={item.image || `https://picsum.photos/seed/${item.id}/300/450`} 
                         alt={item.title} 
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                         loading="lazy"
                       />
                       {item.completed && (
                          <div className="absolute top-1.5 right-1.5 bg-green-500/90 text-white rounded-full p-0.5 shadow-sm backdrop-blur-sm">
                            <Plus className="rotate-45 w-3 h-3" strokeWidth={4} />
                          </div>
                       )}
                     </div>
                     <h3 className="mt-3 text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2">{item.title}</h3>
                     <span className="text-[12px] text-gray-500 mt-1">{item.subtitle}</span>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                       <GetIcon name={category.icon || 'Circle'} size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                    </div>
                  </div>
                )}
             </div>
           ))}
         </div>
      </div>

      <button 
        onClick={onAddItem}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white hover:bg-blue-600 active:scale-90 transition-all z-40"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const { 
    items, categories, 
    addItem, removeItem, updateItem, 
    addCategory, removeCategory, updateCategory,
    getCounts, getItemsByCategory 
  } = useStore();

  const [currentCategory, setCurrentCategory] = useState<CategoryDef | null>(null);
  const [contextItem, setContextItem] = useState<Item | null>(null);
  const [contextCategory, setContextCategory] = useState<CategoryDef | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const counts = getCounts();

  useEffect(() => {
    if (window.innerWidth >= 768 && !currentCategory && categories.length > 0) {
      setCurrentCategory(categories[0]);
    }
  }, [categories]);

  const handleAction = (action: string, target: any) => {
    if (contextItem) {
        switch (action) {
            case 'delete': removeItem(contextItem.id); break;
            case 'toggle_watched': updateItem(contextItem.id, { completed: !contextItem.completed }); break;
            case 'edit': setEditingItem(contextItem); break;
        }
        setContextItem(null);
    } else if (contextCategory) {
        switch (action) {
            case 'delete': 
                removeCategory(contextCategory.id); 
                if (currentCategory?.id === contextCategory.id) setCurrentCategory(null);
                break;
            case 'edit': 
                const newName = prompt("Rename Category:", contextCategory.label);
                if (newName) updateCategory(contextCategory.id, { label: newName });
                break;
        }
        setContextCategory(null);
    }
  };

  const handleAddItem = (result: SearchResult) => {
    if (!currentCategory) return;
    addItem({
      id: result.id,
      category: currentCategory.type,
      title: result.title,
      subtitle: result.subtitle,
      image: result.image,
      addedAt: Date.now(),
      completed: false,
      metadata: result.metadata
    });
    setIsAddingItem(false);
  };

  return (
    <div className="flex h-screen w-full bg-white text-gray-900 overflow-hidden font-sans">
      
      {/* Mobile View */}
      <div className="md:hidden flex-1 h-full relative">
         {!currentCategory ? (
            <DashboardMobile 
              categories={categories}
              counts={counts} 
              onCategorySelect={setCurrentCategory} 
              onCategoryContext={setContextCategory}
              onAddCategory={() => setIsAddingCategory(true)}
            />
         ) : (
            <CategoryView 
              category={currentCategory} 
              items={getItemsByCategory(currentCategory.type).sort((a,b) => b.addedAt - a.addedAt)}
              onBack={() => setCurrentCategory(null)}
              onItemClick={setContextItem}
              onAddItem={() => setIsAddingItem(true)}
              isDesktop={false}
            />
         )}
      </div>

      {/* Desktop View */}
      <aside className="hidden md:flex w-[260px] lg:w-[300px] flex-shrink-0 border-r border-gray-200 z-10">
         <SidebarDesktop 
            categories={categories}
            counts={counts}
            selectedCategory={currentCategory}
            onCategorySelect={setCurrentCategory}
            onCategoryContext={setContextCategory}
            onAddCategory={() => setIsAddingCategory(true)}
         />
      </aside>

      <main className="hidden md:flex flex-1 h-full relative bg-white">
        {currentCategory ? (
           <CategoryView 
              category={currentCategory} 
              items={getItemsByCategory(currentCategory.type).sort((a,b) => b.addedAt - a.addedAt)}
              onItemClick={setContextItem}
              onAddItem={() => setIsAddingItem(true)}
              isDesktop={true}
           />
        ) : (
           <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/50">
             <div className="text-center">
               <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Layout className="text-gray-400" />
               </div>
               <p className="text-lg font-medium">Select a category to view items</p>
             </div>
           </div>
        )}
      </main>

      {/* Overlays */}
      {contextItem && (
        <ContextMenu 
          type="item"
          item={contextItem} 
          onClose={() => setContextItem(null)} 
          onAction={handleAction} 
        />
      )}
      
      {contextCategory && (
        <ContextMenu 
          type="category"
          item={contextCategory} 
          onClose={() => setContextCategory(null)} 
          onAction={handleAction} 
        />
      )}

      {isAddingItem && currentCategory && (
        <AddItem 
          category={currentCategory.type as CategoryType} 
          onClose={() => setIsAddingItem(false)} 
          onAdd={handleAddItem}
        />
      )}

      {isAddingCategory && (
        <AddCategoryDialog 
          onClose={() => setIsAddingCategory(false)}
          onAdd={addCategory}
        />
      )}

      {editingItem && (
        <EditItemDialog 
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onSave={updateItem}
        />
      )}
    </div>
  );
}
