'use strict';

const React = require('react');


class Notepad extends React.Component {
    static propTypes = {
        text: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    render() {
        return (
            <div>
                <textarea value={this.props.text} onChange={event => this.props.onChange(event.target.value)} />
            </div>
        );
    }
}


module.exports = Notepad;