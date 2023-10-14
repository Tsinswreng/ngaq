# voca

2023-05-27T22:47:00.000+08:00

## 簡介|Introduction

此項目是作者個人爲了背單詞而寫的小玩具。

最初本人使用劃詞翻譯軟件瀏覽外文網頁以及啃生肉時、覺得有必要該記一記遇到的生詞、猶其是被重複查詢過的單詞。遂產生了撰寫此玩具的想法。

本玩具與百詞斬之類的背單詞軟件不同、本玩具不提供預設的單詞表。單詞都來源于用戶添加。用戶在閱讀外文時、先按照一定格式把遇到的生詞及解釋添加到純文本裏、然後再使此玩具從純文本解析單詞。背單詞時、程序會篩選出重複添加次數大于兩次的單詞、並且依據單詞的添加日期等信息、計算出單詞的出現權重、㕥實現讓添加次數多的和忘記次數多的單詞優先出現。

本玩具目前完全爲作者自用。很多功能尚未完善。

This project is a personal endeavor by the author, created for the purpose of vocabulary memorization.

Initially, the author used word translation software while browsing foreign language websites and when studying raw texts. They felt it was necessary to record encountered new words, especially those that had been looked up repeatedly. This gave rise to the idea of developing this tool.

Unlike vocabulary memorization software like "Bai Ci Zhan" (a Chinese vocabulary learning app), this tool does not provide a predefined word list. Instead, words are sourced from user input. When users come across unfamiliar words while reading foreign texts, they first add these words and their meanings to a plain text document following a specific format. Then, this tool parses the words from the plain text. When memorizing vocabulary, the program filters out words that have been added more than twice and calculates the weight of each word based on factors like the date it was added. This allows words that have been added more frequently or forgotten more frequently to be prioritized for review.

This toy is currently solely for the author's own use. Many features are not yet fully developed.

## 部署方法

```
# 1. 確保你已安裝了nodejs

# 2. 

git clone https://github.com/Tsinswreng/voca.git

# 3. 安裝依賴
npm i

# 4. 編譯ts 打包前端

npm run buildAll

# 5. 啓動服務器

npm run srv

# 默認在 http://127.0.0.1:1919 。訪問即可。
```


## 記錄

### 2023-10-14T14:34:20.000+08:00 4.8.0

#### feat:
* 隨機ᵈ示ᵈ圖之功能ˇ新增。每點一詞即隨機ᵈ示一圖。需先開開關。
#### refactor:
* `Sqlite.ts`移除ᵣ舊版ᵗtransaction

### 2023-10-10T18:38:11.000+08:00 4.7.2

#### feat:

* `Ut`測時 ᵗ函數; `Sqlite.ts`簡單ᵗ尋

#### refactor:

* `Sqlite.ts`重寫`transaction`;
* `VocaSqlite`改用新transaction

### 2023-10-05T16:20:59.000+08:00 4.7.1

#### feat:

* Sqlite.ts 由對象生成sql語句之函數中 參數類型改潙`obj:object&{length?:never}`、㕥排除數組
* 跨數據庫複製表
* Ut判斷有效數字`$n()`、用于算權重旹
* Ut手動封裝lodashMerge
* 初探用戶登錄

#### fix:

* VocaSqlite 構造器中設數據庫路徑不起效

### 2023-09-30T21:59:41.000+08:00 4.7.0

#### feat:

* 改善˪界面
* 微調出詞算法、 若末ᵗ事件潙添則再乘一次加ˡ權重; 濾詞旹不濾有annotion者

#### fix:

* 除蠹芝重開旹背過ᵗ詞ˋ重背旹不可撤銷

#### chore:

* 移除˪舊版ᵗ 單ᵗ詞ˇ背ᵗ模式



### 2023-09-28T19:14:21.000+08:00 4.6.0

#### feat:

* MultiMode支持重開、無需手動刷新頁面
* 單詞權重排序輕度亂序。每八個詞就有一個詞芝權重亂序者。㕥稍增隨機性。
* WordInfo支持annotation


### 2023-09-26T23:04:35.000+08:00 4.5.2

#### feat:

* Procedures增字段
* 單詞日期權重增寬

### 2023-09-26T15:18:57.000+08:00 4.5.1

#### feat:

* SingleWord2.ts中權重ʸ增設默認權重配置
* 支持前端ʸ改debuffNumerator
* 多詞模式ʸwordInfo增滾動條

#### refactor:

* 從前端新加詞旹先備份表
* VocaSqlite.saveWords()內部改ˣ調用加詞函數洏非直ᵈ用setWordByIds。㕥防單詞ᵗ固有數據在前端被誤刪。
* 改˪諸ᵗ單詞事件ˋ前端ʸ示ᵗ樣式

### 2023-09-25T21:59:53.000+08:00 4.5.0

#### feat:

* 服務器新增/backup路由、支持從前端新建表;
* 每次添詞旹自動備份表;
* 啓用新詞表

#### fix: 

* 修復忘後權重不減反增之蠹;
* Sqlite.ts中匡˪複製表旹id不自增之誤

### 2023-09-24T19:44:38.000+08:00 4.4.0

#### doc:

* 增加了部分文檔

#### feat:

* 前端新增 加詞 和 建表 功能

#### refactor:

* 改善VocaSqlite中的邏輯
* 重構了Sqlite中的transaction
* Tempus中依賴改回momentjs、棄用Dayjs。moment可解析的格式更多。
* 部分重構VocaRaw2

### 2023-09-17T00:12:06.000+08:00 4.3.0

#### feat:

* 多詞模式基本功能已大體實現。

### 2023-09-10T21:52:32.000+08:00 4.2.0

#### feat:

* 始用`fenBangToIPA.ts`。`dkp.dict.yaml`中、于 潙形聲字之同音字、多ᵈ依其義符ⁿ改其聲母。如`旨`與`指`同音、蔿消同音ⁿ降重碼、遂 `dkp.dict.yaml`ʸ `指`ᵗ音ˇ改作 `手iʔ`、然後`fenBangToIPA.ts`有替換芝如`{regex: /手/gm, replacement:'nʰ'},`、遂 卒ʸ`指`之音即成`nʰiʔ`。

#### refactor:

* 前端項目中 組件置于頁面ᵗ子目錄下。公有組件除外。

#### fix:

* `Tempus.ts` 中所得日期多一層雙引號之謬。

### 2023-09-10T00:07:51.000+08:00 4.1.1

#### fix

* 修復`Sqlite.ts`ʸʃˇ導入ᐪᵗ路徑ᵗ問題

### 2023-09-09T23:38:19.000+08:00 4.1.0

#### feat:

* 新建`Tempus.ts`、㕥 統一ᵈ存日期。
* 初ᵈ製˪`WordWindow.vue`, `WordCard.vue`

#### refactor:

* 重構˪日期ˇᵗ存、皆用`Tempus`。
* 重構`Ut.ts`、每 函數ˋ皆獨立ᵈ導出。
* 整ᵗ項目ʸ 擬棄用`moment.js` 洏用`day.js`

### 2023.09.06-23:07:17 4.0.1

#### feat:

* 新增字段`pronounce`、㕥存音ˇ。
* 始製`MultiMode.vue`與`WordCard.vue`、多詞模式也。

### 2023.09.05-22:40:27 4.0.0

#### feat:

* 始製 `WordB.ts`, `Recite.ts`、㕥処前端ʸ背單詞之理則。


#### refactor:

重構了項目結構。
* 重新分離ts與js。ts在`/src`、js在`/out`。內部ʸ目錄ᵗ結構層次ˋ同。運行旹、㕥moduleAlias処js ᵗ路徑別名、使ᶦ與tsconfig同但指向out/ 。
* `backend`中取消`src`子目錄。
* 今尚未能叶 前後端共享自撰ᵗ模塊、各設shared文件夾、欲共享ᵗ模塊ˇ`backend/shared` ᙆ `frontend/shared` ʰ複製、姑㕥代ᶦ。




### 2023.09.02-21:28:32 3.11.0

#### feat:

* 新建`User.ts`, `UserMysql.ts`
* 加詞後能返ᵣ變˪ᵗ諸id

#### refactor:

* 改˪日期格式 從`20230902213215000`至`2023.09.02-21:32:20.000`。緣 前者ˋ逾`Number.MAX_SAFE_INTEGER`。
* 重構˪`VocaRaw.ts`。処txt源詞表ᵗ部ˋ皆改用成員方法。


### 20230831191926 3.10.0

#### feat:

* `VocaMysql.ts`、㕥治mysqlᵗ詞表。現已成功能芝舊mysql詞表導出潙sqlite詞表。

### 20230830231029 3.9.0

#### feat:

* `dkz`中`/ij/`一律取消`/-j/`韻尾、慮及只有`/ij/`洏無`/uw/`。
* 新增`SingleWord2.ts`, `VocaRaw2.ts`, `VocaSqlite.ts`, `config.ts`、係原 背單詞ˉ項目ᵗ版芝誧Sqlite。現已完成解析txt詞表及數據庫ʰ添詞之邏輯。


### 20230816212435 3.8.0

#### feat:

* 蔿dks生成倉頡輔助碼

#### refactor:

* `Dict.ts`中部分靜態方法移到了`shared/db/Sqlite.ts`
* 取消 `DictType.ts`、統一用`Type.ts`來放接口。
* 調整了從中古音映射上古音的正則表達式。


### 20230813233429 3.7.0

### feat:

* `Dict.ts`新增音系分析等相關API
* `Util.ts` 新增若干方法
* `saffesToOcRegex.ts` , `ocToOc3.ts` 正則表達式替換對
* `dks.ts` 自動化構建碼表

### 20230807003712 3.6.3

#### feat:

* saffes 轉上古音 正則表達式
* 查找最小對立對
* Util

### 20230803233247 3.6.2

#### refactor:

* `SerialRegExp.ts` 併入 `Util.ts`

#### feat:

* 推進`Dict.ts`、寫了 處理msoeg上古擬音的邏輯。

### 20230802233229 3.6.1

* 推進 `Bsoc.ts`

### 20230801223618 3.6.0

#### feat: 

* `Bsoc.ts`、用于處理白一平-沙加爾 上古擬音、現已完成音節拆分部分
* `Util.ts`新增了若干方法

#### refactor: 

* 改進了連續正則替換的模塊、更名爲`SerialRegExp.ts`


### 20230731232507 3.5.1

* 着手分析並設計上古三拼方案

### 20230730232558 3.5.0

#### feat:

* Dict.ts中重碼分析基本功能已實現、能夠計算字表的加頻重碼率

### 20230729215349 3.4.6

### 20230728220846 3.4.5

### 20230727220047 3.4.4

### 20230725203959 3.4.3

#### chore:

* `DictRaw.ts` 更名爲 `Dict.ts`

#### feat:

* 公共工具中新增了若干方法、優化了部分原有方法。
* `Dict.ts`新加入了部分 與sqlite數據庫交互的代碼(未完成)

### 20230717180454 3.4.2

#### chore:

* 取消了單獨的`outDir`、編譯生成的js與ts又改回在同一目錄下。
* 路徑別名改在`package.json`裏配置。配合第一點、則無論用`ts-node`運行ts還是用`node`運行js文件都可正確解析路徑別名。

(目前後端部分並未使用任何打包工具、只是編譯成js直接跑。讓編譯生成的js文件和ts文件在同一目錄下也方便多線程往`Worker()`傳入js文件路徑作爲參數。)

### 20230715231819 3.4.1

#### fix:

* 修復了路徑別名不起效的問題。

### 20230715215153 3.4.0

#### feat:

* `Txt`類中新增了若干靜態方法
* 優化了`Util`類中數組越界檢查的錯誤提示
* 推進了`Dict`

#### fix:

* `VocaB.ts`中 `if(out <= 1)`處、把`out`變量 重命名爲`result`了。用`out`作變量名則在idea中`<=`號會誤報。

#### chore:

* 更改了`tsconfig.json`、使編譯後生成的js文件在`./out`下、而非與ts源碼混在一起。
* 新配置了若干目錄別名

### 20230712222858 3.3.1

#### feat:

* Util新增pathAt方法
* 實現了小部分在sqlite中新增字表的邏輯

### 20230712084918 3.3.0

#### chore:

* 更改了項目結構。前端代碼在`src/frontend`、後端代碼在`src/backend`、`src/shared`用于放置共用的工具。
* 更改了.gitignore

### 20230709223858 3.2.0

#### feat:

* 新建目錄 `my_modules` 、用來放一些靜態方法、目前內有Txt類、Util類。Txt類用于處理純文本、Util則是不便歸類的工具。內的arrAt()用于訪問數組、數組越界時則拋出錯誤。

#### chore:

* 移除了`dist`

### 20230703114439 3.1.1

#### chore:

* 更改了編譯後生成的文件的位置。直接生成在與源文件相同的目錄下。
* 更改了.gitingore、不提交backend/下的所有js文件。

### 20230702191959 3.1.0

#### refactor:

* 項目根目錄 改用 通過第三方模塊 來獲取

#### docs:

* 新增了部分與部署相關的文檔

#### chore:

* 新增命令別名 `npm run out` 、該命令會編譯後端部分的ts文件並在backend-out生成
* 更改了.gitignore
* 移除了不必要的文件

### 20230702102917 3.0.0

#### feat:

* 原 舊版背單詞 頁面 被遷移到了vue中。原生版不再維護。

### 20230630234445 2.9.0

#### feat:

* 前端:
  - 新增路由與登錄頁面(未完善)
  - 主頁中新增了少量內容

* 後端:
  - 調整了路由

#### chore:

* 刪除了一些不必要的文件

#### 

### 20230628210724 2.8.0

#### feat:

* 主頁中新增了左側邊欄

#### docs:

* 新增bug.md

### 20230627221032 2.7.0

#### refactor:

* 移除了一些無關的文件

#### feat:

* 在項目根目錄中新增Root.ts、用來給項目文件夾的各級子目錄中的源文件提供項目根目錄的絕對路徑。棄用了2.6.2版本的`path.resolve(process.cwd())`

#### fix:

* 在添加單詞的部分修復了重大漏洞:
* VocaRaw中新增了幾個函數、用于臨時ᵈ 表ᵗ去重

最初、檢驗一個單詞是否 數據庫ʰ 已被添加過 時、用的sql是 

``` ts
	const qrySql = `SELECT *FROM ${this._tableName} WHERE wordShape = ?`
```

在這種情況下、`傾ける`和`傾げる`被視作相等。當時尚不知`BINARY`、遂改用

``` ts
let escaped = lodash.escapeRegExp(currentWordShape)
escaped = escaped.replace(/\\/g, '\\\\'); //把每個反斜槓都轉成兩個反斜槓
const qrySql = `SELECT *FROM ${this._tableName} WHERE wordShape REGEXP '^${escaped}$'`
```

能解決`傾ける`和`傾げる`不分的情況、並且長時間以來未發現問題。

但昨日把新單詞從txt中加進數據庫時發現有些單詞會被重複添加、佔據多行。究其故、發現`SELECT *FROM eng WHERE wordShape REGEXP '^exposé$'` 竟然匹配不到數據庫中已有的`exposé`一詞、導致該詞被複添並佔據多行。另外又發現這樣的sql語句默認不區別大小寫、導致`stem`和`STEM`被視作同一詞而合併。後又發現類似的諸問題在日語單詞表中更嚴重、複添者竟達數百個。

卒用

``` ts
	const qrySql = `SELECT *FROM ${this._tableName} WHERE wordShape = ?`
```

### 20230626101836 2.6.2

* 修複了讀單詞時路徑不正確的問題

### 20230625213816 2.6.1

* 補上了漏導的包

### 20230625162138 2.6.0

* 更改了項目結構、前後端源碼分離。

### 20230623231409 2.5.3

* 刪除了不必要的編譯生成的js文件
* 項目中新增文件夾src/views、日後將用vue重構

### 20230621212954 2.5.2

* 上一個版本不小心多註釋了兩條語句、導致按下按鈕後新日期未被錄入。現已修複。
* 取消了對初權重的臨時篩選
* 修改了debuff輸入框中的數字默認值。


### 20230621194614 2.5.1

* 新建Filter類、擬用于過濾單詞。
* defaultAddWeight默認值改爲200
* 優化了calcPrio0()方法、修複了少量bug、產生新事件後能計算新權重。
* 在項目文件中新建了一個word文檔

新bug:

![Alt text](./img/20230621195831.png)
![Alt text](./img/20230621195842.png)
![Alt text](./img/20230621195848.png)

我希望在點擊按鈕時在控制檯輸出單詞變化後的權重
不用調試模式時、開始複習單詞後點擊「記得」按鈕即發生此bug。

### 20230617220035 2.5.0

* 新增 類 DeemAsRemembered, PriorityConfig、將用來處理權重配置。
* Priority 類 中、重構了計算權重的函數、更名爲calcPrio0。將來版本中、當單詞獲得了新事件後能以此追加地計算新權重。

### 20230615231047 2.4.0

* 試用Promise修改了部分VocaRaw代碼、備份表格結束後能輸出結果。
* 改進了權重算法。
  - 更加了添加事件的權重計算規則、防止由連續重複添加事件產生過大的權重。
  - 日期權重的算法改用平方根而不用對數。
* 新增過濾功能。當一個單詞只有一個單詞事件 或 其權重低於設定值時、此單詞不會進入待復習的單詞列表中。
* 優化了生成隨機數組的方法。

### 20230613130851 2.3.0

* 支持用戶在右邊的輸入框中自定義debuffNumerator。默認值爲3600。
* 兩個輸入框(畀權重的隨機加成最大值max_randomBonus, debuffNumerator) 支持輸入js表達式。 例如可輸入3600*2 代替7200
* 注意: 只有當一個單詞的最後一個事件爲「憶」時纔能獲得debuff。

### 20230612212155 2.2.0

* 支持用戶自定義單詞權重隨機加成的範圍的最大值。在 界面中 開始按鈕旁的輸入框輸入最大值後再按開始按鈕即可生效。
* 只有一個單詞事件的單詞 將不會被復習到。

### 20230611164116 2.1.0

* 新增main.ts 用于存放全局變量等
* 新增Ui.ts 負責界面交互。原有之負責界面之函數被從VocaB中抽離。
* 調整了debuff之算法。詳見VocaB.ts中public getDebuff(durationOfLastRmbEventToNow)
