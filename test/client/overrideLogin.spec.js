const { AccountsClient } = require('meteor/accounts-base');
const overrideLogin = require('./../../client/overrideLogin').default;
const chai = require('ultimate-chai');
const sinon = require('sinon');

const { expect } = chai;

const isMethodOverridden = 'tprzytula:remember-me_overridden';
const isCallbackRegistered = 'tprzytula:remember-me_callbackRegistered';

describe('Given overrideLogin', () => {
    describe('When a new AccountsClient instance is created', () => {
        let connection, testAccounts, callLoginMethodStub;

        beforeEach(() => {
            connection = DDP.connect('127.0.0.1:3000');
            testAccounts = new AccountsClient({ connection });
            callLoginMethodStub = sinon.stub(testAccounts, 'callLoginMethod');
        });

        afterEach(() => {
            connection.disconnect();
        });

        it('should not have any callbacks', () => {
            const { callbacks } = testAccounts._onLoginHook;
            const callbacksAmount = Object.keys(callbacks).length;
            expect(callbacksAmount).to.be.equal(0);
        });

        it('should not have set a flag for callback registration', () => {
            expect(isCallbackRegistered in testAccounts).to.be.equal(false);
        });

        describe('And it is passed to the overrideLogin method', () => {
            beforeEach(() => {
                overrideLogin(testAccounts);
            });

            it('should register onLogin callback', () => {
                const { callbacks } = testAccounts._onLoginHook;
                const callbacksAmount = Object.keys(callbacks).length;
                expect(callbacksAmount).to.be.equal(1);
            });

            it('should set callback registration flag', () => {
                expect(isCallbackRegistered in testAccounts).to.be.equal(true);
            });

            it('should not override the login method', () => {
                expect(isMethodOverridden in testAccounts).to.be.equal(false);
            });

            describe('And registered callback is invoked', () => {
                beforeEach(() => {
                    const { callbacks } = testAccounts._onLoginHook;
                    callbacks['0']();
                });

                it('should set login method overridden flag', () => {
                    expect(isMethodOverridden in testAccounts).to.be.equal(true);
                });

                it('should override the login method', () => {
                    expect(testAccounts.callLoginMethod).to.not.be.equal(callLoginMethodStub);
                });

                describe('And the callLoginMethod is invoked without method arguments', () => {
                    beforeEach(() => {
                        testAccounts.callLoginMethod();
                    });

                    it('should also call the original method', () => {
                        expect(callLoginMethodStub).to.be.calledOnce();
                    });

                    it('should create methodArguments with loggedAtLeastOnce argument', () => {
                        expect(callLoginMethodStub).to.be.calledWith({
                            methodArguments: [{
                                loggedAtLeastOnce: true
                            }]
                        });
                    });
                });

                describe('And the callLoginMethod is invoked with sample method arguments', () => {
                    const sampleMethodArguments = [
                        { user: 'testUser' },
                        { password: 'testPassword' }
                    ];

                    beforeEach(() => {
                        testAccounts.callLoginMethod({
                            methodArguments: [...sampleMethodArguments]
                        });
                    });

                    it('should also call the original method', () => {
                        expect(callLoginMethodStub).to.be.calledOnce();
                    });

                    it('should create methodArguments with loggedAtLeastOnce argument', () => {
                        const expectedArguments = [
                            ...sampleMethodArguments,
                            { loggedAtLeastOnce: true }
                        ];
                        expect(callLoginMethodStub).to.be.calledWith({
                            methodArguments: expectedArguments
                        });
                    });
                });
            });

            describe('And the same Accounts instance is passed several additional times to the method', () => {
                beforeEach(() => {
                    overrideLogin(testAccounts);
                    overrideLogin(testAccounts);
                    overrideLogin(testAccounts);
                });

                it('should not register additional callbacks', () => {
                    const { callbacks } = testAccounts._onLoginHook;
                    const callbacksAmount = Object.keys(callbacks).length;
                    expect(callbacksAmount).to.be.equal(1);
                });
            });
        });
    });
});
