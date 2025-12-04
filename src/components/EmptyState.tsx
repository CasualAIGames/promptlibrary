import { motion } from 'framer-motion';
import { FileText, FolderKanban, Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'prompts' | 'projects';
  onAction: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const isPrompts = type === 'prompts';
  const Icon = isPrompts ? FileText : FolderKanban;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 rounded-2xl bg-slate-900/50 border border-dark-border flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-text-muted" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {isPrompts ? 'No hay prompts aún' : 'No hay proyectos aún'}
      </h3>
      
      <p className="text-text-secondary text-center max-w-sm mb-6">
        {isPrompts
          ? 'Empieza creando tu primer prompt. Podrás organizarlos, añadir imágenes de referencia y sincronizarlos.'
          : 'Crea proyectos para organizar tus prompts por temática, cliente o producción.'}
      </p>

      <button
        onClick={onAction}
        className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-xl transition-all btn-glow"
      >
        <Plus className="w-5 h-5" />
        {isPrompts ? 'Crear Primer Prompt' : 'Crear Primer Proyecto'}
      </button>
    </motion.div>
  );
}

