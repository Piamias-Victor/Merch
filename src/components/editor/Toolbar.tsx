"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Move, Square, Grid3X3, Undo2, Redo2 } from 'lucide-react';

interface ToolbarProps {
  activeTool: 'wall' | 'select' | null;
  onToolSelect: (tool: 'wall' | 'select') => void;
  gridVisible: boolean;
  onToggleGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export default function Toolbar({
  activeTool,
  onToolSelect,
  gridVisible,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: ToolbarProps) {
  const tools = [
    { id: 'select' as const, icon: Move, label: 'Sélection', shortcut: 'V' },
    { id: 'wall' as const, icon: Square, label: 'Mur', shortcut: 'W' },
  ];

  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
      {/* Outils principaux */}
      <div className="p-2 space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center transition-colors group relative",
              activeTool === tool.id
                ? "bg-[#0A5B91] text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon size={20} />
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 p-2 space-y-2">
        {/* Toggle grille */}
        <button
          onClick={onToggleGrid}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
            gridVisible
              ? "bg-gray-100 text-gray-700"
              : "text-gray-400 hover:bg-gray-50"
          )}
          title="Afficher/Masquer la grille"
        >
          <Grid3X3 size={20} />
        </button>
      </div>

      {/* Actions */}
      <div className="mt-auto border-t border-gray-200 p-2 space-y-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
            canUndo
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 cursor-not-allowed"
          )}
          title="Annuler (Ctrl+Z)"
        >
          <Undo2 size={20} />
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
            canRedo
              ? "text-gray-600 hover:bg-gray-100"
              : "text-gray-300 cursor-not-allowed"
          )}
          title="Rétablir (Ctrl+Y)"
        >
          <Redo2 size={20} />
        </button>
      </div>
    </div>
  );
}