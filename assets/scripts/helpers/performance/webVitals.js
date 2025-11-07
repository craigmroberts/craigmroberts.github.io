/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals: LCP, FID, CLS, FCP, TTFB
 */

/**
 * Reports a metric value to the console (can be extended to send to analytics)
 * @param {Object} metric - The web vital metric object
 */
function reportMetric(metric) {
  // Log to console in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
  }

  // TODO: Send to analytics service
  // Example: analytics.track(metric.name, metric.value);
}

/**
 * Observes Largest Contentful Paint (LCP)
 * Good: < 2.5s, Needs Improvement: 2.5-4s, Poor: > 4s
 */
function observeLCP() {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      const metric = {
        name: 'LCP',
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: lastEntry.renderTime < 2500 ? 'good' : lastEntry.renderTime < 4000 ? 'needs-improvement' : 'poor',
        entries: [lastEntry]
      };
      
      reportMetric(metric);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.error('Error observing LCP:', e);
  }
}

/**
 * Observes First Input Delay (FID)
 * Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
 */
function observeFID() {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        const metric = {
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: entry.processingStart - entry.startTime < 100 ? 'good' : 
                  entry.processingStart - entry.startTime < 300 ? 'needs-improvement' : 'poor',
          entries: [entry]
        };
        
        reportMetric(metric);
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.error('Error observing FID:', e);
  }
}

/**
 * Observes Cumulative Layout Shift (CLS)
 * Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
 */
function observeCLS() {
  if (!('PerformanceObserver' in window)) return;

  let clsValue = 0;
  let clsEntries = [];

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach((entry) => {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });

      const metric = {
        name: 'CLS',
        value: clsValue,
        rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs-improvement' : 'poor',
        entries: clsEntries
      };
      
      reportMetric(metric);
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.error('Error observing CLS:', e);
  }
}

/**
 * Observes First Contentful Paint (FCP)
 * Good: < 1.8s, Needs Improvement: 1.8-3s, Poor: > 3s
 */
function observeFCP() {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const metric = {
            name: 'FCP',
            value: entry.startTime,
            rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
            entries: [entry]
          };
          
          reportMetric(metric);
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.error('Error observing FCP:', e);
  }
}

/**
 * Observes Time to First Byte (TTFB)
 * Good: < 800ms, Needs Improvement: 800-1800ms, Poor: > 1800ms
 */
function observeTTFB() {
  try {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    
    if (navigationTiming) {
      const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
      
      const metric = {
        name: 'TTFB',
        value: ttfb,
        rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor',
        entries: [navigationTiming]
      };
      
      reportMetric(metric);
    }
  } catch (e) {
    console.error('Error observing TTFB:', e);
  }
}

/**
 * Initialize all Web Vitals observers
 */
export function initWebVitals() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Wait for page to be fully interactive
  if (document.readyState === 'complete') {
    startObserving();
  } else {
    window.addEventListener('load', startObserving, { once: true, passive: true });
  }
}

function startObserving() {
  observeLCP();
  observeFID();
  observeCLS();
  observeFCP();
  observeTTFB();
}
