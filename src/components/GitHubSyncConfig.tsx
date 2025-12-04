import { useState } from 'react';
import { Github, Key, CheckCircle, XCircle, Loader, Save, Download, Upload } from 'lucide-react';
import { getGitHubToken, setGitHubToken, removeGitHubToken, verifyToken, loadFromGitHub, saveToGitHub } from '../services/githubSync';
import type { AppData } from '../types';
import type { ToastData } from './Toast';

interface GitHubSyncConfigProps {
  onClose: () => void;
  onImport: (data: AppData) => void;
  onShowToast: (toast: ToastData) => void;
  currentData: AppData;
}

export function GitHubSyncConfig({ onClose, onImport, onShowToast, currentData }: GitHubSyncConfigProps) {
  const [token, setToken] = useState(getGitHubToken() || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const handleVerifyToken = async () => {
    if (!token.trim()) {
      onShowToast({ id: crypto.randomUUID(), type: 'error', message: 'Por favor, introduce un token' });
      return;
    }

    setIsVerifying(true);
    try {
      const isValid = await verifyToken(token);
      setIsTokenValid(isValid);
      if (isValid) {
        setGitHubToken(token);
        onShowToast({ id: crypto.randomUUID(), type: 'success', message: 'Token válido y guardado' });
      } else {
        onShowToast({ id: crypto.randomUUID(), type: 'error', message: 'Token inválido. Verifica que tenga permisos de repo' });
      }
    } catch (error) {
      setIsTokenValid(false);
      onShowToast({ id: crypto.randomUUID(), type: 'error', message: 'Error al verificar el token' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSaveToGitHub = async () => {
    if (!token.trim() || !isTokenValid) {
      onShowToast({ id: crypto.randomUUID(), type: 'error', message: 'Primero verifica un token válido' });
      return;
    }

    setIsSaving(true);
    try {
      await saveToGitHub(currentData);
      onShowToast({ id: crypto.randomUUID(), type: 'success', message: 'Datos guardados en GitHub correctamente' });
    } catch (error: any) {
      onShowToast({ id: crypto.randomUUID(), type: 'error', message: error.message || 'Error al guardar en GitHub' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadFromGitHub = async () => {
    if (!token.trim() || !isTokenValid) {
      onShowToast({ id: crypto.randomUUID(), type: 'error', message: 'Primero verifica un token válido' });
      return;
    }

    setIsLoading(true);
    try {
      const data = await loadFromGitHub();
      if (data) {
        onImport(data);
        onShowToast({ id: crypto.randomUUID(), type: 'success', message: 'Datos cargados desde GitHub correctamente' });
      } else {
        onShowToast({ id: crypto.randomUUID(), type: 'info', message: 'No hay datos guardados en GitHub aún' });
      }
    } catch (error: any) {
      onShowToast({ id: crypto.randomUUID(), type: 'error', message: error.message || 'Error al cargar desde GitHub' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveToken = () => {
    removeGitHubToken();
    setToken('');
    setIsTokenValid(null);
    onShowToast({ id: crypto.randomUUID(), type: 'info', message: 'Token eliminado' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
          <Github className="w-5 h-5 text-lime-accent" />
          Sincronización con GitHub
        </h3>
        <p className="text-sm text-text-secondary">
          Configura un Personal Access Token para sincronizar automáticamente tus prompts entre dispositivos.
        </p>
      </div>

      {/* Token Input */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          <Key className="w-4 h-4 inline mr-1" />
          GitHub Personal Access Token
        </label>
        <div className="flex gap-2">
          <input
            type="password"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setIsTokenValid(null);
            }}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            className="flex-1 px-4 py-3 bg-slate-900/50 border border-dark-border rounded-xl text-text-primary placeholder-text-muted focus:border-lime-accent focus:ring-2 focus:ring-lime-accent/20 transition-all"
          />
          <button
            onClick={handleVerifyToken}
            disabled={isVerifying || !token.trim()}
            className="px-4 py-3 bg-lime-accent hover:bg-lime-hover text-dark-bg font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Verificar
              </>
            )}
          </button>
        </div>

        {/* Token Status */}
        {isTokenValid !== null && (
          <div className={`mt-2 flex items-center gap-2 text-sm ${isTokenValid ? 'text-emerald-400' : 'text-red-400'}`}>
            {isTokenValid ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Token válido
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Token inválido
              </>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 p-4 bg-slate-900/50 border border-dark-border rounded-xl">
          <p className="text-xs text-text-secondary mb-2 font-semibold">Cómo crear un token:</p>
          <ol className="text-xs text-text-muted space-y-1 list-decimal list-inside">
            <li>Ve a <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-lime-accent hover:underline">GitHub Settings → Developer settings → Personal access tokens</a></li>
            <li>Haz clic en "Generate new token (classic)"</li>
            <li>Nombre: "Prompt Library Sync"</li>
            <li>Selecciona el permiso: <strong>repo</strong> (acceso completo a repositorios)</li>
            <li>Copia el token y pégalo arriba</li>
          </ol>
          {token && isTokenValid && (
            <button
              onClick={handleRemoveToken}
              className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Eliminar token
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      {isTokenValid && (
        <div className="space-y-3 pt-4 border-t border-dark-border">
          <button
            onClick={handleSaveToGitHub}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-dark-bg bg-lime-accent hover:bg-lime-hover rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar en GitHub ahora
              </>
            )}
          </button>

          <button
            onClick={handleLoadFromGitHub}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-text-primary bg-slate-800 hover:bg-slate-700 border border-dark-border rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Cargar desde GitHub
              </>
            )}
          </button>
        </div>
      )}

      {/* Close Button */}
      <div className="flex justify-end pt-4 border-t border-dark-border">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-slate-800 rounded-lg transition-all"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

