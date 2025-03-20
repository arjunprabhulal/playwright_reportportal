// Script to validate Report Portal API token
const https = require('https');
const http = require('http');

// Get token from environment or command line
const apiKey = process.env.RP_API_KEY || process.argv[2];
const project = process.env.RP_PROJECT || 'superadmin_personal';
const endpoint = process.env.RP_ENDPOINT || 'http://localhost:8080/api/v1';

if (!apiKey) {
  console.error('Error: API Key is required. Set RP_API_KEY environment variable or pass it as an argument.');
  process.exit(1);
}

// Format the token - try with and without bearer prefix
const tokens = [
  apiKey,
  apiKey.startsWith('bearer ') ? apiKey : `bearer ${apiKey}`,
  apiKey.startsWith('uuid_') ? apiKey : `uuid_${apiKey.replace(/^bearer /, '')}`
];

// Parse the endpoint URL
const url = new URL(`${endpoint}/${project}/launch`);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

// Try each token format
async function validateToken() {
  console.log(`Validating token against: ${url.href}`);
  
  for (const token of tokens) {
    console.log(`\nTrying token format: ${token}`);
    
    try {
      await makeRequest(token);
    } catch (error) {
      console.error(`  Failed: ${error.message}`);
    }
  }
}

function makeRequest(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };

    const req = client.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('  Success: Token is valid!');
          console.log(`  Response: ${data.substring(0, 100)}...`);
          resolve(data);
        } else {
          reject(new Error(`Status code ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

validateToken(); 