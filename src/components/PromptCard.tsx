import { motion } from 'framer-motion';
import { Copy, Edit2, Trash2, Image as ImageIcon, MessageSquare, Code, Video, Palette } from 'lucide-react';
import type { Prompt, PromptCategory } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
  onView: (prompt: Prompt) => void;
}

const categoryConfig: Record<PromptCategory, { icon: typeof MessageSquare; label: string; color: string }> = {
  chat: { icon: MessageSquare, label: 'Chat', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  code: { icon: Code, label: 'Código', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
  image: { icon: Palette, label: 'Imagen', color: 'text-pink-400 bg-pink-400/10 border-pink-400/30' },
  video: { icon: Video, label: 'Video', color: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
};

export function PromptCard({ prompt, index, onEdit, onDelete, onView }: PromptCardProps) {
  const category = categoryConfig[prompt.category];
  const CategoryIcon = category.icon;

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(prompt.content);
    // Could add a toast notification here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onView(prompt)}
      className="group glass rounded-xl overflow-hidden card-glow cursor-pointer"
    >
      {/* Image Preview */}
      {prompt.imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${category.color}`}>
            <CategoryIcon className="w-3 h-3" />
            {category.label}
          </span>
          
          {!prompt.imageUrl && (
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-text-muted" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text-primary mb-2 line-clamp-1 group-hover:text-lime-accent transition-colors">
          {prompt.title}
        </h3>

        {/* Content Preview */}
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
          {prompt.content}
        </p>

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {prompt.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium bg-slate-800 text-text-muted rounded-full"
              >
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-800 text-text-muted rounded-full">
                +{prompt.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-dark-border">
          <button
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-text-secondary hover:text-lime-accent hover:bg-lime-accent/10 rounded-lg transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            Copiar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(prompt); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-text-secondary hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(prompt.id); }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

