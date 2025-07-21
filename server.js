// server.js - Production server with compression
import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable compression middleware
app.use(
  compression({
    level: 9, // Maximum compression level
    threshold: 0, // Compress all responses
    filter: (req, res) => {
      // Don't compress responses if this request is excluded
      if (req.headers['x-no-compression']) {
        return false;
      }
      // Use compression filter function
      return compression.filter(req, res);
    },
  })
);

// Serve static files with proper headers
app.use(
  express.static(join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
      // Set proper cache headers
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour for HTML
      } else if (path.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for assets
      }

      // Set compression headers
      res.setHeader('Vary', 'Accept-Encoding');
    },
  })
);

// Serve robots.txt with proper headers
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.sendFile(join(__dirname, 'robots.txt'));
});

// Handle SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});
