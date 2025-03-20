module.exports = {
  endpoint: 'http://localhost:8080/api/v1',
  project: 'default_personal',
  token: 'REPLACE_WITH_YOUR_TOKEN_AFTER_FIRST_LOGIN',
  launch: 'Playwright Tests',
  description: 'Playwright automation with Report Portal integration',
  attributes: [
    {
      key: 'environment',
      value: 'testing'
    },
    {
      key: 'framework',
      value: 'playwright'
    }
  ],
  debug: false
}; 