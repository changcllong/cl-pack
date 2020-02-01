import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Route } from 'react-router';
import PropTypes from 'prop-types';
import Test from './test';

const fs = require('fs');

const PlaceHolder = () => {
    return (<p>HELLO SSR!!</p>);
}

export default class Index extends Component {
    getChildContext() {
        return { list: this.props.locals.list };
    }

    render() {
        const {
            url
        } = this.props;
        return (
            <div>
                <StaticRouter location={url} context={{}}>
                    <section>
                        <Route exact path="/" component={Test}/>
                        <Route path="/tip" component={PlaceHolder}/>
                    </section>
                </StaticRouter>
            </div>
        );
    }
}

Index.childContextTypes = {
    list: PropTypes.array
};

Index.propTypes = {
    locals: PropTypes.object,
    url: PropTypes.string
};

const html = ReactDOMServer.renderToString(React.createElement(Index, { url: '/', locals: { list: [0, 1] } }));

fs.writeFileSync('../output.html', html, { encoding: 'utf8' });
