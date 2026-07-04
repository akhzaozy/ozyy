import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'block-specific-domain',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const host = req.headers.host || '';
            const origin = req.headers.origin || '';
            const referer = req.headers.referer || '';
            if (
              host.includes('akhzafachrozy.my.id') || 
              origin.includes('akhzafachrozy.my.id') || 
              referer.includes('akhzafachrozy.my.id')
            ) {
              res.statusCode = 403;
              res.end('Access Blocked: Domain not allowed.');
              return;
            }
            next();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
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
