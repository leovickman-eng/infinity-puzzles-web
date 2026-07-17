'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '@/public/loading.json';

export default function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [fading,  setFading]  = useState(false);
  const prevPathRef = useRef(pathname);

  // Pathname ändrades → fade-out och dölj
  useEffect(() => {
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      setFading(true);
      const t = setTimeout(() => { setVisible(false); setFading(false); }, 300);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  // Klick på interna länkar → visa overlay
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a');
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;
      if (href === pathname || href === window.location.pathname) return;
      setFading(false);
      setVisible(true);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#FFFBF5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.3s ease',
      opacity: fading ? 0 : 1,
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
