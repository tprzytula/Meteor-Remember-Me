import { expect } from 'ultimate-chai';
import sinon from 'sinon';

import * as Alerts from './../../../client/lib/alerts';

describe('Given alerts', () => {
    const sandbox = sinon.createSandbox();
    let consoleWarnSpy, consoleErrorSpy;

    beforeEach(() => {
        consoleWarnSpy = sandbox.spy(console, 'warn');
        consoleErrorSpy = sandbox.spy(console, 'error');
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('When rememberMeNotActive is invoked', () => {
        beforeEach(() => {
            Alerts.rememberMeNotActive();
        });

        it('should print warning message', () => {
            expect(consoleWarnSpy).to.be.calledOnce();
        });
    });

    describe('When couldNotUpdateRememberMe is invoked', () => {
        const sampleError = 'test';

        beforeEach(() => {
            Alerts.couldNotUpdateRememberMe(sampleError);
        });

        it('should print error message', () => {
            expect(consoleErrorSpy).to.be.calledOnce();
        });

        it('should contain passed error in the message', () => {
            const { args } = consoleErrorSpy.getCall(0);
            expect(args.includes(sampleError)).to.be.equal(true);
        });
    });
});
