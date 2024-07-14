// @ts-check
//@import {  } from "module";
({
	port: 1919
	//待添: 隨機圖之路徑, 數據庫ᵗ路徑
	,randomImgDir:[
		`C:\\Users\\lenovo\\Pictures\\屏保\\nizigenBito`
		,`D:\\_\\視聽\\圖`
	]
	,tables:[
		,`english`
		,`japanese`
		// ,`kvvts_ruts_ngrun`
		,`latin`
		,`italian`
		// ,`cet6`
	]
	,dbPath: `./db/voca.db`
	,backupDbPath: `./db/vocaBackup.db`
	,wordWeight: {
		schemas: [
			{
				name:'my'
				,path: 'D:/_code/voca/src/shared/WordWeight/Schemas/MyWeight.ts'
				,lang: 'ts'
				,params: [
					1
					,2
					,3
				]
			}
		]
	}

	// 單機
	,ngaq: {
		defaultUser: {
			uniqueName: 'ngaq'
			,password: 'ngaq'
			,userDbPath: './db/userDb/ngaq.sqlite'
			,wordWeight: {
				schemas: [
					{
						name:'my'
						,path: 'D:/_code/voca/src/shared/WordWeight/Schemas/MyWeight.ts'
						,lang: 'ts'
						,params: [
							1
							,2
							,3
						]
					}
				]
			}
		}
		,server:{
			port:6324
			,dbPath: "./db/server.sqlite"
			,jwtKey: "TsinswrengGw'ang"
		}
	}
	,userDb: {
		baseDir: './db/userDb'
		,prefix: 'user-'
		,suffix: '.sqlite'
	}
})