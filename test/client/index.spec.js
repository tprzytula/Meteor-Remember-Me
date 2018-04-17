const method = require('./tests/method');
const rememberMe = require('./tests/rememberMe');
const customAccountsClient = require('./tests/customAccountsClient');
const overrideLogin = require('./tests/overrideLogin');

/**
 *  Client-side test cases.
 */
describe('client', () => {
    method();
    rememberMe();
    customAccountsClient();
    overrideLogin();
});
