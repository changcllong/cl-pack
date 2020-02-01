import { existsSync } from 'fs';
import path from 'path';
import { getContext } from './path';

export default (configPath, context = getContext()) => {
    const absolutePath = path.resolve(context, configPath);

    if (existsSync(absolutePath)) {
        const config = require(absolutePath);

        return config.default || config;
    }
    return null;
};
