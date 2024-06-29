### 雙線平行繼承 類型推斷
<2024-06-29T10:32:49.457+08:00,>
```ts
class A{

}

class B extends A{
	id
}


class Parent{
	foo = A
	fn(){
		return new this.foo()
	}
}


class Child extends Parent{
	override foo = B
}

Parent.prototype.fn()

Child.prototype.fn() // 在運行時、Child.prototype.fn()應當返回B的實例、但是typescript卻把它的返回值推斷爲A的實例。怎麼辦?
```


###
<2024-06-10T16:29:47.782+08:00,>
我要寫一個單詞管理系統。數據庫用sqlite。幫我設計一下數據庫的架構。
用法是、用戶在閱讀文章的時候、先把生詞,釋義,註釋等記到文本中。然後用解析器將文本中的單詞及釋義等信息導入數據庫。
一個單詞可以被多次添加。每次添加時 單詞的添加時間日期和釋義,註釋等信息都需要記錄。
需要記錄該單詞所屬的語言(英語,日語 等)。
一個單詞可以被學習多次。每次學習時都有一個學習結果。學習結果有兩種: 記得 與 不記得。單詞被學習的時候也要記錄時間日期。



`Tempus`是記錄時間日期的。我原先的設計大致像這樣:
```ts
class Word{
	/**
	 * 所屬ᵗ表
	 */
	protected _table:string = ''
	;public get table(){return this._table;};

	protected _id?:number
	;public get id(){return this._id;};

	/**
	 * 詞形
	 */
	protected _wordShape:string=''
	;public get wordShape(){return this._wordShape;};

	/**
	 * 變形
	 * 始于2024-01-13T10:48:35.000+08:00
	 */
	protected _variant:string[] = []
	get variant(){return this._variant}

	/**
	 * 意
	 */
	protected _mean:string[] = []
	;public get mean(){return this._mean;};

	/**
	 * 音
	 */
	protected _pronounce:string[] = []
	;public get pronounce(){return this._pronounce;};

	/**
	 * 用戶手動畀單詞加之註、在源txt詞表中用<<>>括着ᵗ部。
	 */
	protected _annotation:string[] = []
	;public get annotation(){return this._annotation;};

	/**
	 * 標籤。用戶ˋ定ᶦ。可潙四六級詞之屬。
	 */
	protected _tag:string[] = []
	;public get tag(){return this._tag;};

	/**
	 * 添之日期
	 */
	protected _dates_add:Tempus[] = []
	;public get dates_add(){return this._dates_add;};

	/**
	 * 添之次
	 */
	;public get times_add(){
		return this.dates_add.length;
	}

	/**
	 * remember
	 */
	protected _dates_rmb:Tempus[]=[]
	get dates_rmb(){return this._dates_rmb;};

	public get times_rmb(){
		return this.dates_rmb.length
	}

	/**
	 * forget
	 */
	protected _dates_fgt:Tempus[] = []
	get dates_fgt(){return this._dates_fgt;};

	get times_fgt(){
		return this.dates_fgt.length
	}

	/**
	 * 添之所從來。可潙書名等。
	 */
	protected _source:string[] = []
	get source(){return this._source;};
}
```
我原先的做法是: 不同語言的單詞存在不同的表。比如英語單詞存在英語表。
需要記錄多個日期時、把日期轉iso8601格式然後用json記到一個格子裏。
比如`["2024-06-10T16:46:55.380Z", "2024-04-10T16:46:55.380Z"]`這樣的。
當需要新添加一個日期的時候就把整個日期json轉數組、給數組新加一個日期、再轉回json寫入數據庫。
但是這樣設計是有不少問題的。比如難以查詢日期。

我原先的做法: 區別單詞是否爲同一個單詞的做法是看單詞的詞形(`wordShape`)是否相同。

現在我有判斷變體和詞族的需求。比如英語`realize`和`realise`可以看作同一個單詞的不同變體、
日語的`思い`,`想い`和`おもい`可以看作同一個單詞的不同變體、
拉丁語不同變格變位的詞也可以歸入同一變體、如`magnus`,`magnum`,`magna`;
英語的`act`,`active`和`actively`可以歸入同一詞族、日語的`思い`和`思う`可以歸入同一詞族。

兩個不同詞形的詞 是否爲變體或詞族 、需要用戶判斷。數據庫中要支持對變體和詞族信息的儲存。


學習單詞時需要對所有單詞計算權重、然有按權重從高到低排序。計算一個單詞權重時需要用到的參數有: 當前的時間,該單詞被加入數據庫的次數和時間,該單詞被記得和忘記的次數及其各自的時間 等。計算過程較複雜、且要用到當前時間作爲參數。所以我不計劃在數據庫中儲存權重而是每次學習時都現代算。如果你有更好的想法也可以提。

數據庫用sqlite。幫我設計一下數據庫的架構。


現在還有單機使用和聯網使用的需求。
聯網使用時支持多用戶。用戶單機學習或添加新詞後、雲端儲存的單詞表和用戶本地的單詞表會出現新舊程度不一致。
需有高效合併的辦法。
服務端使用mysql儲存用戶信息。
需要支持通過用戶查詢到該用戶的單詞管理架構。
用戶可以設置自己的哪些單詞表公開展示。比如用戶A有英語表和日語表、選擇公開英語表。其他用戶可以看到他的英語表的內容。

爲了省事能不能在服務端存單詞表的時候也用sqlite數據庫?
比如用mysql存用戶、分別每個用戶開一個sqlite文件。然後mysql中儲存用戶對該用戶的sqlite文件所在路徑的映射


根據你的需求，我設計了一個SQLite數據庫架構，以下是詳細的數據庫表結構：

### 1. `languages` 表
存儲所有支持的語言。

```sql
CREATE TABLE languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);
```

### 2. `words` 表
存儲單詞的基本信息。

```sql
CREATE TABLE words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_shape TEXT NOT NULL,
    language_id INTEGER,
    FOREIGN KEY (language_id) REFERENCES languages(id)
);
```

### 3. `variants` 表
存儲單詞的變體。

```sql
CREATE TABLE variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    variant TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id)
);
```

### 4. `word_meanings` 表
存儲單詞的釋義。

```sql
CREATE TABLE word_meanings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    meaning TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id)
);
```

### 5. `annotations` 表
存儲用戶對單詞的註釋。

```sql
CREATE TABLE annotations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    annotation TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id)
);
```

### 6. `tags` 表
存儲單詞的標籤。

```sql
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    tag TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id)
);
```

### 7. `sources` 表
存儲單詞的來源信息。

```sql
CREATE TABLE sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    source TEXT NOT NULL,
    FOREIGN KEY (word_id) REFERENCES words(id)
);
```

### 8. `additions` 表
存儲單詞的添加時間。

```sql
CREATE TABLE additions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (word_id) REFERENCES words(id)
);
```

### 9. `studies` 表
存儲單詞的學習記錄。

```sql
CREATE TABLE studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    study_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    result TEXT CHECK(result IN ('remember', 'forget')),
    FOREIGN KEY (word_id) REFERENCES words(id)
);
```

### 10. `families` 表
存儲詞族信息。

```sql
CREATE TABLE families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    family_name TEXT NOT NULL
);
```

### 11. `word_families` 表
將單詞與詞族關聯起來。

```sql
CREATE TABLE word_families (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    family_id INTEGER,
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (family_id) REFERENCES families(id)
);
```

### 12. `word_relations` 表
存儲變體和詞族信息。

```sql
CREATE TABLE word_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER,
    related_word_id INTEGER,
    relation_type TEXT CHECK(relation_type IN ('variant', 'family')),
    FOREIGN KEY (word_id) REFERENCES words(id),
    FOREIGN KEY (related_word_id) REFERENCES words(id)
);

CREATE TABLE change_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name TEXT NOT NULL,
    record_id INTEGER NOT NULL,
    operation TEXT CHECK(operation IN ('INSERT', 'UPDATE', 'DELETE')),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 關鍵點總結
1. 每個單詞存儲在 `words` 表中，包含其詞形和語言。
2. 單詞的變體、釋義、註釋、標籤和來源信息分別存儲在 `variants`、`word_meanings`、`annotations`、`tags` 和 `sources` 表中。
3. 單詞的添加時間存儲在 `additions` 表中。
4. 學習記錄存儲在 `studies` 表中，包括學習日期和結果。
5. 詞族信息存儲在 `families` 和 `word_families` 表中。
6. 單詞之間的關聯（變體和詞族）存儲在 `word_relations` 表中。

這樣的設計可以靈活地擴展和管理單詞信息，並且支持用戶自定義變體和詞族信息。權重計算可以根據上述結構中的數據進行計算，不需要額外存儲在數據庫中。





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
