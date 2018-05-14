import { existsSync } from 'fs';
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
        if (typeof eslint === 'object') {
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
        postcssOption = typeof postcss === 'object' ? postcss : {};

        if (!(postcss.config &&
            typeof postcss.config.path === 'string' &&
            existsSync(path.resolve(CONTEXT, postcss.config.path)))) {
            postcssOption.config = postcss.config || {};
            postcssOption.config.path = getExistConfigPath('postcss', CONTEXT) || getExistConfigPath('postcss', __dirname);
        }
    }

    const rule = [
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

    return rule;
}

// TODO: different asset has different public path
export function getAssetsRule(packConfig, env) {
    const {
        assets
    } = packConfig;
    const rule = {
        test: new RegExp(`.(${assets.join('|')})$`, 'i'),
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
    }

    return rule;
}

export default function getRules(packConfig, env) {

    const rules = [
        getJSRule(packConfig, env),
        ...getCSSRule(packConfig, env),
        getAssetsRule(packConfig, env)
    ];

    return rules;
}
