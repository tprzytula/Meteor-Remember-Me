Package.describe({
    name: 'tprzytula:remember-me',
    version: '0.2.1',
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