'use strict';

const Actions = require('./NotepadActions');

const NotepadReducers = {
    [Actions.CHANGE_TEXT]: {
        'notepad.text': [
            (state = {}, action) => action.text
        ]
    }
};

module.exports = NotepadReducers;