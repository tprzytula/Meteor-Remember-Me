import { prepareLoginWithPasswordMethod } from './lib/overriding';

const IS_CALLBACK_REGISTERED = 'tprzytula:remember-me_callbackRegistered';
const IS_METHOD_OVERRIDDEN = 'tprzytula:remember-me_methodOverridden';
const LOGIN_WITH_PASSWORD_METHOD = 'loginWithPassword';

/**
 *  Extends AccountsClient instance with RememberMe functionality.
 *  @property {AccountsClient} _accounts
 */
class AccountsConfigurator {
    constructor(accounts) {
        this._accounts = accounts;
    }

    /**
     *  Starts the configuration process.
     *  @public
     */
    configure() {
        this._registerLoginMethod();
        this._registerCallback();
    }

    /**
     *  Extends accounts with a "loginWithPassword" method, which is
     *  based on the "Meteor.loginWithPassword".
     *  @private
     */
    _registerLoginMethod() {
        if (LOGIN_WITH_PASSWORD_METHOD in this._accounts) return;
        this._accounts.loginWithPassword = prepareLoginWithPasswordMethod(this._accounts);
    }

    /**
     *  Registers "onLogin" callback.
     *  After successful login attempt the loginMethod will be overridden.
     *  @private
     */
    _registerCallback() {
        if (IS_CALLBACK_REGISTERED in this._accounts) return;
        this._accounts.onLogin(this._overrideCallLoginMethod.bind(this));
        this._accounts[IS_CALLBACK_REGISTERED] = true;
    }

    /**
     *  Overrides Meteor's loginMethod.
     *  From now each time user will perform login/autologin
     *  the new loginMethod will be invoked.
     *  @private
     */
    _overrideCallLoginMethod() {
        if (IS_METHOD_OVERRIDDEN in this._accounts) return;
        this._accounts.callLoginMethod = this._getNewCallLoginMethod();
        this._accounts[IS_METHOD_OVERRIDDEN] = true;
    }

    /**
     *  Prepares login method.
     *
     *  Extends the method arguments with "loggedAtLeastOnce".
     *  This argument will indicate to the server that we were already
     *  logged in during this device session, so our previously set rememberMe
     *  option should not affect the outcome of the next login attempt.
     *
     *  Calls original callLoginMethod at the end with extended "methodArguments".
     *  @returns {Function} callLoginMethod
     *  @private
     */
    _getNewCallLoginMethod() {
        const accountsCallLoginMethod = this._accounts.callLoginMethod.bind(this._accounts);
        return (options) => {
            const preparedOptions = options || {};
            const argument = { loggedAtLeastOnce: true };
            if (preparedOptions.methodArguments) {
                preparedOptions.methodArguments.push(argument);
            } else {
                preparedOptions.methodArguments = [argument];
            }
            accountsCallLoginMethod(preparedOptions);
        };
    }
}

export const factory = (...params) => new AccountsConfigurator(...params);

export default AccountsConfigurator;
