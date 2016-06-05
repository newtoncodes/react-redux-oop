'use strict';

const Actions = require('./TodoActions');

const TodoReducers = {
    [Actions.ADD_ITEM]: {
        'todo': [
            (state = {lastId: 0, items: {}}, action) => {
                let newId = state.lastId + 1;

                return {
                    lastId: newId,
                    items: state.items.merge({
                        [newId]: {text: action.text, checked: false}
                    })
                }
            }
        ]
    },

    [Actions.REMOVE_ITEM]: {
        'todo.items': [
            (state = {}, action) => state.without(action.id)
        ]
    },

    [Actions.CHECK_ITEM]: {
        'todo.items': [
            (state = {}, action) => state.setIn([action.id, 'checked'], true)
        ]
    },

    [Actions.UNCHECK_ITEM]: {
        'todo.items': [
            (state = {}, action) => state.setIn([action.id, 'checked'], false)
        ]
    }
};

module.exports = TodoReducers;
