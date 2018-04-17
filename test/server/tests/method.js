const RememberMe = require('meteor/tprzytula:remember-me');

const rememberMeMethod = 'tprzytula:rememberMe-update';
const chai = require('ultimate-chai');

const { expect } = chai;
const getMeteorMethods = () => Meteor.default_server.method_handlers;
const checkIfMeteorMethodExists = name => name in getMeteorMethods();

module.exports = () => {
    /**
     *  The dependency is significantly affecting how the login system works.
     *  I'm against the idea of dependencies which are running automatically
     *  without the developer knowledge. There are situations where developers
     *  are leaving not used dependencies in the list. In this case it can be
     *  hard for them to debug and find the reason for their login system
     *  to work differently than the normal one should.
     */
    describe('remember-me method', () => {
        /**
         *  Having this dependency installed should not invoke it.
         *  The main method used for the communication client <> server
         *  should not exist.
         */
        it('should not exist by default', () => {
            const doesExist = checkIfMeteorMethodExists(rememberMeMethod);
            expect(doesExist).to.be.equal(false);
        });

        /**
         *  After activating the functionality a new meteor method
         *  should be created. From now all users are being able to
         *  invoke the 'tprzytula:rememberMe-update' method.
         */
        it('should exist after activating the functionality', () => {
            RememberMe.activate();
            const doesExist = checkIfMeteorMethodExists(rememberMeMethod);
            expect(doesExist).to.be.equal(true);
        });
    });
};
