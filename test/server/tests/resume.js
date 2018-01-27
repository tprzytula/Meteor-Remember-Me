const { chai } = require('meteor/practicalmeteor:chai');
const TestUser = require('../utils/testUser');
const Authenticator = require('../../../server/authenticator').default;
const LoginAttemptGenerator = require('../utils/loginAttemptGenerator')

const expect = chai.expect;
const type = 'resume';
const resume = 'token';
const testUser = new TestUser({
    username: 'resume-test',
    password: 'resume-test'
});

module.exports = () => {
    /**
     *  Those tests are covering the autologin attempt.
     *  The attempt is invoked by the core of the meteor accounts.
     *  Every time a previously logged in user reconnects to the system
     *  there is a "resume" attempt sent.
     * 
     *  This dependency did allow the user to decide during the login
     *  if he want to have the rememberMe flag set on true or false.
     *  This setting will have an importance of the decision being made during resume.
     */
    describe('resume attempt', () => {
        /**
         *  In case of an user logging in with rememberMe the resume
         *  attempt should be allowed. This covers a situation where user
         *  is being logged with rememberMe and then restarts the application.
         *  The user should stay logged in.
         */
        it('should pass if user does have rememberMe', () => {
            testUser.setLoginToken({ resume, rememberMe: true });
            const loginAttemptGenerator = new LoginAttemptGenerator({ type, resume });
            const loginAttempt = loginAttemptGenerator.getLoginAttempt();
            const authenticator = new Authenticator(loginAttempt);
            const { result, resultCode, reason } = authenticator.validateAttempt();
            expect(result).to.be.equal(true);
            expect(resultCode).to.be.equal(0);
            expect(reason).to.be.equal('Validation passed');
        });

        /**
         *  In case of an user logging in without rememberMe the resume
         *  attempt should not be allowed. This covers a situation where user
         *  is being logged without rememberMe and then restarts the application.
         *  The user should be logged out.
         */
        it('should not pass if user does not have rememberMe', () => {
            testUser.setLoginToken({ resume, rememberMe: false });
            const loginAttemptGenerator = new LoginAttemptGenerator({ type, resume });
            const loginAttempt = loginAttemptGenerator.getLoginAttempt();
            const authenticator = new Authenticator(loginAttempt);
            const { result, resultCode, reason } = authenticator.validateAttempt();
            expect(result).to.be.equal(false);
            expect(resultCode).to.be.equal(-2);
            expect(reason).to.be.equal('Resume not allowed when user does not have remember me');
        });

        /**
         *  Important thing to keep in mind is that Meteor's login system does not know
         *  when the user is starting the app from the scratch or just lost the internet.
         *  It's not intended to logout an user without rememberMe every time he will lose
         *  the internet connection.
         * 
         *  To avoid this situation the user from now is sending also 'loggedAtLeastOnce: true'
         *  flag if he already logged once in ongoing device session.
         */
        describe('connection loss', () => {
            /**
             *  If the user already had a successfull login attempt during his device session
             *  then he should stay logged in no matter the rememberMe setting after the reconnect.
             *  Validates if user stays online with rememberMe being set to 'false'.
             */
            it('should pass for the same session as previous login when without rememberMe', () => {
                testUser.setLoginToken({ resume, rememberMe: false });
                const loginAttemptGenerator = new LoginAttemptGenerator({ type, resume });
                loginAttemptGenerator.addMethodArgument({ loggedAtLeastOnce: true });
                const loginAttempt = loginAttemptGenerator.getLoginAttempt();
                const authenticator = new Authenticator(loginAttempt);
                const { result, resultCode, reason } = authenticator.validateAttempt();
                expect(result).to.be.equal(true);
                expect(resultCode).to.be.equal(0);
                expect(reason).to.be.equal('Validation passed');
            });
    
            /**
             *  If the user already had a successfull login attempt during his device session
             *  then he should stay logged in no matter the rememberMe setting after the reconnect.
             *  Validates if user stays online with rememberMe being set to 'true'.
             */
            it('should pass for the same session as previous login when with rememberMe', () => {
                testUser.setLoginToken({ resume, rememberMe: true });
                const loginAttemptGenerator = new LoginAttemptGenerator({ type, resume });
                loginAttemptGenerator.addMethodArgument({ loggedAtLeastOnce: true });
                const loginAttempt = loginAttemptGenerator.getLoginAttempt();
                const authenticator = new Authenticator(loginAttempt);
                const { result, resultCode, reason } = authenticator.validateAttempt();
                expect(result).to.be.equal(true);
                expect(resultCode).to.be.equal(0);
                expect(reason).to.be.equal('Validation passed');
            });
        });
    });
};