const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

// 获取 cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date();
  // 设置 cookie 的过期时间为一天
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return d.toGMTString();
};

const handleUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if (method === "GET" && req.path === "/api/user/login") {
    // const { username, password } = req.body;
    const { username, password } = req.query;
    const result = login(username, password);
    return result.then((data) => {
      if (data.username) {
        // 操作 cookie
        // httpOnly 能使前端无法通过 document.cookie 查询cookie
        res.setHeader(
          "Set-Cookie",
          `username=${
            data.username
          }; path=/; httpOnly; expires=${getCookieExpires()}`
        );

        return new SuccessModel();
      }
      return new ErrorModel("login failed");
    });
  }

  // 登录验证的测试
  if (method === "GET" && req.path === "/api/user/login-test") {
    if (req.cookie.username) {
      return Promise.resolve(
        new SuccessModel({ username: req.cookie.username })
      );
    }
    return Promise.resolve(new ErrorModel("not login yet"));
  }
};

module.exports = handleUserRouter;
