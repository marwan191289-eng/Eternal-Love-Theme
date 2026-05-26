/**
 * Vercel Web Analytics integration for API server
 * 
 * This module provides analytics tracking capabilities for the Express API server.
 * Since this is a backend API server, we use the server-side analytics track function
 * and also provide an HTML injection utility for any HTML responses.
 */

import { track } from '@vercel/analytics/server';

/**
 * Track a custom event using Vercel Analytics server-side tracking
 * 
 * @param eventName - The name of the event to track
 * @param properties - Optional properties to attach to the event
 * @param options - Optional configuration (headers, flags, etc.)
 */
export async function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
  options?: {
    flags?: Record<string, unknown>;
    headers?: Record<string, string | string[] | undefined>;
  }
): Promise<void> {
  try {
    await track(eventName, properties, options);
  } catch (error) {
    // Log error but don't fail the request
    console.error('Failed to track analytics event:', error);
  }
}

/**
 * Generate the Vercel Analytics script tag for HTML injection
 * This follows the vanilla JavaScript approach from Vercel Analytics docs
 */
export function getAnalyticsScript(): string {
  return `
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
`;
}

/**
 * Inject analytics script into HTML content
 * 
 * @param html - The HTML content to inject analytics into
 * @returns HTML with analytics script injected before closing </body> tag
 */
export function injectAnalytics(html: string): string {
  const analyticsScript = getAnalyticsScript();
  
  // Try to inject before closing body tag
  if (html.includes('</body>')) {
    return html.replace('</body>', `${analyticsScript}</body>`);
  }
  
  // Fallback: append at the end
  return html + analyticsScript;
}
