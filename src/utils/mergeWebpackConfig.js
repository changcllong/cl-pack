import merge from 'webpack-merge';

export default (defaultConfig = {}, userConfig = {}) => {
    let retRules = {
        rules: defaultConfig.module.rules
    };
    if (userConfig.module && Array.isArray(userConfig.module.rules)) {
        retRules = merge.smart({
            rules: defaultConfig.module.rules
        }, {
            rules: userConfig.module.rules
        });
    }

    let retPlugins = defaultConfig.plugins;
    if (userConfig.plugins) {
        retPlugins = merge({
            customizeArray: merge.unique(
                'plugins',
                [
                    'CleanWebpackPlugin',
                    'MiniCssExtractPlugin',
                    'StylelintWebpackPlugin',
                    'OptimizeCSSAssetsPlugin',
                    'UglifyJsPlugin',
                    'HotModuleReplacementPlugin'
                ],
                plugin => plugin.constructor && plugin.constructor.name
            )
        })({
            plugins: defaultConfig.plugins
        }, {
            plugins: userConfig.plugins
        });
    }

    const retConfig = merge.strategy({
        entry: 'replace'
    })(defaultConfig, userConfig);

    retConfig.module.rules = retRules.rules;
    retConfig.plugins = retPlugins.plugins;

    return retConfig;
};
