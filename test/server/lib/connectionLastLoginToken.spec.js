import { Accounts } from 'meteor/accounts-base';
import { expect } from 'ultimate-chai';
import sinon from 'sinon';
import * as connectionLastLoginToken from '../../../server/lib/connectionLastLoginToken';

describe('Given the connectionLastLoginToken class', () => {
    const sandbox = sinon.createSandbox();
    let instance, updateTokensStub, sampleTokens, sampleUser;

    beforeEach(() => {
        sampleTokens = [
            {
                when: new Date(),
                hashedToken: '7Rg3IXBj0hNZJWQa677ILS2jWKtt2rC7o9Nat3+7+zw='
            },
            {
                when: new Date(),
                hashedToken: '+7+zw='
            }
        ];
        sampleUser = {
            _id: '6vCQJw5TrRaeb9ZJM',
            username: 'test',
            services: {
                resume: {
                    loginTokens: sampleTokens
                }
            }
        };
        sandbox.stub(Accounts, '_getLoginToken').returns(sampleTokens[0].hashedToken);
        sandbox.stub(Meteor.users, 'findOne').returns(sampleUser);
        updateTokensStub = sandbox.stub(Meteor.users, 'update').returns(1);
        instance = connectionLastLoginToken.factory('connection-id');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When updateFields is called', () => {
        beforeEach(() => {
            instance.updateFields({ rememberMe: true });
        });

        it('should request to replace user tokens with correct params', () => {
            const expectedUpdatedToken = Object.assign(sampleTokens[0], { rememberMe: true });
            const expectedQuery = {
                $set: {
                    'services.resume.loginTokens': [expectedUpdatedToken, sampleTokens[1]]
                }
            };
            expect(updateTokensStub).to.be
                .calledWithExactly(sampleUser._id, expectedQuery);
        });
    });
});

describe('Given the connectionLastLoginToken factory', () => {
    it('should be a function', () => {
        expect(typeof connectionLastLoginToken.factory).to.be.equal('function');
    });

    describe('When invoked', () => {
        let result;

        beforeEach(() => {
            result = connectionLastLoginToken.factory();
        });

        it('should return an instance of ConnectionLastLoginToken', () => {
            expect(result instanceof connectionLastLoginToken.default).to.be.equal(true);
        });
    });
});
