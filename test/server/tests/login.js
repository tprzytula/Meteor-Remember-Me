const Authenticator = require('../../../server/authenticator').default;
const LoginAttemptGenerator = require('../utils/loginAttemptGenerator');
const chai = require('ultimate-chai');

const expect = chai.expect;
const type = 'password';

module.exports = () => {
    /**
     *  Those tests are covering a basic user login attempt.
     *  The attempt is invoked if the user is logging for the first
     *  time by using methods such as Meteor.loginWithPassword.
     */
    describe('login attempt', () => {
        /**
         *  The attempt can be disallowed already from the previously
         *  ran validators. It can be a validator directly from the Meteor core
         *  saying that the password is wrong but also another one created by the developer.
         *
         *  In this case there is no need to validate the attempt anymore.
         *  It should be instantly disallowed again.
         */
        it('should not pass if the attempt is already disallowed', () => {
            const loginAttemptGenerator = new LoginAttemptGenerator({ type });
            const loginAttempt = loginAttemptGenerator.getLoginAttempt();
            loginAttempt.allowed = false;
            const authenticator = new Authenticator(loginAttempt);
            const { result, resultCode, reason } = authenticator.validateAttempt();
            expect(result).to.be.equal(false);
            expect(resultCode).to.be.equal(-1);
            expect(reason).to.be.equal('Attempt disallowed by Meteor');
        });

        /**
         *  The dependency logic should not affect normal login attempts.
         *  Because of that if the previously ran validations succeeded the
         *  dependency should also let it pass further.
         */
        it('should pass if the attempt is allowed', () => {
            const loginAttemptGenerator = new LoginAttemptGenerator({ type });
            const loginAttempt = loginAttemptGenerator.getLoginAttempt();
            loginAttempt.allowed = true;
            const authenticator = new Authenticator(loginAttempt);
            const { result, resultCode, reason } = authenticator.validateAttempt();
            expect(result).to.be.equal(true);
            expect(resultCode).to.be.equal(0);
            expect(reason).to.be.equal('Validation passed');
        });
    });
};
