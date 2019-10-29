# Meteor - Remember Me
[![Build Status](https://travis-ci.org/tprzytula/Meteor-Remember-Me.svg?branch=master)](https://travis-ci.org/tprzytula/Meteor-Remember-Me) [![Coverage Status](https://coveralls.io/repos/github/tprzytula/Meteor-Remember-Me/badge.svg)](https://coveralls.io/github/tprzytula/Meteor-Remember-Me) [![Greenkeeper badge](https://badges.greenkeeper.io/tprzytula/Meteor-Remember-Me.svg)](https://greenkeeper.io/)
##### RememberMe extension for the Meteor's accounts system
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
##### https://atmospherejs.com/tprzytula/remember-me

## Changelog
[Meteor Remember-Me - Changelog](doc/CHANGELOG.md)

## Installation

`meteor add tprzytula:remember-me`

## Usage

1. Import the package on the client side:

```js
import RememberMe from 'meteor/tprzytula:remember-me';
```

2. Replace your login method with this:

```js
RememberMe.loginWithPassword(user, password, (error) => {
    // Your previous logic
}, false)
```

If you don't need a callback then you can simply change it to:

```js
RememberMe.loginWithPassword(user, password, false)
```

## API
###### All methods are client side only

`loginWithPassword(string | Object: user, string: password, func: callback, boolean: rememberMe = true)`

Wrapper for a Meteor.loginWithPassword with an addition of rememberMe as a last parameter.

The default for rememberMe is true to match the behaviour of Meteor.

Refer to the [Meteor's documentation](https://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword) for more information.

`changeAccountsSystem(AccountsClient: customAccounts)`

Gives the possibility to set a custom accounts instance to be used for the login system ([more details](doc/CUSTOM_ACCOUNTS.md))

## Testing

You can test this dependency by running `npm run test` or check the recent results from circleci & travis-ci
