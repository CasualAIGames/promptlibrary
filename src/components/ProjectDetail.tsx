import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import type { Project, Prompt } from '../types';
import { PromptCard } from './PromptCard';

interface ProjectDetailProps {
  project: Project;
  prompts: Prompt[];
  onBack: () => void;
  onEditProject: () => void;
  onDeleteProject: () => void;
  onCreatePrompt: () => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (id: string) => void;
  onViewPrompt: (prompt: Prompt) => void;
}

export function ProjectDetail({
  project,
  prompts,
  onBack,
  onEditProject,
  onDeleteProject,
  onCreatePrompt,
  onEditPrompt,
  onDeletePrompt,
  onViewPrompt,
}: ProjectDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={onBack}
          className="p-2 text-text-secondary hover:text-text-primary hover:bg-slate-800 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-text-primary">{project.name}</h2>
          {project.description && (
            <p className="text-text-secondary mt-1">{project.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEditProject}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-slate-900/50 hover:bg-slate-800/50 border border-dark-border rounded-lg transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
          <button
            onClick={onDeleteProject}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 border border-red-400/30 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>
      </motion.div>

      {/* Project Thumbnail */}
      {project.thumbnailUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-48 rounded-xl overflow-hidden"
        >
          <img
            src={project.thumbnailUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        </motion.div>
      )}

      {/* Prompts Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">
          Prompts del Proyecto ({prompts.length})
        </h3>
        <button
          onClick={onCreatePrompt}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-lg transition-all btn-glow"
        >
          <Plus className="w-4 h-4" />
          Añadir Prompt
        </button>
      </div>

      {/* Prompts Grid or Empty State */}
      {prompts.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-text-muted" />
          </div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">
            Este proyecto está vacío
          </h4>
          <p className="text-text-secondary mb-4">
            Añade prompts de imagen o video para este proyecto.
          </p>
          <button
            onClick={onCreatePrompt}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Crear Prompt
          </button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {prompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              index={index}
              onEdit={onEditPrompt}
              onDelete={onDeletePrompt}
              onView={onViewPrompt}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

