//weight
// npx webpack --config webpack.config.weight.cjs
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	//target: 'node',
	bail: false,
	//externals: [nodeExternals()], // removes node_modules from your final bundle
	entry: './out/shared/WordWeight/main.js', // make sure this matches the main root of your code 
	output: {
		path: path.join(__dirname, 'weight'), // this can be any path and directory you want
		filename: 'bundle.js',
	},
	optimization: {
		minimize: false, // enabling this reduces file size and readability
		emitOnErrors: true, // 在错误时仍然生成输出文件
	},
	resolve:{
		alias:{
			"@shared": path.resolve(__dirname, "out/shared/")
		}
		,extensions: ['.ts', '.js'],  // 自动解析这些扩展名
	}
	,module: {
		rules: [
			{
				test: /\.m?js/,
				type: "javascript/auto",
			},
			{
				test: /\.m?js/,
				resolve: {
				  fullySpecified: false,
				},
			},
		]
	}
};