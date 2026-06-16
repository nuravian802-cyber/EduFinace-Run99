import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    server: {
      proxy: {
        '/api/fonnte': {
          target: 'https://api.fonnte.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/fonnte/, '')
        }
      }
    }
  }
});
