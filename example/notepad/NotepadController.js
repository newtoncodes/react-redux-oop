'use strict';

const Controller = require('../../src/Controller');
const Actions = require('./NotepadActions');

class NotepadController extends Controller {
    /**
     * @param {string} text
     */
    changeText(text) {
        this.dispatch(Actions.CHANGE_TEXT, {text});
    }
}

module.exports = NotepadController;