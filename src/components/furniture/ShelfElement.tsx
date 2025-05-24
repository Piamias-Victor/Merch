"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { Group, Rect, Transformer } from 'react-konva';
import { Shelf, ShelfDragEvent, ShelfTransformEvent } from '@/types/shelf';

interface ShelfElementProps {
  shelf: Shelf;
  isSelected: boolean;
  onSelect: (shelfId: string) => void;
  onDrag: (event: ShelfDragEvent) => void;
  onTransform: (event: ShelfTransformEvent) => void;
  viewport: { scale: number };
}

export default function ShelfElement({
  shelf,
  isSelected,
  onSelect,
  onDrag,
  onTransform,
  viewport,
}: ShelfElementProps) {
  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  // Attacher le Transformer au Group sélectionné
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleClick = useCallback((e: any) => {
    e.cancelBubble = true; // Empêche la propagation vers le Stage
    onSelect(shelf.id);
  }, [shelf.id, onSelect]);

  const handleDragEnd = useCallback((e: any) => {
    onDrag({
      shelfId: shelf.id,
      newPosition: {
        x: e.target.x(),
        y: e.target.y(),
      },
    });
  }, [shelf.id, onDrag]);

  const handleTransformEnd = useCallback(() => {
    if (!groupRef.current) return;

    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Récupérer les nouvelles dimensions
    const newWidth = Math.max(20, shelf.width * scaleX);
    const newHeight = Math.max(20, shelf.height * scaleY);

    // Reset du scale pour éviter l'accumulation
    node.scaleX(1);
    node.scaleY(1);

    onTransform({
      shelfId: shelf.id,
      width: newWidth,
      height: newHeight,
      rotation: node.rotation(),
      position: {
        x: node.x(),
        y: node.y(),
      },
    });
  }, [shelf.id, shelf.width, shelf.height, onTransform]);

  return (
    <>
      <Group
        ref={groupRef}
        x={shelf.position.x}
        y={shelf.position.y}
        width={shelf.width}
        height={shelf.height}
        rotation={shelf.rotation}
        draggable
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onMouseEnter={(e) => {
          e.target.getStage()!.container().style.cursor = 'move';
        }}
        onMouseLeave={(e) => {
          e.target.getStage()!.container().style.cursor = 'default';
        }}
      >
        <Rect
          width={shelf.width}
          height={shelf.height}
          fill={isSelected ? "#0A5B91" : "#4882b4"}
          stroke={isSelected ? "#ffffff" : "#0A5B91"}
          strokeWidth={2 / viewport.scale}
          opacity={0.8}
          cornerRadius={4 / viewport.scale}
        />
      </Group>

      {isSelected && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          borderEnabled={true}
          borderStroke="#0A5B91"
          borderStrokeWidth={1 / viewport.scale}
          borderDash={[3 / viewport.scale, 3 / viewport.scale]}
          anchorStroke="#0A5B91"
          anchorFill="#ffffff"
          anchorStrokeWidth={1 / viewport.scale}
          anchorSize={4 / viewport.scale} // Réduit de 6 à 4
          anchorCornerRadius={1 / viewport.scale} // Réduit de 2 à 1
          rotateAnchorOffset={15 / viewport.scale} // Réduit de 20 à 15
          rotateAnchorCursor="crosshair"
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'top-center', 'bottom-center', 'middle-left', 'middle-right'
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // Taille minimale
            const minWidth = 20;
            const minHeight = 20;
            
            return {
              ...newBox,
              width: Math.max(minWidth, newBox.width),
              height: Math.max(minHeight, newBox.height),
            };
          }}
        />
      )}
    </>
  );
}