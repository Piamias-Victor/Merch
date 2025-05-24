"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PlanMetadata } from '@/types/editor';
import FurnitureLayout from '@/components/editor/FurnitureLayout';

// Import dynamique des layouts selon l'étape
const EditorLayout = dynamic(() => import('@/components/editor/EditorLayout'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-lg text-gray-500">Chargement de l'éditeur de murs...</div>
    </div>
  ),
});

const ZoneLayout = dynamic(() => import('@/components/editor/ZoneLayout'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-lg text-gray-500">Chargement de l'éditeur de zones...</div>
    </div>
  ),
});

function EditorContent() {
  const searchParams = useSearchParams();
  
  const step = searchParams.get('step') || 'walls';
  
  const metadata: PlanMetadata = {
    name: searchParams.get('name') || 'Nouveau plan',
    dimensions: {
      width: parseInt(searchParams.get('width') || '1200'),
      height: parseInt(searchParams.get('height') || '900'),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Charger les données depuis localStorage selon l'étape
  const savedPlan = (step === 'furniture' || step === 'zones') ? 
    (() => {
      try {
        return JSON.parse(localStorage.getItem('current-plan') || '{}');
      } catch {
        return {};
      }
    })() : 
    null;

  const savedFurniture = step === 'zones' ?
    (() => {
      try {
        return JSON.parse(localStorage.getItem('current-furniture') || '[]');
      } catch {
        return [];
      }
    })() :
    [];

  if (step === 'zones') {
    return (
      <ZoneLayout 
        metadata={metadata} 
        walls={savedPlan?.walls || []}
        furniture={savedFurniture}
      />
    );
  }

  if (step === 'furniture') {
    return (
      <FurnitureLayout 
        metadata={metadata} 
        walls={savedPlan?.walls || []} 
      />
    );
  }

  return <EditorLayout metadata={metadata} />;
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">Chargement de l'éditeur...</div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}