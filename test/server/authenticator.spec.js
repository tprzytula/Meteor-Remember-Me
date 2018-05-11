const TestUser = require('./utils/testUser');
const AuthenticatorSpec = require('../../server/authenticator').default;
const LoginAttemptGenerator = require('./utils/loginAttemptGenerator');
const chai = require('ultimate-chai');

const { expect } = chai;
const resume = 'token';

describe('Given authenticator', () => {
    let result, resultCode, reason;

    describe('When user performs login attempt with loginWithPassword method', () => {
        let loginAttempt;

        beforeEach(() => {
            const loginAttemptGenerator = new LoginAttemptGenerator({ type: 'password' });
            loginAttempt = loginAttemptGenerator.getLoginAttempt();
        });

        describe('And the attempt is allowed', () => {
            let authenticator;

            beforeEach(() => {
                loginAttempt.allowed = true;
                authenticator = new AuthenticatorSpec(loginAttempt);
                ({ result, resultCode, reason } = authenticator.validateAttempt());
            });

            it('should pass the attempt', () => {
                expect(result).to.be.equal(true);
                expect(resultCode).to.be.equal(0);
                expect(reason).to.be.equal('Validation passed');
            });
        });

        describe('And the attempt is disallowed', () => {
            let authenticator;

            beforeEach(() => {
                loginAttempt.allowed = false;
                authenticator = new AuthenticatorSpec(loginAttempt);
                ({ result, resultCode, reason } = authenticator.validateAttempt());
            });

            it('should not pass the attempt', () => {
                expect(result).to.be.equal(false);
                expect(resultCode).to.be.equal(-1);
                expect(reason).to.be.equal('Attempt disallowed by Meteor');
            });
        });
    });

    describe('When an resume attempt is received from the client', () => {
        let loginAttemptGenerator, testUserInstance;

        beforeEach(() => {
            testUserInstance = new TestUser({
                username: 'resume-test',
                password: 'resume-test',
            });
            testUserInstance.init();
            loginAttemptGenerator = new LoginAttemptGenerator({
                type: 'resume',
                user: testUserInstance.getUser()
            });
            loginAttemptGenerator.addMethodArgument({ resume });
        });

        afterEach(() => {
            testUserInstance.removeUser();
        });

        describe('And user was not logged during this device session', () => {
            let authenticator;

            beforeEach(() => {
                const loginAttempt = loginAttemptGenerator.getLoginAttempt();
                authenticator = new AuthenticatorSpec(loginAttempt);
            });

            describe('And the previous login was with rememberMe', () => {
                beforeEach(() => {
                    testUserInstance.setLoginToken({ resume, rememberMe: true });
                    ({ result, resultCode, reason } = authenticator.validateAttempt());
                });

                it('should pass the attempt', () => {
                    expect(result).to.be.equal(true);
                    expect(resultCode).to.be.equal(0);
                    expect(reason).to.be.equal('Validation passed');
                });
            });

            describe('And the previous login was without rememberMe', () => {
                beforeEach(() => {
                    testUserInstance.setLoginToken({ resume, rememberMe: false });
                    ({ result, resultCode, reason } = authenticator.validateAttempt());
                });

                it('should not pass the attempt', () => {
                    expect(result).to.be.equal(false);
                    expect(resultCode).to.be.equal(-2);
                    expect(reason).to.be.equal('Resume not allowed when user does not have remember me');
                });
            });
        });

        describe('And user was already logged during this device session', () => {
            let authenticator;

            beforeEach(() => {
                loginAttemptGenerator.addMethodArgument({ loggedAtLeastOnce: true });
                const loginAttempt = loginAttemptGenerator.getLoginAttempt();
                authenticator = new AuthenticatorSpec(loginAttempt);
            });

            describe('And the previous login was with rememberMe', () => {
                beforeEach(() => {
                    testUserInstance.setLoginToken({ resume, rememberMe: true });
                    ({ result, resultCode, reason } = authenticator.validateAttempt());
                });

                it('should pass the attempt', () => {
                    expect(result).to.be.equal(true);
                    expect(resultCode).to.be.equal(0);
                    expect(reason).to.be.equal('Validation passed');
                });
            });

            describe('And the previous login was without rememberMe', () => {
                beforeEach(() => {
                    testUserInstance.setLoginToken({ resume, rememberMe: false });
                    ({ result, resultCode, reason } = authenticator.validateAttempt());
                });

                it('should pass the attempt', () => {
                    expect(result).to.be.equal(true);
                    expect(resultCode).to.be.equal(0);
                    expect(reason).to.be.equal('Validation passed');
                });
            });
        });
    });
});
