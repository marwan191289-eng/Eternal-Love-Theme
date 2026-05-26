/**
 * Analytics middleware for tracking API requests
 * 
 * This middleware can optionally track API requests using Vercel Analytics server-side tracking.
 * It's disabled by default to avoid excessive tracking, but can be enabled for specific routes.
 */

import { type Request, type Response, type NextFunction } from 'express';
import { trackEvent } from '../lib/analytics';

export interface AnalyticsMiddlewareOptions {
  /**
   * Whether to track all requests (default: false)
   * When false, only specific events should be tracked manually
   */
  trackAllRequests?: boolean;
  
  /**
   * Custom event name prefix (default: 'api')
   */
  eventPrefix?: string;
  
  /**
   * Filter function to determine which requests to track
   */
  filter?: (req: Request) => boolean;
}

/**
 * Create an analytics middleware instance
 * 
 * @param options - Configuration options for the middleware
 * @returns Express middleware function
 */
export function createAnalyticsMiddleware(options: AnalyticsMiddlewareOptions = {}) {
  const {
    trackAllRequests = false,
    eventPrefix = 'api',
    filter
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip if tracking is disabled and no filter is provided
    if (!trackAllRequests && !filter) {
      next();
      return;
    }

    // Check filter if provided
    if (filter && !filter(req)) {
      next();
      return;
    }

    // Track the request
    const eventName = `${eventPrefix}.${req.method.toLowerCase()}.${req.path.replace(/\//g, '.')}`;
    
    // Get headers for analytics
    const headers: Record<string, string | string[] | undefined> = {};
    const relevantHeaders = ['user-agent', 'referer', 'x-forwarded-for'];
    
    for (const header of relevantHeaders) {
      const value = req.get(header);
      if (value) {
        headers[header] = value;
      }
    }

    // Track async without blocking the request
    trackEvent(
      eventName,
      {
        method: req.method,
        path: req.path,
        query: JSON.stringify(req.query),
      },
      { headers }
    ).catch(error => {
      // Error already logged in trackEvent, but we don't want to fail the request
      console.debug('Analytics tracking failed for request:', error);
    });

    next();
  };
}

/**
 * Default analytics middleware with conservative settings
 * Only tracks specific high-value endpoints
 */
export const analyticsMiddleware = createAnalyticsMiddleware({
  trackAllRequests: false,
  filter: (req) => {
    // Track only important endpoints
    const importantPaths = ['/api/admin', '/api/media', '/api/storage'];
    return importantPaths.some(path => req.path.startsWith(path)) && req.method !== 'OPTIONS';
  }
});
