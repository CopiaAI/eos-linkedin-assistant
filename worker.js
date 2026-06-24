/**
 * Eos LinkedIn Assistant — Notion API Proxy
 * Cloudflare Worker that proxies requests to Notion's API,
 * adding the CORS headers that allow browser-based apps to call Notion.
 * 
 * Deploy via Cloudflare Workers dashboard or Pages.
 * No environment variables needed — the Notion token is passed
 * per-request in the X-Notion-Token header from the app.
 */

const NOTION_API = 'https://api.notion.com';
const ALLOWED_ORIGIN = '*'; // Lock to your GitHub Pages URL in production if desired

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/') {
      return new Response('Eos Notion Proxy — OK', {
        status: 200,
        headers: corsHeaders()
      });
    }

    // Extract the Notion token passed from the app
    const notionToken = request.headers.get('X-Notion-Token');
    if (!notionToken) {
      return new Response(JSON.stringify({ error: 'Missing X-Notion-Token header' }), {
        status: 401,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' }
      });
    }

    // Build the Notion API URL — proxy everything under /notion/* to api.notion.com
    const notionPath = url.pathname.replace(/^\/notion/, '');
    const notionUrl  = NOTION_API + notionPath + url.search;

    // Forward the request to Notion
    const notionRequest = new Request(notionUrl, {
      method:  request.method,
      headers: {
        'Authorization':  'Bearer ' + notionToken,
        'Notion-Version': '2022-06-28',
        'Content-Type':   'application/json'
      },
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text()
    });

    const notionResponse = await fetch(notionRequest);
    const body = await notionResponse.text();

    return new Response(body, {
      status:  notionResponse.status,
      headers: {
        ...corsHeaders(),
        'Content-Type': 'application/json'
      }
    });
  }
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin':  ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Notion-Token',
    'Access-Control-Max-Age':       '86400'
  };
}
