/**
 *  Checks if the provided path of properties exists in the object.
 *  If it does returns the last element from the path.
 *  @param {Object} obj
 *  @param {string} path
 *  @returns {*} value
 */
export const getValueFromTree = (obj = {}, path = '') => {
    const pathSplit = path.split('.');
    let currentRoot = obj;
    const result = pathSplit.every((step) => {
        const isStepAccessible = step in currentRoot;
        if (isStepAccessible) {
            currentRoot = currentRoot[step];
        }
        return isStepAccessible;
    });
    return result ? currentRoot : undefined;
};
