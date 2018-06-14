/**
 *  Generates meteor alike login attempt objects.
 *  In the running environment the object is received
 *  on the server side on every login attempt.
 *  To test unit test this functionality they have to
 *  be provided in the same form to the methods.
 *
 *  @property {Object} loginAttempt
 *  @class
 */
class LoginAttemptGenerator {
    constructor(options = {}) {
        this.createAttempt(options);
    }

    /**
     *  Creates loginAttempt object according to the provided options.
     *  @param {Object} configuration
     */
    createAttempt({
        type = 'password',
        allowed = true,
        user
    }) {
        this.loginAttempt = {
            type,
            allowed,
            methodName: 'login',
            methodArguments: [],
            user: {},
            connection: {},
        };

        if (type === 'resume') {
            this.loginAttempt.user = user || Meteor.users.findOne();
        }
    }

    /**
     *  Returns generated login attempt.
     *  @returns {Object} loginAttempt
     */
    getLoginAttempt() {
        return this.loginAttempt;
    }

    /**
     *  Adds a method argument to the attempt.
     *  On the running meteor environments method arguments
     *  are being sent by user together with the login attempt.
     *  They are including data for the authorization.
     *  @param {Object} argument
     */
    addMethodArgument(argument = {}) {
        this.loginAttempt.methodArguments.push(argument);
    }
}

module.exports = LoginAttemptGenerator;
