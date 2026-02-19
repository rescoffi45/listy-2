import React, { useState, useEffect } from 'react';
import { CategoryType } from '../types';
import { searchContent, SearchResult } from '../services/api';
import { X, Search, Loader2, Plus } from 'lucide-react';

interface AddItemProps {
  category: CategoryType;
  onClose: () => void;
  onAdd: (item: SearchResult) => void;
}

export const AddItem: React.FC<AddItemProps> = ({ category, onClose, onAdd }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      setLoading(true);
      searchContent(debouncedQuery, category).then(res => {
        setResults(res);
        setLoading(false);
      });
    } else {
      setResults([]);
    }
  }, [debouncedQuery, category]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center p-4 bg-white border-b border-gray-200">
        <div className="flex-1 relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             autoFocus
             type="text"
             className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50"
             placeholder={`Search ${category}...`}
             value={query}
             onChange={(e) => setQuery(e.target.value)}
           />
           {query && (
             <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
               <X size={16} />
             </button>
           )}
        </div>
        <button onClick={onClose} className="ml-4 text-blue-500 font-medium">
          Cancel
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : (
          <div className="space-y-2">
            {results.map(item => (
              <div 
                key={item.id}
                onClick={() => onAdd(item)}
                className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm active:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Plus size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
                  <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Plus size={18} />
                </button>
              </div>
            ))}
            {!loading && query.length > 1 && results.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
