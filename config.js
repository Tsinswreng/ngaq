// @ts-check
//@import {  } from "module";
({

	// 單機
	ngaq: {
		/** 默認用戶 */
		defaultUser: {
			uniqueName: 'ngaq'
			,password: 'ngaq'

			,userDbPath: './db/userDb/ngaq.sqlite' //無效
			//不效
			,wordWeight: {
				schemas: [
					{
						name:'my'
						,path: './src/shared/WordWeight/Schemas/MyWeight.ts'
						,lang: 'ts'
						,params: [
							1
							,2
							,3
						]
					}
				]//~schemas
			}//~wordWeight
			,imgDir:[
				`C:\\Users\\lenovo\\Pictures\\屏保\\nizigenBito`
				,`E:\\_\\視聽\\圖`
				// `C:\\Users\\lenovo\\Pictures\\屏保\\scene`
			]
		}
		//web服務器
		,server:{
			port:6324 //端口
			,dbPath: "./db/server.sqlite" //服務器數據庫
			,jwtKey: "TsinswrengGw'ang"
		}
	} //~ngaq
	,userDb: {
		baseDir: './db/userDb'
		,prefix: 'user-'
		,suffix: '.sqlite'
	}

	//以下內容已廢棄
	,port: 1919
	/** @deprecated */
	,randomImgDir:[
		`C:\\Users\\lenovo\\Pictures\\屏保\\nizigenBito`
		,`D:\\_\\視聽\\圖`
	]
	/** @deprecated */
	,tables:[
		,`english`
		,`japanese`
		// ,`kvvts_ruts_ngrun`
		,`latin`
		,`italian`
		// ,`cet6`
	]
	/** @deprecated */
	,dbPath: `./db/voca.db`
	/** @deprecated */
	,backupDbPath: `./db/vocaBackup.db`
	
	,wordWeight: {
		schemas: [
			{
				name:'my'
				,path: './src/shared/WordWeight/Schemas/MyWeight.ts'
				,lang: 'ts'
				,params: [
					1
					,2
					,3
				]
			}
		]
	}

})