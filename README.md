# voca

23.05.27-2247

## 文檔待補充

## 部署方法(未完):

```
# 1. 確保你已安裝了node

# 2. 
git clone https://github.com/Tsinswreng/voca.git

# 3. 安裝依賴
npm i

# 4. 使用vite打包
npm run build

#5. 編譯後端的ts文件
`npm run out`

#6. (待完成)
```


## 記錄

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
