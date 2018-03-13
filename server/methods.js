import { check } from 'meteor/check';
import { updateState } from './index.js';

// Name of the method should be unique to not override others
const updateRememberMeMethod = 'tprzytula:rememberMe-update';

export default () => {
    Meteor.methods({
        /**
         *  Exposes a meteor method to allow the clients
         *  to request a change for the rememberMe flag.
         *  @param {boolean} flag
         *  @returns {boolean} result
         */
        [updateRememberMeMethod](flag = true) {
            check(flag, Boolean);
            const connectionId = this.connection.id;
            return updateState(connectionId, flag);
        }
    });
};
