//weight
// npx webpack --config webpack.config.weight.cjs
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'production'
	,target: 'web',
	bail: false,
	//externals: [nodeExternals()], // removes node_modules from your final bundle
	entry: './out/shared/WordWeight/Schemas/ngaq4/wordWeightMain.js', // make sure this matches the main root of your code 
	output: {
		path: path.join(__dirname, 'bundle'), // this can be any path and directory you want
		filename: 'weight.js',
	},
	optimization: {
		minimize: true, // enabling this reduces file size and readability
		emitOnErrors: true, // 在错误时仍然生成输出文件
		usedExports: true, // 启用 Tree Shaking
		sideEffects: false, // 通常情况下，只有纯函数库或特定功能模块才会将 sideEffects 设置为 false
		// splitChunks: {
		// 	chunks: 'all',
		// },
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
				sideEffects: false
			},
			{
				test: /\.m?js/,
				resolve: {
					fullySpecified: false,
				},
				sideEffects: false
			},
		]
	}
	,devtool: 'source-map',
};