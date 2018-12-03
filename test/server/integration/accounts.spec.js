import { Accounts } from 'meteor/accounts-base';
import { expect } from 'ultimate-chai';
import sinon from 'sinon';
import {
    addValidationStep,
    findUserByUsername,
    findUserByEmail,
    findUser,
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

describe('Given findUserByEmail method', () => {
    const sandbox = sinon.createSandbox();
    let findUserByEmailStub;

    beforeEach(() => {
        findUserByEmailStub = sandbox.stub(Accounts, 'findUserByEmail');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When a param is passed', () => {
        const sampleEmail = 'test@test.com';

        beforeEach(() => {
            findUserByEmail(sampleEmail);
        });

        it('should pass the param to the Accounts findUserByEmail method', () => {
            expect(findUserByEmailStub).to.be.calledWith(sampleEmail);
        });
    });
});

describe('Given findUser method', () => {
    const sandbox = sinon.createSandbox();
    const sampleUsername = 'test';
    const sampleEmail = 'test@test.com';
    let findUserByUsernameStub, findUserByEmailStub;

    beforeEach(() => {
        findUserByUsernameStub = sandbox.stub(Accounts, 'findUserByUsername');
        findUserByEmailStub = sandbox.stub(Accounts, 'findUserByEmail');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When the record contains username and email', () => {
        beforeEach(() => {
            findUser({ username: sampleUsername, emails: [ { address: sampleEmail } ] });
        });

        it('should pass the username to the Accounts findUserByUsernameStub method', () => {
            expect(findUserByUsernameStub).to.be.calledWith(sampleUsername);
        });
    });

    describe('When the record contains only username', () => {
        beforeEach(() => {
            findUser({ username: sampleUsername });
        });

        it('should pass the username to the Accounts findUserByUsernameStub method', () => {
            expect(findUserByUsernameStub).to.be.calledWith(sampleUsername);
        });
    });

    describe('When the record contains only email', () => {
        beforeEach(() => {
            findUser({ emails: [ { address: sampleEmail } ] });
        });

        it('should pass the email to the Accounts findUserByEmail method', () => {
            expect(findUserByEmailStub).to.be.calledWith(sampleEmail);
        });
    });

    describe('When the record does not contain username or email', () => {
        beforeEach(() => {
            findUser();
        });

        it('should not call the Accounts methods', () => {
            expect(findUserByUsernameStub).to.not.be.called();
            expect(findUserByEmailStub).to.not.be.called();
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
