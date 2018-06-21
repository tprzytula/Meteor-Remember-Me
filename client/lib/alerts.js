/**
 *  Informs about the requirement of this functionality
 *  to be activated on the server before use.
 *
 *  Doesn't throw the error because the login attempt
 *  succeeded and the inappropriate behaviour of RememberMe dependency
 *  should not affect the core login behaviour.
 */
export const rememberMeNotActive = () => {
    console.warn(
        'Dependency meteor/tprzytula:remember-me is not present on the server!\n',
        '\nMake sure you have installed this dependency on the server.',
        '\nRememberMe setting will not be taken into account'
    );
};

/**
 *  Prints received error from an attempt to send flag state update
 *  to the server.
 *
 *  Doesn't throw the error because the login attempt
 *  succeeded and the inappropriate behaviour of RememberMe dependency
 *  should not affect the core login behaviour.
 *  @param {Meteor.Error} error
 */
export const couldNotUpdateRememberMe = (error) => {
    console.error(
        'meteor/tprzytula:remember-me' +
        '\nCould not update remember me setting.' +
        '\nError:',
        error
    );
};
