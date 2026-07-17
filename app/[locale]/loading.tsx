'use client';

import Lottie from 'lottie-react';
import animationData from '@/public/loading.json';

export default function Loading() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#FFFBF5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: 120, height: 120 }}
      />
    </div>
  );
}
