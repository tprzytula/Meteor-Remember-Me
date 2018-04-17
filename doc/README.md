# Meteor - Remember Me
### Integrated remember me functionality support for Meteor


As you already know meteor login system is based on login tokens.
Each login token have it's own expiry time, until then it will stay active.
As long as the time won't expire, the user will be automatically logged in.

What if we want to have a remember me functionality in the application then?
We can track the stored setting on the user and logout him manually when we wish for.
Unfortunately in some apps if we are using "onLogin" callback on the server to 
perform a business logic then it can hit us back.

This package solves those problems. You can now specify during your login if you
want to login with rememberMe or without. All autologins performed by Meteor won't
be accepted if the login was performed without rememberMe. OnLogin callbacks won't be 
executed either!

Don't worry about using multiple devices for the same account! Each device will
be respected separately and if you will log in on user "test" with rememberMe on
your phone and then without rememberMe on your tablet then the autologin will stay
active for your phone!.

## Changelog
[Meteor Remember-Me - Changelog](CHANGELOG.md)

## Installation

`meteor add tprzytula:remember-me`

## Usage

To activate the functionality:

1. Import the package on server side:

```js
import RememberMe from 'meteor/tprzytula:remember-me';
```

2. Activate the functionality:

```js
RememberMe.activate()
```

3. Import the package on client side:

```js
import RememberMe from 'meteor/tprzytula:remember-me';
```

4. Change your login method to this:

```js
RememberMe.loginWithPassword(username, password, (error) => {
    // Your previous logic
}, true)
```

If you don't need a callback then you can simply change it to:

```js
RememberMe.loginWithPassword(username, password, true)
```

## API

`loginWithPassword(string: username, string: password, func: callback, boolean: rememberMe = true)`

Wrapper for a Meteor.loginWithPassword with an addition of rememberMe as a last parameter.

The default for rememberMe is true to match the behaviour of Meteor.

`changeAccountsSystem(AccountsClient: customAccounts)`

Gives the possibility to set a custom accounts instance to be used for the login system ([more details](CUSTOM_ACCOUNTS.md))

## Testing

You can test this dependency by running `npm run test`
