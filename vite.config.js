import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-axios';
          }
        },
      },
    },
    // Warn on chunks > 500 kB
    chunkSizeWarningLimit: 500,
  },

  // Expose env variables to client (VITE_ prefix required)
  envPrefix: 'VITE_',
});
