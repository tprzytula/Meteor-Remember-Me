import { Accounts } from 'meteor/accounts-base';

/* eslint-disable */
export const prepareLoginWithPasswordMethod = (accountsInstance) => {
    /*
        The method is based on the original one in Accounts:
        https://github.com/meteor/meteor/blob/46257bad264bf089e35e0fe35494b51fe5849c7b/packages/accounts-password/password_client.js#L33
     */
    /* istanbul ignore next */
    // TODO: Maybe try to test it anyways? We changed this method so it would be nice to ensure that it's okay
    return function (selector, password, callback) {
        if (typeof selector === 'string') {
            selector = selector.indexOf('@') === -1
                ? { username: selector }
                : { email: selector };
        }
        accountsInstance.callLoginMethod({
            methodArguments: [{
                user: selector,
                password: Accounts._hashPassword(password)
            }],
            userCallback: function (error, result) {
                if (error && error.error === 400 &&
                    error.reason === 'old password format') {
                    srpUpgradePath({
                        upgradeError: error,
                        userSelector: selector,
                        plaintextPassword: password
                    }, callback);
                } else if (error) {
                    callback && callback(error);
                } else {
                    callback && callback();
                }
            }
        });
    };
};
/* eslint-enable */
