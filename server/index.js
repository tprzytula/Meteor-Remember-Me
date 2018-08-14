import { check } from 'meteor/check';
import * as integrationMethod from './integration/method';
import * as integrationAccounts from './integration/accounts';
import * as integrationError from './integration/error';
import * as ConnectionLastLoginToken from './lib/connectionLastLoginToken';
import * as LoginAttemptValidator from './loginAttemptValidator';

/**
 *  RememberMe server-side
 *  Extends functionality of Meteor's Accounts system.
 */
class RememberMe {
    constructor() {
        this._activate();
    }

    /**
     *  Activates the functionality on the server
     *  @private
     */
    _activate() {
        this._createMethod();
        integrationAccounts.addValidationStep(RememberMe._validateAttempt.bind(this));
    }

    /**
     *  Creates Meteor method to listen for requests coming from users.
     *  Users who will use the rememberMe functionality will pass the setting
     *  using this method
     *  @private
     */
    _createMethod() {
        if (this._updateRememberMeMethod) return;
        this._updateRememberMeMethod = integrationMethod.factory({
            name: 'tprzytula:rememberMe-update',
            callback: RememberMe._updateRememberMe.bind(this)
        });
        this._updateRememberMeMethod.setup();
    }

    /**
     *  Updates the state of rememberMe setting for requesting connection.
     *  @param {Object} connection
     *  @param {boolean} rememberMe
     *  @returns {boolean} result
     *  @private
     */
    static _updateRememberMe({ connection }, rememberMe) {
        check(rememberMe, Boolean);
        const lastLoginToken = ConnectionLastLoginToken.factory(connection.id);
        return lastLoginToken.updateFields({ rememberMe });
    }

    /**
     *  Validated login attempt
     *  @param {Object} attempt
     *  @returns {boolean} result
     *  @private
     */
    static _validateAttempt(attempt) {
        const validator = LoginAttemptValidator.factory(attempt);
        const { result, errorCode, reason, error } = validator.validate();
        if (error) {
            throw error;
        } else if (!result) {
            throw integrationError.createMeteorError(errorCode, reason);
        }
        return true;
    }
}

export const factory = () => new RememberMe();

export default factory();
