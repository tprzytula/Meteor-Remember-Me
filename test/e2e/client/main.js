import { Template } from 'meteor/templating';
import RememberMe from 'meteor/tprzytula:remember-me';
import { ReactiveDict } from 'meteor/reactive-dict';

import './main.html';

const State = new ReactiveDict('state', { rememberMe: false });

Template.loginSystem.helpers({
    buttonState() {
        return Meteor.user() ? 'Log out' : 'Login'
    }
});

Template.loginResultTemplate.helpers({
    loginResult() {
        return State.get('loginResult') || '';
    },
    loginResultDate() {
        return State.get('loginResultDate') || '';
    }
});

Template.loginSystem.helpers({
    rememberMe() {
        return State.get('rememberMe');
    }
});

Template.loginSystem.events({
    'click input'() {
        State.set('rememberMe', !State.get('rememberMe'));
    },
    'click button'() {
        if (Meteor.user()) {
            Meteor.logout();
            return;
        }
        State.set('loginResult', '');

        RememberMe.loginWithPassword('test', 'test', (error) => {
            if (error) {
                State.set('loginResult', error.reason || error);
            }
        }, State.get('rememberMe'));
    }
});
