const { checkLogin } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");

const handleUserRouter = (req, res) => {
  const method = req.method;

  // 登录
  if (method === "POST" && req.path === "/api/user/login") {
    const { username, password } = req.body;
    const result = checkLogin(username, password);
    if (result) {
      return new SuccessModel();
    }
    return new ErrorModel("login failed");
  }
};

module.exports = handleUserRouter;
