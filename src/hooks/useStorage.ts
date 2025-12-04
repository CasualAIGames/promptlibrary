import { useState, useEffect, useCallback, useRef } from 'react';
import type { Prompt, Project, AppData } from '../types';
import { getGitHubToken, saveToGitHub } from '../services/githubSync';

const STORAGE_KEY = 'prompt-library-data';
const VERSION = '1.0.0';

interface StorageState {
  prompts: Prompt[];
  projects: Project[];
}

const getInitialState = (): StorageState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored) as AppData;
      return {
        prompts: data.prompts || [],
        projects: data.projects || [],
      };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return { prompts: [], projects: [] };
};

export function useStorage() {
  const [state, setState] = useState<StorageState>(getInitialState);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    const data: AppData = {
      prompts: state.prompts,
      projects: state.projects,
      version: VERSION,
      exportedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    // Auto-guardar en GitHub después de 2 segundos de inactividad (debounce)
    // Solo si no es el mount inicial y hay token configurado
    if (!isInitialMount.current && getGitHubToken()) {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      autoSaveTimeoutRef.current = setTimeout(async () => {
        try {
          await saveToGitHub(data);
          console.log('Auto-guardado en GitHub exitoso');
        } catch (error) {
          console.error('Error en auto-guardado:', error);
          // No mostrar error al usuario, es silencioso
        }
      }, 2000); // Esperar 2 segundos después del último cambio
    }

    isInitialMount.current = false;
  }, [state]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  // Prompt operations
  const addPrompt = useCallback((prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, prompts: [newPrompt, ...prev.prompts] }));
    return newPrompt;
  }, []);

  const updatePrompt = useCallback((id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>) => {
    setState(prev => ({
      ...prev,
      prompts: prev.prompts.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, []);

  const deletePrompt = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      prompts: prev.prompts.filter(p => p.id !== id),
    }));
  }, []);

  // Project operations
  const addProject = useCallback((project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      // Also remove project association from prompts
      prompts: prev.prompts.map(p =>
        p.projectId === id ? { ...p, projectId: undefined } : p
      ),
    }));
  }, []);

  // Export/Import operations
  const exportData = useCallback((): string => {
    const data: AppData = {
      prompts: state.prompts,
      projects: state.projects,
      version: VERSION,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, [state]);

  const importData = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString) as AppData;
      if (!data.prompts || !data.projects) {
        throw new Error('Invalid data format');
      }
      setState({
        prompts: data.prompts,
        projects: data.projects,
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, []);

  const getPromptsForProject = useCallback((projectId: string): Prompt[] => {
    return state.prompts.filter(p => p.projectId === projectId);
  }, [state.prompts]);

  const getGenericPrompts = useCallback((): Prompt[] => {
    return state.prompts.filter(p => !p.projectId);
  }, [state.prompts]);

  return {
    prompts: state.prompts,
    projects: state.projects,
    addPrompt,
    updatePrompt,
    deletePrompt,
    addProject,
    updateProject,
    deleteProject,
    exportData,
    importData,
    getPromptsForProject,
    getGenericPrompts,
  };
}

