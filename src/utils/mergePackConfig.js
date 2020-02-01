import { mergeWith } from 'lodash';

export default (defaultConfig = {}, userConfig = {}) => {
    return mergeWith(defaultConfig, userConfig, (objValue, srcValue, key) => {
        if (key === 'entry') {
            return srcValue;
        }
    })
};
