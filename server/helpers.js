const RememberMeHelpers = {};

/**
 *  Returns an user containing provided login token.
 *  @param userLoginToken
 *  @returns {Object} user
 */
RememberMeHelpers.findMatchingUser = userLoginToken => Meteor.users.findOne({
    'services.resume.loginTokens.hashedToken': userLoginToken
}, {
    fields: {
        'services.resume.loginTokens': 1
    }
});

/**
 *  Returns all currently stored login token records for
 *  the user who has also the provided token in parameter.
 *  @param {string} loginToken
 *  @returns {Array} loginTokenRecords
 */
RememberMeHelpers.getAllUserTokens = (loginToken) => {
    const user = RememberMeHelpers.findMatchingUser(loginToken);
    if (!user) return false;
    return user.services.resume.loginTokens || [];
};

/**
 *  Updates login token records for an user who match the single token.
 *  @param {string} loginToken
 *  @param {Array} newLoginTokens
 *  @returns {boolean} result
 */
RememberMeHelpers.updateUserTokens = (loginToken, newLoginTokens) => {
    const updatedDocuments = Meteor.users.update({
        'services.resume.loginTokens.hashedToken': loginToken
    }, {
        $set: {
            'services.resume.loginTokens': newLoginTokens
        }
    });
    return updatedDocuments === 1;
};

export default RememberMeHelpers;
