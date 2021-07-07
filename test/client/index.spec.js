// Run tests from other files
import './accountsConfigurator.spec';
import './accountsWrapper.spec';
import './lib/alerts.spec';
import './lib/methodParams.spec';

import { expect } from 'ultimate-chai';
import sinon from 'sinon';
import { DDP } from 'meteor/ddp-client';
import { Accounts, AccountsClient } from 'meteor/accounts-base';
import * as RememberMe from './../../client/index';

describe('Given RememberMe', () => {
    const sandbox = sinon.createSandbox();
    const sampleCorrectParams = {
        selector: 'test-user',
        password: 'test-password',
        flag: true,
        callback: sandbox.stub()
    };
    let rememberMe;

    beforeEach(() => {
        rememberMe = RememberMe.factory();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When using loginWithPassword method with sample parameters', () => {
        let loginWithPasswordStub;

        beforeEach(() => {
            loginWithPasswordStub = sandbox.stub(Accounts, 'loginWithPassword');
            rememberMe.loginWithPassword(...Object.values(sampleCorrectParams));
        });

        it('should call loginWithPassword with correct arguments', () => {
            const { selector, password } = sampleCorrectParams;
            expect(loginWithPasswordStub).to.be.calledWith(selector, password);
        });
    });

    describe('When switching accounts system', () => {
        let connection, accountsClient, loginWithPasswordStub;

        beforeEach(() => {
            connection = DDP.connect('localhost:3000');
            accountsClient = new AccountsClient({ connection });
            rememberMe.changeAccountsSystem(accountsClient);
            loginWithPasswordStub = sandbox.stub(accountsClient, 'loginWithPassword');
        });

        describe('And invoking loginWithPassword method', () => {
            beforeEach(() => {
                rememberMe.loginWithPassword(...Object.values(sampleCorrectParams));
            });

            it('should call loginWithPassword from the new instance', () => {
                expect(loginWithPasswordStub).to.be.calledOnce();
            });
        });
    });

    describe('When not providing a correct AccountsClient instance to the "changeAccountsSystem"', () => {
        let error;

        beforeEach(() => {
            try {
                rememberMe.changeAccountsSystem(RememberMe.factory());
            } catch (e) {
                console.error(e);
                error = e;
            }
        });

        it('should throw an exception', () => {
            expect(error instanceof Meteor.Error).to.be.true();
        });
    });

    describe('And loginWithPassword method parameters', () => {
        let callStub, parameters;

        beforeEach(() => {
            parameters = {
                selector: 'test-user',
                password: 'test-password'
            };
            callStub = sandbox.stub(Accounts.connection, 'call')
                .callsFake((methodName, parameter, callback) => {
                    callback();
                });
            sandbox.stub(Accounts, 'loginWithPassword')
                .callsFake((selector, password, callback) => {
                    callback();
                });
        });

        describe('When parameters contains callback', () => {
            beforeEach(() => {
                Object.assign(parameters, { callback: () => {} });
            });

            describe('And the method is invoked with rememberMe parameter being true', () => {
                beforeEach(() => {
                    Object.assign(parameters, { flag: true });
                    rememberMe.loginWithPassword(...Object.values(parameters));
                });

                it('should send RememberMe true request to the server', () => {
                    expect(callStub).to.be.calledWith('tprzytula:rememberMe-update', true);
                });
            });

            describe('And the method is invoked with rememberMe parameter being false', () => {
                beforeEach(() => {
                    Object.assign(parameters, { flag: false });
                    rememberMe.loginWithPassword(...Object.values(parameters));
                });

                it('should send RememberMe false request to the server', () => {
                    expect(callStub).to.be.calledWith('tprzytula:rememberMe-update', false);
                });
            });

            describe('And the method is invoked without rememberMe parameter', () => {
                beforeEach(() => {
                    rememberMe.loginWithPassword(...Object.values(parameters));
                });

                it('should send RememberMe true request to the server', () => {
                    expect(callStub).to.be.calledWith('tprzytula:rememberMe-update', true);
                });
            });
        });

        describe('When parameters do not contain a callback', () => {
            describe('And the method is invoked with rememberMe parameter being true', () => {
                beforeEach(() => {
                    Object.assign(parameters, { flag: true });
                    rememberMe.loginWithPassword(...Object.values(parameters));
                });

                it('should send RememberMe true request to the server', () => {
                    expect(callStub).to.be.calledWith('tprzytula:rememberMe-update', true);
                });
            });

            describe('And the method is invoked with rememberMe parameter being false', () => {
                beforeEach(() => {
                    Object.assign(parameters, { flag: false });
                    rememberMe.loginWithPassword(...Object.values(parameters));
                });

                it('should send RememberMe true request to the server', () => {
                    expect(callStub).to.be.calledWith('tprzytula:rememberMe-update', false);
                });
            });

            describe('And the method is invoked without rememberMe parameter', () => {
                beforeEach(() => {
                    rememberMe.loginWithPassword(...Object.values(parameters));
                });

                it('should send RememberMe true request to the server', () => {
                    expect(callStub).to.be.calledWith('tprzytula:rememberMe-update', true);
                });
            });
        });
    });
});

describe('Given RememberMe factory', () => {
    it('should be a function', () => {
        expect(typeof RememberMe.factory).to.be.equal('function');
    });
});
