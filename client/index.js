import {
    Accounts,
    AccountsClient
} from 'meteor/accounts-base';

import {
    exportFlagFromParams,
    exportCallbackFromParams
} from './helpers';

import overrideAccountsLogin from './overrideLogin';

/**
 *  RememberMe
 *
 *  @property {Object} remoteConnection - handler to a custom connection.
 *  @property {string} methodName - unique name for the rememberMe method
 *
 *  @class
 */
class RememberMe {
    constructor() {
        this.remoteConnection = null;
        this.methodName = 'tprzytula:rememberMe-update';
        overrideAccountsLogin(Accounts);
    }

    /**
     *  Returns login method either from the main
     *  connection or remote one if set.
     *  @returns {function} loginWithPassword
     *  @private
     */
    getLoginWithPasswordMethod = () => {
        if (this.remoteConnection) {
            return this.remoteConnection.loginWithPassword;
        }

        return Meteor.loginWithPassword;
    };

    /**
     *  Returns call method either from the main
     *  connection or remote one if set.
     *  @returns {function} call
     *  @private
     */
    getCallMethod = () => {
        if (this.remoteConnection) {
            return this.remoteConnection.call.bind(this.remoteConnection);
        }

        return Meteor.call;
    };

    /**
     *  Wrapper for the Meteor.loginWithPassword
     *  Invokes suitable loginMethod and upon results
     *  passes it to the user's callback and if there
     *  were no errors then also invokes a method to
     *  update the rememberMe flag on the server side.
     *  @public
     */
    loginWithPassword = (...params) => {
        const [user, password, ...rest] = params;
        const flag = exportFlagFromParams(rest);
        const callbackMethod = exportCallbackFromParams(rest);
        const loginMethod = this.getLoginWithPasswordMethod();
        loginMethod(user, password, (error) => {
            if (!error) {
                this.updateFlag(flag);
            }
            callbackMethod(error);
        });
    };

    /**
     *  Sends request to the server to update
     *  the remember me setting.
     *  @param {boolean} flag
     *  @private
     */
    updateFlag = (flag) => {
        const callMethod = this.getCallMethod();
        callMethod(this.methodName, flag, (error) => {
            if (error && error.error === 404) {
                console.warn(
                    'Dependency meteor/tprzytula:remember-me is not active!\n',
                    '\nTo activate it make sure to run "RememberMe.activate()" on the server.' +
                    'It is required to be able to access the functionality on the client.'
                );
            } else if (error) {
                console.error(
                    'meteor/tprzytula:remember-me' +
                    '\nCould not update remember me setting.' +
                    '\nError:',
                    error
                );
            }
        });
    };

    /**
     *  Switches from using the current login system to
     *  a new custom one. After switching each login attempt
     *  will be performed to new accounts instance.
     *  @param {AccountsClient} customAccounts
     *  @returns {boolean} result
     *  @public
     */
    changeAccountsSystem = (customAccounts) => {
        if (customAccounts instanceof AccountsClient &&
            customAccounts.connection) {
            this.remoteConnection = customAccounts.connection;
            this.setLoginMethod();
            overrideAccountsLogin(customAccounts);
            return true;
        }
        console.error('meteor/tprzytula:remember-me' +
            '\nProvided parameter is not a valid AccountsClient.');
        return false;
    };

    /**
     *  Since freshly created AccountsClients are not having
     *  this method by default it's required to make sure that
     *  the set accounts system will contain it.
     *  @private
     */
    setLoginMethod = () => {
        if ('loginWithPassword' in this.remoteConnection) {
            // Login method is already present
            return;
        }

        /* eslint-disable */
        /*
            The method is based on the original one in Accounts:
            https://github.com/meteor/meteor/blob/46257bad264bf089e35e0fe35494b51fe5849c7b/packages/accounts-password/password_client.js#L33
         */
        this.remoteConnection.loginWithPassword = function (selector, password, callback) {
            if (typeof selector === 'string') {
                selector = selector.indexOf('@') === -1
                    ? { username: selector }
                    : { email: selector };
            }
            Meteor.remoteUsers.callLoginMethod({
                methodArguments: [{
                    user: selector,
                    password: Accounts._hashPassword(password)
                }],
                userCallback: function (error, result) {
                    if (error && error.error === 400 &&
                        error.reason === 'old password format') {
                        srpUpgradePath({
                            upgradeError: error,
                            userSelector: selector,
                            plaintextPassword: password
                        }, callback);
                    } else if (error) {
                        callback && callback(error);
                    } else {
                        callback && callback();
                    }
                }
            });
        };
        /* eslint-enable */
    };
}

export default new RememberMe();

// Export handle to the class only on TEST environment
export const RememberMeClass = process.env.TEST_METADATA ? RememberMe : null;
