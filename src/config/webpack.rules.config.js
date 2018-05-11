import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export function getJsRule(packConfig, env) {
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

export default function getRules(packConfig, env) {
    const {
        js,
        css
    } = packConfig;

    const rules = [
        getJsRule(packConfig, env),
        {
            test: /\.(css|scss)$/,
            use: [
                env === 'prd' ? MiniCssExtractPlugin.loader : 'style-loader',
                'css-loader',
                'sass-loader'
            ],
            exclude: /node_modules/
        },
        {
            test: /\.(png|jpg|gif)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'images/[name].[ext]'
                    }
                }
            ]
        },
        {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[ext]'
                    }
                }
            ]
        },
        {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        limit: 8192,
                        mimetype: 'application/font-woff',
                        name: 'fonts/[name].[ext]'
                    }
                }
            ]
        }
    ];

    return rules;
}
