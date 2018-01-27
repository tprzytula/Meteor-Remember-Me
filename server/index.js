import { Accounts } from 'meteor/accounts-base';
import methods from './methods';
import Authenticator from './authenticator';
import RememberMeHelpers from './helpers';

/**
 *  To have the access to this functionality it has to
 *  be activated on the server. We don't want to interfere
 *  with users who added the package but don't want to use
 *  this functionality in specific cases.
 *  @public
 */
export const activate = () => {
    methods();
    Accounts.validateLoginAttempt((attempt) => {
        const authenticator = new Authenticator(attempt);
        const { result, resultCode, reason, error } = authenticator.validateAttempt();
        if (error) {
            throw error;
        } else if (!result) {
            throw new Meteor.Error(resultCode, reason);
        }
        return true;
    });
};

/**
 *  Updates the state of a rememberMe for the requested connectionId.
 *  @param {string} connectionId
 *  @param {boolean} flag
 *  @returns {boolean} result
 *  @private
 */
export const _updateState = (connectionId, flag) => {
    const userLoginToken = Accounts._getLoginToken(connectionId);
    const loginTokens = RememberMeHelpers.getAllUserTokens(userLoginToken);
    if (!loginTokens) {
        return false;
    }

    const updatedLoginTokens = loginTokens.map((loginToken) => {
        const record = loginToken;
        if (loginToken.hashedToken === userLoginToken) {
            Object.assign(record, { rememberMe: flag });
        }
        return record;
    });

    return RememberMeHelpers.updateUserTokens(userLoginToken, updatedLoginTokens);
};
