import _ from 'lodash';
import Crypto from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';

/**
 *  Gives tools to perform custom authentication.
 *
 *  @typedef {Object} attempt - single user login attempt.
 *  @type {Authenticator}
 *  @class
 */
class Authenticator {
    constructor(attempt) {
        this.loginAttempt = attempt;
    }

    /**
     *  Hashes provided token the same way as Accounts are
     *  hashing login tokens.
     *
     *  @param {string} token - token to be hashed.
     *  @return {string} hashedToken
     */
    static hashToken(token) {
        const hashedToken = Crypto.SHA256(token);
        return Base64.stringify(hashedToken);
    }

    /**
     *  Validates custom login attempt.
     *
     *  @returns {Object} result
     */
    validateAttempt() {
        const isAttemptAllowed = this.loginAttempt.allowed;
        if (!isAttemptAllowed) {
            return {
                result: false,
                resultCode: -1,
                reason: 'Attempt disallowed by Meteor',
                error: this.loginAttempt.error
            };
        }

        if (this.loginAttempt.type === 'resume') {
            const shouldResume = this.shouldResumeBeAccepted();
            if (!shouldResume) {
                return {
                    result: false,
                    resultCode: -2,
                    reason: 'Resume not allowed when user does not have remember me'
                };
            }
        }

        return {
            result: true,
            resultCode: 0,
            reason: 'Validation passed'
        };
    }

    /**
     *  In case of login attempt being "resume" checks if user is eligible to
     *  be logged in again. First checks if the loginToken is valid. Then if
     *  user has flag rememberMe then should be logged in. In case of not having
     *  rememberMe set there is also check if the user had an active application
     *  session before, which helps in case of losing internet connection.
     *  We don't want to logout user because the user lost internet connection for
     *  a moment, rememberMe should not be a condition in this case.
     *
     *  @returns {boolean} result
     */
    shouldResumeBeAccepted() {
        const loginTokens = this.getUsersLoginTokens();
        const hashedToken = this.getTokenFromAttempt();
        const userResume = _.find(loginTokens, item => item.hashedToken === hashedToken);
        if (!userResume) {
            return false;
        }

        const loggedAtLeastOnce = _.some(this.loginAttempt.methodArguments, {
            loggedAtLeastOnce: true
        });
        return (userResume.rememberMe || loggedAtLeastOnce);
    }

    /**
     *  Gets hashed resume token send together with the login attempt.
     *  @returns {string} hashedToken
     */
    getTokenFromAttempt() {
        const attemptToken = (this.loginAttempt.methodArguments)
            ? this.loginAttempt.methodArguments[0].resume
            : '';
        return Authenticator.hashToken(attemptToken);
    }

    /**
     *  Get login tokens of user who is trying to log in.
     *  @returns {Array} loginTokens
     */
    getUsersLoginTokens() {
        const user = Accounts.findUserByUsername(this.loginAttempt.user.username);
        return (user.services && user.services.resume)
            ? user.services.resume.loginTokens
            : [];
    }
}

export default Authenticator;

