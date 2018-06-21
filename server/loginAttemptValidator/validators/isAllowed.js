import * as Validator from './validator';

/**
 *  IsAllowed
 *
 *  Validates if the login attempt was already
 *  disallowed in one of the previous authentication processes.
 *
 *  @class
 *  @extends Validator
 */
class IsAllowed extends Validator.default {
    constructor(...params) {
        super(...params);
        super.setErrorDetails({
            reason: 'Attempt disallowed by previous validation',
            error: this.loginAttempt.error
        });
    }

    /**
     *  Runs the validation.
     *  @returns {boolean} isValid
     */
    validate() {
        return !!(this.loginAttempt && this.loginAttempt.allowed);
    }
}

export const factory = (...params) => new IsAllowed(...params);

export default IsAllowed;
