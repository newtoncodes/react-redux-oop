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

        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(name => {
            if (name === 'constructor') return;
            if (!this[name] || (typeof this[name] !== 'function')) return;
            this[name] = this[name].bind(this);
        });
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
        this._store.dispatch(Object.assign({type}, data));
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