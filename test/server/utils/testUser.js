const { Accounts } = require('meteor/accounts-base');
const Authenticator = require('./../../../server/authenticator').default;

/**
 *  Manages a test user for testing purposes.
 *
 *  @property {string} username
 *  @property {string} password
 *  @class
 */
class TestUser {
    constructor(options = {}) {
        this.username = options.username || 'test';
        this.password = options.password || 'test';
    }

    /**
     *  Invoked at the class initialization.
     */
    init() {
        this.createUser();
    }

    /**
     *  Returns user document from the collection.
     *  @returns {Object} user
     */
    getUser() {
        return Meteor.users.findOne({ username: this.username });
    }

    /**
     *  Removes user with the same username if exists.
     */
    removeUser() {
        Meteor.users.remove({
            username: this.username
        });
    }

    /**
     *  Creates username for the configuration credentials.
     */
    createUser() {
        Accounts.createUser({
            username: this.username,
            password: this.password
        });
    }

    /**
     *  Creates and sets login tokens for the user according
     *  to the provided to the method options.
     *  @param {Object} options
     *  @returns {boolean} result
     */
    setLoginToken({ resume, rememberMe = true }) {
        const loginToken = {
            when: new Date(),
            hashedToken: Authenticator.hashToken(resume),
            rememberMe,
        };

        const user = Meteor.users.findOne({ username: this.username });
        if (!user) {
            return false;
        }

        const result = Meteor.users.update(user._id, {
            $set: {
                'services.resume.loginTokens': [loginToken]
            }
        });

        return result === 1;
    }
}

module.exports = TestUser;
