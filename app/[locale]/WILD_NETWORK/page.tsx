'use client';

import dynamic from 'next/dynamic';

const WildNetworkClient = dynamic(() => import('./WildNetworkClient'), { ssr: false });

export default function WildNetworkPage() {
  return <WildNetworkClient />;
}
