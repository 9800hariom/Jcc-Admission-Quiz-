import { handleMockRequest } from "./mockServer";

const originalFetch = window.fetch;

export function initApiInterceptor() {
  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const urlStr = typeof input === "string" 
      ? input 
      : (input instanceof URL ? input.href : input.url);

    // Only intercept local relative API calls or absolute calls containing /api/
    const isApiCall = urlStr.startsWith("/api/") || urlStr.includes(window.location.origin + "/api/");

    if (isApiCall) {
      // Ensure the url is absolute for routing parsing in mockServer
      const absoluteUrl = urlStr.startsWith("http") 
        ? urlStr 
        : new URL(urlStr, window.location.origin).toString();

      try {
        const response = await originalFetch(input, init);
        
        // 404 means the server didn't find the route (static build on Vercel serves index.html or 404 error)
        if (response.status === 404 || response.status === 502 || response.status === 503) {
          console.warn(`[API Interceptor] Endpoint ${urlStr} returned status ${response.status}. Falling back to browser-side local simulation...`);
          return handleMockRequest(absoluteUrl, init);
        }
        
        return response;
      } catch (err) {
        console.warn(`[API Interceptor] Network failure contacting ${urlStr}. Falling back to browser-side local simulation...`, err);
        return handleMockRequest(absoluteUrl, init);
      }
    }

    // For all other resources (static assets, external APIs, etc.), use original fetch
    return originalFetch(input, init);
  };
}
