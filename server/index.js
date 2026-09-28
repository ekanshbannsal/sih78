const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// In production, serve static frontend assets built by Vite
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback middleware for SPA routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      // If frontend has not been built yet (e.g. during initial dev)
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>ForecastGuard AI Server</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b1329; color: #e2e8f0; padding: 40px; text-align: center; }
              .card { background: #132247; border: 1px solid #1e3a8a; border-radius: 12px; max-width: 600px; margin: 40px auto; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
              h1 { color: #38bdf8; margin-bottom: 8px; }
              a { color: #38bdf8; text-decoration: none; font-weight: bold; }
              .badge { background: #0284c7; color: white; padding: 4px 10px; border-radius: 999px; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="card">
              <span class="badge">Operational Backend</span>
              <h1>ForecastGuard AI</h1>
              <p>AI-Powered Medium-Range Forecast Bust Detection (SIH Prototype)</p>
              <p>Express API Server is active and operational on port ${PORT}.</p>
              <p>Explore API endpoints at <a href="/api/health">/api/health</a> or <a href="/api/regions">/api/regions</a>.</p>
              <p style="font-size: 13px; color: #94a3b8; margin-top: 24px;">To view the full interactive dashboard, run the Vite client or execute <code>npm run build</code>.</p>
            </div>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`⚡ ForecastGuard AI Operational Server`);
  console.log(`📡 Server listening on port: ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
