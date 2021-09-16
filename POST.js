// use postman app to checkout if POST method is working

const http = require("http");
const server = http.createServer((req, res) => {
  if (req.method === "POST") {
    console.log("req content-type: ", req.headers["content-type"]);
    let postData = "";
    // 当接收数据时触发
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    // 当接收结束时触发
    req.on("end", () => {
      console.log("postData: ", postData);
      res.end("hello world");
    });
  }
});

server.listen(8000);
console.log("OK");
