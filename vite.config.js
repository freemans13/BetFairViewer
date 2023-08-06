import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';
import linaria from '@linaria/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    stylelint({
      include: ['**/*.{js,jsx,css}'],
    }),
    linaria({
      include: ['**/*.{js,jsx}'],
      babelOptions: {
        presets: ['@babel/preset-react'],
      },
    }),
  ],
  server: {
    proxy: {
      '/betfair': {
        target: 'http://10.168.1.1:5010',
        // target: 'http://localhost:1919',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    minify: false,
  },
});
