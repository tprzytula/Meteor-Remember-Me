import * as Validator from './validator';
import * as integrationAccounts from '../../integration/accounts';

/**
 *  ShouldResumeBeAccepted
 *
 *  Validates if the attempt is a resume type.
 *  Then decides if it should be accepted.
 *
 *  @class
 *  @extends Validator
 */
class ShouldResumeBeAccepted extends Validator.default {
    static _didUserReportSetting(userResume) {
        return 'rememberMe' in userResume;
    }

    constructor(...params) {
        super(...params);
        super.setErrorDetails({
            reason: 'Resume not allowed when user does not have remember me',
            errorCode: 405
        });
    }

    /**
     *  Runs the validation.
     *  @returns {boolean} isValid
     */
    validate() {
        if (this.loginAttempt.type !== 'resume') {
            return true;
        }

        const userResume = this._getResume();
        if (!userResume) {
            return false;
        }

        if (!ShouldResumeBeAccepted._didUserReportSetting(userResume)) {
            // User did not report the setting so it should work in a default way
            return true;
        }

        const methodArguments = this.loginAttempt.methodArguments || [];
        const loggedAtLeastOnce =
            methodArguments.some(argument => argument.loggedAtLeastOnce === true);
        return (userResume.rememberMe || loggedAtLeastOnce);
    }

    /**
     *  Fetches loginToken record associated to this login attempt from the database.
     *  @returns {Object} loginToken
     *  @private
     */
    _getResume() {
        const loginTokens = this._getUsersLoginTokens();
        const hashedToken = this._getTokenFromAttempt();
        return loginTokens.find(item => item.hashedToken === hashedToken);
    }

    /**
     *  Hashes and returns login token passed in the login attempt.
     *  @returns {string}
     *  @private
     */
    _getTokenFromAttempt() {
        const attemptToken = (this.loginAttempt.methodArguments)
            ? this.loginAttempt.methodArguments[0].resume
            : '';
        return integrationAccounts.hashLoginToken(attemptToken);
    }

    /**
     *  Finds user record in the database and returns all of the user's loginTokens.
     *  @returns {[Object]} loginTokens
     *  @private
     */
    _getUsersLoginTokens() {
        const user = integrationAccounts.findUser(this.loginAttempt.user);
        return (user && user.services && user.services.resume)
            ? user.services.resume.loginTokens
            : [];
    }
}

export const factory = (...params) => new ShouldResumeBeAccepted(...params);

export default ShouldResumeBeAccepted;
