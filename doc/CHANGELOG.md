# Changelog

## [1.0.0] - 01.08.2018
* Dependency was refactored

**Important changes:**
* All log ins made by the default Meteor.loginWithPassword method won't be affected anymore by this dependency. Every client who did not report the rememberMe setting will stay logged in to match the default Meteor's behaviour.

**Breaking changes:**
* `activate` method was removed. There is no need to activate RememberMe on the server anymore.
* `changeAccountsSystem` will now throw an error when provided parameter is not a valid instance of the AccountsClient

## [0.2.1] - 10.05.2018
* Change client methods to arrow functions to prevent wrong context issues ([Issue #6](https://github.com/tprzytula/Meteor-Remember-Me/issues/6))
* loginWithPassword method for custom accounts was throwing an error if accounts were not stored in `Meteor.remoteUsers` (whoops!)

## [0.2.0] - 13.03.2018
New feature:
* Add support for custom AccountsClient ([introduction](CUSTOM_ACCOUNTS.md))

Related improvements:
* Check if onLogin callback from the dependency is already present
* Check if loginAttempt method was already overridden in provided instance

## [0.1.3] - 04.02.2018
* Inform client if the functionality was not activated on the server
* Client side unit tests

## [0.1.2] - 01.02.2018
* Remove 'lodash' dependency, replace usages with ES6
* Remove 'crypto-js' dependency, use 'crypto' instead
* Decrease the server bundle size significantly by the above changes

## [0.1.1] - 27.01.2018
* Print correct error in case of already disallowed attempt
* Add server side tests

## [0.1.0] - 19.01.2018
* Initial release
