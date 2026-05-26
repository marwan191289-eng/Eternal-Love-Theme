import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { injectAnalytics } from "./lib/analytics";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

app.get("/", (req, res) => {
  // If the client accepts HTML, serve an HTML page with analytics
  const acceptsHtml = req.accepts('html');
  
  if (acceptsHtml) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eternal Love Theme API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      color: #333;
    }
    .container {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h1 {
      color: #667eea;
      margin-top: 0;
    }
    .status {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: bold;
    }
    .endpoints {
      margin-top: 2rem;
    }
    .endpoint {
      background: #f3f4f6;
      padding: 1rem;
      margin: 0.5rem 0;
      border-radius: 6px;
      font-family: monospace;
    }
    .endpoint code {
      color: #667eea;
    }
    .footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌹 Eternal Love Theme API</h1>
    <p><span class="status">✓ Online</span></p>
    
    <div class="endpoints">
      <h2>Available Endpoints</h2>
      <div class="endpoint">
        <strong>GET</strong> <code>/api/healthz</code> - Health check
      </div>
      <div class="endpoint">
        <strong>GET</strong> <code>/api/storage</code> - Storage operations
      </div>
      <div class="endpoint">
        <strong>GET</strong> <code>/api/media</code> - Media management
      </div>
      <div class="endpoint">
        <strong>GET</strong> <code>/api/admin</code> - Admin operations
      </div>
    </div>
    
    <div class="footer">
      <p>Eternal Love Theme API Server • Powered by Express & Vercel</p>
      <p>Analytics enabled via Vercel Web Analytics</p>
    </div>
  </div>
</body>
</html>`;
    
    // Inject Vercel Analytics script into the HTML
    const htmlWithAnalytics = injectAnalytics(html);
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlWithAnalytics);
  } else {
    // For API clients, return JSON
    res.json({ status: "ok" });
  }
});

export default app;
