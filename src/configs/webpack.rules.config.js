// import { existsSync } from 'fs';
import { isObject } from 'lodash';
// import { isString } from 'util';
// import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import getExistConfigPath from '../util/getExistConfigPath';

export function getJSRules(packConfig) {
    const {
        eslint
    } = packConfig;
    const rule = {
        test: /\.(js|jsx)$/,
        use: [
            'babel-loader'
        ],
        exclude: /node_modules/
    };
    if (eslint) {
        const eslintLoader = {
            loader: 'eslint-loader'
        }
        if (isObject(eslint)) {
            eslintLoader.options = eslint;
        }
        rule.use.push(eslintLoader);
    }

    return [rule];
}

export function getCSSRules(packConfig) {
    const { css } = packConfig;
    const { postcss, modules, extractCss } = css;
    const cssOption = {
        modules: modules
    };

    // let postcssOption;
    // if (postcss) {
    //     postcssOption = isObject(postcss) ? postcss : {};

    //     if (!(postcss.config &&
    //         isString(postcss.config.path) &&
    //         existsSync(path.resolve(context, postcss.config.path)))) {
    //         postcssOption.config = postcss.config || {};
    //         postcssOption.config.path = getExistConfigPath('postcss', context) || getExistConfigPath('postcss', __dirname);
    //     }
    // }

    const styleLoader = extractCss ? MiniCssExtractPlugin.loader : 'style-loader';

    const rules = [
        {
            test: /\.css$/i,
            use: [
                styleLoader,
                { loader: 'css-loader', options: { importLoaders: 0, ...cssOption } }
            ]
        },
        {
            test: /\.(scss|sass)$/i,
            use: [
                styleLoader,
                { loader: 'css-loader', options: { importLoaders: 1, ...cssOption } },
                'sass-loader'
            ]
        },
        {
            test: /\.less$/i,
            use: [
                styleLoader,
                { loader: 'css-loader', options: { importLoaders: 1, ...cssOption } },
                'less-loader'
            ]
        }
    ];

    if (postcss) {
        const postcssLoader = isObject(postcss)
            ? { loader: 'postcss-loader', options: postcss }
            : 'postcss-loader';

        rules.forEach(rule => {
            rule.use[1].options.importLoaders += 1;

            const useLen = rule.use.length;
            if (useLen <= 2) {
                rule.use.push(postcssLoader)
            } else {
                rule.use.splice(2, 0, postcssLoader);
            }
        })
    }

    return rules;
}

export function getAssetsRules(packConfig) {
    const { hash } = packConfig;

    return [{
        test: new RegExp('.(jpg|jpeg|png|gif|mp3|ttf|woff|woff2|eot|svg)$', 'i'),
        loader: 'file-loader',
        options: {
            name: hash ? '[path][name]@[hash].[ext]' : '[path][name].[ext]'
        }
    }];

    // if (isObject(assets)) {
    //     Object.keys(assets).forEach(asset => {
    //         const options = isObject(assets[asset]) ? assets[asset] : {};
    //         if (!options.name) {
    //             options.name = env === 'prd' ? '[path][name]@[hash].[ext]' : '[path][name].[ext]';
    //         }
    //         rules.push({
    //             test: new RegExp('.(jpg|jpeg|png|gif|mp3|ttf|woff|woff2|eot|svg)$', 'i'),
    //             loader: 'file-loader',
    //             options
    //         });
    //     });
    // }

    // return rules;
}

// export default function getRules(packConfig, env) {
//     const rules = [
//         getJSRule(packConfig, env),
//         ...getCSSRule(packConfig, env),
//         ...getAssetsRule(packConfig, env)
//     ];

//     return rules;
// }
