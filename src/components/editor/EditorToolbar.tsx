import React from 'react';
import { cn } from '@/lib/utils';
import { Move, Square, Grid3X3, Undo2, Redo2, Check, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface EditorToolbarProps {
  activeTool: 'select' | 'wall';
  onToolSelect: (tool: 'select' | 'wall') => void;
  gridVisible: boolean;
  onToggleGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  wallsCount: number;
  onValidateWalls: () => void;
  // Nouveaux props pour le zoom
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onResetZoom: () => void;
}

export default function EditorToolbar({
  activeTool,
  onToolSelect,
  gridVisible,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  wallsCount,
  onValidateWalls,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onResetZoom,
}: EditorToolbarProps) {
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
              "w-12 h-12 rounded-lg flex items-center justify-center transition-colors relative",
              activeTool === tool.id
                ? "bg-[#0A5B91] text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <tool.icon size={20} />
            {tool.id === 'wall' && wallsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wallsCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contrôles de vue */}
      <div className="border-t border-gray-200 p-2 space-y-2">
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

      {/* Contrôles de zoom */}
      <div className="border-t border-gray-200 p-2 space-y-2">
        <button
          onClick={onZoomIn}
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:bg-gray-100"
          title="Zoomer (+)"
        >
          <ZoomIn size={20} />
        </button>
        
        <button
          onClick={onZoomOut}
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:bg-gray-100"
          title="Dézoomer (-)"
        >
          <ZoomOut size={20} />
        </button>
        
        <button
          onClick={onZoomToFit}
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors text-gray-600 hover:bg-gray-100"
          title="Ajuster à la fenêtre (0)"
        >
          <Maximize2 size={20} />
        </button>
        
        {/* Indicateur de zoom */}
        <div className="w-12 h-6 rounded text-xs bg-gray-100 flex items-center justify-center text-gray-600">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto border-t border-gray-200 p-2 space-y-2">
        {/* Validation des murs */}
        {wallsCount > 0 && (
          <button
            onClick={onValidateWalls}
            className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors bg-green-600 text-white hover:bg-green-700"
            title={`Valider ${wallsCount} mur(s) et passer aux rayons`}
          >
            <Check size={20} />
          </button>
        )}
        
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