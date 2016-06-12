'use strict';

const Redux = require('redux');
const EventEmitter = require('eventemitter3');
const Immutable = require('seamless-immutable');


/**
 * Redux store wrapper
 *
 * @extends EventEmitter
 */
class Store extends EventEmitter {
    /**
     * @param {Object} state
     * @param {function} enhancer
     */
    constructor(state, enhancer) {
        super();

        /**
         * @type {function}
         * @private
         */
        this._enhancer = enhancer;

        /**
         * @type {Object.<string,Object.<string,Array.<function>>>}
         * @private
         */
        this._reducers = {};

        /**
         * @type {Object}
         * @private
         */
        this._store = Redux.createStore(this._reducer.bind(this), Immutable(state || {}), this._enhancer);
        this._store.subscribe(() => this.emit('state', this._store.getState()));
        this.dispatch = this._store.dispatch.bind(this._store);
        this.getState = this._store.getState.bind(this._store);
    }

    /**
     * @param {string} action
     * @param {string} [path]
     * @param {function} reducer
     */
    addReducer(action, path, reducer) {
        if (arguments.length === 2) {
            reducer = arguments[2];
            path = '';
        }

        path = (path || '*') + '';

        this._reducers[action] = this._reducers[action] || {};
        this._reducers[action][path] = this._reducers[action][path] || [];
        this._reducers[action][path].push(reducer);
    }

    /**
     * @param {string} action
     * @param {string} [path]
     * @param {function} reducer
     */
    removeReducer(action, path, reducer) {
        if (arguments.length === 2) {
            reducer = arguments[2];
            path = '';
        }

        path = (path || '*') + '';

        if (!this._reducers[action] || !this._reducers[action][path]) return;

        let index = this._reducers[action][path].indexOf(reducer);
        if (index !== -1) this._reducers[action][path].splice(index, 1);
    }

    /**
     * @param {Object.<string,Object.<string,Array.<function>|function>>} reducers
     */
    addReducers(reducers) {
        Object.keys(reducers).forEach(action => {
            Object.keys(reducers[action]).forEach(path => {
                this._reducers[action] = this._reducers[action] || {};
                this._reducers[action][path] = this._reducers[action][path] || [];
                this._reducers[action][path] = this._reducers[action][path].concat(reducers[action][path]);
            });
        });
    }

    /**
     * @param {Object.<string,Object.<string,Array.<function>|function>>} reducers
     */
    removeReducers(reducers) {
        Object.keys(reducers).forEach(action => {
            Object.keys(reducers[action]).forEach(path => {
                if (!this._reducers[action] || !this._reducers[action][path]) return;

                reducers[action][path].forEach(reducer => {
                    let index = this._reducers[action][path].indexOf(reducer);
                    if (index !== -1) this._reducers[action][path].splice(index, 1);
                });
            });
        });
    }

    /**
     * @param {Object} state
     * @param {Object} action
     * @param {Object} action.type
     * @private
     */
    _reducer(state, action) {
        this.emit('action', action);

        let reducers = this._reducers['*'];
        if (reducers) state = this._reduce(reducers, state, action);

        reducers = this._reducers[action.type];
        if (reducers) state = this._reduce(reducers, state, action);

        return state;
    }

    /**
     * @param {Object} reducers
     * @param {Object} state
     * @param {Object} action
     * @returns {Object}
     * @private
     */
    _reduce(reducers, state, action) {
        return Object.keys(reducers).reduce((state, path) => reducers[path].reduce((state, reducer) => {
            if (path === '*') return Immutable(reducer(state, action));

            let arr = path.split('.');
            let local = arr.reduce((state, key) => state ? state[key] : state, state);

            return state.setIn(arr, Immutable(reducer(local, action)));
        }, state), state);
    }

    /**
     * @returns {*}
     */
    get state() {
        return this._store.getState();
    }

    /**
     * @returns {Object}
     */
    get reduxStore() {
        return this._store;
    }
}


module.exports = Store;
