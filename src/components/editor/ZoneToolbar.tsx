import React from 'react';
import { cn } from '@/lib/utils';
import { Grid3X3, ZoomIn, ZoomOut, Maximize2, MapPin, Check } from 'lucide-react';

interface ZoneToolbarProps {
  gridVisible: boolean;
  onToggleGrid: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onResetZoom: () => void;
  onFinishPlan: () => void;
}

export default function ZoneToolbar({
  gridVisible,
  onToggleGrid,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onResetZoom,
  onFinishPlan,
}: ZoneToolbarProps) {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col">
      {/* Outils zones */}
      <div className="p-2 space-y-2">
        <div className="w-12 h-12 rounded-lg bg-[#0A5B91]/10 flex items-center justify-center">
          <MapPin size={20} className="text-[#0A5B91]" />
        </div>
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

      {/* Actions finales */}
      <div className="mt-auto border-t border-gray-200 p-2 space-y-2">
        <button
          onClick={onFinishPlan}
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors bg-green-600 text-white hover:bg-green-700"
          title="Finaliser le plan complet"
        >
          <Check size={20} />
        </button>
      </div>
    </div>
  );
}