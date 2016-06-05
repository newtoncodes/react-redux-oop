'use strict';

const React = require('react');
const App = require('../src/App');
const TodoContainer = require('./todo/TodoContainer');
const NotepadContainer = require('./notepad/NotepadContainer');

const TodoReducers = require('./todo/TodoReducers');
const NotepadReducers = require('./notepad/NotepadReducers');


class ExampleApp extends App {
    constructor() {
        super({
            notepad: {
                text: ''
            },

            todo: {
                lastId: 0,
                items: {}
            }
        });

        let dev = (process.env.NODE_ENV !== 'production');

        if (dev) this._addMiddleware(require('redux-immutable-state-invariant')());

        this._addMiddleware(require('redux-thunk').default);

        if (dev) {
            this._addMiddleware(require('redux-logger')());

            let matches = window.location.href.match(/[?&]_debug=([^&]+)\b/);
            let session = (matches && matches.length) ? matches[1] : null;

            let devTools = null;
            if (window['devToolsExtension']) devTools = window['devToolsExtension']();

            if (devTools) this._addEnhancer(devTools);
            if (session) this._addEnhancer(require('redux-devtools').persistState(session));
        }
    }

    /**
     * @private
     */
    _render() {
        return (
            <div>
                {<TodoContainer />}
                {<NotepadContainer />}
            </div>
        );
    };

    /**
     * @returns {Store}
     * @private
     */
    _createStore() {
        let store = super._createStore();
        store.addReducers(TodoReducers);
        store.addReducers(NotepadReducers);
        return store;
    }
}


module.exports = ExampleApp;
