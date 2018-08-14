import sinon from 'sinon';
import { expect } from 'ultimate-chai';
import * as shouldResumeBeAccepted from '../../../../server/loginAttemptValidator/validators/shouldResumeBeAccepted';
import * as integrationAccounts from '../../../../server/integration/accounts';

describe('Given the shouldResumeBeAccepted validator', () => {
    const sandbox = sinon.createSandbox();
    let instance, loginAttemptMock, mockedToken, result;

    beforeEach(() => {
        sandbox
            .stub(integrationAccounts, 'hashLoginToken')
            .callsFake(token => token);
        sandbox
            .stub(integrationAccounts, 'findUserByUsername')
            .callsFake(() => ({
                services: {
                    resume: {
                        loginTokens: [mockedToken]
                    }
                }
            }));
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When user starts a new device session after being logged in', () => {
        beforeEach(() => {
            loginAttemptMock = {
                type: 'resume',
                methodArguments: [{ resume: 'token' }],
                user: { username: 'test' }
            };
            instance = shouldResumeBeAccepted.factory(loginAttemptMock);
        });

        describe('And rememberMe was true', () => {
            beforeEach(() => {
                mockedToken = { hashedToken: 'token', rememberMe: true };
                result = instance.validate();
            });

            it('should pass the validation', () => {
                expect(result).to.be.equal(true);
            });
        });

        describe('And rememberMe was false', () => {
            beforeEach(() => {
                mockedToken = { hashedToken: 'token', rememberMe: false };
                result = instance.validate();
            });

            it('should not pass the validation', () => {
                expect(result).to.be.equal(false);
            });

            describe('And the getError is invoked', () => {
                beforeEach(() => {
                    result = instance.getError();
                });

                it('should return a proper error details', () => {
                    expect(result).to.be.deep.equal({
                        result: false,
                        reason: 'Resume not allowed when user does not have remember me',
                        errorCode: 405
                    });
                });
            });
        });

        describe('And rememberMe was not reported by user', () => {
            beforeEach(() => {
                mockedToken = { hashedToken: 'token' };
                result = instance.validate();
            });

            it('should pass the validation', () => {
                expect(result).to.be.equal(true);
            });
        });
    });

    describe('When user reconnects after a connection loss', () => {
        beforeEach(() => {
            loginAttemptMock = {
                type: 'resume',
                methodArguments: [{ resume: 'token' }, { loggedAtLeastOnce: true }],
                user: { username: 'test' }
            };
            instance = shouldResumeBeAccepted.factory(loginAttemptMock);
        });

        describe('And rememberMe was true', () => {
            beforeEach(() => {
                mockedToken = { hashedToken: 'token', rememberMe: true };
                result = instance.validate();
            });

            it('should pass the validation', () => {
                expect(result).to.be.equal(true);
            });
        });

        describe('And rememberMe was false', () => {
            beforeEach(() => {
                mockedToken = { hashedToken: 'token', rememberMe: false };
                result = instance.validate();
            });

            it('should pass the validation', () => {
                expect(result).to.be.equal(true);
            });
        });

        describe('And rememberMe was not present', () => {
            beforeEach(() => {
                mockedToken = { hashedToken: 'token' };
                result = instance.validate();
            });

            it('should pass the validation', () => {
                expect(result).to.be.equal(true);
            });
        });
    });

    describe('When user logged in using a method', () => {
        beforeEach(() => {
            loginAttemptMock = { type: 'password' };
            instance = shouldResumeBeAccepted.factory(loginAttemptMock);
        });

        describe('And the validate method is invoked', () => {
            beforeEach(() => {
                result = instance.validate();
            });

            it('should pass the validation', () => {
                expect(result).to.be.equal(true);
            });
        });
    });
});

describe('Given the shouldResumeBeAccepted factory', () => {
    it('should be a function', () => {
        expect(typeof shouldResumeBeAccepted.factory).to.be.equal('function');
    });

    describe('When invoked', () => {
        let result;

        beforeEach(() => {
            result = shouldResumeBeAccepted.factory();
        });

        it('should return an instance of ShouldResumeBeAccepted validator', () => {
            expect(result instanceof shouldResumeBeAccepted.default).to.be.equal(true);
        });
    });
});

