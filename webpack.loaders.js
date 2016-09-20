
module.exports = [
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components)/,
		loaders: [require.resolve('react-hot-loader')]
	},
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components)/,
		loader: require.resolve('babel-loader'),
		query: {
		  presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-react')],
		  // plugins: [require.resolve('babel-plugin-transform-runtime'), require.resolve('babel-plugin-transform-decorators-legacy'), require.resolve('babel-plugin-transform-class-properties')],
		  plugins: [require.resolve('babel-plugin-transform-decorators-legacy'), require.resolve('babel-plugin-transform-class-properties')],
		}
	},
	{ test: require.resolve("jquery"),
		loader: "expose?$!expose?jQuery"
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: "file"
	},
	{
		test: /\.(woff|woff2)$/,
		exclude: /(node_modules|bower_components)/,
		loader: "url?prefix=font/&limit=5000"
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: "url?limit=10000&mimetype=application/octet-stream"
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		loader: "url?limit=10000&mimetype=image/svg+xml"
	},
	{
		test: /\.gif/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/gif"
	},
	{
		test: /\.jpg/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/jpg"
	},
	{
		test: /\.png/,
		exclude: /(node_modules|bower_components)/,
		loader: "url-loader?limit=10000&mimetype=image/png"
	}
];
