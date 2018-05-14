import path from 'path';
import { existsSync } from 'fs';

export default function getExistConfigPath(name, dir) {
    const names = [`.${filename}rc.js`, `.${filename}rc`, `${filename}.config.js`];
    let configPath;
    for (let i = 0; i < names.length; i++) {
        configPath = path.join(dir, names[i]);
        if (existsSync(configPath)) {
            return configPath;
        }
    }
    return undefined;
}
