// Report Portal configuration
const apiKey = process.env.RP_API_KEY || 'YOUR_API_KEY_HERE';
const bearerToken = apiKey.startsWith('bearer ') ? apiKey : `bearer ${apiKey}`;

const RPConfig = {
  token: bearerToken,
  endpoint: process.env.RP_ENDPOINT || 'http://localhost:8080/api/v1',
  project: process.env.RP_PROJECT || 'YOUR_PROJECT_NAME',
  launch: process.env.RP_LAUNCH || 'Playwright Tests',
  description: 'Automated tests using Playwright',
  debug: true,
  headers: {
    'Authorization': bearerToken
  },
  rerun: false,
  rerunOf: undefined,
  skippedIssue: true,
  mode: 'DEFAULT',
  attributes: [
    {
      key: 'agent',
      value: 'playwright'
    },
    {
      key: 'environment',
      value: 'test'
    }
  ],
  restClientConfig: {
    timeout: 60000, // default 30000
    proxy: undefined  // default undefined
  }
};

module.exports = RPConfig; 