#!/bin/bash

# GitHub Pages Build Script
# This script ensures a clean build for GitHub Pages deployment

echo "🧹 Cleaning previous build..."
rm -rf dist

echo "📦 Building for GitHub Pages (CI optimized)..."
npm run build:ci

echo "📋 Build Summary:"
echo "📁 Build output: dist/"
echo "🌐 Base URL: /user-management/"
echo "📊 Bundle analysis:"
ls -la dist/assets/ | grep -E '\.(js|css)$' | awk '{print "  " $9 " - " $5 " bytes"}'

echo "✅ GitHub Pages build complete!"
echo "🚀 Ready for deployment at: https://zalewskaa.github.io/user-management/"
