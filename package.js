Package.describe({
    name: 'tprzytula:remember-me',
    version: '0.2.0',
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

Package.onTest((api) => {
    api.use('ecmascript');
    api.use('accounts-base');
    api.use('accounts-password');
    api.use('coffeescript');
    api.use('ddp');
    api.use('meteortesting:mocha');
    api.use('tprzytula:remember-me');
    api.use('practicalmeteor:sinon');
    api.mainModule('test/client/index.js', 'client');
    api.mainModule('test/server/index.js', 'server');
    Npm.depends({
        sinon: '4.2.2',
        'ultimate-chai': '4.1.1'
    });
});
