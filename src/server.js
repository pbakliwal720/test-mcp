const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Proxy configuration for browser tools
const browserToolsProxy = createProxyMiddleware({
  target: process.env.BROWSER_TOOLS_URL || 'http://localhost:8080',
  changeOrigin: true,
  pathRewrite: {
    '^/api/browser-tools': '', // Remove the /api/browser-tools prefix when forwarding
  },
  onProxyRes: function (proxyRes, req, res) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
});

// Use the proxy middleware for /api/browser-tools routes
app.use('/api/browser-tools', browserToolsProxy);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
app.listen(port, () => {
  console.log(`MCP Server running on port ${port}`);
});