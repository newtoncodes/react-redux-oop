'use strict';

const React = require('react');
const Container = require('../../src/Container');
const NotepadController = require('./NotepadController');
const Notepad = require('./components/Notepad');

class NotepadContainer extends Container {
    /**
     * Map state to props
     * @param {Object} state
     * @returns {Object}
     */
    static mapper(state) {
        return {
            text: state.notepad.text
        };
    }

    /**
     * Collection of controllers or a single controller.
     * @type {NotepadController|exports|module.exports}
     */
    actions = new NotepadController();

    /**
     * Render
     * @returns {XML}
     */
    render() {
        return (
            <Notepad
                text={this.props.text}
                onChange={text => this.actions.changeText(text)}
            />
        );
    }
}

module.exports = NotepadContainer.connect();