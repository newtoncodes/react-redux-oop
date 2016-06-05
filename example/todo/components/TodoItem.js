'use strict';

const React = require('react');

class TodoItem extends React.Component {
    static propTypes = {
        text: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        onCheck: React.PropTypes.func.isRequired,
        onUncheck: React.PropTypes.func.isRequired
    };

    render() {
        return (
            <div>
                <div style={{textDecoration: this.props.checked ? 'line-through' : ''}} >{this.props.text}</div>

                <button onClick={this.props.onRemove}>Remove</button>
                <button onClick={this.props.onCheck}>Check</button>
                <button onClick={this.props.onUncheck}>Uncheck</button>
            </div>
        )
    }
}

module.exports = TodoItem;
