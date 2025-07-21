import { defineConfig } from 'vite';

export default defineConfig({
  base: '/user-management/',
  build: {
    minify: 'esbuild', // Use esbuild instead of terser to avoid Rollup issues
    sourcemap: false,
    rollupOptions: {
      // Force Rollup to use JavaScript implementation instead of native
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
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
  // Force environment variables to use JS fallback
  define: {
    'process.env.ROLLUP_NO_NATIVE': 'true',
  },
  server: {
    hmr: false,
    middlewareMode: false,
    compress: true,
  },
});
