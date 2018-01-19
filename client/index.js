import { Accounts } from 'meteor/accounts-base';
import overrideAccountsLogin from './overrideLogin';

const RememberMe = {};

const updateRememberMe = 'tprzytula:rememberMe-update';
RememberMe.loginWithPassword = (user, password, callback = () => {}, rememberMe = true) => {
    let flag = rememberMe;
    let callbackMethod = () => {};

    if (typeof callback === 'boolean') {
        flag = callback;
    } else {
        callbackMethod = callback;
    }

    Meteor.loginWithPassword(user, password, (error) => {
        if (!error) {
            Meteor.call(updateRememberMe, flag);
        }
        callbackMethod(error);
    });
};

let loginOverridden = false;
Accounts.onLogin(() => {
    /* Override meteor accounts callLoginMethod to store information that user logged before */
    if (!loginOverridden) {
        overrideAccountsLogin();
        loginOverridden = true;
    }
});

export default RememberMe;
