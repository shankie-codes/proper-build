
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
	// {
	// 	test: /\.jsx?$/,
	// 	exclude: /(node_modules|bower_conmponents)/,
	// 	loader: 'babel-loader',
	// 	query: {
	// 	  presets: ['babel-preset-es2015', 'babel-preset-react'],
	// 	  plugins: ['babel-plugin-transform-runtime', 'babel-plugin-transform-decorators-legacy', 'babel-plugin-transform-class-properties'],
	// 	}
	// },
	// {
	// 	test: /\.jsx?$/,
	// 	exclude: /(node_modules|bower_components)/,
	// 	loader: '/build/node_modules/babel-loader/index.js',
	// 	query: {
	// 	  presets: ['/build/node_modules/babel-preset-es2015/lib/index.js', '/build/node_modules/babel-preset-react/index.js'],
	// 	  plugins: ['/build/node_modules/babel-plugin-transform-runtime/lib/index.js', '/build/node_modules/babel-plugin-transform-decorators-legacy/lib/index.js', '/build/node_modules/babel-plugin-transform-class-properties/lib/index.js'],
	// 	}
	// },
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
