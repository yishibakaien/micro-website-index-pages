const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanPlugin = require('clean-webpack-plugin');
const htmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const extractTextWebpackPlugin = require('extract-text-webpack-plugin');
const extractCss = new extractTextWebpackPlugin('css/[name].css');

// const _path = str => path.resolve(__dirname, str);

// 根据 css 数量 用于生成相应模板
const _getTemp = filePath => {
    let files = glob.sync(filePath);
    let basename = [],
        extname;
    for (let item of files) {
        extname = path.extname(item);
        basename.push(path.basename(item, extname));
    }
    console.log('basename', basename);
    return basename;
};
let temps = _getTemp('./src/styles/templates/*.styl');

let config = {
    entry: {
        index: path.resolve(__dirname, 'src/index.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: path.resolve(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules'),
                query: {
                    presets: ['env']
                }
            },
            {
                test: /\.css$/,
                use: extractCss.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                test: /\.styl$/,
                use: extractCss.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'stylus-loader']
                })
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader:'url-loader',
                query: {
                    limit: 100000,
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)$/,
                loader: 'url-loader',
                query: {
                    limit: 100000,
                    name: 'fonts/[name].[ext]'
                }
            }
        ]
    },
    plugins: [
        extractCss,
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new cleanPlugin(['dist']),
        new htmlWebpackInlineSourcePlugin()
    ],
    devServer: {
        host: '127.0.0.1',
        port: 3004, // 端口
        inline: true,
        hot: false,
        proxy: {
            '/api/*': {
                target: 'http://192.168.1.11:8080',
                secure: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};

temps.forEach(function(item) {
    console.log(item);
    let conf = {
        filename: `${item}.html`,
        template: './src/index.html',
        inject: true,
        hash: false,
        chunks: ['index', item],
        inlineSource: '(' + item + '.css|index.css|index.js)',
        minify: { // 压缩HTML文件
            removeComments: true, // 移除HTML中的注释
            collapseWhitespace: true // 删除空白符与换行符（压缩html）
        }
    };
    config.entry[item] = `./src/styles/templates/${item}.styl`;
    config.plugins.push(new htmlWebpackPlugin(conf));
});
// config.plugins.push(new htmlWebpackInlineSourcePlugin());

module.exports = config;