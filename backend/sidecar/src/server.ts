import http from "node:http";

interface BrowserSession {
  provider: string;
  ready: boolean;
  lastUsed: number;
}

const sessions = new Map<string, BrowserSession>();

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "healthy", activeContexts: sessions.size }));
    return;
  }

  if (req.method === "POST" && req.url === "/api/v1/sessions/warm") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const { provider } = JSON.parse(body || "{}");
        sessions.set(provider || "default", {
          provider: provider || "default",
          ready: true,
          lastUsed: Date.now(),
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, provider }));
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

const PORT = process.env.PORT || 9091;
server.listen(PORT, () => {
  console.error(`[ProxyAI Sidecar] Browser Pool escutando na porta :${PORT}`);
});
