'use strict';


/**
 * Abstract controller
 */
class Controller {
    /**
     * @param {Store} [store]
     */
    constructor(store) {
        this._store = store || null;
    }

    /**
     * @param {Store} store
     */
    attachTo(store) {
        this._store = store;
    }

    //noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
    /**
     * @param {string} type
     * @param {Object} [data]
     * @protected
     */
    dispatch(type, data = {}) {
        if (!this._store) throw new Error('Store not set.');
        setTimeout(() => this._store.dispatch(Object.assign({type}, data), 0));
    }

    /**
     * @returns {Object}
     */
    getState() {
        if (!this._store) throw new Error('Store not set.');
        return this._store.getState();
    }

    /**
     * @returns {Object}
     */
    get state() {
        if (!this._store) throw new Error('Store not set.');
        return this._store.getState();
    }
}


module.exports = Controller;