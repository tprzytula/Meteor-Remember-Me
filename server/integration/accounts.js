import { Accounts } from 'meteor/accounts-base';

/**
 *  Adds additional validation step in the Meteor's login process.
 *  @param {function} callback
 */
export const addValidationStep = callback => Accounts.validateLoginAttempt(callback);

/**
 *  Returns last login token associated to the connectionId.
 *  @param {string} connectionId
 *  @returns {string} loginToken
 */
export const getConnectionLastLoginToken = connectionId => Accounts._getLoginToken(connectionId);


/**
 *  Returns user's record matching the username.
 *  @param {string} username
 *  @returns {Object} user
 */
export const findUserByUsername = username => Accounts.findUserByUsername(username);

/**
 *  Hashes login token.
 *  @param {string} token
 *  @returns {string} hashedToken
 */
export const hashLoginToken = token => Accounts._hashLoginToken(token);
