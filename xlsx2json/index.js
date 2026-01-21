const XLSX = require('xlsx');
const fs = require('fs');

// 1. 读取Excel文件（替换为你的文件路径）
const workbook = XLSX.readFile('./test.xlsx');
// 2. 取第一个工作表
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
// 3. 转成二维数组（方便按列取值）
const arr = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// 4. 核心：第一列做key，第二列做value
const jsonObj = {};
arr.forEach(row => {
  const key = row[0]; // 第一列
  const value = row[1]; // 第二列
  // 过滤空行/空key
  if (key && value) {
    jsonObj[key] = value;
  }
});

// 5. 写入JSON文件
fs.writeFileSync('./test.json', JSON.stringify(jsonObj, null, 2), 'utf8');
console.log('转换完成！生成 test.json');