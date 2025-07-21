// Analytics utilities

// Import libraries
import _ from 'lodash';
import axios from 'axios';

// Analytics configuration
const ANALYTICS_CONFIG = {
  endpoint: 'https://api.analytics.example.com/track',
  batchSize: 50,
  flushInterval: 5000,
  maxRetries: 3,
};

// Event queue
let eventQueue = [];
let flushTimer = null;

// Track page view
export function trackPageView(page, properties = {}) {
  const event = {
    type: 'page_view',
    page,
    timestamp: Date.now(),
    properties: {
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      ...properties,
    },
  };

  addToQueue(event);
}

// Track user interaction
export function trackUserInteraction(element, action, properties = {}) {
  const event = {
    type: 'user_interaction',
    element: element.tagName.toLowerCase(),
    action,
    timestamp: Date.now(),
    properties: {
      elementId: element.id,
      elementClass: element.className,
      text: element.textContent?.substring(0, 100),
      ...properties,
    },
  };

  addToQueue(event);
}

// Track performance metrics
export function trackPerformanceMetrics(metrics) {
  const event = {
    type: 'performance',
    timestamp: Date.now(),
    properties: {
      loadTime:
        performance.timing.loadEventEnd - performance.timing.navigationStart,
      domContentLoaded:
        performance.timing.domContentLoadedEventEnd -
        performance.timing.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime,
      firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime,
      ...metrics,
    },
  };

  addToQueue(event);
}

// Track error
export function trackError(error, context = {}) {
  const event = {
    type: 'error',
    timestamp: Date.now(),
    properties: {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
    },
  };

  addToQueue(event);
}

// Track custom event
export function trackCustomEvent(eventName, properties = {}) {
  const event = {
    type: 'custom',
    eventName,
    timestamp: Date.now(),
    properties,
  };

  addToQueue(event);
}

// Add event to queue
function addToQueue(event) {
  eventQueue.push(event);

  if (eventQueue.length >= ANALYTICS_CONFIG.batchSize) {
    flushQueue();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flushQueue, ANALYTICS_CONFIG.flushInterval);
  }
}

// Flush event queue
async function flushQueue() {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue = [];

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  try {
    await sendEvents(events);
  } catch (error) {
    console.error('Failed to send analytics events:', error);
    eventQueue.unshift(...events);
  }
}

// Send events to analytics endpoint
async function sendEvents(events) {
  const payload = {
    events,
    sessionId: getSessionId(),
    userId: getUserId(),
    timestamp: Date.now(),
  };

  await axios.post(ANALYTICS_CONFIG.endpoint, payload, {
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Get session ID
function getSessionId() {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// Get user ID
function getUserId() {
  let userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = generateId();
    localStorage.setItem('analytics_user_id', userId);
  }
  return userId;
}

// Generate unique ID
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Track user behavior
export function trackUserBehavior() {
  let lastActivity = Date.now();
  let isActive = true;

  const updateActivity = () => {
    lastActivity = Date.now();
    if (!isActive) {
      isActive = true;
      trackCustomEvent('user_returned');
    }
  };

  const checkInactivity = () => {
    const now = Date.now();
    if (now - lastActivity > 300000 && isActive) {
      isActive = false;
      trackCustomEvent('user_inactive');
    }
  };

  document.addEventListener('mousemove', updateActivity);
  document.addEventListener('keypress', updateActivity);
  document.addEventListener('click', updateActivity);
  document.addEventListener('scroll', updateActivity);

  setInterval(checkInactivity, 60000);
}

// Track scroll depth
export function trackScrollDepth() {
  let maxScrollDepth = 0;
  let hasTracked25 = false;
  let hasTracked50 = false;
  let hasTracked75 = false;
  let hasTracked100 = false;

  const trackScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;

    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
    }

    if (scrollPercent >= 25 && !hasTracked25) {
      hasTracked25 = true;
      trackCustomEvent('scroll_depth', { depth: 25 });
    }

    if (scrollPercent >= 50 && !hasTracked50) {
      hasTracked50 = true;
      trackCustomEvent('scroll_depth', { depth: 50 });
    }

    if (scrollPercent >= 75 && !hasTracked75) {
      hasTracked75 = true;
      trackCustomEvent('scroll_depth', { depth: 75 });
    }

    if (scrollPercent >= 100 && !hasTracked100) {
      hasTracked100 = true;
      trackCustomEvent('scroll_depth', { depth: 100 });
    }
  };

  window.addEventListener('scroll', _.throttle(trackScroll, 100));
}

// Track time on page
export function trackTimeOnPage() {
  const startTime = Date.now();

  const trackTime = () => {
    const timeSpent = Date.now() - startTime;
    trackCustomEvent('time_on_page', {
      timeSpent,
      timeSpentSeconds: Math.round(timeSpent / 1000),
    });
  };

  window.addEventListener('beforeunload', trackTime);
  window.addEventListener('pagehide', trackTime);
}

// Track form interactions
export function trackFormInteractions() {
  document.addEventListener('submit', (event) => {
    const form = event.target;
    trackCustomEvent('form_submit', {
      formId: form.id,
      formAction: form.action,
      formMethod: form.method,
    });
  });

  document.addEventListener(
    'input',
    _.debounce((event) => {
      const input = event.target;
      trackCustomEvent('form_input', {
        inputType: input.type,
        inputName: input.name,
        inputId: input.id,
      });
    }, 1000)
  );
}

// Track link clicks
export function trackLinkClicks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link) {
      trackCustomEvent('link_click', {
        href: link.href,
        text: link.textContent?.substring(0, 100),
        target: link.target,
      });
    }
  });
}

// Track button clicks
export function trackButtonClicks() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (button) {
      trackCustomEvent('button_click', {
        buttonText: button.textContent?.substring(0, 100),
        buttonId: button.id,
        buttonClass: button.className,
      });
    }
  });
}

// Track search queries
export function trackSearchQueries() {
  const searchInputs = document.querySelectorAll(
    "input[type='search'], input[placeholder*='search'], input[placeholder*='Search']"
  );

  searchInputs.forEach((input) => {
    input.addEventListener(
      'input',
      _.debounce((event) => {
        const query = event.target.value;
        if (query.length > 2) {
          trackCustomEvent('search_query', {
            query: query.substring(0, 100),
            queryLength: query.length,
          });
        }
      }, 500)
    );
  });
}

// Complex analytics function
export function trackComplexAnalytics() {
  const metrics = {
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    platform: navigator.platform,
    vendor: navigator.vendor,
  };

  const performanceMetrics = {
    navigationStart: performance.timing.navigationStart,
    loadEventEnd: performance.timing.loadEventEnd,
    domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd,
    responseEnd: performance.timing.responseEnd,
    requestStart: performance.timing.requestStart,
    responseStart: performance.timing.responseStart,
  };

  const memoryInfo = performance.memory
    ? {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      }
    : {};

  trackCustomEvent('complex_analytics', {
    ...metrics,
    ...performanceMetrics,
    ...memoryInfo,
  });
}

// Analytics with retry logic
export function trackWithRetry(event, maxRetries = 3) {
  let retries = 0;

  const attemptTrack = async () => {
    try {
      await sendEvents([event]);
    } catch (error) {
      retries++;
      if (retries < maxRetries) {
        setTimeout(attemptTrack, 1000 * retries);
      } else {
        console.error('Failed to track event after retries:', error);
      }
    }
  };

  attemptTrack();
}

// Batch analytics processing
export function processBatchAnalytics(events) {
  const processedEvents = events.map((event) => ({
    ...event,
    processed: true,
    processedAt: Date.now(),
    hash: btoa(JSON.stringify(event)),
  }));

  const groupedEvents = _.groupBy(processedEvents, 'type');
  const eventCounts = _.mapValues(groupedEvents, 'length');

  trackCustomEvent('batch_processed', {
    totalEvents: events.length,
    eventCounts,
    processingTime: Date.now() - events[0]?.timestamp,
  });

  return processedEvents;
}

// Initialize analytics
export function initializeAnalytics() {
  trackPageView(window.location.pathname);
  trackUserBehavior();
  trackScrollDepth();
  trackTimeOnPage();
  trackFormInteractions();
  trackLinkClicks();
  trackButtonClicks();
  trackSearchQueries();

  window.addEventListener('error', (event) => {
    trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), {
      type: 'unhandledrejection',
    });
  });
}

// Export for cleanup
export function flushAnalytics() {
  return flushQueue();
}
