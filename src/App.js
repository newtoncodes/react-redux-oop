'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');
const Redux = require('redux');
const Provider = require('react-redux').Provider;
const Immutable = require('seamless-immutable');

const Store = require('./Store');


/**
 * Base app class
 * @deprecated
 */
class App {
    /**
     * @param {Object} [state]
     * @param {Array.<function>} [middlewares]
     * @param {Array.<function>} [enhancers]
     * @deprecated
     */
    constructor(state = {}, middlewares = [], enhancers = []) {
        /**
         * @type {Store}
         * @protected
         */
        this._store = null;

        /**
         * @type {Array.<function>}
         * @private
         */
        this._middlewares = middlewares;

        /**
         * @type {function}
         * @private
         */
        this._middleware = Redux.applyMiddleware(...this._middlewares);

        /**
         * @type {Array.<function>}
         * @private
         */
        this._enhancers = enhancers;

        /**
         * @type {function}
         * @private
         */
        this._enhancer = Redux.compose(this._middleware, ...this._enhancers);

        /**
         * @type {Object}
         * @private
         */
        this._initialState = Immutable(state);
    }

    /**
     * @param {Object} [state]
     * @returns {App}
     * @deprecated
     */
    configure(state = {}) {
        this._store = this._createStore(state);
        this._store.init();

        return this;
    }

    /**
     * @param {HTMLElement|*} node
     * @returns {App}
     */
    renderTo(node) {
        ReactDOM.render(React.createElement(Provider, {
            store: this._store,
            children: React.createElement(this._render)
        }), node);

        return this;
    }

    /**
     * @returns {string}
     */
    renderHtml() {
        if (!this._store) throw new Error('The App is not configured.');

        return ReactDOMServer.renderToString(React.createElement(Provider, {
            store: this._store,
            children: React.createElement(this._render)
        }));
    }

    /**
     * @returns {string}
     */
    renderStaticHtml() {
        if (!this._store) throw new Error('The App is not configured.');

        return ReactDOMServer.renderToStaticMarkup(React.createElement(Provider, {
            store: this._store,
            children: React.createElement(this._render)
        }));
    }

    /**
     * @returns {XML}
     * @private
     */
    _render() {
        return React.createElement('div');
    }

    /**
     * @param {function} middleware
     * @param {number|null} [index]
     * @returns {App}
     * @protected
     */
    _addMiddleware(middleware, index = null) {
        if (index === null) this._middlewares.push(middleware);
        else this._middlewares.splice(index, 0, middleware);

        this._middleware = Redux.applyMiddleware(...this._middlewares);
        this._enhancer = Redux.compose(this._middleware, ...this._enhancers);

        return this;
    }

    /**
     * @param {function} enhancer
     * @param {number|null} [index]
     * @returns {App}
     * @protected
     */
    _addEnhancer(enhancer, index = null) {
        if (index === null) this._enhancers.push(enhancer);
        else this._enhancers.splice(index, 0, enhancer);

        this._middleware = Redux.applyMiddleware(...this._middlewares);
        this._enhancer = Redux.compose(this._middleware, ...this._enhancers);

        return this;
    }

    /**
     * @param {Object} [state]
     * @returns {Store}
     * @protected
     */
    _createStore(state = {}) {
        return new Store(this._initialState.merge(state || {}, {deep: true}), [], this._enhancer);
    }

    /**
     * @returns {Store}
     */
    get store() {
        return this._store;
    }
}


module.exports = App;