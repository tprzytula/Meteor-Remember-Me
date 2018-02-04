const RememberMe = require('meteor/tprzytula:remember-me').default;
const rememberMeMethod = 'tprzytula:rememberMe-update';
const sinon = require('sinon');

module.exports = () => {
    /**
     *  RememberMe.loginWithPassword is a wrapper for the Meteor's
     *  loginWithPassword method. It should match specific behaviour.
     */
    describe('Invoking "RememberMe.loginWithPassword" method', () => {
        /**
         *  Each time the wrapper is called it
         *  should also internally call the Meteor's login method.
         */
        it('should call Meteor.loginWithPassword', () => {
            const loginWithPassword = sinon.stub(
                Meteor,
                'loginWithPassword'
            );

            RememberMe.loginWithPassword('username', 'password');
            expect(loginWithPassword).to.have.been.calledOnce;
            expect(loginWithPassword).to.have.been.calledWith(
                'username',
                'password'
            );

            RememberMe.loginWithPassword('username_two', 'password_two');
            expect(loginWithPassword).to.have.been.calledTwice;
            expect(loginWithPassword).to.have.been.calledWith(
                'username_two',
                'password_two'
            );

            loginWithPassword.restore();
        });

        /**
         *  Updating the Remember Me status is only relevant if the login
         *  performed successfully. Otherwise there is no reason to send
         *  this request to the server.
         */
        it('should not call updateRememberMe method if login failed', () => {
            const loginWithPassword = sinon.stub(Meteor, 'loginWithPassword');
            const call = sinon.stub(Meteor, 'call');
            loginWithPassword.callsFake((user, password, callback) => {
                const error = 'Invalid user';
                callback(error);
            });
            RememberMe.loginWithPassword('username', 'password');
            expect(loginWithPassword).to.have.been.calledOnce;
            expect(call).to.have.callCount(0);

            loginWithPassword.restore();
            call.restore();
        });

        /**
         *  If the login performed successfully then method for updating
         *  the state of remember me should be invoked. This way server
         *  will be informed about requested change for this setting.
         */
        it('should call updateRememberMe method if logged in successfully', () => {
            const loginWithPassword = sinon.stub(
                Meteor,
                'loginWithPassword'
            );
            const call = sinon.stub(Meteor, 'call');
            loginWithPassword.callsFake((user, password, callback) => {
                const error = false;
                callback(error);
            });
            RememberMe.loginWithPassword('username', 'password');
            expect(loginWithPassword).to.have.been.calledOnce;
            expect(loginWithPassword).to.have.been.calledWith(
                'username',
                'password'
            );
            expect(call).to.have.been.calledOnce;
            expect(call).to.have.been.calledWith(rememberMeMethod);

            loginWithPassword.restore();
            call.restore();
        });

        /**
         *  Meteor.loginWithPassword takes a callback as a parameter.
         *  The callback provided to the RememberMe.loginWithPassword
         *  should be invoked after received response from the Meteor's
         *  internal login method. It should also sent the error as
         *  a parameter (if encountered).
         */
        it('should correctly pass callback to "Meteor.loginWithPassword"', () => {
            const loginWithPassword = sinon.stub(
                Meteor,
                'loginWithPassword'
            );
            const call = sinon.stub(Meteor, 'call');
            const error = 'User does not exist';
            loginWithPassword.callsFake((user, password, callback) => {
                callback(error);
            });
            const obj = {};
            obj.callback = (error) => error;
            const callbackSpy = sinon.spy(obj, 'callback');
            RememberMe.loginWithPassword('username', 'password', obj.callback);
            expect(loginWithPassword).to.have.been.calledOnce;
            expect(loginWithPassword).to.have.been.calledWith(
                'username',
                'password'
            );

            expect(callbackSpy).to.have.been.calledOnce;
            expect(callbackSpy).to.have.been.calledWith(error);

            loginWithPassword.restore();
            call.restore();
        });
    });
};