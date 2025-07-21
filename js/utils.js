// Utility functions

// Import libraries
import _ from 'lodash';
import moment from 'moment';
import { format, differenceInDays } from 'date-fns';
import { compose, curry } from 'ramda';

// String utilities
export function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateString(str, length) {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

// Array utilities
export function uniqueArray(arr) {
  return [...new Set(arr)];
}

export function sortArray(arr, key) {
  return [...arr].sort((a, b) => {
    if (typeof a[key] === 'string') {
      return a[key].localeCompare(b[key]);
    }
    return a[key] - b[key];
  });
}

// Object utilities
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function mergeObjects(...objects) {
  return _.merge({}, ...objects);
}

// Date utilities
export function formatDate(date, formatString = 'YYYY-MM-DD') {
  return moment(date).format(formatString);
}

export function getDaysDifference(date1, date2) {
  return differenceInDays(new Date(date1), new Date(date2));
}

// DOM utilities
export function createElement(tag, className, textContent) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = textContent;
  return element;
}

export function addClass(element, className) {
  element.classList.add(className);
}

export function removeClass(element, className) {
  element.classList.remove(className);
}

// Validation utilities
export function isValidEmail(email) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
}

// Math utilities
export function roundToDecimal(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function calculatePercentage(value, total) {
  return (value / total) * 100;
}

// Storage utilities
export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
}

// Async utilities
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function retry(fn, maxAttempts = 3) {
  return async (...args) => {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        return await fn(...args);
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
        await delay(1000 * (i + 1));
      }
    }
  };
}

// Functional utilities using Ramda
export function composeFunctions(...fns) {
  return compose(...fns);
}

export function curryFunction(fn) {
  return curry(fn);
}

// Memoization
const memoCache = new Map();

export function memoize(fn) {
  return (...args) => {
    const key = JSON.stringify(args);
    if (memoCache.has(key)) {
      return memoCache.get(key);
    }
    const result = fn(...args);
    memoCache.set(key, result);
    return result;
  };
}

// Debouncing
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttling
export function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Color utilities
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
