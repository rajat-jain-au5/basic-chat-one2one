var express = require("express");
var auth = require("../middleware/auth");
var router = express.Router();
const userController = require("../controller/userController");
// const {catchErrors} = require('../handlers/errorHandlers')
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/getall", auth, userController.getAllUsers);
router.get("/getallchat/:id", auth, userController.getAllChats);

router.get("/user", auth, userController.getUser);

module.exports = router;
