'use strict';

const React = require('react');
const ReactRedux = require('react-redux');
const Controller = require('./Controller');


/**
 * Abstract container
 * 
 * @extends React.Component
 */
class Container extends React.Component {
    /**
     * @returns {React.Component}
     */
    static connect() {
        this.__connected = true;

        return ReactRedux.connect(
            (state) => {
                let mapper = this['mapper'];
                //let result = mapper ? mapper(state) : {};
                //result['_state'] = state;
                return mapper ? mapper(state) : {};
            }

            //(dispatch) => {return {_dispatch: dispatch}}

            // (stateProps, dispatchProps, ownProps) => {
            //     return {
            //         ...ownProps,
            //         ...stateProps,
            //         ...dispatchProps
            //     };
            // }
        )(this);
    }

    static mapper() {
        return {};
    }

    /**
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super(props);

        this._store = context.store;

        if (!this.constructor.__connected) throw new Error('The Container class ' + this.constructor.name + ' is not connected.');

        this._actions = this._actions || {};
        _mapStore(this._actions, this._store);
    }

    /**
     * @param {Object} props
     */
    shouldComponentUpdate(props) {
        let keys = Object.keys(props);

        for (let i = 0, l = keys.length; i < l; i ++) {
            if (props[keys[i]] !== this.props[keys[i]]) return true;
        }

        return false;
    }

    /**
     * @param {Object} props
     * @param {Object} context
     */
    componentWillReceiveProps(props, context) {
        _mapStore(this._actions, context.store);
    }

    /**
     * @param {string} type
     * @param {Object} data
     */
    dispatch(type, data) {
        this._store.dispatch(Object.assign({type}, data));
    }

    /**
     * @returns {Object|Controller}
     */
    get actions() {
        return this._actions || {};
    }

    /**
     * @param {Object|Controller} actions
     */
    set actions(actions) {
        this._actions = Object.assign(this._actions || {}, actions || {});
        if (this._store) _mapStore(this._actions, this._store);
    }
}

Container.contextTypes = {
    store: React.PropTypes.object
};


function _mapStore(actions, store) {
    if (actions instanceof Controller) actions.attachTo(store);

    Object.keys(actions).forEach(key => {
        let action = actions[key];
        if (action && (typeof action === 'object') && !Array.isArray(action)) _mapStore(action, store);
    });
}


module.exports = Container;
