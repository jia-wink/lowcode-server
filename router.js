// const { Router } = require("express");
const express = require("express");
const router = express.Router();
const services = require("./services");

// 登录功能
router.post("/api/login", services.login);
// 登录功能
router.post("/api/register", services.register);
// 发送验证码功能
router.post("/api/code", services.code);

module.exports = router;
