import type { AppData } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';
const DATA_FILE_PATH = 'data/library.json';
const REPO_OWNER = 'CasualAIGames';
const REPO_NAME = 'promptlibrary';

interface GitHubFileContent {
  content: string;
  sha?: string;
}

/**
 * Obtiene el token de GitHub guardado en localStorage
 */
export function getGitHubToken(): string | null {
  return localStorage.getItem('github_token');
}

/**
 * Guarda el token de GitHub
 */
export function setGitHubToken(token: string): void {
  localStorage.setItem('github_token', token);
}

/**
 * Elimina el token de GitHub
 */
export function removeGitHubToken(): void {
  localStorage.removeItem('github_token');
}

/**
 * Lee el contenido del archivo JSON desde GitHub
 */
export async function loadFromGitHub(): Promise<AppData | null> {
  const token = getGitHubToken();
  if (!token) {
    throw new Error('No hay token de GitHub configurado');
  }

  try {
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_FILE_PATH}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (response.status === 404) {
      // El archivo no existe aún, retornar null
      return null;
    }

    if (!response.ok) {
      throw new Error(`Error al cargar: ${response.statusText}`);
    }

    const data: GitHubFileContent = await response.json();
    const content = atob(data.content); // Decodificar base64
    return JSON.parse(content) as AppData;
  } catch (error) {
    console.error('Error al cargar desde GitHub:', error);
    throw error;
  }
}

/**
 * Guarda el contenido en el archivo JSON de GitHub
 */
export async function saveToGitHub(data: AppData): Promise<void> {
  const token = getGitHubToken();
  if (!token) {
    throw new Error('No hay token de GitHub configurado');
  }

  try {
    // Primero intentar leer el archivo para obtener el SHA (si existe)
    let sha: string | undefined;
    try {
      const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_FILE_PATH}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.ok) {
        const fileData: GitHubFileContent = await response.json();
        sha = fileData.sha;
      }
    } catch (error) {
      // El archivo no existe, continuar sin SHA
    }

    // Preparar el contenido
    const content = JSON.stringify(data, null, 2);
    const encodedContent = btoa(unescape(encodeURIComponent(content)));

    // Crear o actualizar el archivo
    const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${DATA_FILE_PATH}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Actualizar biblioteca de prompts - ${new Date().toISOString()}`,
        content: encodedContent,
        sha, // Si existe, actualiza; si no, crea nuevo
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Error al guardar: ${error.message || response.statusText}`);
    }
  } catch (error) {
    console.error('Error al guardar en GitHub:', error);
    throw error;
  }
}

/**
 * Verifica si el token es válido
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/user`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

