# Changelog

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
