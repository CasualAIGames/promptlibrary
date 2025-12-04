import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Header,
  HeroSection,
  TabSelector,
  PromptCard,
  ProjectCard,
  Modal,
  PromptForm,
  ProjectForm,
  PromptViewer,
  EmptyState,
  ProjectDetail,
  Toast,
  SearchBar,
  GitHubSyncConfig,
} from './components';
import type { ToastData } from './components';
import { useStorage } from './hooks/useStorage';
import { getGitHubToken, loadFromGitHub } from './services/githubSync';
import type { ViewMode, Prompt, Project, PromptCategory, AppData } from './types';

function App() {
  // State
  const [activeTab, setActiveTab] = useState<ViewMode>('prompts');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalType, setModalType] = useState<'prompt' | 'project' | 'view-prompt' | 'github-sync' | null>(null);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<PromptCategory | 'all'>('all');

  // Storage hook
  const {
    prompts,
    projects,
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
  } = useStorage();

  // Toast helpers
  const showToast = useCallback((type: ToastData['type'], message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Carga automática desde GitHub al iniciar
  useEffect(() => {
    const loadFromGitHubOnStart = async () => {
      const token = getGitHubToken();
      if (!token) return;

      try {
        const data = await loadFromGitHub();
        if (data && (data.prompts.length > 0 || data.projects.length > 0)) {
          // Solo cargar si hay datos y si el localStorage está vacío o tiene menos datos
          const localData = localStorage.getItem('prompt-library-data');
          if (!localData || JSON.parse(localData).prompts.length < data.prompts.length) {
            importData(JSON.stringify(data));
            showToast('success', 'Datos sincronizados desde GitHub');
          }
        }
      } catch (error) {
        // Silencioso, no mostrar error si falla la carga automática
        console.log('No se pudo cargar desde GitHub (puede ser normal si es la primera vez)');
      }
    };

    loadFromGitHubOnStart();
  }, []); // Solo al montar

  // Import JSON event listener
  useEffect(() => {
    const handleImport = (e: CustomEvent<string>) => {
      const success = importData(e.detail);
      if (success) {
        showToast('success', 'Datos importados correctamente');
      } else {
        showToast('error', 'Error al importar los datos');
      }
    };

    window.addEventListener('import-json', handleImport as EventListener);
    return () => {
      window.removeEventListener('import-json', handleImport as EventListener);
    };
  }, [importData, showToast]);

  // Export handler
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-library-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'Biblioteca exportada correctamente');
  };

  // Import handler (triggered from Header component)
  const handleImportClick = () => {
    // The actual import is handled by the file input in Header
  };

  // Sync handler - Abre modal de configuración de GitHub
  const handleSync = () => {
    setModalType('github-sync');
  };

  // Handler para importar desde GitHub
  const handleImportFromGitHub = (data: AppData) => {
    const success = importData(JSON.stringify(data));
    if (success) {
      showToast('success', 'Datos importados desde GitHub correctamente');
    } else {
      showToast('error', 'Error al importar los datos');
    }
  };

  // Prompt handlers
  const handleCreatePrompt = () => {
    setEditingPrompt(null);
    setModalType('prompt');
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setModalType('prompt');
  };

  const handleViewPrompt = (prompt: Prompt) => {
    setViewingPrompt(prompt);
    setModalType('view-prompt');
  };

  const handleSavePrompt = (data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, data);
      showToast('success', 'Prompt actualizado');
    } else {
      addPrompt(data);
      showToast('success', 'Prompt creado');
    }
    setModalType(null);
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este prompt?')) {
      deletePrompt(id);
      showToast('success', 'Prompt eliminado');
    }
  };

  // Project handlers
  const handleCreateProject = () => {
    setEditingProject(null);
    setModalType('project');
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setModalType('project');
  };

  const handleSaveProject = (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingProject) {
      updateProject(editingProject.id, data);
      showToast('success', 'Proyecto actualizado');
      if (selectedProject?.id === editingProject.id) {
        setSelectedProject({ ...selectedProject, ...data });
      }
    } else {
      addProject(data);
      showToast('success', 'Proyecto creado');
    }
    setModalType(null);
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este proyecto? Los prompts asociados se convertirán en genéricos.')) {
      deleteProject(id);
      showToast('success', 'Proyecto eliminado');
      if (selectedProject?.id === id) {
        setSelectedProject(null);
      }
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  // Filter prompts
  const filteredPrompts = (promptList: Prompt[]) => {
    return promptList.filter(prompt => {
      const matchesSearch = 
        prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || prompt.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Get the prompts to display
  const genericPrompts = getGenericPrompts();
  const displayedPrompts = filteredPrompts(genericPrompts);

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary">
      {/* Background Glow Effect */}
      <div className="bg-glow" />

      {/* Header */}
      <Header
        onExport={handleExport}
        onImport={handleImportClick}
        onSync={handleSync}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <HeroSection
          promptCount={prompts.length}
          projectCount={projects.length}
        />

        {/* Tab Selector */}
        <TabSelector
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSelectedProject(null);
          }}
        />

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'prompts' && (
            <motion.div
              key="prompts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search and Filter */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
              />

              {/* Action Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleCreatePrompt}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-xl transition-all btn-glow"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Prompt
                </button>
              </div>

              {/* Prompts Grid or Empty State */}
              {displayedPrompts.length === 0 && genericPrompts.length === 0 ? (
                <EmptyState type="prompts" onAction={handleCreatePrompt} />
              ) : displayedPrompts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No se encontraron prompts con los filtros actuales.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPrompts.map((prompt, index) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      index={index}
                      onEdit={handleEditPrompt}
                      onDelete={handleDeletePrompt}
                      onView={handleViewPrompt}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'projects' && !selectedProject && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Action Button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleCreateProject}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-xl transition-all btn-glow"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Proyecto
                </button>
              </div>

              {/* Projects Grid or Empty State */}
              {projects.length === 0 ? (
                <EmptyState type="projects" onAction={handleCreateProject} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      promptCount={getPromptsForProject(project.id).length}
                      index={index}
                      onEdit={handleEditProject}
                      onDelete={handleDeleteProject}
                      onSelect={handleSelectProject}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'projects' && selectedProject && (
            <motion.div
              key="project-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectDetail
                project={selectedProject}
                prompts={getPromptsForProject(selectedProject.id)}
                onBack={() => setSelectedProject(null)}
                onEditProject={() => handleEditProject(selectedProject)}
                onDeleteProject={() => handleDeleteProject(selectedProject.id)}
                onCreatePrompt={handleCreatePrompt}
                onEditPrompt={handleEditPrompt}
                onDeletePrompt={handleDeletePrompt}
                onViewPrompt={handleViewPrompt}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <Modal
        isOpen={modalType === 'prompt'}
        onClose={() => { setModalType(null); setEditingPrompt(null); }}
        title={editingPrompt ? 'Editar Prompt' : 'Nuevo Prompt'}
        size="lg"
      >
        <PromptForm
          prompt={editingPrompt}
          projects={projects}
          currentProjectId={selectedProject?.id}
          onSave={handleSavePrompt}
          onCancel={() => { setModalType(null); setEditingPrompt(null); }}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'project'}
        onClose={() => { setModalType(null); setEditingProject(null); }}
        title={editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        size="md"
      >
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => { setModalType(null); setEditingProject(null); }}
        />
      </Modal>

      <Modal
        isOpen={modalType === 'view-prompt'}
        onClose={() => { setModalType(null); setViewingPrompt(null); }}
        title={viewingPrompt?.title || 'Ver Prompt'}
        size="lg"
      >
        {viewingPrompt && (
          <PromptViewer
            prompt={viewingPrompt}
            project={projects.find(p => p.id === viewingPrompt.projectId)}
            onEdit={() => {
              setEditingPrompt(viewingPrompt);
              setModalType('prompt');
              setViewingPrompt(null);
            }}
            onClose={() => { setModalType(null); setViewingPrompt(null); }}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'github-sync'}
        onClose={() => setModalType(null)}
        title="Sincronización con GitHub"
        size="lg"
      >
        <GitHubSyncConfig
          onClose={() => setModalType(null)}
          onImport={handleImportFromGitHub}
          onShowToast={(toast) => showToast(toast.type, toast.message)}
          currentData={{
            prompts,
            projects,
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
          }}
        />
      </Modal>

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;

