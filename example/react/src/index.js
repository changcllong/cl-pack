import React from 'react';
import ReactDOM from 'react-dom';

import App from './component/test';
import style from './index.scss';

ReactDOM.render(
    (
        <div className={style.app}>
            <App data={[
                { id: 2, name: 'declare', parent: 0 },
                { id: 3, name: 'gps', parent: 0 },
                { id: 4, name: 'gui', parent: 1 },
                { id: 0, name: 'api', parent: null },
                { id: 1, name: 'fetch', parent: null },
                { id: 31, name: 'led', parent: 3 },
                { id: 32, name: 'mips', parent: 3 },
                { id: 41, name: 'dns', parent: 31 },
                { id: 42, name: 'cros', parent: 31 }
            ]} />
        </div>
    ),
    document.getElementById('root')
);
