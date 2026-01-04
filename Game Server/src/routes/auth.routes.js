const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const hwidCheck = require("../middlewares/hwid.middleware");

router.post("/register", hwidCheck, auth.register);
router.post("/login", hwidCheck, auth.login);

router.post("/register", auth.register);
router.post("/login", auth.login);

module.exports = router;