# Playwright Test Automation with Report Portal Integration

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Node.js and npm**: 
   Download and install from [nodejs.org](https://nodejs.org/)

2. **Docker Desktop**: 
   Download and install from [docker.com](https://www.docker.com/products/docker-desktop/)

## Project Structure

- `tests/` - Contains test files
- `config/` - Configuration files for Playwright and Report Portal
- `reportportal/` - Report Portal docker-compose files
- `scripts/` - Utility scripts for token validation, etc.

## Setting up Playwright

1. Install dependencies:
   ```
   npm install
   ```

2. Install Playwright browsers:
   ```
   npx playwright install
   ```

## Setting up Report Portal

1. Install Docker Desktop from the link above
2. Navigate to the Report Portal directory and start the containers:
   ```
   cd reportportal
   docker-compose up -d
   ```
3. Access Report Portal UI at http://localhost:8080
   - Default login: `superadmin`
   - Default password: `erebus`
4. Verify Report Portal is running:
   ```
   docker ps | grep reportportal
   ```
   You should see multiple containers running.

## Initial Configuration

1. Create a `.env` file from the provided `.env.example`:
   ```
   cp .env.example .env
   ```

2. Update your `.env` file with your own API keys and project information.

3. **IMPORTANT**: Never commit your `.env` file to version control. It is already added to `.gitignore` to prevent accidental commits.

## Report Portal API Keys

### Generating a New API Key

Follow these steps to generate a valid API key:

1. Log in to Report Portal at http://localhost:8080
2. Click on your username in the top right corner
3. Select "Profile" from the dropdown
4. In your profile, go to the "API Keys" section
5. Click "Generate API Key"
6. Enter a name for your key (e.g., "playwright-tests")
7. Select the appropriate project (e.g., "superadmin_personal")
8. Ensure it has permissions for: 
   - Launch: CREATE/UPDATE/DELETE/READ
   - Test Item: CREATE/UPDATE/DELETE/READ
9. Click "Generate"
10. Copy the API key - it will look something like: `superadmin-personal_xxxxxxxx`
11. **IMPORTANT**: Add the `bearer ` prefix to your token in the package.json file:
    ```json
    "test:reportportal": "cross-env RP_API_KEY=\"bearer your_api_key_here\" RP_PROJECT=\"superadmin_personal\" RP_ENDPOINT=\"http://localhost:8080/api/v1\" RP_LAUNCH=\"Playwright Tests\" playwright test"
    ```

### API Key Formats

Report Portal 5.13+ supports different API key formats:

1. **Project Prefixed Keys** (older format): 
   - Format: `superadmin-personal_xxxxxxxxxxxxxxxx`
   - Usage: Must be prefixed with `bearer ` in configurations

2. **UUID Format Keys** (newer format):
   - Format: `uuid_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Used in newer Report Portal versions

### Validating Your API Key

Before running tests, validate your API key:

1. Using the validation script:
   ```
   npm run validate:token your_api_key_here
   ```

2. Or using curl directly:
   ```
   curl -H "Authorization: bearer YOUR_TOKEN" http://localhost:8080/api/v1/superadmin_personal/launch
   ```
   This should return data instead of an authentication error.

## Running Tests

Run tests without Report Portal integration:
```
npm test
```

Run tests with Report Portal integration:
```
npm run test:reportportal
```

Debug tests:
```
npm run test:debug
```

Run tests with UI mode:
```
npm run test:ui
```

## Viewing Reports

Access the Report Portal UI at http://localhost:8080

View the HTML report with:
```
npm run report
```

## Playwright & Report Portal Configuration

### Package.json Scripts

The project includes several test scripts:

```json
"scripts": {
  "test": "playwright test",
  "test:reportportal": "cross-env RP_API_KEY=\"bearer YOUR_TOKEN\" RP_PROJECT=\"superadmin_personal\" RP_ENDPOINT=\"http://localhost:8080/api/v1\" RP_LAUNCH=\"Playwright Tests\" playwright test",
  "test:debug": "playwright test --debug",
  "test:ui": "playwright test --ui",
  "report": "playwright show-report",
  "validate:token": "node ./scripts/validate-token.js"
}
```

### Playwright Configuration

The Report Portal configuration in `playwright.config.js`:

```javascript
reporter: [
  ['html'],
  ['list'],
  ['@reportportal/agent-js-playwright', {
    endpoint: process.env.RP_ENDPOINT || 'http://localhost:8080/api/v1',
    apiKey: process.env.RP_API_KEY,
    launch: process.env.RP_LAUNCH || 'Playwright Tests',
    project: process.env.RP_PROJECT || 'superadmin_personal',
    attributes: [
      {
        key: 'agent',
        value: 'playwright'
      }
    ]
  }]
]
```

## Troubleshooting

If you receive a 401 unauthorized error when trying to send test results to Report Portal:

1. **Bearer prefix**: Make sure to add the `bearer ` prefix to your token:
   ```
   bearer superadmin-personal_xxxxxxxx
   ```

2. **API Key Format**: Verify your API key format:
   - For older versions: `superadmin-personal_xxxxxxxx`
   - For newer versions: `uuid_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

3. **Permissions**: Make sure your API key has the right permissions:
   - Launch: CREATE/UPDATE/DELETE/READ
   - Test Item: CREATE/UPDATE/DELETE/READ

4. **Project Name**: Ensure the project name matches exactly, including casing

5. **Environment Variables**: Check that environment variable names match exactly between .env file and config

6. **Server Status**: Verify Report Portal containers are running properly with `docker ps`

7. **Logs**: Check Report Portal logs if needed:
   ```
   cd reportportal && docker-compose logs --tail=50 api
   ```

8. **Token in Headers**: Some versions of the client need the token in the headers configuration

## System Resource Management

If Report Portal is consuming too much system resources:

1. Stop all Report Portal containers:
   ```
   docker ps | grep reportportal | awk '{print $1}' | xargs docker stop
   docker stop postgres
   ```

2. When needed again, restart Report Portal:
   ```
   cd reportportal && docker-compose up -d
   ``` 

## Docker Container Information

When ReportPortal is running properly, you should see the following containers:

```
CONTAINER ID   IMAGE                                    COMMAND                  CREATED        STATUS               PORTS                                               NAMES
36a9e9c6dabe   reportportal/service-auto-analyzer:5.13.2   "/venv/bin/uwsgi --h…"   43 hours ago   Up 10 hours (healthy)                                                reportportal-analyzer-1
5439689c55ff   reportportal/service-auto-analyzer:5.13.2   "/venv/bin/uwsgi --h…"   43 hours ago   Up 10 hours (healthy)                                                reportportal-analyzer-train-1
5ea01c11ac8c   reportportal/service-index:5.13.0         "./app"                  43 hours ago   Up 10 hours (healthy)   8080/tcp                                       reportportal-index-1
f663f74f5ef    reportportal/service-jobs:5.13.1         "/bin/sh -c 'exec ja…"   43 hours ago   Up 10 hours (healthy)   8686/tcp                                       reportportal-jobs-1
15c67dfcb8f    reportportal/service-api:5.13.4         "sh -c 'java ${JAVA_…"   43 hours ago   Up 10 hours (healthy)   8080/tcp                                       reportportal-api-1
e2c4112a5c3f   reportportal/service-authorization:5.13.1 "sh -c 'java ${JAVA_…"   43 hours ago   Up 10 hours (healthy)   8080/tcp                                       reportportal-uat-1
bd10c565e298   traefik:v2.11.15                        "/entrypoint.sh --pr…"   43 hours ago   Up 10 hours          80/tcp, 0.0.0.0:8080->8080-8081/tcp              reportportal-gateway-1
ce373a46169c   reportportal/service-ui:5.12.4          "/docker-entrypoint.…"   43 hours ago   Up 10 hours (healthy)   8080/tcp                                       reportportal-ui-1
4f46e9e272d    opensearchproject/opensearch:2.18.0     "./opensearch-docker…"   43 hours ago   Up 10 hours (healthy)   9200/tcp, 9300/tcp, 9600/tcp, 9650/tcp         reportportal-opensearch-1
2712a6d6a6f6   bitnami/postgresql:16.6.0               "/opt/bitnami/script…"   43 hours ago   Up 10 hours (healthy)   5432/tcp                                       postgres
f6c5f04fd64b   bitnami/rabbitmq:3.13.7-debian-12-r5   "/opt/bitnami/script…"   43 hours ago   Up 10 hours (healthy)   4369/tcp, 5551-5552/tcp, 5671-5672/tcp, 15671-15672/tcp, 25672/tcp   reportportal-rabbitmq-1
```

Each container serves a specific purpose in the ReportPortal ecosystem. You can check the status of these containers at any time using:

```
docker ps | grep reportportal
``` 