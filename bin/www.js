const http = require("http");

const PORT = 8000;
const serverHandle = require("../index");

const server = http.createServer(serverHandle);

server.listen(8000);
console.log("ok");
