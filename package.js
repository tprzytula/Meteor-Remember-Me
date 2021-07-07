Package.describe({
    name: 'tprzytula:remember-me',
    version: '1.0.2',
    summary: 'Extension for Meteor account-base package with the implementation of rememberMe',
    git: 'https://github.com/tprzytulacc/Meteor-RememberMe',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.5.2.2');
    api.use('ecmascript');
    api.use('accounts-base');
    api.use('accounts-password');
    api.mainModule('client/index.js', 'client');
    api.mainModule('server/index.js', 'server');
});

Package.onTest(function (api) {
    api.use(['meteortesting:browser-tests', 'meteortesting:mocha']);
    api.use(['ecmascript', 'accounts-base', 'accounts-password']);
    api.use('tprzytula:remember-me');

    api.mainModule('test/client/index.spec.js', 'client');
    api.mainModule('test/server/index.spec.js', 'server');
});
