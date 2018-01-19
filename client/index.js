import overrideAccountsLogin from './overrideLogin';

const RememberMe = {};
console.log('first', Package['accounts-base']);
console.log('second', Package['accounts-base-two']);

const updateRememberMe = 'tprzytula:rememberMe-update';
RememberMe.loginWithPassword = (user, password, callback = () => {}, rememberMe = true) => {
    Meteor.loginWithPassword(user, password, (error) => {
        if (!error) {
            Meteor.call(updateRememberMe, rememberMe);
        }
        callback(error);
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
