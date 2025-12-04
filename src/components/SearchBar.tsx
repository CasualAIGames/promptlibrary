import { Search, Filter } from 'lucide-react';
import type { PromptCategory } from '../types';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: PromptCategory | 'all';
  onCategoryChange: (category: PromptCategory | 'all') => void;
}

export function SearchBar({ searchTerm, onSearchChange, categoryFilter, onCategoryChange }: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar prompts..."
          className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all"
        />
      </div>

      {/* Category Filter */}
      <div className="relative">
        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as PromptCategory | 'all')}
          className="pl-12 pr-8 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all appearance-none cursor-pointer min-w-[180px]"
        >
          <option value="all">Todas las categorías</option>
          <option value="chat">Chat</option>
          <option value="code">Código</option>
          <option value="image">Imagen</option>
          <option value="video">Video</option>
        </select>
      </div>
    </div>
  );
}

