import React from 'react';
import ReactDOM from 'react-dom';
import Test from './component/test';
import style from './index.scss';

ReactDOM.render(
    (
        <div id={style.app}>
            <p>REACT EXAMPLE...</p>
            <Test />
        </div>
    ),
    document.getElementById('root')
);
