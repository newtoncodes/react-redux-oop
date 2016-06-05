'use strict';

const React = require('react');
const Container = require('../../src/Container');
const TodoController = require('./TodoController');
const TodoList = require('./components/TodoList');

class TodoContainer extends Container {
    /**
     * Map state to props
     * @param {Object} state
     * @returns {Object}
     */
    static mapper(state) {
        return {
            items: state.todo.items
        };
    }

    /**
     * Collection of controllers or a single controller.
     * @type {TodoController|exports|module.exports}
     */
    actions = new TodoController();

    /**
     * Render
     * @returns {XML}
     */
    render() {
        return (
            <TodoList
                items={this.props.items}
                onAddItem={text => this.actions.addItem(text)}
                onItemRemove={id => this.actions.removeItem(id)}
                onItemCheck={id => this.actions.checkItem(id)}
                onItemUncheck={id => this.actions.uncheckItem(id)}
            />
        );
    }
}

// Always export Component.connect();
module.exports = TodoContainer.connect();
