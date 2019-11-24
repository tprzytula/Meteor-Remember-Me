# Meteor - Remember Me
[![Coverage Status](https://coveralls.io/repos/github/tprzytula/Meteor-Remember-Me/badge.svg)](https://coveralls.io/github/tprzytula/Meteor-Remember-Me)

RememberMe is a Meteor package that extends the default Accounts system with a new "remember me" functionality. 

Login sessions by default have the expiry date set to 90 days which mean that once you've logged in into your application you are able to come back to it at any given point of time during this period and be still automatically logged in. You must have to log out yourself if you do not want that to happen.

However, this is not always what we intend to see as the users of any given application. Sometimes for privacy reasons we want to be sure that once we closed the website no one else would be able to control our account by visiting the website again from the same device without the need to always make sure to log out ourselves.

The following package gives the ability to control the default behaviour by giving users the power to make the decision if they want to persist their login sessions after they close the application or not.

All of this comes just as an additional parameter to the `loginWithPassword` method where you can simply provide `true` to keep the default behaviour or `false` if you want Meteor to reject the next auto-login attempt after you leave the website.

## Installation

`meteor add tprzytula:remember-me`

##### You can view the package on atmosphere: https://atmospherejs.com/tprzytula/remember-me

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

Wrapper for a Meteor.loginWithPassword with an addition of rememberMe as the last parameter.

If not provided, the default for rememberMe is true to match the behaviour of Meteor.

Refer to the [Meteor's documentation](https://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword) for more information about the login method itself.

`changeAccountsSystem(AccountsClient: customAccounts)`

Gives the possibility to set a custom accounts instance to be used for the login system ([more details](doc/CUSTOM_ACCOUNTS.md))

## Important notice

Many people were trying to solve this problem in the past by storing the setting in local storage and singing out the user or clearing their cached token when they come back. However, this approach might cause many side effects, especially when your business logic uses `onLogin` callbacks because the user will still be logged-in for a split of a second before their logic could take effect. 

You won't be having these problems when using this package.

**By using this dependency you can be sure that:**

- Not a single `onLogin` callback will be invoked when your users are coming back to the website after logging-in with `rememberMe` being `false`.
- The `rememberMe` setting is stored only in the MongoDB when you leave the website. There will be no information regarding this setting stored in local storage, IndexedDB etc.
- The `rememberMe` setting is unique not only to the user but also to the login token itself which means that each device will be respected separately. Logging-in on user "test" with rememberMe on your phone and then without rememberMe on your desktop won't stop you from being logged-in automatically the next time you visit the website on your phone.
- Despite the choice you won't be suddenly logged-out when you reconnect after losing connection during the same session.

## Testing

You can test this dependency by running `npm run test:headless` or by checking the results of a GitHub Action pipeline from the last commit.

As you might notice I'm using `meteor test` instead of `meteor test-packages`.

You can find more about why was I forced to create such a hack [here](package.js). Hopefully this will be helpful for you if you ran through similar issues.

## Changelog
[Meteor Remember-Me - Changelog](doc/CHANGELOG.md)
