const method = require('./tests/method');
const rememberMe = require('./tests/rememberMe');

/**
 *  Client-side test cases.
 */
describe('client', () => {
    method();
    rememberMe();
});