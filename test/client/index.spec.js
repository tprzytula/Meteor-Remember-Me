const RememberMe = require('./../../client/index').RememberMeClass;
const { AccountsClient } = require('meteor/accounts-base');
const chai = require('ultimate-chai');
const sinon = require('sinon');

const rememberMeMethod = 'tprzytula:rememberMe-update';
const sampleUsername = 'username';
const samplePassword = 'password';
const sampleCallback = () => {};
const { expect } = chai;

describe('Given updateRememberMe method', () => {
    let callStub, loginWithPasswordStub, rememberMe;

    beforeEach(() => {
        rememberMe = new RememberMe();
        loginWithPasswordStub = sinon.stub(Meteor, 'loginWithPassword');
        callStub = sinon.stub(Meteor, 'call');
    });

    afterEach(() => {
        loginWithPasswordStub.restore();
        callStub.restore();
    });

    describe('When login was unsuccessful', () => {
        const notExistingUsername = 'notExistingUser';

        beforeEach(() => {
            loginWithPasswordStub.callsFake((user, password, callback) => callback('User not found'));
            rememberMe.loginWithPassword(notExistingUsername, samplePassword);
        });

        it('should not call the updateRememberMe method', () => {
            expect(callStub).to.have.callCount(0);
        });
    });

    describe('When login was successful', () => {
        beforeEach(() => {
            loginWithPasswordStub.callsFake((user, password, callback) => {
                const error = false;
                callback(error);
            });
            rememberMe.loginWithPassword(sampleUsername, samplePassword);
        });

        it('should call the updateRememberMe method', () => {
            expect(callStub).to.have.been.calledWith(rememberMeMethod);
        });
    });
});

describe('Given rememberMe flag', () => {
    let callStub, loginWithPasswordStub, rememberMe, rememberMeFlag;

    beforeEach(() => {
        rememberMe = new RememberMe();
        loginWithPasswordStub = sinon.stub(
            Meteor,
            'loginWithPassword'
        );
        callStub = sinon.stub(Meteor, 'call');
        loginWithPasswordStub.callsFake((user, password, callback) => {
            const error = false;
            callback(error);
        });
    });

    afterEach(() => {
        loginWithPasswordStub.restore();
        callStub.restore();
    });

    describe('When rememberMe is not activated on the server', () => {
        const warningTitle = 'Dependency meteor/tprzytula:remember-me is not active!\n';
        const warningMessage = '\nTo activate it make sure to run "RememberMe.activate()" on the server.' +
            'It is required to be able to access the functionality on the client.';
        let consoleStub;

        beforeEach(() => {
            callStub.callsFake((method, flag, callback) => {
                callback({ error: 404 });
            });
            consoleStub = sinon.stub(console, 'warn');
        });

        afterEach(() => {
            consoleStub.restore();
        });

        describe('And loginWithPassword is invoked', () => {
            beforeEach(() => {
                rememberMe.loginWithPassword(sampleUsername, samplePassword);
            });

            it('should inform user about the requirement to activate it on server', () => {
                expect(consoleStub).to.have.been.calledWith(warningTitle, warningMessage);
            });
        });
    });

    describe('When rememberMe method fires error', () => {
        const errorMessage = 'meteor/tprzytula:remember-me' +
            '\nCould not update remember me setting.' +
            '\nError:';
        const errorDetails = 'Example details';
        let consoleStub;

        beforeEach(() => {
            callStub.callsFake((method, flag, callback) => {
                callback(errorDetails);
            });
            consoleStub = sinon.stub(console, 'error');
        });

        afterEach(() => {
            consoleStub.restore();
        });

        describe('And loginWithPassword is invoked', () => {
            beforeEach(() => {
                rememberMe.loginWithPassword(sampleUsername, samplePassword);
            });

            it('should inform user about the error', () => {
                expect(consoleStub).to.have.been.calledWith(errorMessage, errorDetails);
            });
        });
    });

    describe('When not provided as a parameter (without callback)', () => {
        beforeEach(() => {
            rememberMe.loginWithPassword(sampleUsername, samplePassword);
        });

        it('should set remember me to true by default (without callback)', () => {
            expect(callStub).to.have.been.calledWith(rememberMeMethod, true);
        });
    });

    describe('When not provided as a parameter (with callback)', () => {
        beforeEach(() => {
            rememberMe.loginWithPassword(sampleUsername, samplePassword, sampleCallback);
        });

        it('should set remember me to true by default (without callback)', () => {
            expect(callStub).to.have.been.calledWith(rememberMeMethod, true);
        });
    });

    describe('When equals "true"', () => {
        beforeEach(() => {
            rememberMeFlag = true;
        });

        describe('And is passed as a third parameter', () => {
            beforeEach(() => {
                rememberMe.loginWithPassword(sampleUsername, samplePassword, rememberMeFlag);
            });

            it('should set rememberMe to true', () => {
                expect(callStub).to.have.been.calledWith(rememberMeMethod, true);
            });
        });

        describe('And is passed as a fourth parameter', () => {
            beforeEach(() => {
                rememberMe.loginWithPassword(
                    sampleUsername,
                    samplePassword,
                    sampleCallback,
                    rememberMeFlag
                );
            });

            it('should set rememberMe to true', () => {
                expect(callStub).to.have.been.calledWith(rememberMeMethod, true);
            });
        });
    });

    describe('When equals "false"', () => {
        beforeEach(() => {
            rememberMeFlag = false;
        });

        describe('And is passed as a third parameter', () => {
            beforeEach(() => {
                rememberMe.loginWithPassword(sampleUsername, samplePassword, rememberMeFlag);
            });

            it('should set rememberMe to false', () => {
                expect(callStub).to.have.been.calledWith(rememberMeMethod, false);
            });
        });

        describe('And is passed as a fourth parameter', () => {
            beforeEach(() => {
                rememberMe.loginWithPassword(
                    sampleUsername,
                    samplePassword,
                    sampleCallback,
                    rememberMeFlag
                );
            });

            it('should set rememberMe to true', () => {
                expect(callStub).to.have.been.calledWith(rememberMeMethod, false);
            });
        });
    });
});

describe('Given RememberMe.loginWithPassword method', () => {
    let callStub, loginWithPasswordStub, rememberMe;

    beforeEach(() => {
        rememberMe = new RememberMe();
        loginWithPasswordStub = sinon.stub(Meteor, 'loginWithPassword');
        callStub = sinon.stub(Meteor, 'call');
    });

    afterEach(() => {
        loginWithPasswordStub.restore();
        callStub.restore();
    });

    describe('When used with sample parameters', () => {
        beforeEach(() => {
            rememberMe.loginWithPassword(sampleUsername, samplePassword);
        });

        it('should correctly pass parameters to Meteor.loginWithPassword method', () => {
            expect(loginWithPasswordStub).calledWith(
                sampleUsername,
                samplePassword
            );
        });
    });

    describe('When accounts system is changed', () => {
        let connection, remoteAccounts;

        beforeEach(() => {
            connection = DDP.connect('127.0.0.1:3000');
            remoteAccounts = new AccountsClient({ connection });
            rememberMe.changeAccountsSystem(remoteAccounts);
        });

        afterEach(() => {
            connection.disconnect();
        });

        describe('And loginWithPassword is used', () => {
            let remoteCallStub, remoteLoginWithPasswordStub;

            beforeEach(() => {
                remoteLoginWithPasswordStub = sinon.stub(
                    remoteAccounts.connection,
                    'loginWithPassword'
                );
                remoteLoginWithPasswordStub.callsFake((user, password, callback) => {
                    const error = false;
                    callback(error);
                });
                remoteCallStub = sinon.stub(remoteAccounts.connection, 'call');
                rememberMe.loginWithPassword(sampleUsername, samplePassword);
            });

            afterEach(() => {
                remoteLoginWithPasswordStub.restore();
                remoteCallStub.restore();
            });

            it('should use loginWithPassword from the new accounts', () => {
                expect(remoteLoginWithPasswordStub).to.have.been.calledWith(
                    'username',
                    'password'
                );
            });

            it('should call rememberMe method for the connection from the new accounts', () => {
                expect(remoteCallStub).to.have.been.calledOnce();
            });
        });
    });
});

describe('Given changeAccountsSystem', () => {
    let callStub, rememberMe, result;

    beforeEach(() => {
        rememberMe = new RememberMe();
        callStub = sinon.stub(Meteor, 'call');
    });

    afterEach(() => {
        callStub.restore();
    });

    describe('When an incorrect instance is passed', () => {
        beforeEach(() => {
            const randomInstance = new RememberMe();
            result = rememberMe.changeAccountsSystem(randomInstance);
        });

        it('should not accept the instance', () => {
            expect(result).to.be.equal(false);
        });
    });

    describe('When a correct instance is passed', () => {
        let connection, remoteAccounts;

        beforeEach(() => {
            connection = DDP.connect('127.0.0.1:3000');
            remoteAccounts = new AccountsClient({ connection });
            result = rememberMe.changeAccountsSystem(remoteAccounts);
        });

        afterEach(() => {
            connection.disconnect();
        });

        it('should accept the instance', () => {
            expect(result).to.be.equal(true);
        });

        it('should append "loginWithPassword" method to the instance', () => {
            expect('loginWithPassword' in remoteAccounts.connection).to.be.equal(true);
        });
    });

    describe('When passed instance already contains loginWithPassword method', () => {
        const loginWithPassword = () => {};
        let connection, remoteAccounts;

        beforeEach(() => {
            connection = DDP.connect('127.0.0.1:3000');
            remoteAccounts = new AccountsClient({ connection });
            connection.loginWithPassword = loginWithPassword;
            result = rememberMe.changeAccountsSystem(remoteAccounts);
        });

        afterEach(() => {
            connection.disconnect();
        });

        it('should not override the already existing loginWithPassword method', () => {
            expect(remoteAccounts.connection.loginWithPassword).to.be.equal(loginWithPassword);
        });
    });
});
