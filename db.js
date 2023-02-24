let mysql = require("mysql");
// sql对应在父函数中写的sql语句
exports.base = (sql, data, callback) => {
  let connection = mysql.createConnection({
    host: "localhost", //表示这个账号只能本地使用，如果要远程登录则为%
    // port:3306,//端口号
    user: "root", //用户名
    password: "141242", //密码
    database: "lowcode_H5", //要打开的数据库
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log("连接成功");
  });
  // 如果不存在，就创建一个数据库，数据库表Login
  connection.query(
    "create table if not exists Login\
     (`username` varchar(255) unique not null,`password` varchar(255) not null,`code` varchar(255) not null);",
    (error, results, fields) => {
      if (error) throw error;
      {
        console.log(error);
      }
      console.log(results);
    }
  );

  // 在数据库中找到对应的数据
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      console.log(error);
    }
    console.log(results);
    callback && callback(results, error);
  });
  connection.end();
};
