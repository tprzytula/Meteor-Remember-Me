import AccountsConfigurator from './accountsConfigurator';
import * as Alerts from './lib/alerts';

const updateFlagMethod = 'tprzytula:rememberMe-update';

/**
 *  Wrapper for currently used accounts system.
 *  @property {AccountsClient} _accounts
 */
class AccountsWrapper {
    constructor(accounts) {
        this._accounts = accounts;
    }

    /**
     *  Configures accounts.
     *  @public
     */
    configure() {
        this._accountsConfigurator = new AccountsConfigurator(this._accounts);
        this._accountsConfigurator.configure();
    }

    /**
     *  Wraps login method from the accounts instance.
     *  @param {string | Object} selector - Either a string interpreted as a username or an email; or an object with a
     *                                      single key: `email`, `username` or `id`. Username or email match in a case
     *                                      insensitive manner.
     *  @param {string} password
     *  @param {boolean} flag
     *  @param {function} callback
     *  @public
     */
    loginWithPassword({ selector, password, flag, callback }) {
        this._accounts.loginWithPassword(selector, password, (error) => {
            if (!error) {
                this._updateFlag(flag);
            }
            callback(error);
        });
    }

    /**
     *  Informs the server of the state update of rememberMe flag.
     *  @param {boolean} flag
     *  @private
     */
    _updateFlag(flag) {
        this._accounts.connection.call(updateFlagMethod, flag, (error) => {
            if (error && error.error === 404) {
                Alerts.rememberMeNotActive();
            } else if (error) {
                Alerts.couldNotUpdateRememberMe(error);
            }
        });
    }
}

export const factory = (...params) => new AccountsWrapper(...params);

export default AccountsWrapper;
