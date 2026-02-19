import React from 'react';
import { Item, CategoryDef } from '../types';
import { X, Check, Share, Pin, FileText, FolderInput, Edit, Globe, Trash, EyeOff } from 'lucide-react';

interface ContextMenuProps {
  item: Item | CategoryDef;
  type: 'item' | 'category';
  onClose: () => void;
  onAction: (action: string, item: any) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ item, type, onClose, onAction }) => {
  // Prevent scrolling when open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isItem = type === 'item';
  const data = item as any; // safe cast for display access

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-8 transition-all">
        
        {/* Popped Out Card (Left on Desktop) */}
        <div className={`relative shadow-2xl rounded-xl overflow-hidden transform transition-all duration-300 flex-shrink-0 ${isItem ? 'w-48 h-72 md:w-64 md:h-96' : 'w-64 h-32 md:w-80 md:h-48 bg-white flex items-center justify-center'}`}>
          {isItem ? (
            <img 
              src={data.image || 'https://picsum.photos/300/450'} 
              alt={data.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center p-6 text-center">
               {/* Icon placeholder if needed */}
               <h3 className="text-2xl font-bold text-gray-800">{data.label}</h3>
               <p className="text-gray-500 text-base mt-2">{data.type}</p>
            </div>
          )}
          
          {isItem && data.completed && (
             <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1.5 shadow-md">
               <Check size={20} strokeWidth={3} />
             </div>
          )}
        </div>

        {/* Menu Items (Right on Desktop) */}
        <div className="flex flex-col gap-3 w-full max-w-xs md:pt-4">
            <div className="w-full bg-white/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl text-gray-900 text-sm font-medium">
            {isItem ? (
                <>
                <button 
                    onClick={() => onAction('toggle_watched', item)}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-200/50 hover:bg-white active:bg-gray-100 transition-colors"
                >
                    <span>{data.completed ? 'Mark as unwatched' : 'Mark as watched'}</span>
                    {data.completed ? <EyeOff size={18} /> : <Check size={18} />}
                </button>
                
                <button 
                    onClick={() => onAction('share', item)}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-200/50 hover:bg-white active:bg-gray-100 transition-colors"
                >
                    <span>Share</span>
                    <Share size={18} />
                </button>

                <button 
                    onClick={() => onAction('note', item)}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-200/50 hover:bg-white active:bg-gray-100 transition-colors"
                >
                    <span>Add note</span>
                    <FileText size={18} />
                </button>
                
                <button 
                    onClick={() => onAction('edit', item)}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-200/50 hover:bg-white active:bg-gray-100 transition-colors"
                >
                    <span>Edit</span>
                    <Edit size={18} />
                </button>
                </>
            ) : (
                <>
                <button 
                    onClick={() => onAction('edit', item)}
                    className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-200/50 hover:bg-white active:bg-gray-100 transition-colors"
                >
                    <span>Edit Category</span>
                    <Edit size={18} />
                </button>
                </>
            )}
            </div>

            {/* Delete Button */}
            <div className="w-full bg-white/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl text-sm font-medium">
            <button 
                onClick={() => onAction('delete', item)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors"
            >
                <span>{isItem ? 'Delete item' : 'Delete category'}</span>
                <Trash size={18} />
            </button>
            </div>
        </div>

      </div>
    </div>
  );
};