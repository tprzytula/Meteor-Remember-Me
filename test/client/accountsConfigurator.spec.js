import { expect } from 'ultimate-chai';
import sinon from 'sinon';

import { DDP } from 'meteor/ddp-client';
import { AccountsClient } from 'meteor/accounts-base';
import * as AccountsConfigurator from './../../client/accountsConfigurator';

describe('Given AccountsConfigurator', () => {
    const sandbox = sinon.createSandbox();
    let accountsClient, accountsConfigurator, connection;

    beforeEach(() => {
        connection = DDP.connect('localhost:3000');
        accountsClient = new AccountsClient({ connection });
        accountsConfigurator = AccountsConfigurator.factory(accountsClient);
    });

    afterEach(() => {
        connection.disconnect();
        sandbox.restore();
    });

    describe('When configure is invoked', () => {
        let onLoginStub, onLoginCallback;

        beforeEach(() => {
            onLoginStub = sandbox.stub(accountsClient, 'onLogin')
                .callsFake((callback) => { onLoginCallback = callback; });
            accountsConfigurator.configure();
        });

        it('should register onLogin callback with correct method', () => {
            expect(onLoginStub).to.be.calledOnce();
        });

        it('should set loginWithPassword method to the instance', () => {
            expect('loginWithPassword' in accountsClient).to.be.equal(true);
        });

        describe('And configure is invoked again', () => {
            beforeEach(() => {
                accountsConfigurator.configure();
            });

            it('should not register additional onLogin callbacks', () => {
                expect(onLoginStub).to.be.calledOnce();
            });
        });

        describe('And the users logs in', () => {
            let callLoginMethodStub;

            beforeEach(() => {
                callLoginMethodStub = sandbox.stub(accountsClient, 'callLoginMethod');
                onLoginCallback();
            });

            it('should override callLoginMethod', () => {
                expect(accountsClient.callLoginMethod).to.not.be.equal(callLoginMethodStub);
            });

            describe('And the user logs in again', () => {
                let overriddenCallLoginMethodStub;

                beforeEach(() => {
                    overriddenCallLoginMethodStub = sandbox.stub(accountsClient, 'callLoginMethod');
                    onLoginCallback();
                });

                it('should not override callLoginMethod again', () => {
                    expect(accountsClient.callLoginMethod)
                        .to.be.equal(overriddenCallLoginMethodStub);
                });
            });

            describe('And the callLoginMethod is invoked without parameter', () => {
                beforeEach(() => {
                    accountsClient.callLoginMethod();
                });

                it('should call original method with loggedAtLeastOnce in arguments', () => {
                    const expectedParameter = { methodArguments: [{ loggedAtLeastOnce: true }] };
                    expect(callLoginMethodStub).to.be.calledWithExactly(expectedParameter);
                });
            });

            describe('And the callLoginMethod is invoked with sample parameter', () => {
                const sampleArguments = [
                    { username: 'test-user' },
                    { password: 'test-password' }
                ];

                beforeEach(() => {
                    accountsClient.callLoginMethod({ methodArguments: [...sampleArguments] });
                });

                it('should call original method with sample parameters with an addition of loggedAtLeastOnce in arguments', () => {
                    const expectedArguments = [...sampleArguments, { loggedAtLeastOnce: true }];
                    expect(callLoginMethodStub)
                        .to.be.calledWithExactly({ methodArguments: expectedArguments });
                });
            });
        });
    });
});

describe('Given AccountsConfigurator factory', () => {
    it('should be a function', () => {
        expect(typeof AccountsConfigurator.factory).to.be.equal('function');
    });

    describe('When invoked', () => {
        let result;

        beforeEach(() => {
            result = AccountsConfigurator.factory();
        });

        it('should return an instance of AccountsConfigurator', () => {
            expect(result instanceof AccountsConfigurator.default).to.be.equal(true);
        });
    });
});
