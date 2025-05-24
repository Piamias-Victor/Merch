"use client";

import React, { useState, useEffect } from 'react';
import { Shelf } from '@/types/shelf';
import { Package, X, RotateCw, Move, Maximize2 } from 'lucide-react';

interface PropertiesPanelProps {
  selectedShelf: Shelf | null;
  onUpdateShelf: (updates: Partial<Shelf>) => void;
  onDeleteShelf: () => void;
  onDuplicateShelf: () => void;
}

export default function PropertiesPanel({
  selectedShelf,
  onUpdateShelf,
  onDeleteShelf,
  onDuplicateShelf,
}: PropertiesPanelProps) {
  const [localValues, setLocalValues] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    rotation: 0,
  });

  // Synchroniser les valeurs locales avec le rayon sélectionné
  useEffect(() => {
    if (selectedShelf) {
      setLocalValues({
        width: Math.round(selectedShelf.width),
        height: Math.round(selectedShelf.height),
        x: Math.round(selectedShelf.position.x),
        y: Math.round(selectedShelf.position.y),
        rotation: Math.round(selectedShelf.rotation),
      });
    }
  }, [selectedShelf]);

  const handleInputChange = (field: keyof typeof localValues, value: number) => {
    if (!selectedShelf) return;

    setLocalValues(prev => ({ ...prev, [field]: value }));

    // Appliquer immédiatement les changements
    if (field === 'width' || field === 'height') {
      onUpdateShelf({
        [field]: Math.max(20, value), // Taille minimale
      });
    } else if (field === 'x' || field === 'y') {
      onUpdateShelf({
        position: {
          ...selectedShelf.position,
          [field]: value,
        },
      });
    } else if (field === 'rotation') {
      onUpdateShelf({
        rotation: value,
      });
    }
  };

  const handleInputBlur = (field: keyof typeof localValues) => {
    // Corriger les valeurs invalides au blur
    if (field === 'width' || field === 'height') {
      const correctedValue = Math.max(20, localValues[field]);
      if (correctedValue !== localValues[field]) {
        setLocalValues(prev => ({ ...prev, [field]: correctedValue }));
        onUpdateShelf({ [field]: correctedValue });
      }
    }
  };

  if (!selectedShelf) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rayon sélectionné</h3>
          <p className="text-sm">
            Cliquez sur un rayon dans le plan pour voir ses propriétés
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package size={20} className="text-[#0A5B91] mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Propriétés du rayon</h3>
          </div>
          <button
            onClick={onDeleteShelf}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Supprimer le rayon"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          ID: {selectedShelf.id.slice(0, 8)}...
        </p>
      </div>

      {/* Propriétés */}
      <div className="flex-1 p-4 space-y-6">
        {/* Dimensions */}
        <div>
          <div className="flex items-center mb-3">
            <Maximize2 size={16} className="text-gray-600 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Dimensions</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Largeur (px)
              </label>
              <input
                type="number"
                min="20"
                value={localValues.width}
                onChange={(e) => handleInputChange('width', parseInt(e.target.value) || 0)}
                onBlur={() => handleInputBlur('width')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Hauteur (px)
              </label>
              <input
                type="number"
                min="20"
                value={localValues.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
                onBlur={() => handleInputBlur('height')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div>
          <div className="flex items-center mb-3">
            <Move size={16} className="text-gray-600 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Position</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                X (px)
              </label>
              <input
                type="number"
                value={localValues.x}
                onChange={(e) => handleInputChange('x', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Y (px)
              </label>
              <input
                type="number"
                value={localValues.y}
                onChange={(e) => handleInputChange('y', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <div className="flex items-center mb-3">
            <RotateCw size={16} className="text-gray-600 mr-2" />
            <h4 className="text-sm font-medium text-gray-900">Rotation</h4>
          </div>
          
          <div className="space-y-2">
            <input
              type="number"
              min="-360"
              max="360"
              value={localValues.rotation}
              onChange={(e) => handleInputChange('rotation', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
            />
            <div className="text-xs text-gray-500">
              Angle en degrés (-360° à 360°)
            </div>
          </div>
        </div>

        {/* Raccourcis rapides */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Actions rapides</h4>
          <div className="space-y-2">
            <button
              onClick={() => handleInputChange('rotation', 0)}
              className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Remettre à 0°
            </button>
            <button
              onClick={() => handleInputChange('rotation', localValues.rotation + 90)}
              className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Tourner de 90°
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <button
          onClick={onDuplicateShelf}
          className="w-full px-4 py-2 bg-[#0A5B91] text-white rounded-md hover:bg-[#084c78] transition-colors text-sm font-medium"
        >
          Dupliquer le rayon
        </button>
        <button
          onClick={onDeleteShelf}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Supprimer le rayon
        </button>
      </div>
    </div>
  );
}