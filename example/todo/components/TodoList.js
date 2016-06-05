'use strict';

const React = require('react');
const TodoItem = require('./TodoItem');

class TodoList extends React.Component {
    static propTypes = {
        items: React.PropTypes.object.isRequired,
        onItemRemove: React.PropTypes.func.isRequired,
        onItemCheck: React.PropTypes.func.isRequired,
        onItemUncheck: React.PropTypes.func.isRequired
    };

    _handleClick() {
        this.props.onAddItem(this.refs.input.value);
        this.refs.input.value = '';
    }

    render() {
        return (
            <div>
                <div>
                    {Object.keys(this.props.items).map(key => (
                        <TodoItem
                            key={key}

                            onRemove={this.props.onItemRemove.bind(null, key)}
                            onCheck={this.props.onItemCheck.bind(null, key)}
                            onUncheck={this.props.onItemUncheck.bind(null, key)}

                            {...this.props.items[key]}
                        />
                    ))}
                </div>

                <input ref="input"/>
                <button onClick={this._handleClick.bind(this)}>Add item</button>
            </div>
        )
    }
}

module.exports = TodoList;
