
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

export function convertJavaFilesToUtf8(folderPath) {
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // 递归处理子文件夹
      convertJavaFilesToUtf8(filePath);
    } else if (path.extname(file) === '.java') {
      // 如果是.java文件，进行编码转换
      const data = fs.readFileSync(filePath);
      const utf8Data = iconv.decode(data, 'gbk'); // 使用相应的源编码进行解码
      fs.writeFileSync(filePath, utf8Data, 'utf-8'); // 写回文件，使用utf-8编码
      console.log(`Converted: ${filePath}`);
    }
  });
}

// 用法示例
const folderPath = "D:\\_\\mmf\\PROGRAM\\java\\PRJ_BU2_JAVA_002"
convertJavaFilesToUtf8(folderPath);




