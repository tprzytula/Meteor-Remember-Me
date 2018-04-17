const RememberMe = require('meteor/tprzytula:remember-me').RememberMeClass;

const rememberMeMethod = 'tprzytula:rememberMe-update';
const sinon = require('sinon');
const chai = require('ultimate-chai');

const { expect } = chai;

module.exports = () => {
    /**
     *  Remember me setting should be correctly set for each case.
     */
    describe('Remember me flag', () => {
        /**
         *  There is no requirement for passing remember me parameter.
         *  To match default behaviour of Meteor it's true by default.
         */
        describe('not provided as a parameter', () => {
            it('should set remember me to true by default (without callback)', () => {
                const rememberMe = new RememberMe();
                const loginWithPassword = sinon.stub(
                    Meteor,
                    'loginWithPassword'
                );
                const call = sinon.stub(Meteor, 'call');
                loginWithPassword.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                rememberMe.loginWithPassword('username', 'password');
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );
                expect(call).to.have.been.calledOnce();
                expect(call).to.have.been.calledWith(rememberMeMethod, true);

                loginWithPassword.restore();
                call.restore();
            });

            it('should set remember me to true by default (with callback)', () => {
                const rememberMe = new RememberMe();
                const loginWithPassword = sinon.stub(
                    Meteor,
                    'loginWithPassword'
                );
                const call = sinon.stub(Meteor, 'call');
                loginWithPassword.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                rememberMe.loginWithPassword('username', 'password', () => {});
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );
                expect(call).to.have.been.calledOnce();
                expect(call).to.have.been.calledWith(rememberMeMethod, true);

                loginWithPassword.restore();
                call.restore();
            });
        });

        /**
         *  Remember me flag can be provided as a third parameter
         *  in case where user does not need to provide a callback.
         */
        describe('provided as a third parameter', () => {
            it('should set remember me to true if equals "true"', () => {
                const rememberMe = new RememberMe();
                const loginWithPassword = sinon.stub(
                    Meteor,
                    'loginWithPassword'
                );
                const call = sinon.stub(Meteor, 'call');
                loginWithPassword.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                rememberMe.loginWithPassword('username', 'password', true);
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );
                expect(call).to.have.been.calledOnce();
                expect(call).to.have.been.calledWithMatch(rememberMeMethod, true);

                loginWithPassword.restore();
                call.restore();
            });

            it('should set remember me to false if equals "false"', () => {
                const rememberMe = new RememberMe();
                const loginWithPassword = sinon.stub(
                    Meteor,
                    'loginWithPassword'
                );
                const call = sinon.stub(Meteor, 'call');
                loginWithPassword.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                rememberMe.loginWithPassword('username', 'password', false);
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );
                expect(call).to.have.been.calledOnce();
                expect(call).to.have.been.calledWithMatch(rememberMeMethod, false);

                loginWithPassword.restore();
                call.restore();
            });
        });

        /**
         *  Remember me flag can be provided as a fourth parameter
         *  in case where wants to provide callback as a third one.
         */
        describe('provided as a fourth parameter', () => {
            it('should set remember me to true if equals "true"', () => {
                const rememberMe = new RememberMe();
                const loginWithPassword = sinon.stub(
                    Meteor,
                    'loginWithPassword'
                );
                const call = sinon.stub(Meteor, 'call');
                loginWithPassword.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                rememberMe.loginWithPassword('username', 'password', () => {}, true);
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );
                expect(call).to.have.been.calledOnce();
                expect(call).to.have.been.calledWithMatch(rememberMeMethod, true);

                loginWithPassword.restore();
                call.restore();
            });

            it('should set remember me to false if equals "false"', () => {
                const rememberMe = new RememberMe();
                const loginWithPassword = sinon.stub(
                    Meteor,
                    'loginWithPassword'
                );
                const call = sinon.stub(Meteor, 'call');
                loginWithPassword.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                rememberMe.loginWithPassword('username', 'password', () => {}, false);
                expect(loginWithPassword).to.have.been.calledOnce();
                expect(loginWithPassword).to.have.been.calledWith(
                    'username',
                    'password'
                );
                expect(call).to.have.been.calledOnce();
                expect(call).to.have.been.calledWithMatch(rememberMeMethod, false);

                loginWithPassword.restore();
                call.restore();
            });
        });
    });
};
