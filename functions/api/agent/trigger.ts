// GET /api/agent/trigger — proxy to BlogWriterAgent Worker
// No DO binding needed — calls the worker directly via fetch
export const onRequestGet: PagesFunction = async ({ request }) => {
  const agentWorkerUrl = "https://woody-blog-agent.woody40814.workers.dev";
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "write";

  try {
    const resp = await fetch(`${agentWorkerUrl}?action=${action}`);
    const data = await resp.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
