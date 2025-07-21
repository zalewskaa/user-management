# Senior Frontend Developer Performance Challenge

## Overview

This is a comprehensive performance challenge designed to test a senior frontend developer's ability to identify and fix performance issues, optimize code, and implement best practices. The application is intentionally built with multiple performance antipatterns and inefficiencies that need to be addressed.

## Challenge Description

You are tasked with optimizing a User Management System that displays user data from a JSON API. The application is currently experiencing significant functional and performance issues and contains numerous antipatterns that need to be identified and resolved.

## Data Source

The application fetches user data from: `https://microsoftedge.github.io/Demos/json-dummy-data/128KB.json`

## Your Tasks

1. **Performance Audit**: Use browser dev tools to identify performance bottlenecks
2. **Bundle Analysis**: Analyze bundle size and identify unnecessary dependencies
3. **Document Issues**: Create a comprehensive list of the performance issues found
4. **Repair Application**: Ensure the application functions as intended
5. **Optimise Implementation**: Implement optimizations across network requests, CSS delivery, JavaScript execution, dependency management, and bundle optimization to achieve significant performance improvements
6. **Add Advanced Optimizations**: Focus on cache, performance metric tracking, error handling or/and regression tests

## Success Criteria

Your solution should demonstrate:

1. **Bundle Size Reduction**: A significant reduction in bundle size
2. **Performance Improvement**:
   - Better initial load time
   - Better search response time
   - Smooth scrolling
3. **Best Practices**:
   - Proper error handling
   - Accessibility compliance
   - Optimised code for faster execution
   - Clean, maintainable code
   - Comprehensive documentation

## Technical Requirements

- **Framework**: Vanilla JavaScript (no React/Vue/Angular)
- **Build Tool**: Vite
- **Styling**: CSS/SCSS
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Evaluation Criteria

Your solution will be evaluated on:

1. **Performance Metrics**: Measurable improvements in load time, bundle size, and runtime performance
2. **Code Quality**: Clean, maintainable, and well-documented code
3. **Best Practices**: Proper implementation of performance optimization techniques
4. **Problem Solving**: Creative and effective solutions to identified issues
5. **Documentation**: Clear explanation of optimizations made and their impact with performance metrics (before and after optimization)

## Bonus, Optional Challenges

1. **Progressive Web App**: Implement PWA features
2. **Offline Support**: Add service worker for offline functionality
3. **Advanced Caching**: Implement sophisticated caching strategies
4. **Performance Monitoring**: Add real-time performance monitoring
5. **Accessibility**: Ensure WCAG 2.1 AA compliance

Good luck! This challenge will test your ability to think critically about performance and implement effective solutions.
