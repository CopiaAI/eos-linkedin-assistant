/**
 * Eos LinkedIn Assistant — Notion API Proxy
 * Cloudflare Worker that proxies requests to Notion's API,
 * adding the CORS headers that allow browser-based apps to call Notion.
 */

const NOTION_BASE = 'https://api.notion.com/v1';
const ALLOWED_ORIGIN = '*';

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
    if (url.pathname === '/' || url.pathname === '') {
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

    // Strip the leading /notion prefix and build the full Notion URL
    // e.g. /notion/databases/ID/query -> https://api.notion.com/v1/databases/ID/query
    const path = url.pathname.replace(/^\/notion\//, '/').replace(/^\/notion$/, '/');
    const notionUrl = NOTION_BASE + path + url.search;

    // Forward the request to Notion
    const bodyText = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text();

    const notionResponse = await fetch(notionUrl, {
      method: request.method,
      headers: {
        'Authorization':  'Bearer ' + notionToken,
        'Notion-Version': '2022-06-28',
        'Content-Type':   'application/json'
      },
      body: bodyText
    });

    const body = await notionResponse.text();

    return new Response(body, {
      status: notionResponse.status,
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
