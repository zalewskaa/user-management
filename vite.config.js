import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    // Enable gzip compression for production builds
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      compressionOptions: {
        level: 9, // Maximum gzip compression
        memLevel: 9, // Maximum memory usage for better compression
      },
      threshold: 512, // Compress files larger than 512 bytes
      deleteOriginFile: false,
      filter: /\.(js|css|html|txt|xml|json)$/i,
    }),
    // Enable brotli compression for even better compression
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      compressionOptions: {
        level: 11, // Maximum brotli compression
        chunkSize: 32 * 1024,
        windowBits: 24, // Maximum window size
        mode: 0, // Generic mode for best compression
      },
      threshold: 512, // Compress files larger than 512 bytes
      deleteOriginFile: false,
      filter: /\.(js|css|html|txt|xml|json)$/i,
    }),
    // Additional compression for HTML files
    viteCompression({
      algorithm: 'gzip',
      ext: '.html.gz',
      compressionOptions: { level: 9 },
      threshold: 0, // Compress all HTML files
      deleteOriginFile: false,
      filter: /\.html$/i,
    }),
  ],
  build: {
    minify: 'terser', // Enable minification for better compression
    sourcemap: false, // Disable sourcemap for production to save space
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching and compression
          vendor: ['chart.js', 'date-fns'],
          bootstrap: ['bootstrap'],
        },
        // Optimize asset names for caching
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
      },
    },
    // Optimize chunk size for better compression
    chunkSizeWarningLimit: 500,
    // Enable additional optimizations
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets
  },
  server: {
    hmr: false,
    // Enable compression in development
    middlewareMode: false,
    compress: true,
  },
});
