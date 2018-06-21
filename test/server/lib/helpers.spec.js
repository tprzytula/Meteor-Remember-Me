import { expect } from 'ultimate-chai';
import { getValueFromTree } from '../../../server/lib/helpers';

describe('Given getValueFromTree method', () => {
    const sampleParam = {
        test: {
            test: {
                treasure: 'congrats!'
            },
            treasure: 'that is cheating'
        },
        something: {
            test: {
                treasure: 'bad choice'
            }
        }
    };
    let result;

    describe('When a correct path is provided', () => {
        beforeEach(() => {
            result = getValueFromTree(sampleParam, 'test.test.treasure');
        });

        it('should return undefined', () => {
            expect(result).to.be.equal('congrats!');
        });
    });

    describe('When an incorrect path is provided', () => {
        beforeEach(() => {
            result = getValueFromTree(sampleParam, 'one.two.three.four');
        });

        it('should return undefined', () => {
            expect(result).to.be.equal(undefined);
        });
    });

    describe('When path is not provided', () => {
        beforeEach(() => {
            result = getValueFromTree(sampleParam);
        });

        it('should return undefined', () => {
            expect(result).to.be.equal(undefined);
        });
    });

    describe('When nothing is passed', () => {
        beforeEach(() => {
            result = getValueFromTree();
        });

        it('should return undefined', () => {
            expect(result).to.be.equal(undefined);
        });
    });
});
