# AccountsClient

## Custom AccountsClient in Meteor Apps

#### Wait why?

Imagine an example situation where you decided to split your Meteor server into two separate ones to reduce the overload. You found it pretty convenient to use one of them only for serving HCP where the separate one will handle all the logic.
 
Another example could be an android app in the Google Play store where upon start you could decide between connecting to the *NA* or *EU* server.

#### How ?
To achieve the first example you will point all the client apps to the HCP server and connect to the separate one using:

```js
const remoteConnection = DDP.connect('127.0.0.1:4000');
```
By now you can easily start using methods from the new connection the same way as you are doing it on the main:
```js
remoteConnection.call('delayApocalypse', 1000, (error) => {
    if (error) {
        console.error('Could not delay the apocalypse:', error);
    }
})
``` 

However migrating the accounts system is a bit more tricky. Upon using the default accounts methods the app's clients will try to log in to the main server by the default (which was supposed to be HCP only).

The first step for migration is to create a new instance of AccountsClient

```js
const accountsClient = new AccountsClient({ connection: remoteConnection });
```

Unfortunately if you want to have a method like `loginWithPassword` then you have to implement it yourself the same way as it's done for the main accounts system [Source](https://github.com/meteor/meteor/blob/46257bad264bf089e35e0fe35494b51fe5849c7b/packages/accounts-password/password_client.js#L33)

But don't worry! Using tprzytula:remember-me you don't have to worry about that.

## Switching to the custom AccountsClient in tprzytula:remember-me

Using this dependency the login logic always stays the same no matter of which AccountsClient system you are currently using. You can switch the accounts system at any point during your app lifetime. After you will be done with the AccountsClient configuration the only thing you need to do is to pass the instance to *changeAccountsSystem* method and voila!

### Example:

##### Configuration:

To let the dependency know that you have and want to use a separate custom account system you need to pass the instance to the `changeAccountsSystem` method.

```js
import { AccountsClient } from 'meteor/accounts-base';
import RememberMe from 'meteor/tprzytula:remember-me';

Meteor.remoteConnection = DDP.connect('127.0.0.1:4000'); // Meteor's server for accounts
Meteor.remoteUsers = new AccountsClient({ connection: Meteor.remoteConnection });

RememberMe.changeAccountsSystem(Meteor.remoteUsers);

```

##### Usage:

After the configuration you can use the newly set accounts system in the same way you were doing it previously.

```js
import RememberMe from 'meteor/tprzytula:remember-me';

RememberMe.loginWithPassword('username', 'password', (error) => {
    if (error) {
        console.error(error);
        return;
    }
    // success!
}, true);
```
