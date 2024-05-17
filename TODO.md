###
<2024-05-16T10:08:32.018+08:00>
svc增接口、褈讀代碼加載權重算法

### 
<2024-03-24T23:24:39.000+08:00,>

我的網頁中有如下代碼:
```html
<button onclick="console.log(parseInt('123'))">test</button>
```
當我點擊按鈕時，控制臺上會輸出 123。當我按F12、在控制臺上輸入

```js
parseInt = null
```
時、再次點擊按鈕就會報錯。
如何避免用戶在控制臺修改js?

如何避免用戶在控制臺修改js 導致前端已有的js代碼工作不正常?
比如網頁中有一個登錄按鈕、點擊時前端會通過new Date().getTime()向後端返回時間。現在用戶按下F12打開控制臺、執行 `Date.prototype.getTime = ()=>114514`、使得每個Date實例每次調用getTime方法時都返回114514

###
<2024-03-24T20:48:00.000+08:00,>
自定義單詞解釋器  語法

###
<2024-03-24T17:01:37.000+08:00,>
一截圖就黑屏、退出截圖後就正常

### 
<2024-03-24T20:11:40.000+08:00,>
- [ ] 用戶表增字段 手机号码 注册时间 最后登录 用户类型 账号状态 个人资料 session token ? 其他信息（Other Information）：根据实际需求可能会包含其他的字段，如用户地址、兴趣爱好等。

###
<2024-03-24T16:36:08.000+08:00,>

模式一 二 三
指定配置文件路径
自ᵈ叶ᵣ算法代碼


定義一個默認算法類
每張詞表定義一個算法實現

設每64個詞一組、允 自訂 每組中 各表ᙆᵗ詞ᵗ比例。如日:英 = 40:24
允 權重初分配 與 再分配
權重變化ᵗ視圖

元數據表 名稱固定 _metadata、禁 用戶詞表 佔用此名
事件響應 分 前與後。如建表前與建表後。建表前 響應事件旹 允 攔截操作。如檢查表名、修改sql等。()

<2024-03-24T20:44:23.000+08:00,>
不允 自定義權重代碼修改依賴
依賴類ˋ用繼承、函數ˋ固不可改、一般對象用深複製。要有Word、Tempus、Sros
基類ˋ組合入具體ᵗ表ᵗ權重ᵗ實現類中。因難繼承。
允 支持導入他表ᵗ權重類、改參數。



##
- [x] 让事件继承? 比如当我emit子事件时、监听父事件的监听器也会响应、但是emit父事件时子事件不会响应<2024-03-22T10:02:15.000+08:00,2024-03-24T16:36:27.000+08:00>
- [x] 享元模式 建sqlite db 連接池?<2024-03-23T00:00:23.000+08:00,2024-03-24T16:36:30.000+08:00>
- [ ] 更新元數據表、清除已無ᵗ表

##
- [ ] 2024-02-24T23:46:56.000+08:00 數據庫連接 用連接池?

## 2024-02-02T00:01:56.000+08:00
- [ ] 關閉ᵣ圖

## 2024-01-30T19:19:15.000+08:00
- [ ] 可調 各表ˋ出詞ᵗ數ᵗ比例/個數

## 2024-01-21T22:48:47.000+08:00
- [ ] 加ᵗ次ˋ大於等於三之詞當大衰洏快恢復、洏非 方背之後權重猶大
- [ ] 加ᵗ次ˋ只有一 之詞ˋ背過後則現ˋ寡

## 2024-01-19T00:34:44.000+08:00
- [ ] 快速篩選times_add

## 2024-01-15T22:25:10.000+08:00
- [ ] 增字段誧例句
- [ ] `nonKanji.dict.yaml`寫轉譯腳本 如 `!男` -> `!nvf`


## 2024-01-07T22:02:53.000+08:00
- [ ] 支持圖片作wordShape或mean

## 2023-12-28T22:02:10.000+08:00
- [ ] 前後端傳數據旹可選 直ᵈ傳二進制 或 json、勿全用json。 單詞對象數組,圖片ᵘ。

## 2023-12-27T23:58:41.000+08:00
- [x] 加ᵗ次ˋ越多、憶ᵗ事件ᵗdebuff越弱

## 2023-12-26T09:56:15.000+08:00

- [ ] 增支持芝vocaRaw中對源詞表語法ᵗ轉義。如轉義後能在日期塊中放大括號, 能放latex公式等, 註釋。

## 2023-12-18T00:04:19.000+08:00
- [ ] 前端ʸ動態ᵈ調 dateWeight參數、如指數與分母
- [ ] 記ˡ事件與忘ˡ事件之dateWeight參數ˋ分別設置

## 2023-12-15T19:37:40.000+08:00
- [ ] 前端增「應用」按鈕㕥使後端重新加載配置
- [ ] npm run buildAll會因報錯而中斷
- [ ] Buile.ts 找不到文件旹 報錯無調用堆棧

## 2023-12-11T22:53:27.000+08:00
- [ ] 便ᵈ動態ᵈ調ᵣ加ˡ事件ᵗ權重
- [ ] 自動定時切圖

## 2023-12-10T20:41:23.000+08:00

- [ ] vigour vigor 看作同一詞、magnuns magnum magna 看作同一詞
- [ ] 用鍵盤觸發單詞事件
- [ ] 單詞分頁

## 2023-12-10T13:18:31.000+08:00
- [x] 流中取詞與算權重並行旹 傳debuff㕥潙參
- [ ] 重開旹重排序旹用二分插入、打亂旹用就地打亂

## 2023-12-07T15:36:02.000+08:00
- [ ] 同一語言洏異表、多表混背: 設英語有兩表: 平時由觀書ⁿ積詞者潙A表、六級詞表潙B表。開啓A,B表並背旹, 由A,B表合併得C表。以C表程前端、背ᶦ旹、每得新事件、保存旹A,B,C表皆各自保存新事件。
- [ ] 自定義篩選規則
- [ ] 改voca語法。增日期塊頭、能納訊芝標籤 來源等。
- [x] @shared/ 自動同步
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
- [x] 日誌

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

- [x] 重開旹 于未變之詞 不必重算權重
- [ ] 保存成功旹彈窗提示
- [ ] Sqlite.ts 增雙工流 直ᵈ存js對象、不轉json、其中用await stmt.get、前端亦直ᵈ解析原始ᵗ對象。
- [ ] 流中添多個js對象如何分隔


## 2023-12-03T20:31:53.000+08:00

- [ ] 寫 getShuffle之就地版本
- [ ] compileTs 當ts代碼有錯旹不報錯

## 2023-12-02T10:15:41.000+08:00

- [ ] fetch 後得ᵗ response對象、 調用response.json()旹、 無論 用 try catch await 抑 .then() .catch 皆致 錯誤對象之調用堆棧ᵗ訊ˋ失

* ConfigError
- [ ] 把設置頁做成彈窗 不另由路由跳轉
- [x] 自定義權重算法 eval 或 Function


## 2023-11-20T00:24:49.000+08:00

- [x] Sros 返回值判斷是否爲有限數字
- [x] 叫AI測試Sros
- [ ] 測試bigNumber溢出
- [x] Sros_big創建數字還是number類型

## 2023-11-19T20:37:21.000+08:00

- [ ] 隨機圖片 增 收藏 ˉ功能

## 2023-11-18T17:08:43.000+08:00

- [x] 異步操作 有時抛錯旹 調用堆棧ᵗ訊ᵗ失 之機制ˋ不明確。


## 2023-11-13T11:00:55.000+08:00

- [ ] 非數組之對象類型

## 2023-11-01T15:54:12.000+08:00

randomIntArr 測負數
 randomIntArr(-99999999, 99999999, 99999999, true) 會報錯
