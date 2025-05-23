"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { PlanMetadata } from '@/types/editor';

// Import dynamique du layout
const EditorLayout = dynamic(() => import('@/components/editor/EditorLayout'), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center">
      <div className="text-lg text-gray-500">Chargement de l'éditeur...</div>
    </div>
  ),
});

function EditorContent() {
  const searchParams = useSearchParams();
  
  const metadata: PlanMetadata = {
    name: searchParams.get('name') || 'Nouveau plan',
    dimensions: {
      width: parseInt(searchParams.get('width') || '1200'),
      height: parseInt(searchParams.get('height') || '900'),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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