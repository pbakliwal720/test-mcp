# test-mcp

Test repository for MCP workflow testing

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/pbakliwal720/test-mcp.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up GitHub Secrets:
   - Go to repository Settings
   - Navigate to Secrets and Variables > Actions
   - Add the following secrets:
     - `VALUE_TO_ENCODE`

## Deployment

### Staging
- Push to the `main` branch to trigger staging deployment

### Production
1. Create a new release
2. Tag the release (e.g., v1.0.0)
3. Publish the release to trigger production deployment

## Monitoring Deployments

1. Go to Actions tab
2. View the workflow runs
3. Click on a specific run to see details