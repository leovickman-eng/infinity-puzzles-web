import dynamic from 'next/dynamic';

// Server component — renders an instant dark shell from CDN edge,
// then hydrates the full client UI without a serverless cold start.
const UniverseClient = dynamic(() => import('./UniverseClient'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100svh', background: '#0d0a12' }} />
  ),
});

export default function UniversePage() {
  return <UniverseClient />;
}
