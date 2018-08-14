import { expect } from 'ultimate-chai';
import sinon from 'sinon';
import * as MeteorMethod from '../../../server/integration/method';

describe('When an instance is created', () => {
    const sandbox = sinon.createSandbox();
    let meteorMethodInstance, callbackSpy;

    beforeEach(() => {
        const callbackMock = { callback: () => {} };
        callbackSpy = sandbox.spy(callbackMock, 'callback');
        meteorMethodInstance = MeteorMethod.factory({
            name: 'test',
            callback: callbackMock.callback
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('And setup is invoked', () => {
        let meteorMethodsStub;

        beforeEach(() => {
            meteorMethodsStub = sandbox.stub(Meteor, 'methods');
            meteorMethodInstance.setup();
        });

        it('should pass a new method configuration to Meteor', () => {
            expect(meteorMethodsStub).to.be.calledOnce();
        });

        describe('And the method configuration', () => {
            let receivedConfiguration;

            beforeEach(() => {
                [receivedConfiguration] = meteorMethodsStub.getCall(0).args;
            });

            it('should contain a method with provided name', () => {
                expect('test' in receivedConfiguration).to.be.equal(true);
                expect(typeof receivedConfiguration.test).to.be.equal('function');
            });

            describe('And when the method is invoked', () => {
                const sampleParams = ['1', '2', '3'];

                beforeEach(() => {
                    receivedConfiguration.test(...sampleParams);
                });

                it('should call provided callback with method context and provided params', () => {
                    expect(callbackSpy).to.be.calledWith(sinon.match.object, ...sampleParams);
                });
            });
        });
    });
});

describe('Given MeteorMethod factory', () => {
    it('should be a function', () => {
        expect(typeof MeteorMethod.factory).to.be.equal('function');
    });

    describe('When invoked', () => {
        let result;

        beforeEach(() => {
            result = MeteorMethod.factory({ name: 'test', callback: () => {} });
        });

        it('should return an instance of MeteorMethod', () => {
            expect(result instanceof MeteorMethod.default).to.be.equal(true);
        });
    });
});
