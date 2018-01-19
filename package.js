Package.describe({
    name: 'tprzytula:remember-me',
    version: '0.0.1',
    summary: '',
    git: 'https://github.com/tprzytulacc/Meteor-RememberMe',
    documentation: 'README.md'
});

Package.onUse((api) => {
    api.versionsFrom('1.5.2.2');
    api.use('ecmascript');
    api.mainModule('client/index.js', 'client');
    api.mainModule('server/index.js', 'server');
});

Package.onTest((api) => {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('tprzytula:remember-me');
    api.mainModule('remember-me-tests.js');
});

Npm.depends({
    'crypto-js': '3.1.9-1',
    lodash: '4.17.4'
});
