import React, { useMemo, useState, useEffect } from 'react';

// 这里是题目二的答案
const reduceArrayToTree = (arr) => {
    const helpMap = arr.reduce((retMap, item) => {
        const { parent } = item;
        const parentkey = parent == null ? 'null' : parent;
        if (!retMap[parentkey]) {
            retMap[parentkey] = [];
        }
        retMap[parentkey].push(item);
        return retMap;
    }, {});

    const buildTree = ({ id, name }) => {
        const node = {
            id,
            name
        };

        if (Array.isArray(helpMap[id])) {
            node.children = helpMap[id].map(item => buildTree(item));
        }

        return node;
    };

    const root = helpMap.null;
    if (!Array.isArray(root)) {
        return [];
    }
    return root.map(item => buildTree(item));
};

const App = ({ data = [] }) => {
    const firstData = useMemo(() => {
        return reduceArrayToTree(data);
    }, [data]);

    return (
        <LevelSelect data={firstData} />
    )
}

const LevelSelect = ({ data }) => {
    const [value, setValue] = useState(data[0]?.id);
    const nextData = useMemo(() => {
        const current = data.find(({ id }) => id === value);

        if (!current) return [];
        return current.children || [];
    }, [data, value]);

    useEffect(() => {
        setValue(data[0]?.id);
    }, [data]);

    return data.length > 0 ? (
        <>
            <select
                value={value}
                onChange={e => { setValue(+e.target.value); }}
            >
                {data.map(({ id, name }) => {
                    return (
                        <option key={id} value={id}>
                            {name}
                        </option>
                    );
                })}
            </select>
            <LevelSelect data={nextData} />
        </>
    ) : null;
}

export default App;
