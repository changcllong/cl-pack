import { existsSync } from 'fs';
import { isString, isObject } from 'util';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getExistConfigPath from '../util/existConfig';

export function getJSRule(packConfig, env) {
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
        const eslintRule = {
            loader: 'eslint-loader'
        }
        if (isObject(eslint)) {
            eslintRule.options = eslint;
        }
        rule.use.push(eslintRule);
    }

    return rule;
}

export function getCSSRule(packConfig, env) {
    const {
        CONTEXT,
        css,
        postcss
    } = packConfig;

    const cssOption = {
        ...css,
        ...env === 'prd' ? {
            minimize: { minifyFontValues: false }
        } : {}
    };

    let postcssOption;
    if (postcss) {
        postcssOption = isObject(postcss) ? postcss : {};

        if (!(postcss.config &&
            isString(postcss.config.path) &&
            existsSync(path.resolve(CONTEXT, postcss.config.path)))) {
            postcssOption.config = postcss.config || {};
            postcssOption.config.path = getExistConfigPath('postcss', CONTEXT) || getExistConfigPath('postcss', __dirname);
        }
    }

    const rules = [
        {
            test: /\.css$/i,
            use: [
                env === 'prd' ? MiniCssExtractPlugin.loader : 'style-loader',
                {
                    loader: 'css-loader',
                    options: cssOption
                },
                ...postcss ? [{
                    loader: 'postcss-loader',
                    options: postcssOption
                }] : []
            ]
        },
        {
            test: /\.(scss|sass)$/i,
            use: [
                env === 'prd' ? MiniCssExtractPlugin.loader : 'style-loader',
                {
                    loader: 'css-loader',
                    options: cssOption
                },
                ...postcss ? [{
                    loader: 'postcss-loader',
                    options: postcssOption
                }] : [],
                'sass-loader'
            ]
        },
        {
            test: /\.less$/i,
            use: [
                env === 'prd' ? MiniCssExtractPlugin.loader : 'style-loader',
                {
                    loader: 'css-loader',
                    options: cssOption
                },
                ...postcss ? [{
                    loader: 'postcss-loader',
                    options: postcssOption
                }] : [],
                'less-loader'
            ]
        }
    ];

    return rules;
}

export function getAssetsRule(packConfig, env) {
    const {
        assets
    } = packConfig;
    const rules = [];

    if (isObject(assets)) {
        Object.keys(assets).forEach(asset => {
            const options = isObject(assets[asset]) ? assets[asset] : {};
            if (!options.name) {
                options.name = env === 'prd' ? '[path][name]@[hash].[ext]' : '[path][name].[ext]';
            }
            rules.push({
                test: new RegExp(`.(${asset})$`, 'i'),
                loader: 'file-loader',
                options
            });
        });
    }

    return rules;
}

export default function getRules(packConfig, env) {

    const rules = [
        getJSRule(packConfig, env),
        ...getCSSRule(packConfig, env),
        ...getAssetsRule(packConfig, env)
    ];

    return rules;
}
