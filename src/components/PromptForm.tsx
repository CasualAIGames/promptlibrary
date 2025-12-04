import { useState, useEffect } from 'react';
import { ImagePlus, X, Save, Tag, Loader } from 'lucide-react';
import type { Prompt, PromptCategory, Project } from '../types';
import { compressImage } from '../utils/imageUtils';

interface PromptFormProps {
  prompt?: Prompt | null;
  projects: Project[];
  currentProjectId?: string;
  onSave: (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const categories: { value: PromptCategory; label: string }[] = [
  { value: 'chat', label: 'Chat / Conversación' },
  { value: 'code', label: 'Código / Programación' },
  { value: 'image', label: 'Imagen / Arte' },
  { value: 'video', label: 'Video / Animación' },
];

export function PromptForm({ prompt, projects, currentProjectId, onSave, onCancel }: PromptFormProps) {
  const [title, setTitle] = useState(prompt?.title || '');
  const [content, setContent] = useState(prompt?.content || '');
  const [category, setCategory] = useState<PromptCategory>(prompt?.category || 'image');
  const [tags, setTags] = useState<string[]>(prompt?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl, setImageUrl] = useState(prompt?.imageUrl || '');
  const [projectId, setProjectId] = useState(prompt?.projectId || currentProjectId || '');
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setContent(prompt.content);
      setCategory(prompt.category);
      setTags(prompt.tags);
      setImageUrl(prompt.imageUrl || '');
      setProjectId(prompt.projectId || '');
    }
  }, [prompt]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        // Comprimir imagen antes de guardar (max 1920x1080, calidad 70%)
        const compressed = await compressImage(file, 1920, 1080, 0.7);
        setImageUrl(compressed);
      } catch (error) {
        console.error('Error al comprimir imagen:', error);
        // Fallback: usar imagen sin comprimir si falla la compresión
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      imageUrl: imageUrl || undefined,
      projectId: projectId || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Título del Prompt *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Retrato cinematográfico con iluminación dramática"
          className="w-full px-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all"
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Contenido del Prompt *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe aquí tu prompt completo..."
          rows={6}
          className="w-full px-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all resize-y"
          required
        />
      </div>

      {/* Category & Project Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Categoría
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PromptCategory)}
            className="w-full px-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Project */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Proyecto (opcional)
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all"
          >
            <option value="">Sin proyecto (Genérico)</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          <Tag className="w-4 h-4 inline mr-1" />
          Etiquetas
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Añadir etiqueta..."
            className="flex-1 px-4 py-2 bg-slate-900/50 border border-dark-border rounded-lg text-text-primary placeholder-text-muted focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-slate-800 text-text-secondary hover:text-text-primary rounded-lg transition-all"
          >
            Añadir
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-lime-accent/10 text-lime-accent text-sm rounded-full border border-lime-accent/30"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          <ImagePlus className="w-4 h-4 inline mr-1" />
          Imagen de Referencia
        </label>
        <div className="border-2 border-dashed border-dark-border hover:border-lime-accent/50 rounded-xl p-4 transition-colors">
          {imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-2 right-2 p-1.5 bg-dark-bg/80 backdrop-blur-sm text-text-secondary hover:text-red-400 rounded-lg transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
              {isCompressing ? (
                <>
                  <Loader className="w-10 h-10 text-lime-accent mb-2 animate-spin" />
                  <span className="text-sm text-lime-accent">
                    Comprimiendo imagen...
                  </span>
                </>
              ) : (
                <>
                  <ImagePlus className="w-10 h-10 text-text-muted mb-2" />
                  <span className="text-sm text-text-secondary">
                    Arrastra una imagen o haz clic para subir
                  </span>
                  <span className="text-xs text-text-muted mt-1">
                    PNG, JPG, WEBP (se comprimirá automáticamente)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isCompressing}
                className="hidden"
              />
            </label>
          )}
        </div>
        {/* Or paste URL */}
        <div className="mt-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
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
          {prompt ? 'Guardar Cambios' : 'Crear Prompt'}
        </button>
      </div>
    </form>
  );
}

