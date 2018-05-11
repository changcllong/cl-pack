import webpack from 'webpack';
import webpackBaseConfig from './webpack.base.config';
import getRules from './webpack.rules.config';

export default (packConfig) => {
    const webpackConfig = webpackBaseConfig(packConfig);

    webpackConfig.mode = 'development';

    webpackConfig.module.rules = getRules(packConfig, 'dev');

    if (packConfig.hot) {
        Object.keys(webpackConfig.entry).forEach(entryName => {
            webpackConfig.entry[entryName].unshift('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=10000&reload=true');
        });

        webpackConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        );
    }

    return webpackConfig;
};
