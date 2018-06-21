/**
 *  Checks which param is the rememberMe flag
 *  and returns it. If it's not present then
 *  returns "true" by default.
 *  @param {Array} params
 *  @returns {boolean} flag
 */
export const exportFlagFromParams = (params = []) => {
    const [
        firstParam,
        secondParam = true
    ] = params;
    return (typeof firstParam === 'boolean')
        ? firstParam
        : secondParam;
};

/**
 *  Checks if the first provided param is the callback
 *  function. If it's not present then returns an
 *  empty method instead.
 *  @param {Array} params
 *  @returns {function} callback
 */
export const exportCallbackFromParams = (params = []) => {
    const [firstParam] = params;
    return (typeof firstParam === 'function')
        ? firstParam
        : () => {};
};
