const { AccountsClient } = require('meteor/accounts-base');
const RememberMe = require('meteor/tprzytula:remember-me').RememberMeClass;

const sinon = require('sinon');
const chai = require('ultimate-chai');

const { expect } = chai;

const rememberMeMethod = 'tprzytula:rememberMe-update';

module.exports = () => {
    /**
     *  If the accounts system is being managed not on the
     *  Meteor server from the main connection then it's required
     *  to create a new instance of AccountsClient with provided
     *  DDP connection pointing to the desired server.
     */
    describe('Support for custom AccountsClient', () => {

        /**
         *  From the release 0.2.0 a new API method "changeAccountsSystem"
         *  is provided. Using this method it's possible to switch from
         *  using the default Accounts from the main Meteor server to
         *  a custom one.
         */
        describe('Changing the default accounts system', () => {

            /**
             *  It's important to only accept instanced of the AccountsClient.
             *  All invalid parameters should not be accepted, which means
             *  that the accounts should not change and the method should
             *  return "false".
             */
            it('should not accept invalid AccountsClient', () => {
                const rememberMe = new RememberMe();
                const randomInstance = new RememberMe();
                const result = rememberMe.changeAccountsSystem(randomInstance);
                expect(result).to.be.equal(false);
            });

            /**
             *  Upon providing correct AccountsClient instance the method
             *  should return "true".
             */
            it('should switch to new AccountsClient', () => {
                const rememberMe = new RememberMe();
                const connection = DDP.connect('127.0.0.1:3000');
                const preparedAccounts = new AccountsClient({ connection });
                const result = rememberMe.changeAccountsSystem(preparedAccounts);
                expect(result).to.be.equal(true);
            });
        });

        describe('Adjusting received AccountsClient', () => {

            it('should append "loginWithPassword" method if there is none', () => {
                const rememberMe = new RememberMe();
                const connection = DDP.connect('127.0.0.1:3000');
                const preparedAccounts = new AccountsClient({ connection });
                expect('loginWithPassword' in preparedAccounts.connection).to.be.equal(false);
                rememberMe.changeAccountsSystem(preparedAccounts);
                expect('loginWithPassword' in preparedAccounts.connection).to.be.equal(true);
            });

        });

        describe('Should start using the passed custom AccountsClient', () => {

            /**
             *  Each time the wrapper is called it
             *  should also internally call the Meteor's login method.
             */
            it('should call loginWithPassword', () => {
                const rememberMe = new RememberMe();
                const connection = DDP.connect('127.0.0.1:3000');
                const preparedAccounts = new AccountsClient({ connection });
                rememberMe.changeAccountsSystem(preparedAccounts);

                const loginWithPassword = sinon.stub(
                    preparedAccounts.connection,
                    'loginWithPassword'
                );

                rememberMe.loginWithPassword('username', 'password');
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );

                rememberMe.loginWithPassword('username_two', 'password_two');
                expect(loginWithPassword).to.have.been.calledTwice();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username_two',
                    'password_two'
                );

                loginWithPassword.restore();
            });

            /**
             *  If the login performed successfully then method for updating
             *  the state of remember me should be invoked. This way server
             *  will be informed about requested change for this setting.
             */
            it('should call updateRememberMe method if logged in successfully', () => {
                const rememberMe = new RememberMe();
                const connection = DDP.connect('127.0.0.1:3000');
                const preparedAccounts = new AccountsClient({ connection });
                rememberMe.changeAccountsSystem(preparedAccounts);

                const loginWithPassword = sinon.stub(
                    preparedAccounts.connection,
                    'loginWithPassword'
                );
                const call = sinon.stub(connection, 'call');
                loginWithPassword.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                rememberMe.loginWithPassword('username', 'password');
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );
                expect(call).to.have.been.calledOnce();
                expect(call).to.have.been.calledWith(rememberMeMethod);

                loginWithPassword.restore();
                call.restore();
            });
        });
    });
};
