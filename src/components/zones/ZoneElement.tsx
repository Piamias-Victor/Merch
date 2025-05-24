"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { Group, Rect, Text, Transformer } from 'react-konva';
import { Zone, ZoneDragEvent, ZoneResizeEvent } from '@/types/zone';

interface ZoneElementProps {
  zone: Zone;
  isSelected: boolean;
  isPreview?: boolean;
  onSelect: (zoneId: string) => void;
  onDrag: (event: ZoneDragEvent) => void;
  onResize: (event: ZoneResizeEvent) => void;
  viewport: { scale: number };
}

export default function ZoneElement({
  zone,
  isSelected,
  isPreview = false,
  onSelect,
  onDrag,
  onResize,
  viewport,
}: ZoneElementProps) {
  const groupRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);

  // Attacher le Transformer au Group sélectionné
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current && !isPreview) {
      transformerRef.current.nodes([groupRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, isPreview]);

  const handleClick = useCallback((e: any) => {
    if (isPreview) return;
    e.cancelBubble = true; // Empêche la propagation vers le Stage
    onSelect(zone.id);
  }, [zone.id, onSelect, isPreview]);

  const handleDragEnd = useCallback((e: any) => {
    if (isPreview) return;
    
    onDrag({
      zoneId: zone.id,
      newBounds: {
        x: e.target.x(),
        y: e.target.y(),
        width: zone.bounds.width,
        height: zone.bounds.height,
      },
    });
  }, [zone.id, zone.bounds.width, zone.bounds.height, onDrag, isPreview]);

  const handleTransformEnd = useCallback(() => {
    if (!groupRef.current || isPreview) return;

    const node = groupRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Nouvelles dimensions
    const newWidth = Math.max(50, zone.bounds.width * scaleX);
    const newHeight = Math.max(50, zone.bounds.height * scaleY);

    // Reset du scale
    node.scaleX(1);
    node.scaleY(1);

    onResize({
      zoneId: zone.id,
      newBounds: {
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
      },
    });
  }, [zone.id, zone.bounds.width, zone.bounds.height, onResize, isPreview]);

  // Calculer la taille du texte en fonction du zoom et de la zone
  const fontSize = Math.max(10, Math.min(14, 14 / viewport.scale));
  const smallFontSize = Math.max(8, Math.min(10, 10 / viewport.scale));
  const textPadding = 6 / viewport.scale;

  // Formater les montants
  const formatCurrency = (amount: number) => `${Math.round(amount / 1000)}k€`;
  const formatPercentage = (percentage: number) => `${percentage.toFixed(1)}%`;

  return (
    <>
      <Group
        ref={groupRef}
        x={zone.bounds.x}
        y={zone.bounds.y}
        width={zone.bounds.width}
        height={zone.bounds.height}
        draggable={!isPreview}
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onMouseEnter={(e) => {
          if (!isPreview) {
            e.target.getStage()!.container().style.cursor = 'move';
          }
        }}
        onMouseLeave={(e) => {
          if (!isPreview) {
            e.target.getStage()!.container().style.cursor = 'default';
          }
        }}
      >
        {/* Fond de la zone */}
        <Rect
          width={zone.bounds.width}
          height={zone.bounds.height}
          fill={zone.color}
          stroke={isSelected ? "#0A5B91" : "#666666"}
          strokeWidth={isSelected ? 3 / viewport.scale : 2 / viewport.scale}
          opacity={isPreview ? 0.5 : isSelected ? 0.7 : 0.4}
          cornerRadius={4 / viewport.scale}
          dash={isPreview ? [8 / viewport.scale, 4 / viewport.scale] : []}
        />
        
        {/* Contenu de la zone */}
        {zone.bounds.width > 120 && zone.bounds.height > 80 && (
          <>
            {/* Nom de la zone */}
            <Text
              x={textPadding}
              y={textPadding}
              text={zone.name}
              fontSize={fontSize}
              fontFamily="Arial"
              fill={isSelected ? "#0A5B91" : "#333333"}
              fontStyle="bold"
              width={zone.bounds.width - textPadding * 2}
              align="center"
            />
            
            {/* CA et part */}
            <Text
              x={textPadding}
              y={textPadding + fontSize + 4}
              text={`CA: ${formatCurrency(zone.businessData.ca)} (${formatPercentage(zone.businessData.caPercentage)})`}
              fontSize={smallFontSize}
              fontFamily="Arial"
              fill={isSelected ? "#0A5B91" : "#555555"}
              width={zone.bounds.width - textPadding * 2}
              align="center"
            />
            
            {/* Marge et part */}
            <Text
              x={textPadding}
              y={textPadding + fontSize + smallFontSize + 8}
              text={`Marge: ${formatCurrency(zone.businessData.margin)} (${formatPercentage(zone.businessData.marginPercentage)})`}
              fontSize={smallFontSize}
              fontFamily="Arial"
              fill={isSelected ? "#0A5B91" : "#555555"}
              width={zone.bounds.width - textPadding * 2}
              align="center"
            />
          </>
        )}
        
        {/* Version compacte pour petites zones */}
        {(zone.bounds.width <= 120 || zone.bounds.height <= 80) && (
          <Text
            x={textPadding}
            y={zone.bounds.height / 2 - fontSize / 2}
            text={zone.name}
            fontSize={Math.max(8, fontSize * 0.8)}
            fontFamily="Arial"
            fill={isSelected ? "#0A5B91" : "#333333"}
            fontStyle="bold"
            width={zone.bounds.width - textPadding * 2}
            align="center"
            verticalAlign="middle"
            wrap="word"
            ellipsis={true}
          />
        )}
      </Group>

      {isSelected && !isPreview && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false} // Pas de rotation pour les zones
          borderEnabled={true}
          borderStroke="#0A5B91"
          borderStrokeWidth={1 / viewport.scale}
          borderDash={[3 / viewport.scale, 3 / viewport.scale]}
          anchorStroke="#0A5B91"
          anchorFill="#ffffff"
          anchorStrokeWidth={1 / viewport.scale}
          anchorSize={6 / viewport.scale}
          anchorCornerRadius={2 / viewport.scale}
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'top-center', 'bottom-center', 'middle-left', 'middle-right'
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // Taille minimale
            const minSize = 50;
            
            return {
              ...newBox,
              width: Math.max(minSize, newBox.width),
              height: Math.max(minSize, newBox.height),
            };
          }}
        />
      )}
    </>
  );
}