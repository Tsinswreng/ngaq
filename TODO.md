## 2023-12-10T13:18:31.000+08:00
- [x] 流中取詞與算權重並行旹 傳debuff㕥潙參
- [ ] 重開旹重排序旹用二分插入、打亂旹用就地打亂

## 2023-12-07T15:36:02.000+08:00
- [ ] 同一語言洏異表、多表混背: 設英語有兩表: 平時由觀書ⁿ積詞者潙A表、六級詞表潙B表。開啓A,B表並背旹, 由A,B表合併得C表。以C表程前端、背ᶦ旹、每得新事件、保存旹A,B,C表皆各自保存新事件。
- [ ] 自定義篩選規則
- [ ] 改voca語法。增日期塊頭、能納訊芝標籤 來源等。
- [ ] @shared/ 自動同步
- [ ] js錯誤處理機制
- [ ] 對不同表設不同權重算法
- [x] 從後端取詞與算權重可並行

## 2023-12-06T23:55:07.000+08:00

- [ ] 前端 設 彈窗組件
- [x] Recite.ts # const neoSw = SingleWord2.intersect(u.fw, gotV.fw) 偶爾報錯 w1.wordShape !== w2.wordShape

## 2023-12-05T00:40:26.000+08:00
- [x] /db下胡無vocaBackup.db
- [ ] 予config.js 增 ts-check
- [ ] 事件循環
- [ ] 日誌

## 2023-12-04T23:19:32.000+08:00
- [ ] 覺 以流代select * 之後 前端點開始 比曩 慢不少
- [ ] 調用堆棧ᵗ訊ˋ泯
``` ts
	public static async copyTableCrossDb(srcDb:Database, srcTable:string, targetDb:Database, neoName=srcTable, batchAmount=8192){
		
		try {
			await Sqlite.copyTableStructureCrossDb(srcDb, srcTable, targetDb, neoName)
			//console.log('modor')
			//return //t
			let stmt_selectAllSafe = await Sqlite.stmt.getStmt_selectAllSafe(srcDb, srcTable)
			//const firstRow = (await Sqlite.getManyRows_transaction(srcDb, srcTable, 1))[0]
			const firstRow = await Sqlite.stmt.get<Object>(stmt_selectAllSafe)
			
			
			const stmt_insert = await Sqlite.getStmt_insertObj(targetDb, neoName, $(firstRow))
			const sql = await Sqlite.sql.genSql_SelectAllIntSafe(srcDb, srcTable)
			//console.log(sql)//t 如sql謬則有調用堆棧
			const stmt_get = await Sqlite.prepare(srcDb, sql)
			// 注意 事務不能嵌套
			// srcDb 和targetDb不是同一個db、不能放在同一個transaction裏
	
			stmt_selectAllSafe = await Sqlite.stmt.getStmt_selectAllSafe(srcDb, srcTable)
			
			for(let i = 0;;i++){
				
				process.stdout.write(`\r${i}`)
				//const rows = await Sqlite.stmtGetRows_transaction(srcDb, stmt_get, batchAmount) //不能用getManyRows、因每次循環旹其內ᵗstmt皆異
				const rows = await Sqlite.stmt.get(stmt_selectAllSafe, batchAmount) //此處抛錯則泯調用堆棧訊
				//await Sqlite.stmtInsertObjs_transaction(targetDb, stmt_insert, neoName, rows) // *
				await Sqlite.stmt.run(stmt_insert, rows)
				if(rows.length !== batchAmount){break}
			}
		} catch (error) {
			//console.log(error)
			throw error
		}

	}
```


## 2023-12-04T16:48:44.000+08:00

- [ ] 重開旹 于未變之詞 不必重算權重
- [ ] 保存成功旹彈窗提示
- [ ] Sqlite.ts 增雙工流 直ᵈ存js對象、不轉json、其中用await stmt.get、前端亦直ᵈ解析原始ᵗ對象。
- [ ] 流中添多個js對象如何分隔


## 2023-12-03T20:31:53.000+08:00

* 寫 getShuffle之就地版本
* compileTs 當ts代碼有錯旹不報錯

## 2023-12-02T10:15:41.000+08:00

- [ ] fetch 後得ᵗ response對象、 調用response.json()旹、 無論 用 try catch await 抑 .then() .catch 皆致 錯誤對象之調用堆棧ᵗ訊ˋ失

* ConfigError
* 把設置頁做成彈窗 不另由路由跳轉
- [x] 自定義權重算法 eval 或 Function


## 2023-11-20T00:24:49.000+08:00

* Sros 返回值判斷是否爲有限數字
* 叫AI測試Sros
* 測試bigNumber溢出
* Sros_big創建數字還是number類型

## 2023-11-19T20:37:21.000+08:00

* 隨機圖片 增 收藏 ˉ功能

## 2023-11-18T17:08:43.000+08:00

* 異步操作 有時抛錯旹 調用堆棧ᵗ訊ᵗ失 之機制ˋ不明確。


## 2023-11-13T11:00:55.000+08:00

非數組之對象類型

## 2023-11-01T15:54:12.000+08:00

randomIntArr 測負數
 randomIntArr(-99999999, 99999999, 99999999, true) 會報錯
