Package.describe({
    name: 'tprzytula:remember-me',
    version: '0.1.0',
    summary: 'Extension for Meteor account-base package with the implementation of rememberMe',
    git: 'https://github.com/tprzytulacc/Meteor-RememberMe',
    documentation: 'README.md'
});

Package.onUse((api) => {
    api.versionsFrom('1.5.2.2');
    api.use('ecmascript');
    api.use('accounts-base');
    api.mainModule('client/index.js', 'client');
    api.mainModule('server/index.js', 'server');
});

Npm.depends({
    'crypto-js': '3.1.9-1',
    lodash: '4.17.4'
});
