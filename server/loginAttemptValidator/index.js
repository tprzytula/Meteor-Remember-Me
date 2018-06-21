import * as IsAllowed from './validators/isAllowed';
import * as ShouldResumeBeAccepted from './validators/shouldResumeBeAccepted';

/**
 *  The brain of the RememberMe functionality.
 *  Decides if user's login attempt should be accepted or not.
 */
class LoginAttemptValidator {
    constructor(attempt = {}) {
        this._loginAttempt = attempt;
        this._validators = this._prepareValidators();
    }

    /**
     *  Creates list of validators
     *  @returns {Object[]} validators
     *  @private
     */
    _prepareValidators() {
        return [
            IsAllowed.factory(this._loginAttempt),
            ShouldResumeBeAccepted.factory(this._loginAttempt)
        ];
    }

    /**
     *  Runs all validators and returns the result.
     *  If any of them failed then the validation did not succeeded.
     *  @returns {Object} result
     */
    validate() {
        const failedValidator = this._validators.find(validator => !validator.validate());
        if (failedValidator) {
            return failedValidator.getError();
        }

        return {
            result: true,
            resultCode: 0,
            reason: 'Validation passed'
        };
    }
}

export const factory = (...params) => new LoginAttemptValidator(...params);

export default LoginAttemptValidator;

