/**
 *  Validator
 *
 *  @property {Object} loginAttempt
 *  @property {Object} errorDetails
 *
 *  @class
 *  @abstract
 */
class Validator {
    constructor(attempt) {
        this.loginAttempt = attempt;
        this.errorDetails = {};
    }

    /**
     *  Sets the error message for failures.
     *  @param {Object} details
     */
    setErrorDetails(details) {
        this.errorDetails = details;
    }

    /**
     *  Runs the validation.
     *  @returns {boolean} isValid
     */
    validate() {
        return !!this.loginAttempt;
    }

    /**
     *  Returns error message for failure.
     *  @returns {Object} errorMessage
     */
    getError() {
        return {
            result: false,
            ...this.errorDetails
        };
    }
}

export default Validator;
