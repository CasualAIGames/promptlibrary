import { useState, useEffect } from 'react';
import { ImagePlus, X, Save, FolderPlus } from 'lucide-react';
import type { Project } from '../types';

interface ProjectFormProps {
  project?: Project | null;
  onSave: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnailUrl || '');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
      setThumbnailUrl(project.thumbnailUrl || '');
    }
  }, [project]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setThumbnailUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      thumbnailUrl: thumbnailUrl || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          <FolderPlus className="w-4 h-4 inline mr-1" />
          Nombre del Proyecto *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Cortometraje Sci-Fi, Campaña Publicitaria..."
          className="w-full px-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente el proyecto y su propósito..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all resize-y"
        />
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          <ImagePlus className="w-4 h-4 inline mr-1" />
          Imagen de Portada
        </label>
        <div className="border-2 border-dashed border-dark-border hover:border-lime-accent/50 rounded-xl p-4 transition-colors">
          {thumbnailUrl ? (
            <div className="relative">
              <img
                src={thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setThumbnailUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-dark-bg/80 backdrop-blur-sm text-text-secondary hover:text-red-400 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
              <ImagePlus className="w-10 h-10 text-text-muted mb-2" />
              <span className="text-sm text-text-secondary">
                Sube una imagen de portada
              </span>
              <span className="text-xs text-text-muted mt-1">
                Esta imagen aparecerá en la tarjeta del proyecto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
        {/* Or paste URL */}
        <div className="mt-2">
          <input
            type="url"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            placeholder="O pega una URL de imagen..."
            className="w-full px-4 py-2 bg-slate-900/50 border border-dark-border rounded-lg text-text-primary text-sm placeholder-text-muted focus:border-lime-accent transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-slate-800 rounded-lg transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-lg transition-all btn-glow"
        >
          <Save className="w-4 h-4" />
          {project ? 'Guardar Cambios' : 'Crear Proyecto'}
        </button>
      </div>
    </form>
  );
}

