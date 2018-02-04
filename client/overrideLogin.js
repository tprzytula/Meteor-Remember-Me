import { Accounts } from 'meteor/accounts-base';

/**
 *  This function is used to override Account's function called callLoginMethod.
 *  We are using our custom implementation of remember me functionality where user
 *  can decide if he want's to be remembered or not.
 *
 *  The problem is that after losing internet connection we don't want to disallow
 *  login attempt from user no matter if he has set rememberMe or not.
 *
 *  On the server it was not possible to know if the login attempt was from user who
 *  just started the application or from user reconnecting because it's always new
 *  connection with type "resume".
 *
 *  Overriding this function after first successful login gives us possibility to
 *  send another parameter "loggedAtLeastOnce" to the every next login request in the
 *  current application session. This parameter can be recognized by server to perform suitable logic.
 *  This method is internal and is invoked without our logic on every login attempt which is also
 *  made by Meteor on every reconnect.
 *
 *  Launching the app again means that it will became default again without our additions.
 *  Then the next successful login will override it again.
 */
const overrideLoginMethod = () => {
    const accountsCallLoginMethod = Accounts.callLoginMethod.bind(Accounts);
    Accounts.callLoginMethod = function (options = {}) {
        const preparedOptions = options;
        if (preparedOptions) {
            if (preparedOptions.methodArguments) {
                preparedOptions.methodArguments.push({ loggedAtLeastOnce: true });
            } else {
                preparedOptions.methodArguments = [{ loggedAtLeastOnce: true }];
            }
        }
        accountsCallLoginMethod(preparedOptions);
    };
};

export default () => {
    let loginOverridden = false;
    Accounts.onLogin(() => {
        /* Override meteor accounts callLoginMethod to store information that user logged before */
        if (!loginOverridden) {
            overrideLoginMethod();
            loginOverridden = true;
        }
    });
};
