import { expect } from 'ultimate-chai';
import * as isAllowed from '../../../../server/loginAttemptValidator/validators/isAllowed';

describe('Given the isAllowed validator', () => {
    let instance, loginAttempt, result;

    describe('When login attempt is allowed', () => {
        beforeEach(() => {
            loginAttempt = { allowed: true };
            instance = isAllowed.factory(loginAttempt);
        });

        describe('And the validation is invoked', () => {
            beforeEach(() => {
                result = instance.validate();
            });

            it('should not pass the validation', () => {
                expect(result).to.be.equal(true);
            });
        });
    });

    describe('When login attempt is disallowed', () => {
        beforeEach(() => {
            loginAttempt = { allowed: false, error: 'not today' };
            instance = isAllowed.factory(loginAttempt);
        });

        describe('And the validation is invoked', () => {
            beforeEach(() => {
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
                        reason: 'Attempt disallowed by previous validation',
                        error: 'not today'
                    });
                });
            });
        });
    });

    describe('When login attempt is empty', () => {
        beforeEach(() => {
            loginAttempt = {};
            instance = isAllowed.factory(loginAttempt);
        });

        describe('And the validation is invoked', () => {
            beforeEach(() => {
                result = instance.validate();
            });

            it('should not pass the validation', () => {
                expect(result).to.be.equal(false);
            });
        });
    });
});

describe('Given the isAllowed factory', () => {
    it('should be a function', () => {
        expect(typeof isAllowed.factory).to.be.equal('function');
    });

    describe('When invoked', () => {
        let result;

        beforeEach(() => {
            result = isAllowed.factory({ error: 'something' });
        });

        it('should return an instance of IsAllowed validator', () => {
            expect(result instanceof isAllowed.default).to.be.equal(true);
        });
    });
});
