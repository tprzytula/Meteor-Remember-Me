Package.describe({
    name: 'tprzytula:remember-me',
    version: '1.0.2',
    summary: 'Extension for Meteor account-base package with the implementation of rememberMe',
    git: 'https://github.com/tprzytulacc/Meteor-RememberMe',
    documentation: 'README.md'
});

Package.onUse((api) => {
    api.versionsFrom('1.5.2.2');
    api.use('ecmascript');
    api.use('accounts-base');
    api.use('accounts-password');
    api.mainModule('client/index.js', 'client');
    api.mainModule('server/index.js', 'server');
});

/*
    https://github.com/meteortesting/meteor-mocha/issues/63

    Unfortunately, because of the issue above I was not able to test this package using the "meteor test-packages"
    and had to setup a "fake" meteor project instead.

    You can follow my approach if you have encountered the same issues. Make sure to setup a Meteor project within
    your package and end up with a ".meteor" directory where your dependency should be listed in the packages list.

    Things to remember:
        - Make sure to always have the recent version of your package under .meteor/packages
        - When you want to publish your package by running "Meteor publish" you need to remove the ".meteor" directory
          before because otherwise it won't allow you to do that (I know it's a pain)

    Hopefully one day Meteor won't require from us to use hacks for such basic things as testing your own code.
*/
