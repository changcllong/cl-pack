import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Test from './component/test';
import './index.scss';

ReactDOM.render(
    (
        <div>
            <p>REACT EXAMPLE...</p>
            <Test />
        </div>
    ),
    document.getElementById('app')
);
