# test-mcp

Test repository for MCP workflow testing with browser tools integration.

## Features

- Express.js server with proxy middleware for browser tools
- CORS enabled
- Environment variable configuration
- Health check endpoint
- Error handling middleware

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/pbakliwal720/test-mcp.git
   cd test-mcp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. Set up GitHub Secrets:
   - Go to repository Settings
   - Navigate to Secrets and Variables > Actions
   - Add the following secrets:
     - `VALUE_TO_ENCODE`
     - Other deployment-specific secrets as needed

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api/browser-tools/*` - Proxy endpoint for browser tools

## Deployment

### Staging
- Push to the `main` branch to trigger staging deployment

### Production
1. Create a new release
2. Tag the release (e.g., v1.0.0)
3. Publish the release to trigger production deployment

## Monitoring

1. Go to Actions tab
2. View the workflow runs
3. Click on a specific run to see details

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `BROWSER_TOOLS_URL` - URL for browser tools service
- `VALUE_TO_ENCODE` - Value to encode for authentication

## Testing

Run the tests:
```bash
npm test
```