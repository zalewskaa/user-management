import { defineConfig } from 'vite';

// GitHub Actions compatible configuration
// Uses JavaScript implementations to avoid native binary issues
export default defineConfig({
  base: '/user-management/',
  build: {
    // Use esbuild instead of terser - much more reliable in CI
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2020', // Broader compatibility
    rollupOptions: {
      // Disable native optimizations that require platform-specific binaries
      external: [],
      output: {
        manualChunks: {
          vendor: ['chart.js', 'date-fns'],
          bootstrap: ['bootstrap'],
        },
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
        // Ensure compatibility with older environments
        format: 'es',
        generatedCode: 'es2015',
      },
    },
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    // Optimize for CI environments
    reportCompressedSize: false, // Skip gzip reporting to speed up builds
  },
  // Ensure compatibility with different Node.js versions
  esbuild: {
    target: 'es2020',
    platform: 'browser',
  },
  // Environment configuration
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.ROLLUP_NO_NATIVE': 'true',
  },
  server: {
    hmr: false,
    middlewareMode: false,
    compress: true,
  },
});
