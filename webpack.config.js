const path = require('path');  // node自带包
const htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	entry:'./browser/VocaB.ts',   // 打包对入口文件，期望打包对文件入口
	output:{
		filename:'VocaB2.js',   // 输出文件名称
		path:path.resolve(__dirname,'browser'),  //获取输出路径
		clean: false //清空編譯ᵗ文件
	},
	mode: 'development',   // 整个mode 可以不要，模式是生产坏境就是压缩好对，这里配置开发坏境方便看生成对代码
	module:{
		rules: [{
			test: /\.tsx?$/,
			use: 'ts-loader', //用ts-loader處理以ts結尾之文件
			exclude: /node_modules/
		}]
	},
	resolve: {
		extensions: ['.ts', 'js']      // 解析对文件格式
	},
	plugins: [
		 new htmlWebpackPlugin(
			  {
				  title: "Webpack App"
				  //template: "xxx.html" 模板
			  }
		 ),
	]
}
