const db = require("./db.js");
let mysql = require("mysql");
const nodemailer = require("nodemailer");

exports.start = (req, res) => {};
// 登录注册处理，向外暴露
exports.login = (req, res) => {
  let username = req.body.username;
  let pwd = req.body.password;
  if (username.length === 0 || pwd.length === 0) {
    return res.json({ status: 0, msg: "请输入账号或密码！" });
  }
  // 查询语句
  let sql = "select * from Login where username = ?";
  try {
    db.base(sql, username, (result, error) => {
      if (!result.length) {
        return res.json({ status: 0, msg: "登录失败" });
      } else {
        if (result[0].password == pwd) {
          console.log(result);
          return res.json({ status: 1, msg: "登录成功a" });
        }

        return res.json({ status: 0, msg: "密码错误" });
      }
    });
  } catch (e) {
    console.log("出错啦", e);
  }
};
exports.register = (req, res) => {
  let username = req.body.username;
  let pwd = req.body.password;
  let code = req.body.code;
  // 邮箱发送的验证码状态，验证码是否匹配
  let codetrue = 0;
  // 查询语句
  let sql = "select * from Login where username = ?;";
  // 向表中更改数据
  let sqlpassword = "update Login set password = ? where username = ?";

  db.base(sql, username, (result, error) => {
    // if (!result.length) {
    //   return res.json({ status: 0, msg: "请输入邮箱" });
    // } else {
    if (result[0].code == code) {
      console.log("codetrue:", codetrue);
      console.log("匹配验证码...");
      db.base(sqlpassword, [pwd, username], (result, error) => {
        console.log("成功了", result);
        return res.json({ status: 1, msg: "注册成功a" });
      });
    } else {
      return res.json({ status: 0, msg: "验证码错误" });
    }
    // }
  });
};
exports.code = (req, res) => {
  // 默认验证码就是初始密码
  let email = req.body.username;

  // 产生一个6位的随机数
  let code = Math.floor(Math.random() * 900000) + 100000;
  let pwd = code;
  let transport = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true, //安全发邮件
    port: 465, //IMAP/SMTP服务端口
    auth: {
      user: "1847949884@qq.com", //你的邮箱
      pass: "hegnltxixhzxcije", //在邮箱设置里开启IMAP/SMTP服务后的密码
    },
  });
  //配置相关参数
  let options = {
    from: "1847949884@qq.com", //从哪个邮箱发出
    to: email, //发到哪个邮箱
    subject: "这里是注册的验证码！",
    //这里就是邮件的主题内容，模板字符串``里可以引入js变量，这里引入的是前面生成的验证码。
    html: `<div>
        <h2>${code}</h2>
        </div>`,
  };

  transport.sendMail(options, function (err, msg) {
    if (err) {
      console.log(err);
    } else {
      res.send(msg);
      transport.close;
    }
  });
  console.log("123456");
  let sql1 = "select username from Login where username = ?";
  db.base(sql1, email, (result, error) => {
    console.log("查询是否有这个账号", result);
    if (result[0]) {
      let sql2 = "update Login set code = ? where username = ?";
      try {
        db.base(sql2, [code, email], (result, error) => {
          return;
        });
      } catch (err) {
        console.log("出错了", err);
      }
      return res.json({ status: 0, msg: "这个邮箱已经注册了！继续注册可以修改密码" });
    } else {
      // 把邮箱、密码、验证码全部存入mysql
      let sql = "insert into Login values (?,?,?)";
      try {
        db.base(sql, [email, pwd, code], (result, error) => {
          if (error) {
            console.log("result", result);
            return res.json({ status: 0, msg: error.sqlMessage, code });
          } else {
            return res.json({ status: 1, msg: "发送验证码成了" });
          }
        });
      } catch (err) {
        console.log("出错了", err);
      }
    }
  });
};

exports.test = (req, res) => {
  console.log("进入到后台接口了");
  return res.json({ status: 1, msg: "测试成功！" });
};
