import { Copy, Edit2, ExternalLink, Calendar, Tag } from 'lucide-react';
import type { Prompt, Project } from '../types';

interface PromptViewerProps {
  prompt: Prompt;
  project?: Project;
  onEdit: () => void;
  onClose: () => void;
}

export function PromptViewer({ prompt, project, onEdit }: PromptViewerProps) {
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt.content);
    // Could add toast notification
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Image */}
      {prompt.imageUrl && (
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={() => window.open(prompt.imageUrl, '_blank')}
            className="absolute top-3 right-3 p-2 bg-dark-bg/80 backdrop-blur-sm text-text-secondary hover:text-text-primary rounded-lg transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Project Badge */}
      {project && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm rounded-full border border-emerald-500/30">
          <span className="font-medium">Proyecto:</span>
          {project.name}
        </div>
      )}

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-muted uppercase tracking-wider">
            Contenido del Prompt
          </h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-lime-accent/10 text-lime-accent hover:bg-lime-accent/20 rounded-lg transition-all border border-lime-accent/30"
          >
            <Copy className="w-3.5 h-3.5" />
            Copiar
          </button>
        </div>
        <div className="p-4 bg-slate-900/70 border border-dark-border rounded-xl">
          <p className="text-text-primary whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {prompt.content}
          </p>
        </div>
      </div>

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div>
          <h3 className="flex items-center gap-1.5 text-sm font-medium text-text-muted uppercase tracking-wider mb-3">
            <Tag className="w-4 h-4" />
            Etiquetas
          </h3>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-800 text-text-secondary text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 pt-4 border-t border-dark-border text-sm text-text-muted">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          Creado: {formatDate(prompt.createdAt)}
        </span>
        {prompt.updatedAt !== prompt.createdAt && (
          <span>Actualizado: {formatDate(prompt.updatedAt)}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-lg transition-all btn-glow"
        >
          <Edit2 className="w-4 h-4" />
          Editar Prompt
        </button>
      </div>
    </div>
  );
}

