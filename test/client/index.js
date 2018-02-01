const method = require('./tests/method');
const rememberMe = require('./tests/rememberMe');
const accounts = require('./tests/accounts');

/**
 *  Client-side test cases.
 */
describe('client', () => {
    method();
    rememberMe();
});