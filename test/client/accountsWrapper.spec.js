import { expect } from 'ultimate-chai';
import sinon from 'sinon';

import { DDP } from 'meteor/ddp-client';
import { AccountsClient } from 'meteor/accounts-base';
import AccountsConfigurator from './../../client/accountsConfigurator';
import * as AccountsWrapper from './../../client/accountsWrapper';
import * as Alerts from './../../client/lib/alerts';

describe('Given AccountsWrapper', () => {
    const sandbox = sinon.createSandbox();
    const sampleCorrectParams = {
        username: 'test-user',
        password: 'test-password',
        flag: true,
        callback: sandbox.stub()
    };
    let accountsClient, accountsWrapper, callStub, connection;

    beforeEach(() => {
        sampleCorrectParams.callback = sandbox.stub();
        connection = DDP.connect('localhost:3000');
        accountsClient = new AccountsClient({ connection });
        accountsClient.loginWithPassword = sandbox.stub().callsFake((...params) => {
            const [username, password, callback] = params;
            const attemptValid = username === sampleCorrectParams.username &&
                password === sampleCorrectParams.password;
            if (attemptValid) {
                callback();
                return;
            }
            callback('User not found');
        });
        callStub = sandbox.stub(accountsClient.connection, 'call')
            .callsFake((methodName, parameter, callback) => {
                callback();
            });
        accountsWrapper = AccountsWrapper.factory(accountsClient);
    });

    afterEach(() => {
        connection.disconnect();
        sandbox.restore();
    });

    describe('When initialised', () => {
        let configureSpy;

        beforeEach(() => {
            configureSpy = sandbox.stub(AccountsConfigurator.prototype, 'configure');
            accountsWrapper.configure();
        });

        it('should initiate setup in AccountsConfiguration', () => {
            expect(configureSpy).to.be.calledOnce();
        });

        describe('And loginWithPassword is invoked with correct login details', () => {
            beforeEach(() => {
                accountsWrapper.loginWithPassword(sampleCorrectParams);
            });

            it('should call loginWithPassword from the accounts instance with correct parameters', () => {
                const { username, password } = sampleCorrectParams;
                expect(accountsClient.loginWithPassword)
                    .to.be.calledWith(username, password);
            });

            it('should call callback without any error', () => {
                expect(sampleCorrectParams.callback).to.be.calledWith(undefined);
            });

            it('should send request to update the rememberMe flag', () => {
                expect(callStub).to.be.calledWith('tprzytula:rememberMe-update', sampleCorrectParams.flag);
            });
        });

        describe('And loginWithPassword with incorrect login details', () => {
            const sampleIncorrectParams = {
                username: 'test-user-wrong',
                password: 'test-password-wrong',
                flag: true,
                callback: sinon.stub()
            };

            beforeEach(() => {
                accountsWrapper.loginWithPassword(sampleIncorrectParams);
            });

            it('should pass error to the callback', () => {
                expect(sampleIncorrectParams.callback).to.be.calledWith('User not found');
            });

            it('should not send request to update the rememberMe flag', () => {
                expect(callStub).not.to.be.calledWith('tprzytula:rememberMe-update');
            });
        });

        describe('And rememberMe is not activated on the server', () => {
            beforeEach(() => {
                callStub.callsFake((methodName, parameter, callback) => {
                    if (methodName === 'tprzytula:rememberMe-update') {
                        callback(new Meteor.Error(404));
                    }
                });
            });

            describe('And loginWithPassword is invoked', () => {
                let alertStub;

                beforeEach(() => {
                    alertStub = sandbox.stub(Alerts, 'rememberMeNotActive');
                    accountsWrapper.loginWithPassword(sampleCorrectParams);
                });

                it('should alert that rememberMe is not activated on the server', () => {
                    expect(alertStub).to.be.calledOnce();
                });
            });
        });

        describe('And server throws an unexpected error when requested to update rememberMe flag', () => {
            beforeEach(() => {
                callStub.callsFake((methodName, parameter, callback) => {
                    if (methodName === 'tprzytula:rememberMe-update') {
                        callback(new Meteor.Error(401));
                    }
                });
            });

            describe('And loginWithPassword is invoked', () => {
                let alertStub;

                beforeEach(() => {
                    alertStub = sandbox.stub(Alerts, 'couldNotUpdateRememberMe');
                    accountsWrapper.loginWithPassword(sampleCorrectParams);
                });

                it('should alert that it could not update the rememberMe setting', () => {
                    expect(alertStub).to.be.calledOnce();
                });
            });
        });
    });
});

describe('Given AccountsWrapper factory', () => {
    it('should be a function', () => {
        expect(typeof AccountsWrapper.factory).to.be.equal('function');
    });

    describe('When invoked', () => {
        let result;

        beforeEach(() => {
            result = AccountsWrapper.factory();
        });

        it('should return an instance of AccountsWrapper', () => {
            expect(result instanceof AccountsWrapper.default).to.be.equal(true);
        });
    });
});
