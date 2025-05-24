import { useState, useCallback } from 'react';
import { Shelf, ShelfState, ShelfDragEvent, ShelfTransformEvent, DEFAULT_SHELF_DIMENSIONS } from '@/types/shelf';

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const useShelfPlacement = () => {
  const [state, setState] = useState<ShelfState>({
    shelves: [],
    selectedShelfId: null,
    activeTool: 'select',
  });

  const setActiveTool = useCallback((tool: 'select' | 'shelf') => {
    setState(prev => ({
      ...prev,
      activeTool: tool,
      selectedShelfId: tool === 'select' ? prev.selectedShelfId : null,
    }));
  }, []);

  const handleCanvasClick = useCallback((point: { x: number; y: number }) => {
    if (state.activeTool === 'shelf') {
      // Créer un nouveau rayon
      const newShelf: Shelf = {
        id: generateId(),
        position: {
          x: point.x - DEFAULT_SHELF_DIMENSIONS.width / 2,
          y: point.y - DEFAULT_SHELF_DIMENSIONS.height / 2,
        },
        width: DEFAULT_SHELF_DIMENSIONS.width,
        height: DEFAULT_SHELF_DIMENSIONS.height,
        rotation: 0,
        zIndex: Date.now(), // Z-index basé sur le timestamp
      };

      setState(prev => ({
        ...prev,
        shelves: [...prev.shelves, newShelf],
        selectedShelfId: newShelf.id, // Auto-sélection
        activeTool: 'select', // Retour au mode sélection
      }));
    } else {
      // Mode sélection : désélectionner si clic sur vide
      setState(prev => ({
        ...prev,
        selectedShelfId: null,
      }));
    }
  }, [state.activeTool]);

  const handleShelfSelect = useCallback((shelfId: string) => {
    setState(prev => ({
      ...prev,
      selectedShelfId: prev.selectedShelfId === shelfId ? null : shelfId,
    }));
  }, []);

  const handleShelfDrag = useCallback((event: ShelfDragEvent) => {
    setState(prev => ({
      ...prev,
      shelves: prev.shelves.map(shelf =>
        shelf.id === event.shelfId
          ? { ...shelf, position: event.newPosition }
          : shelf
      ),
    }));
  }, []);

  const handleShelfTransform = useCallback((event: ShelfTransformEvent) => {
    setState(prev => ({
      ...prev,
      shelves: prev.shelves.map(shelf =>
        shelf.id === event.shelfId
          ? {
              ...shelf,
              width: event.width,
              height: event.height,
              rotation: event.rotation,
              position: event.position,
            }
          : shelf
      ),
    }));
  }, []);

  const deleteSelectedShelf = useCallback(() => {
    if (!state.selectedShelfId) return;

    setState(prev => ({
      ...prev,
      shelves: prev.shelves.filter(shelf => shelf.id !== prev.selectedShelfId),
      selectedShelfId: null,
    }));
  }, [state.selectedShelfId]);

  const duplicateSelectedShelf = useCallback(() => {
    if (!state.selectedShelfId) return;

    const selectedShelf = state.shelves.find(s => s.id === state.selectedShelfId);
    if (!selectedShelf) return;

    const duplicatedShelf: Shelf = {
      ...selectedShelf,
      id: generateId(),
      position: {
        x: selectedShelf.position.x + 20,
        y: selectedShelf.position.y + 20,
      },
      zIndex: Date.now(),
    };

    setState(prev => ({
      ...prev,
      shelves: [...prev.shelves, duplicatedShelf],
      selectedShelfId: duplicatedShelf.id,
    }));
  }, [state.selectedShelfId, state.shelves]);

  const updateShelf = useCallback((shelfId: string, updates: Partial<Shelf>) => {
    setState(prev => ({
      ...prev,
      shelves: prev.shelves.map(shelf =>
        shelf.id === shelfId ? { ...shelf, ...updates } : shelf
      ),
    }));
  }, []);

  const getSelectedShelf = useCallback(() => {
    return state.shelves.find(shelf => shelf.id === state.selectedShelfId) || null;
  }, [state.shelves, state.selectedShelfId]);

  return {
    ...state,
    setActiveTool,
    handleCanvasClick,
    handleShelfSelect,
    handleShelfDrag,
    handleShelfTransform,
    updateShelf,
    getSelectedShelf,
    deleteSelectedShelf,
    duplicateSelectedShelf,
  };
};