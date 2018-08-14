/**
 *  Wrapper for the Meteor.Error
 *  @param {Array} params
 *  @returns {Match.Error} Meteor.error
 */
export const createMeteorError = (...params) => new Meteor.Error(...params);
