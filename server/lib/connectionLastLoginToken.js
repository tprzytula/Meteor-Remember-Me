import * as helpers from './helpers';
import * as integrationCollection from '../integration/collection';
import * as integrationAccounts from '../integration/accounts';

/**
 *  Gives tools to manage the last login token associated to the connectionId.
 *  @property {string} connectionId
 *  @property {string} lastToken
 *  @property {Object} tokenOwner
 *  @class
 */
class ConnectionLastLoginToken {
    constructor(connectionId) {
        this.connectionId = connectionId;
        this.lastToken = '';
        this.tokenOwner = null;
    }

    /**
     *  Returns all tokens for the user.
     *  @returns {Object[]} tokens
     *  @private
     */
    _getAllUserTokens() {
        return helpers.getValueFromTree(this.tokenOwner, 'services.resume.loginTokens') || [];
    }

    /**
     *  Looks for the last token that matches this connectionId and stores it.
     *  @private
     */
    _fetchLastToken() {
        const lastToken = integrationAccounts.getConnectionLastLoginToken(this.connectionId);
        const tokenOwner = integrationCollection.getUserByToken(lastToken);
        if (!lastToken || !tokenOwner) {
            throw new Error(`Could not find tokens for ${this.connectionId}`);
        }
        Object.assign(this, { lastToken, tokenOwner });
    }

    /**
     *  Appends/Replaces fields in the loginToken;
     *  @param {Object} fields
     *  @returns {boolean} result
     */
    updateFields(fields) {
        this._fetchLastToken();
        const loginTokens = this._getAllUserTokens();
        const updatedLoginTokens = loginTokens.map((token) => {
            if (token.hashedToken === this.lastToken) {
                return Object.assign({}, token, fields);
            }
            return token;
        });
        const result = integrationCollection.replaceUserTokens(
            this.tokenOwner._id,
            updatedLoginTokens
        );
        return result === 1;
    }
}

export const factory = (...params) => new ConnectionLastLoginToken(...params);

export default ConnectionLastLoginToken;
