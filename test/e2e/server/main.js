import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
    const doesUserExist = Meteor.users.findOne();

    if (!doesUserExist) {
        Accounts.createUser({
            username: 'test',
            password: 'test'
        });
    }
});
