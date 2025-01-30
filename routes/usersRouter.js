const {Router} = require("express");
const usersController = require("../controllers/usersController.js")
const router = Router();

router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.post("/logout", usersController.logoutUser)

router.get("/all", usersController.getAllUsers);
router.get("/auth", usersController.verifyAuth)

module.exports = router;