const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const hwidCheck = require("../middlewares/hwid.middleware");

// Register + Login مع فحص HWID
router.post("/register", hwidCheck, auth.register);
router.post("/login", hwidCheck, auth.login);

module.exports = router;