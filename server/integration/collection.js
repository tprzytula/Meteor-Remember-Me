/**
 *  Finds and returns an user containing requested login token.
 *  @param {string} token
 *  @returns {Object} user
 */
export const getUserByToken = (token) => {
    const query = { 'services.resume.loginTokens.hashedToken': token };
    return Meteor.users.findOne(query, {
        'services.resume.loginTokens': 1
    });
};

/**
 *  Replaces current user's login tokens.
 *  // TODO: Ensure that login tokens weren't changed in the meantime
 *  @param {string} id
 *  @param {Object[]} tokens
 *  @returns {number} result
 */
export const replaceUserTokens = (id, tokens) => Meteor.users.update(id, {
    $set: {
        'services.resume.loginTokens': tokens
    }
});
