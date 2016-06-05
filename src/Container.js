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
                return mapper ? mapper(state) : {};
            },

            (dispatch) => {return {_dispatch: dispatch}}

            // (stateProps, dispatchProps, ownProps) => {
            //     return {
            //         ...ownProps,
            //         ...stateProps,
            //         ...dispatchProps
            //     };
            // }
        )(this);
    }

    /**
     * @param {Object} props
     */
    constructor(props) {
        super(props);

        if (!this.constructor.__connected) throw new Error('The Container class ' + this.constructor.name + ' is not connected.');

        this._dispatch = props._dispatch;

        /**
         * @type {Object|Controller}
         * @private
         */
        this._actions = {};
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
     */
    componentWillReceiveProps(props) {
        this._dispatch = props._dispatch;
        _mapDispatch(this._actions, this._dispatch);
    }

    /**
     * @param {string} type
     * @param {Object} data
     */
    dispatch(type, data) {
        this.props._dispatch(Object.assign({type}, data));
    }

    /**
     * @returns {Object|Controller}
     * @private
     */
    get actions() {
        return this._actions;
    }

    /**
     * @param {Object|Controller} actions
     * @private
     */
    set actions(actions) {
        this._actions = actions || {};
        _mapDispatch(this._actions, this._dispatch);
    }
}


function _mapDispatch(actions, dispatch, state) {
    if (actions instanceof Controller) {
        actions.provideDispatch(dispatch);
    }

    Object.keys(actions).forEach(key => {
        let action = actions[key];
        if (typeof action === 'object') _mapDispatch(action, dispatch, state);
    });
}


module.exports = Container;
