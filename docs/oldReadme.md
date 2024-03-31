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

