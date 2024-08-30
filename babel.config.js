const config ={
	presets: [
		'@babel/preset-env', // 适用于现代 JavaScript 的预设
		'@babel/preset-typescript' // TypeScript 预设
	  ],
	  plugins: [
		['@babel/plugin-proposal-decorators', { legacy: true }], // 启用装饰器支持
		'@babel/plugin-proposal-class-properties' // 支持类属性
		//,"transform-commonjs"
		// ,["@babel/plugin-transform-runtime", {
		// 	useESModules: true
		// }]
	  ]
	  //,sourceType: 'module'
	,targets: {
		esmodules: true
		,"browsers": [
            "> 0.25%",
            "not dead"
        ]
	}
}

export default config