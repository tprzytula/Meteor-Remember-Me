const login = require('./tests/login');
const method = require('./tests/method');
const resume = require('./tests/resume');

/**
 *  Server-side test cases.
 */
describe('server', () => {
    login();
    method();
    resume();
});