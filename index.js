const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");

const serverHandle = (req, res) => {
  // 设置返回格式 JSON
  res.setHeader("Content-type", "application/json");

  // 处理 blog 路由
  const blogData = handleBlogRouter(req, res);
  if (blogData) {
    res.end(JSON.stringify(blogData));
    return;
  }

  // 处理 user 路由
  const userData = handleUserRouter(req, res);
  if (userData) {
    res.end(JSON.stringify(userData));
    return;
  }

  // 未找到路由，返回 404
  res.writeHead(404, { "Content-type": "text/plain" });
  res.write("404 not found\n");
  res.end();
};

module.exports = serverHandle;

// process.env.NODE_ENV
