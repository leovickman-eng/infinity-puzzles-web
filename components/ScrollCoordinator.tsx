'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Calls ScrollTrigger.refresh() once, after all sibling useEffects have run
// and registered their ScrollTriggers. This lets GSAP recalculate every
// trigger's position with full knowledge of all pins and their added scroll space.
export default function ScrollCoordinator() {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return null;
}
