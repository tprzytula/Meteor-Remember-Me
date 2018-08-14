import { Accounts } from 'meteor/accounts-base';
import { expect } from 'ultimate-chai';
import sinon from 'sinon';
import {
    addValidationStep,
    findUserByUsername,
    getConnectionLastLoginToken,
    hashLoginToken
} from '../../../server/integration/accounts';

describe('Given addValidationStep method', () => {
    const sandbox = sinon.createSandbox();
    let validateLoginAttemptStub;

    beforeEach(() => {
        validateLoginAttemptStub = sandbox.stub(Accounts, 'validateLoginAttempt');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When a param is passed', () => {
        const sampleMethod = () => {};

        beforeEach(() => {
            addValidationStep(sampleMethod);
        });

        it('should pass the param to the Accounts validateLoginAttempt method', () => {
            expect(validateLoginAttemptStub).to.be.calledWith(sampleMethod);
        });
    });
});

describe('Given findUserByUsername method', () => {
    const sandbox = sinon.createSandbox();
    let findUserByUsernameStub;

    beforeEach(() => {
        findUserByUsernameStub = sandbox.stub(Accounts, 'findUserByUsername');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When a param is passed', () => {
        const sampleUsername = 'test-user';

        beforeEach(() => {
            findUserByUsername(sampleUsername);
        });

        it('should pass the param to the Accounts findUserByUsername method', () => {
            expect(findUserByUsernameStub).to.be.calledWith(sampleUsername);
        });
    });
});

describe('Given getConnectionLastLoginToken method', () => {
    const sandbox = sinon.createSandbox();
    let _getLoginTokenStub;

    beforeEach(() => {
        _getLoginTokenStub = sandbox.stub(Accounts, '_getLoginToken');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When a param is passed', () => {
        const sampleConnectionId = 'test-connection-id';

        beforeEach(() => {
            getConnectionLastLoginToken(sampleConnectionId);
        });

        it('should pass the param to the Accounts validateLoginAttempt method', () => {
            expect(_getLoginTokenStub).to.be.calledWith(sampleConnectionId);
        });
    });
});

describe('Given hashLoginToken method', () => {
    const sandbox = sinon.createSandbox();
    let _hashLoginToken;

    beforeEach(() => {
        _hashLoginToken = sandbox.stub(Accounts, '_hashLoginToken');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When a param is passed', () => {
        const sampleToken = 'sample-token';

        beforeEach(() => {
            hashLoginToken(sampleToken);
        });

        it('should pass the param to the Accounts validateLoginAttempt method', () => {
            expect(_hashLoginToken).to.be.calledWith(sampleToken);
        });
    });
});
