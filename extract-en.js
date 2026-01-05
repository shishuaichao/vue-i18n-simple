const extractChinese = require('node-extract-chinese');
const fs = require('fs');
const path = require('path');

// 配置：要扫描的目录、输出文件
const config = {
  srcDir: path.resolve(__dirname, 'src'), // 项目源码目录
  outputFile: path.resolve(__dirname, 'extracted-chinese.json'), // 提取结果输出
  includeExts: ['.vue', '.js', '.ts'], // 要提取的文件类型
  excludeDirs: ['node_modules', 'dist'] // 排除的目录
};

// 递归读取所有目标文件
function readFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !config.excludeDirs.includes(file.name)) {
      readFiles(fullPath, fileList);
    } else if (file.isFile()) {
      const ext = path.extname(fullPath);
      if (config.includeExts.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

// 提取所有文件中的中文并去重
function main() {
  const allFiles = readFiles(config.srcDir);
  const chineseMap = {}; // 键：中文文本，值：所在文件列表

  allFiles.forEach(filePath => {
    // 读取文件内容
    const content = fs.readFileSync(filePath, 'utf8');
    // 提取中文（核心调用node-extract-chinese）
    const chineseTexts = extractChinese(content);
    
    // 去重并记录文件来源
    chineseTexts.forEach(text => {
      text = text.trim();
      if (!text) return; // 过滤空文本
      if (!chineseMap[text]) {
        chineseMap[text] = [];
      }
      if (!chineseMap[text].includes(filePath)) {
        chineseMap[text].push(filePath);
      }
    });
  });

  // 写入文件（格式：{ "中文文本": ["所在文件1", "所在文件2"] }）
  fs.writeFileSync(
    config.outputFile,
    JSON.stringify(chineseMap, null, 2),
    'utf8'
  );

  console.log(`✅ 提取完成！共提取 ${Object.keys(chineseMap).length} 个唯一中文文本`);
  console.log(`📄 结果已保存到：${config.outputFile}`);
}

// 执行提取
main();