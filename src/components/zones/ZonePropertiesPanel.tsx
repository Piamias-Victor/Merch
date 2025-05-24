"use client";

import React, { useState, useEffect } from 'react';
import { Zone, ZoneCategory, ZONE_CATEGORIES } from '@/types/zone';
import { MapPin, X, Palette, Type, Maximize2, Move, TrendingUp, Building2 } from 'lucide-react';

interface ZonePropertiesPanelProps {
  selectedZone: Zone | null;
  onUpdateZone: (updates: Partial<Zone>) => void;
  onDeleteZone: () => void;
  onDuplicateZone: () => void;
}

export default function ZonePropertiesPanel({
  selectedZone,
  onUpdateZone,
  onDeleteZone,
  onDuplicateZone,
}: ZonePropertiesPanelProps) {
  const [localValues, setLocalValues] = useState({
    name: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Synchroniser les valeurs locales avec la zone sélectionnée
  useEffect(() => {
    if (selectedZone) {
      setLocalValues({
        name: selectedZone.name,
        x: Math.round(selectedZone.bounds.x),
        y: Math.round(selectedZone.bounds.y),
        width: Math.round(selectedZone.bounds.width),
        height: Math.round(selectedZone.bounds.height),
      });
    }
  }, [selectedZone]);

  const handleNameChange = (value: string) => {
    setLocalValues(prev => ({ ...prev, name: value }));
    onUpdateZone({ name: value });
  };

  const handleCategoryChange = (category: ZoneCategory) => {
    const categoryData = ZONE_CATEGORIES[category];
    onUpdateZone({ 
      category, 
      color: categoryData.color,
      businessData: {
        ...categoryData.averageData,
        ca: categoryData.averageData.ca + (Math.random() - 0.5) * 20000,
        caPercentage: categoryData.averageData.caPercentage + (Math.random() - 0.5) * 4,
        margin: categoryData.averageData.margin + (Math.random() - 0.5) * 8000,
        marginPercentage: categoryData.averageData.marginPercentage + (Math.random() - 0.5) * 4,
        topLabs: categoryData.averageData.topLabs.map(lab => ({
          ...lab,
          ca: lab.ca + (Math.random() - 0.5) * 5000,
          margin: lab.margin + (Math.random() - 0.5) * 2000
        }))
      }
    });
  };

  const handleColorChange = (color: string) => {
    onUpdateZone({ color });
  };

  const handleInputChange = (field: 'x' | 'y' | 'width' | 'height', value: number) => {
    if (!selectedZone) return;

    setLocalValues(prev => ({ ...prev, [field]: value }));

    if (field === 'width' || field === 'height') {
      onUpdateZone({
        bounds: {
          ...selectedZone.bounds,
          [field]: Math.max(50, value),
        }
      });
    } else if (field === 'x' || field === 'y') {
      onUpdateZone({
        bounds: {
          ...selectedZone.bounds,
          [field]: value,
        }
      });
    }
  };

  const handleInputBlur = (field: 'width' | 'height') => {
    const correctedValue = Math.max(50, localValues[field]);
    if (correctedValue !== localValues[field]) {
      setLocalValues(prev => ({ ...prev, [field]: correctedValue }));
      if (selectedZone) {
        onUpdateZone({
          bounds: {
            ...selectedZone.bounds,
            [field]: correctedValue,
          }
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => `${percentage.toFixed(1)}%`;

  if (!selectedZone) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune zone sélectionnée</h3>
          <p className="text-sm">
            Cliquez sur une zone dans le plan pour voir ses propriétés
          </p>
        </div>
      </div>
    );
  }

  const categoryData = ZONE_CATEGORIES[selectedZone.category];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin size={20} className="text-[#0A5B91] mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Propriétés de la zone</h3>
          </div>
          <button
            onClick={onDeleteZone}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Supprimer la zone"
          >
            <X size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          ID: {selectedZone.id.slice(0, 8)}...
        </p>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Informations générales */}
          <div>
            <div className="flex items-center mb-3">
              <Type size={16} className="text-gray-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Informations générales</h4>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                value={localValues.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
                placeholder="Nom de la zone"
              />
              
              <select
                value={selectedZone.category}
                onChange={(e) => handleCategoryChange(e.target.value as ZoneCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
              >
                {Object.entries(ZONE_CATEGORIES).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.label}
                  </option>
                ))}
              </select>
              
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedZone.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={selectedZone.color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#0A5B91] focus:border-[#0A5B91]"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Données financières de la zone */}
          <div>
            <div className="flex items-center mb-3">
              <TrendingUp size={16} className="text-green-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Performance financière</h4>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(selectedZone.businessData.ca)}
                  </div>
                  <div className="text-xs text-gray-600">
                    CA ({formatPercentage(selectedZone.businessData.caPercentage)})
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(selectedZone.businessData.margin)}
                  </div>
                  <div className="text-xs text-gray-600">
                    Marge ({formatPercentage(selectedZone.businessData.marginPercentage)})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Laboratoires */}
          <div>
            <div className="flex items-center mb-3">
              <Building2 size={16} className="text-purple-600 mr-2" />
              <h4 className="text-sm font-medium text-gray-900">Top 3 Laboratoires</h4>
            </div>
            
            <div className="space-y-3">
              {selectedZone.businessData.topLabs.map((lab, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900">
                      #{index + 1} {lab.name}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {formatPercentage(lab.caPercentage)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600">CA:</span>
                      <span className="font-medium ml-1">{formatCurrency(lab.ca)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Marge:</span>
                      <span className="font-medium ml-1">{formatCurrency(lab.margin)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">
                      Marge: {formatPercentage(lab.marginPercentage)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, lab.caPercentage * 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  min="50"
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
                  min="50"
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

          {/* Actions rapides */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Actions rapides</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryChange(selectedZone.category)}
                className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Réinitialiser les données
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleInputChange('width', selectedZone.bounds.width + 50)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  + 50px L
                </button>
                <button
                  onClick={() => handleInputChange('height', selectedZone.bounds.height + 50)}
                  className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  + 50px H
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <button
          onClick={onDuplicateZone}
          className="w-full px-4 py-2 bg-[#0A5B91] text-white rounded-md hover:bg-[#084c78] transition-colors text-sm font-medium"
        >
          Dupliquer la zone
        </button>
        <button
          onClick={onDeleteZone}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Supprimer la zone
        </button>
      </div>
    </div>
  );
}