'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');
const {Provider} = require('react-redux');


/**
 * Main container
 */
class Container extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            component: props.component
        };

        props.subscribe(this);
    }

    setComponent(component) {
        this.setState({component});
    }

    render() {
        return this.state.component || <div></div>;
    }
}


/**
 * Root view
 */
class View {
    /**
     * @param {Store} store
     * @param {Object} component
     */
    constructor(store, component) {
        /**
         * @type {Store}
         * @protected
         */
        this._store = store;

        /**
         * @type {Object}
         * @protected
         */
        this._component = component;
    }

    /**
     * @return {Object}
     */
    render() {
        return React.createElement(Provider, {
            store: this._store,
            children: React.createElement(Container, {
                component: this._component,
                subscribe: (cmp) => this._container = cmp
            })
        });
    }

    /**
     * @param {HTMLElement|*} node
     * @returns {View}
     */
    renderTo(node) {
        ReactDOM.render(this.render(), node);
    }

    /**
     * @returns {string}
     */
    renderHtml() {
        if (!this._store) throw new Error('The View is not configured.');
        return ReactDOMServer.renderToString(this.render());
    }

    /**
     * @returns {string}
     */
    renderStaticHtml() {
        if (!this._store) throw new Error('The View is not configured.');
        return ReactDOMServer.renderToStaticMarkup(this.render());
    }

    /**
     * @param {Object} component
     */
    set component(component) {
        this._component = component;
        this._container && this._container.setComponent(component);
    }

    /**
     * @return {Object}
     */
    get component() {
        return this._component;
    }

    /**
     * @returns {Store}
     */
    get store() {
        return this._store;
    }
}


module.exports = View;