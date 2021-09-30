const fs = require("fs");
const path = require("path");
const readline = require("readline");

// 获取文件名
const fileName = path.join(__dirname, "../../logs", "access.log");

// 创建 read stream
const readStream = fs.createReadStream(fileName);

// 创建 readline 对象
const rl = readline.createInterface({
  input: readStream,
});

let chromeNum = 0;
let total = 0;

// 逐行读取
rl.on("line", (lineData) => {
  if (!lineData) {
    return;
  }
  // 记录总行数
  total++;

  const arr = lineData.split(" -- ");
  if (arr[2] && arr[2].indexOf("Chrome") > 0) {
    // 累加 Chrome 的数量
    chromeNum++;
  }
});

// 监听读取完成
rl.on("close", () => {
  console.log("chrome ratio: ", chromeNum / total);
});
