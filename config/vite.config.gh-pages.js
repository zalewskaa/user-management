import { defineConfig } from 'vite';

export default defineConfig({
  base: '/user-management/',
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js', 'date-fns'],
          bootstrap: ['bootstrap'],
        },
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  server: {
    hmr: false,
    middlewareMode: false,
    compress: true,
  },
});
