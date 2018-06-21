import { expect } from 'ultimate-chai';
import sinon from 'sinon';
import { getUserByToken, replaceUserTokens } from '../../../server/integration/collection';

describe('Given getUserByToken method', () => {
    const sandbox = sinon.createSandbox();
    let findOneStub;

    beforeEach(() => {
        findOneStub = sandbox.stub(Meteor.users, 'findOne');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When called with a token', () => {
        const sampleToken = 'test-token';

        beforeEach(() => {
            getUserByToken(sampleToken);
        });

        it('should construct a query and pass it to the Meteor findOne method', () => {
            const expectedQuery = {
                'services.resume.loginTokens.hashedToken': sampleToken
            };
            expect(findOneStub).to.be.calledWith(expectedQuery);
        });
    });
});

describe('Given replaceUserTokens method', () => {
    const sandbox = sinon.createSandbox();
    let updateStub;

    beforeEach(() => {
        updateStub = sandbox.stub(Meteor.users, 'update');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When called with an id and tokens', () => {
        const sampleId = 'user-id';
        const sampleTokens = ['token-one', 'token-two'];

        beforeEach(() => {
            replaceUserTokens(sampleId, sampleTokens);
        });

        it('should construct a query and pass it to the Meteor update method with id', () => {
            const expectedQuery = {
                $set: {
                    'services.resume.loginTokens': sampleTokens
                }
            };
            expect(updateStub).to.be.calledWith(sampleId, expectedQuery);
        });
    });
});
