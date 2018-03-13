const AccountsClient = require('meteor/accounts-base').AccountsClient;
const RememberMe = require('meteor/tprzytula:remember-me').RememberMeClass;

const isMethodOverridden = 'tprzytula:remember-me_overridden';
const isCallbackRegistered = 'tprzytula:remember-me_callbackRegistered';
const chai = require('ultimate-chai');

const expect = chai.expect;

module.exports = () => {
    /**
     *  Overriding internal login method after first successful
     *  login gives us possibility to send another parameter
     *  "loggedAtLeastOnce" to the every next login request in the
     *  current application session. This parameter can be recognized
     *  by server to perform suitable logic.
     */
    describe('Overriding internal login method', () => {

        /**
         *  By default freshly created instance of AccountsClient should
         *  not have any onLogin callbacks set yet. Upon creating
         *  RememberMe instance and giving to it the preparedAccounts
         *  a new callback should be registered.
         *
         *  The callback will be used to override the login method
         *  after only the first successful login attempt during
         *  the device session.
         */
        it('should register onLogin callback on initialization', () => {
            const rememberMe = new RememberMe();
            const connection = DDP.connect('127.0.0.1:3000');
            const preparedAccounts = new AccountsClient({ connection });
            const callbacks = preparedAccounts._onLoginHook.callbacks;

            const beforeInitialization = Object.keys(callbacks).length;
            expect(beforeInitialization).to.be.equal(0);
            expect(isCallbackRegistered in preparedAccounts).to.be.equal(false);

            rememberMe.changeAccountsSystem(preparedAccounts);

            const afterInitialization = Object.keys(callbacks).length;
            expect(afterInitialization).to.be.equal(1);
            expect(isCallbackRegistered in preparedAccounts).to.be.equal(true);
        });

        /**
         *  Given conditions in above tests it's important to
         *  make sure that the same onLogin callback won't be
         *  registered/duplicated no matter of how many times we
         *  will register the same AccountsClient to the RememberMe.
         */
        it('should not register more than one callback to the same AccountsClient', () => {
            const rememberMe = new RememberMe();
            const connection = DDP.connect('127.0.0.1:3000');
            const preparedAccounts = new AccountsClient({ connection });
            const callbacks = preparedAccounts._onLoginHook.callbacks;

            rememberMe.changeAccountsSystem(preparedAccounts);
            rememberMe.changeAccountsSystem(preparedAccounts);
            rememberMe.changeAccountsSystem(preparedAccounts);
            rememberMe.changeAccountsSystem(preparedAccounts);
            rememberMe.changeAccountsSystem(preparedAccounts);
            expect(Object.keys(callbacks).length).to.be.equal(1);
        });

        /**
         *  After successful change of accounts there should be one
         *  onLogin callback registered which will have the purpose
         *  to override the login method. To ensure this it's ensured
         *  if the method was overwritten only after invoking the callback.
         */
        it('should override login method after first successful login', () => {
            const rememberMe = new RememberMe();
            const connection = DDP.connect('127.0.0.1:3000');
            const preparedAccounts = new AccountsClient({ connection });
            rememberMe.changeAccountsSystem(preparedAccounts);
            expect(isMethodOverridden in preparedAccounts).to.be.equal(false);

            const callbacks = preparedAccounts._onLoginHook.callbacks;
            callbacks['0']();
            expect(isMethodOverridden in preparedAccounts).to.be.equal(true);
        });
    });
};
