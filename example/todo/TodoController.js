'use strict';

const Controller = require('../../src/Controller');
const Actions = require('./TodoActions');

class TodoController extends Controller {
    /**
     * @param {string} text
     */
    addItem(text) {
        this.dispatch(Actions.ADD_ITEM, {text});
    }

    /**
     * @param {number} id
     */
    removeItem(id) {
        this.dispatch(Actions.REMOVE_ITEM, {id});
    }

    /**
     * @param {number} id
     */
    checkItem(id) {
        this.dispatch(Actions.CHECK_ITEM, {id});
    }

    /**
     * @param {number} id
     */
    uncheckItem(id) {
        this.dispatch(Actions.UNCHECK_ITEM, {id});
    }
}

module.exports = TodoController;
