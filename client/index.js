import overrideAccountsLogin from './overrideLogin';
overrideAccountsLogin();

const RememberMe = {};
const updateRememberMe = 'tprzytula:rememberMe-update';

RememberMe.loginWithPassword = (user, password, callback = () => {}, rememberMe = true) => {
    const flag = (typeof callback === 'boolean')
        ? callback
        : rememberMe;

    const callbackMethod = (typeof callback === 'function')
        ? callback
        : () => {};

    Meteor.loginWithPassword(user, password, (error) => {
        if (!error) {
            Meteor.call(updateRememberMe, flag, (error) => {
                if (error && error.error === 404) {
                    console.warn(
                        'Dependency meteor/tprzytula:remember-me is not active!\n',
                        '\nTo activate it make sure to run "RememberMe.activate()" on the server.' +
                        'It is required to be able to access the functionality on the client.'
                    )
                } else if (error) {
                    console.error(
                        'meteor/tprzytula:remember-me' +
                        '\nCould not update remember me setting.' +
                        '\nError:', error
                    );
                }
            });
        }
        callbackMethod(error);
    });
};

export default RememberMe;
