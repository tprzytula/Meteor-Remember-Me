const { exportFlagFromParams, exportCallbackFromParams } = require('./../../client/helpers');
const chai = require('ultimate-chai');

const { expect } = chai;

describe('Given exportFlagFromParams', () => {
    const sampleFlag = false;
    const sampleMethod = () => {};
    let result;

    describe('When rememberMe flag is a first param', () => {
        beforeEach(() => {
            result = exportFlagFromParams([sampleFlag]);
        });

        it('should return the flag', () => {
            expect(result).to.be.equal(sampleFlag);
        });
    });

    describe('When rememberMe flag is a second param', () => {
        beforeEach(() => {
            result = exportFlagFromParams([sampleMethod, sampleFlag]);
        });

        it('should return the flag', () => {
            expect(result).to.be.equal(sampleFlag);
        });
    });

    describe('When parameters are only containing a method', () => {
        beforeEach(() => {
            result = exportFlagFromParams([sampleMethod]);
        });

        it('should return true as default', () => {
            expect(result).to.be.equal(true);
        });
    });

    describe('When the parameters are empty', () => {
        beforeEach(() => {
            result = exportFlagFromParams([]);
        });

        it('should return true as default', () => {
            expect(result).to.be.equal(true);
        });
    });

    describe('When nothing is passed to the method', () => {
        beforeEach(() => {
            result = exportFlagFromParams();
        });

        it('should return true as default', () => {
            expect(result).to.be.equal(true);
        });
    });
});

describe('Given exportCallbackFromParams', () => {
    const sampleMethod = () => {};
    let result;

    describe('When function is a first param', () => {
        beforeEach(() => {
            result = exportCallbackFromParams([sampleMethod, 1, 'abc']);
        });

        it('should return the same method', () => {
            expect(result).to.be.equal(sampleMethod);
        });
    });

    describe('When function is a second param', () => {
        beforeEach(() => {
            result = exportCallbackFromParams([1, sampleMethod, 'abc']);
        });

        it('should return a function', () => {
            expect(typeof result).to.be.equal('function');
        });

        describe('And the returned function', () => {
            it('should not be the same as the one in params', () => {
                expect(result).to.not.be.equal(sampleMethod);
            });
        });
    });

    describe('When function is not in parameters', () => {
        beforeEach(() => {
            result = exportCallbackFromParams([1, 'abc']);
        });

        it('should return a function', () => {
            expect(typeof result).to.be.equal('function');
        });
    });

    describe('When the parameters are empty', () => {
        beforeEach(() => {
            result = exportCallbackFromParams([]);
        });

        it('should return a function', () => {
            expect(typeof result).to.be.equal('function');
        });
    });

    describe('When nothing is passed to the method', () => {
        beforeEach(() => {
            result = exportCallbackFromParams();
        });

        it('should return a function', () => {
            expect(typeof result).to.be.equal('function');
        });
    });
});
