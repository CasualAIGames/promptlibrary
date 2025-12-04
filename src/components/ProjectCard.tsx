import { motion } from 'framer-motion';
import { FolderOpen, Edit2, Trash2, FileText } from 'lucide-react';
import type { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  promptCount: number;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onSelect: (project: Project) => void;
}

export function ProjectCard({ project, promptCount, index, onEdit, onDelete, onSelect }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => onSelect(project)}
      className="group relative h-64 rounded-xl overflow-hidden cursor-pointer card-glow"
    >
      {/* Background Image or Gradient */}
      {project.thumbnailUrl ? (
        <img
          src={project.thumbnailUrl}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-dark-bg" />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        {/* Prompt Count Badge */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-dark-bg/80 backdrop-blur-sm text-lime-accent rounded-full border border-lime-accent/30">
            <FileText className="w-3 h-3" />
            {promptCount} prompts
          </span>
        </div>

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-lime-accent/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-lime-accent/30 group-hover:bg-lime-accent/30 transition-colors">
          <FolderOpen className="w-6 h-6 text-lime-accent" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-text-primary mb-1 group-hover:text-lime-accent transition-colors">
          {project.name}
        </h3>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(project); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 backdrop-blur-sm text-text-secondary hover:text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all border border-dark-border"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Editar
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800/80 backdrop-blur-sm text-text-secondary hover:text-red-400 hover:bg-red-400/20 rounded-lg transition-all border border-dark-border"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-xl border border-dark-border group-hover:border-lime-accent/50 transition-colors pointer-events-none" />
    </motion.div>
  );
}

