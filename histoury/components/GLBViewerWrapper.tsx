'use client';

import dynamic from 'next/dynamic';
import { GLBViewerProps } from './GLBViewer';

// Dynamically import the GLBViewer component with no SSR
const GLBViewer = dynamic(() => import('./GLBViewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-lg">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading 3D Viewer...</p>
      </div>
    </div>
  )
});

export default function GLBViewerWrapper(props: GLBViewerProps) {
  return <GLBViewer {...props} />;
}
