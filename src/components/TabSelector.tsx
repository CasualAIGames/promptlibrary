import { motion } from 'framer-motion';
import { FileText, FolderKanban } from 'lucide-react';
import type { ViewMode } from '../types';

interface TabSelectorProps {
  activeTab: ViewMode;
  onTabChange: (tab: ViewMode) => void;
}

export function TabSelector({ activeTab, onTabChange }: TabSelectorProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex p-1 bg-slate-900/50 border border-dark-border rounded-xl">
        <button
          onClick={() => onTabChange('prompts')}
          className={`relative flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
            activeTab === 'prompts'
              ? 'text-dark-bg'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {activeTab === 'prompts' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-lime-accent rounded-lg"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
          <FileText className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Prompts Genéricos</span>
        </button>

        <button
          onClick={() => onTabChange('projects')}
          className={`relative flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
            activeTab === 'projects'
              ? 'text-dark-bg'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          {activeTab === 'projects' && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-lime-accent rounded-lg"
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
          <FolderKanban className="w-4 h-4 relative z-10" />
          <span className="relative z-10">Proyectos</span>
        </button>
      </div>
    </div>
  );
}

