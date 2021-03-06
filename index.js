const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const { access } = require("./src/utlis/log");

// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date();
  // 设置 cookie 的过期时间为一天
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

// session 数据
const SESSION_DATA = {};

// 用于处理 post data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== "POST") {
      resolve({});
      return;
    }
    if (req.headers["content-type"] !== "application/json") {
      resolve({});
      return;
    }

    let postData = "";
    req.on("data", (chunk) => {
      postData += chunk.toString();
    });
    req.on("end", () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(JSON.parse(postData));
    });
  });

  return promise;
};

const serverHandle = (req, res) => {
  // 记录 access log
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers["user-agent"]
    } -- ${Date.now()}`
  );

  // 设置返回格式 JSON
  res.setHeader("Content-type", "application/json");

  // 获取 path
  const url = req.url;
  req.path = url.split("?")[0];

  // 解析 query
  req.query = querystring.parse(url.split("?")[1]);

  // 解析 cookie
  req.cookie = {};
  const cookieStr = req.headers.cookie || "";
  cookieStr.split(";").forEach((item) => {
    if (!item) return;
    const arr = item.split("=");
    // trim() 会删除 overwrite cookie 时造成的空格
    const key = arr[0].trim();
    const val = arr[1].trim();
    req.cookie[key] = val;
  });
  // console.log("req.cookie is: ", req.cookie);

  // 解析 session
  let needSetCookie = false;
  let userId = req.cookie.userid;
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
  } else {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
  }
  req.session = SESSION_DATA[userId];

  // 处理 post data
  getPostData(req).then((postData) => {
    req.body = postData;

    // 处理 blog 路由
    // const blogData = handleBlogRouter(req, res);
    // if (blogData) {
    //   res.end(JSON.stringify(blogData));
    //   return;
    // }

    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then((blogData) => {
        if (needSetCookie) {
          // 操作 cookie
          // httpOnly 能使前端无法通过 document.cookie 查询cookie
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(blogData));
        return;
      });
      return;
    }

    // 处理 user 路由
    // const userData = handleUserRouter(req, res);
    // if (userData) {
    //   res.end(JSON.stringify(userData));
    //   return;
    // }
    const userResult = handleUserRouter(req, res);
    if (userResult) {
      userResult.then((userData) => {
        if (needSetCookie) {
          // 操作 cookie
          // httpOnly 能使前端无法通过 document.cookie 查询cookie
          res.setHeader(
            "Set-Cookie",
            `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`
          );
        }
        res.end(JSON.stringify(userData));
      });
      return;
    }

    // 未找到路由，返回 404
    res.writeHead(404, { "Content-type": "text/plain" });
    res.write("404 not found\n");
    res.end();
  });
};

module.exports = serverHandle;

// process.env.NODE_ENV
