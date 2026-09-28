import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            // Rarely used heavy tools load only when their feature is opened.
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('canvg') || id.includes('dompurify')) return 'pdf-tools';
            if (id.includes('leaflet') || id.includes('@vis.gl') || id.includes('@googlemaps') || id.includes('google-maps')) return 'maps';
            if (id.includes('recharts') || id.includes('/d3') || id.includes('d3-')) return 'charts';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('@google/genai')) return 'genai';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('motion')) return 'motion';
            if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'react-vendor';
            return 'vendor';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
