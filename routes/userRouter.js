const {Router} = require("express");
const usersController = require("../controllers/userController.js")
const {verifyToken} = require("../middlewares/verifyToken.js");
const { checkUserRole } = require("../middlewares/checkUserRole.js");
const router = Router();

router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.post("/logout", usersController.logoutUser)

router.get("/all", verifyToken, checkUserRole("admin"), usersController.getAllUsers);
router.get("/auth", verifyToken, usersController.verifyAuth)
router.get("/byEmail/:email", usersController.getUserEmail)
router.post("/reset-password", usersController.generateReset)
router.post("/confirm-reset", usersController.resetPassword)

module.exports = router;