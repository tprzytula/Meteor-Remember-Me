import { expect } from 'ultimate-chai';
import sinon from 'sinon';
import { createMeteorError } from './../../../server/integration/error';

describe('Given createMeteorError method', () => {
    const sandbox = sinon.createSandbox();
    let errorStub;

    beforeEach(() => {
        errorStub = sandbox.spy(Meteor, 'Error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When invoked with sample parameters', () => {
        let createdError;

        beforeEach(() => {
            createdError = createMeteorError(500, 'Bad request',
                'Your request is missing required fields');
        });

        it('should call Meteor.Error with correct parameters', () => {
            expect(errorStub).to.be.calledWithExactly(500, 'Bad request',
                'Your request is missing required fields');
        });

        it('should return an instance of Meteor.Error with correct fields', () => {
            expect(createdError instanceof Meteor.Error).to.be.true();
            expect(createdError.error).to.be.equal(500);
            expect(createdError.reason).to.be.equal('Bad request');
            expect(createdError.details).to.be.equal('Your request is missing required fields');
        });
    });
});
