import React from 'react';
import { 
  Film, Tv, Book, Gamepad2, Mic, Music, Wine, Beer, Link as LinkIcon, 
  CheckSquare, Dices, MoreHorizontal, ArrowUpDown, ChevronLeft, Plus,
  Search, X, Circle
} from 'lucide-react';

export const IconMap: Record<string, React.FC<any>> = {
  Film, Tv, Book, Gamepad2, Mic, Music, Wine, Beer, LinkIcon, 
  CheckSquare, Dices, MoreHorizontal, ArrowUpDown, ChevronLeft, Plus,
  Search, X, Circle
};

export const GetIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const Icon = IconMap[name];
  return Icon ? <Icon {...props} /> : null;
};