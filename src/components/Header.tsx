import { Download, Upload, RefreshCw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: () => void;
  onSync: () => void;
}

export function Header({ onExport, onImport, onSync }: HeaderProps) {
  return (
    <header className="relative z-10 border-b border-dark-border bg-dark-bg/80 backdrop-blur-lg sticky top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-accent to-emerald-soft flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-dark-bg" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              Prompt <span className="text-lime-accent">Library</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-slate-900/50 hover:bg-slate-800/50 border border-dark-border rounded-lg transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar JSON</span>
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary bg-slate-900/50 hover:bg-slate-800/50 border border-dark-border rounded-lg transition-all duration-200 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar JSON</span>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      onImport();
                      // Dispatch custom event with file content
                      window.dispatchEvent(new CustomEvent('import-json', { detail: content }));
                    };
                    reader.readAsText(file);
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>

            <button
              onClick={onSync}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-lg transition-all duration-200 btn-glow"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Sincronizar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

