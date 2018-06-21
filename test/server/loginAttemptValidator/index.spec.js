import { expect } from 'ultimate-chai';
import * as loginAttemptValidator from '../../../server/loginAttemptValidator/index';

describe('Given the loginAttemptValidator factory', () => {
    it('should be a function', () => {
        expect(typeof loginAttemptValidator.factory).to.be.equal('function');
    });

    describe('When invoked', () => {
        let result;

        beforeEach(() => {
            result = loginAttemptValidator.factory();
        });

        it('should return an instance of LoginAttemptValidator', () => {
            expect(result instanceof loginAttemptValidator.default).to.be.equal(true);
        });
    });
});
