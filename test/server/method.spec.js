const RememberMe = require('meteor/tprzytula:remember-me');

const rememberMeMethod = 'tprzytula:rememberMe-update';
const chai = require('ultimate-chai');

const { expect } = chai;
const getMeteorMethods = () => Meteor.default_server.method_handlers;
const checkIfMeteorMethodExists = name => name in getMeteorMethods();

describe('Given a rememberMe method', () => {
    /**
     *  Having this dependency installed should not invoke it.
     *  The rememberMe method used for the communication client <> server
     *  should not exist.
     */
    it('should not exist by default', () => {
        const doesExist = checkIfMeteorMethodExists(rememberMeMethod);
        expect(doesExist).to.be.equal(false);
    });

    describe('When rememberMe functionality is activated', () => {
        beforeEach(() => {
            RememberMe.activate();
        });

        /**
         *  After activating the functionality a new meteor method
         *  should be created. From now user is able to invoke the
         *  'tprzytula:rememberMe-update' method.
         */
        it('should exist after activating the functionality', () => {
            const doesExist = checkIfMeteorMethodExists(rememberMeMethod);
            expect(doesExist).to.be.equal(true);
        });
    });
});
