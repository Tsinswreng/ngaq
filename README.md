# ngaq (ŋaʔ)

**Warning: This project has not been done yet. It is still unusable.**

## 開發文檔 dev doc

項目結構:
```
src/	#源碼
	shared/	#共享代碼、內有諸工具函數等
		Common.ts	#最常用的工具
		tools/	#工具
		Ut.ts	#已廢棄
		algo.ts	#已廢棄
	backend/	#後端
	frontend/	#前端
out/	#產出目錄
	shared/	#共享代碼
	backend/	#後端
	frontend/	#前端
		dist/	#vite打包後生成的目錄
			index.html	#前端網頁入口

test/	#jest測試文件
db/	#sqlite數據庫
	userDb/	#用戶sqlite數據庫目錄、每個用戶一個sqlite
	server.sqlite	#服務端sqlite

config.js	#配置文件、由src/backend/Config.ts管理
global.d.ts	#全局類型聲明、中有諸類型別名、如type str=string
tsconfig.json	#最外層ts配置、內配有路徑別名、如 @shared對應<項目根目錄>/src/shared。導包旹 最好用路徑別名、少用相對路徑

```

部署:
```bash

git clone xxx

# 安裝依賴
npm i

# 編譯ts (報錯是正常的)
npm run buildB

#編譯前端 (報錯是正常的)
npm run buildF

#打包 單詞權重算法
npx webpack --config webpack.config.weight.cjs

```

**本項目採用ES模塊化標準。您需要了解ESM和CJS的區別**

直接用`node`命令運行編譯生成的js 或 直接用`ts-node`命令運行ts源文件 可能會報錯。 無法解析路徑別名而找不到模塊。

建議使用`esno`來運行。可考慮全局安裝: `npm install -g esno`

啓動後端服務器: 

```bash
esno app.ts
```

訪問`http://127.0.0.1:6324/ngaq4`

或者啓動前端開發服務器:
```bash
npm run devF
```

## 單詞表 語法

單詞表不允許註釋。蔿方便解釋、此處用//和/* */作註釋
```c
<metadata> //元數據
{
	"belong": "italian" //語言
	,"delimiter": "-/-/-/-/-" //單詞分隔
}
</metadata>

//以下潙一個日期塊。
[2024-07-26T10:39:42.262+08:00] // 日期、寫到中括號裏、格式為ISO 8601。
[[source|歌曲]] //日期塊內所有單詞共有的屬性。
// 語法: [[屬性名|內容]]
// 一個日期塊中可以有0或多個共有屬性、用換行符分隔、如:
/*
[[source|歌曲]]
[[foo|bar]]
*/
{{ // 開始

sempre // 第一行視作單詞的text
always // 從第二行之後的內容都被視作單詞的mean

-/-/-/-/- // 單詞分隔符。必須與metadata中的delimiter相同。
qui
here
[[pronounce|kʷi]] //每個單詞可以有0或多個額外的屬性。

-/-/-/-/-
sapere
to know

}} // 日期塊結束

// 一個文件中可以放多個日期塊。

```

添加時、須把所有文件內容複製粘貼到頁面上的加詞框中再提交。

重複添加旹 會自動過濾已經加過的內容。因此您可以一直在同一個文件中反複添加新詞並多次提交


## config.js 結構

{
	
}