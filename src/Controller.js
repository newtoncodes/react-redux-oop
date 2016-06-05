'use strict';


/**
 * Abstract controller
 */
class Controller {
    /**
     * @param {function} [dispatch]
     */
    constructor(dispatch) {
        this.provideDispatch(dispatch);
    }

    /**
     * @param {function} dispatch
     */
    provideDispatch(dispatch) {
        this.dispatch = (type, data = {}) => {
            if (!dispatch) throw new Error('Dispatch not set.');
            setTimeout(() => dispatch(Object.assign({type}, data), 0));
        };
    }

    //noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
    /**
     * @param {string} type
     * @param {Object} [data]
     * @protected
     */
    dispatch(type, data = {}) {
        throw new Error('Dispatch not set.');
    }
}


module.exports = Controller;