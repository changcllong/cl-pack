import React, { Component } from 'react';

export default class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [0, 1, 2, 3, 4, 5]
        }
    }

    render() {
        const {
            list
        } = this.state;
        return (
            <ul>
                {list.map(item => {
                    return (<li key={item}>第 {item} 项</li>);
                })}
            </ul>
        );
    }
}
