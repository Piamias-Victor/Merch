import { useState, useCallback } from 'react';
import { Zone, ZoneState, ZoneCategory, ZoneDragEvent, ZoneResizeEvent, ZONE_CATEGORIES, Point } from '@/types/zone';

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const useZoneCreation = () => {
  const [state, setState] = useState<ZoneState>({
    zones: [],
    selectedZoneId: null,
    activeTool: 'select',
    isDrawing: false,
    currentCategory: ZoneCategory.DERMOCOSMETIC,
    drawStart: null,
  });

  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });

  const setActiveTool = useCallback((tool: 'select' | 'zone') => {
    setState(prev => ({
      ...prev,
      activeTool: tool,
      selectedZoneId: tool === 'select' ? prev.selectedZoneId : null,
      isDrawing: false,
      drawStart: null,
    }));
  }, []);

  const setCurrentCategory = useCallback((category: ZoneCategory) => {
    setState(prev => ({
      ...prev,
      currentCategory: category,
    }));
  }, []);

  const handleMouseDown = useCallback((point: Point) => {
    if (state.activeTool === 'zone') {
      setState(prev => ({
        ...prev,
        isDrawing: true,
        drawStart: point,
        selectedZoneId: null,
      }));
    }
  }, [state.activeTool]);

  const handleMouseMove = useCallback((point: Point) => {
    setMousePosition(point);
  }, []);

  const handleMouseUp = useCallback((point: Point) => {
    if (state.isDrawing && state.drawStart && state.activeTool === 'zone') {
      const minSize = 50; // Taille minimale d'une zone
      
      const bounds = {
        x: Math.min(state.drawStart.x, point.x),
        y: Math.min(state.drawStart.y, point.y),
        width: Math.abs(point.x - state.drawStart.x),
        height: Math.abs(point.y - state.drawStart.y),
      };

      // Créer la zone seulement si elle est assez grande
      if (bounds.width >= minSize && bounds.height >= minSize) {
        const categoryData = ZONE_CATEGORIES[state.currentCategory];
        
        const newZone: Zone = {
          id: generateId(),
          name: `${categoryData.label} ${state.zones.filter(z => z.category === state.currentCategory).length + 1}`,
          category: state.currentCategory,
          bounds,
          color: categoryData.color,
          zIndex: Date.now(),
          businessData: {
            ca: categoryData.averageData.ca + (Math.random() - 0.5) * 20000, // Variation ±10k
            caPercentage: categoryData.averageData.caPercentage + (Math.random() - 0.5) * 4, // Variation ±2%
            margin: categoryData.averageData.margin + (Math.random() - 0.5) * 8000, // Variation ±4k
            marginPercentage: categoryData.averageData.marginPercentage + (Math.random() - 0.5) * 4, // Variation ±2%
            topLabs: categoryData.averageData.topLabs.map(lab => ({
              ...lab,
              ca: lab.ca + (Math.random() - 0.5) * 5000, // Variation ±2.5k
              margin: lab.margin + (Math.random() - 0.5) * 2000 // Variation ±1k
            }))
          }
        };

        setState(prev => ({
          ...prev,
          zones: [...prev.zones, newZone],
          selectedZoneId: newZone.id,
          isDrawing: false,
          drawStart: null,
          activeTool: 'select', // Retour au mode sélection
        }));
      } else {
        // Annuler si trop petit
        setState(prev => ({
          ...prev,
          isDrawing: false,
          drawStart: null,
        }));
      }
    }
  }, [state.isDrawing, state.drawStart, state.activeTool, state.currentCategory, state.zones]);

  const handleCanvasClick = useCallback((point: Point) => {
    if (state.activeTool === 'select') {
      // Désélectionner si clic sur vide
      setState(prev => ({
        ...prev,
        selectedZoneId: null,
      }));
    }
  }, [state.activeTool]);

  const handleZoneSelect = useCallback((zoneId: string) => {
    setState(prev => ({
      ...prev,
      selectedZoneId: prev.selectedZoneId === zoneId ? null : zoneId,
    }));
  }, []);

  const handleZoneDrag = useCallback((event: ZoneDragEvent) => {
    setState(prev => ({
      ...prev,
      zones: prev.zones.map(zone =>
        zone.id === event.zoneId
          ? { ...zone, bounds: event.newBounds }
          : zone
      ),
    }));
  }, []);

  const handleZoneResize = useCallback((event: ZoneResizeEvent) => {
    setState(prev => ({
      ...prev,
      zones: prev.zones.map(zone =>
        zone.id === event.zoneId
          ? { ...zone, bounds: event.newBounds }
          : zone
      ),
    }));
  }, []);

  const updateZone = useCallback((zoneId: string, updates: Partial<Zone>) => {
    setState(prev => ({
      ...prev,
      zones: prev.zones.map(zone =>
        zone.id === zoneId ? { ...zone, ...updates } : zone
      ),
    }));
  }, []);

  const deleteSelectedZone = useCallback(() => {
    if (!state.selectedZoneId) return;

    setState(prev => ({
      ...prev,
      zones: prev.zones.filter(zone => zone.id !== prev.selectedZoneId),
      selectedZoneId: null,
    }));
  }, [state.selectedZoneId]);

  const duplicateSelectedZone = useCallback(() => {
    if (!state.selectedZoneId) return;

    const selectedZone = state.zones.find(z => z.id === state.selectedZoneId);
    if (!selectedZone) return;

    const duplicatedZone: Zone = {
      ...selectedZone,
      id: generateId(),
      name: `${selectedZone.name} (copie)`,
      bounds: {
        ...selectedZone.bounds,
        x: selectedZone.bounds.x + 20,
        y: selectedZone.bounds.y + 20,
      },
      zIndex: Date.now(),
      businessData: {
        ...selectedZone.businessData,
        // Légère variation pour la copie
        ca: selectedZone.businessData.ca * (0.9 + Math.random() * 0.2),
        margin: selectedZone.businessData.margin * (0.9 + Math.random() * 0.2),
        topLabs: selectedZone.businessData.topLabs.map(lab => ({
          ...lab,
          ca: lab.ca * (0.9 + Math.random() * 0.2),
          margin: lab.margin * (0.9 + Math.random() * 0.2)
        }))
      }
    };

    setState(prev => ({
      ...prev,
      zones: [...prev.zones, duplicatedZone],
      selectedZoneId: duplicatedZone.id,
    }));
  }, [state.selectedZoneId, state.zones]);

  const getSelectedZone = useCallback(() => {
    return state.zones.find(zone => zone.id === state.selectedZoneId) || null;
  }, [state.zones, state.selectedZoneId]);

  const getPreviewZone = useCallback((): Zone | null => {
    if (!state.isDrawing || !state.drawStart) return null;

    const bounds = {
      x: Math.min(state.drawStart.x, mousePosition.x),
      y: Math.min(state.drawStart.y, mousePosition.y),
      width: Math.abs(mousePosition.x - state.drawStart.x),
      height: Math.abs(mousePosition.y - state.drawStart.y),
    };

    const categoryData = ZONE_CATEGORIES[state.currentCategory];

    return {
      id: 'preview',
      name: 'Nouvelle zone',
      category: state.currentCategory,
      bounds,
      color: categoryData.color,
      zIndex: 99999,
      businessData: categoryData.averageData, // Données par défaut pour le preview
    };
  }, [state.isDrawing, state.drawStart, state.currentCategory, mousePosition]);

  return {
    ...state,
    mousePosition,
    setActiveTool,
    setCurrentCategory,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasClick,
    handleZoneSelect,
    handleZoneDrag,
    handleZoneResize,
    updateZone,
    deleteSelectedZone,
    duplicateSelectedZone,
    getSelectedZone,
    getPreviewZone,
  };
};