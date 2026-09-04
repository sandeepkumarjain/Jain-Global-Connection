import L from 'leaflet';

// In ESM/browser environments, plugins like leaflet.markercluster attach to window.L
if (typeof window !== 'undefined') {
  (window as any).L = L;
}

export default L;
