/**
 *  Higher level wrapper for handling creation
 *  of new Meteor methods with the possibility
 *  to easily provide a callback which will be
 *  triggered when the method is invoked.
 *
 *  @property {string} name
 *  @property {function} callback
 *  @class
 */
class Method {
    constructor({ name, callback }) {
        this.name = name;
        this.callback = callback;
    }

    /**
     *  Registers the method in Meteor.
     *  @public
     */
    setup() {
        const method = this._constructMethod();
        Meteor.methods(method);
    }

    /**
     *  Prepares object with the method configuration
     *  in an understandable way for Meteor.methods parser.
     *  @returns {Object} method
     *  @private
     */
    _constructMethod() {
        const { name, callback } = this;
        return {
            [name](...params) {
                return callback(this, ...params);
            }
        };
    }
}

export const factory = (...params) => new Method(...params);

export default Method;
