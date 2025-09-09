import React from 'react';
import type { EditorSettings } from '../types';

const STORAGE_KEY = 'graphic_editor_settings_v1';

export function useEditorSettings(initial?: Partial<EditorSettings>) {
  const [settings, setSettings] = React.useState<EditorSettings>(() => {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage) {
      try {
        const parsed = JSON.parse(fromStorage) as EditorSettings;
        return parsed;
      } catch {}
    }
    return {
      gridSize: initial?.gridSize ?? 20,
      showGrid: initial?.showGrid ?? true,
      snapToGrid: initial?.snapToGrid ?? true,
      strokeColor: initial?.strokeColor ?? '#000000',
      strokeWidth: initial?.strokeWidth ?? 2,
    };
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return { settings, setSettings } as const;
}


