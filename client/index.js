import {
    Accounts,
    AccountsClient
} from 'meteor/accounts-base';
import AccountsWrapper from './accountsWrapper';
import {
    exportFlagFromParams,
    exportCallbackFromParams
} from './lib/methodParams';

/**
 *  RememberMe client-side
 *  Extends functionality of Meteor's Accounts system.
 *  @property {AccountsWrapper} _accountsWrapper
 */
class RememberMe {
    constructor() {
        this._accountsWrapper = null;
        this._init();
    }

    /**
     *  Configures default Accounts system to be used.
     *  @private
     */
    _init() {
        this._accountsWrapper = new AccountsWrapper(Accounts);
        this._accountsWrapper.configure();
    }

    /**
     *  Login method.
     *  To be used in the same way as "Meteor.loginWithPassword" except
     *  of being able to pass the RememberMe flag as the last parameter.
     *  @param params
     *  @public
     */
    loginWithPassword = (...params) => {
        const [username, password, ...rest] = params;
        const flag = exportFlagFromParams(rest);
        const callback = exportCallbackFromParams(rest);
        this._accountsWrapper.loginWithPassword({ username, password, flag, callback });
    };

    /**
     *  Gives the possibility to change the default Accounts system to a different one.
     *  The new instance can use different DDP connection or even be on the same one.
     *  Example of usage is given in the documentation.
     *  @public
     */
    changeAccountsSystem = (accountsInstance) => {
        if (accountsInstance instanceof AccountsClient !== true) {
            throw new Meteor.Error(400, 'Provided argument is not a valid instance of AccountsClient');
        }
        this._accountsWrapper = new AccountsWrapper(accountsInstance);
        this._accountsWrapper.configure();
    }
}

export const factory = () => new RememberMe();

export default factory();
