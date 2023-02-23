// 创建express服务器
const express = require("express");
const app = express();

// 注册解析表单数据的body-parser
const bodyParser = require("body-parser");

// 路由文件，执行相关操作
const router = require("./router.js");

//设置跨域
app.use("/api/*", function (req, res, next) {
  // 设置请求头为允许跨域
  res.header("Access-Control-Allow-Origin", "*");
  // 设置服务器支持的所有头信息字段
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization, Accept,X-Requested-With"
  );
  // 设置服务器支持的所有跨域请求的方法
  res.header("Access-Control-Allow-Methods", "POST,GET");
  // next()方法表示进入下一个路由
  next();
});

// post
app.use(bodyParser.urlencoded({ extended: false }));
// 处理json格式的参数
app.use(bodyParser.json());
// 配置路由
app.use(router);
// 服务器在本地4000端口运行
app.listen("12580", function (res) {
  console.log("running...");
  console.log(res);
});
