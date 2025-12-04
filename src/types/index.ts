export type PromptCategory = 'chat' | 'code' | 'image' | 'video';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  imageUrl?: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppData {
  prompts: Prompt[];
  projects: Project[];
  version: string;
  exportedAt: string;
}

export type ViewMode = 'prompts' | 'projects';

export type ModalType = 'prompt' | 'project' | 'view-prompt' | null;

