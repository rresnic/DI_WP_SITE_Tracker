const {Router} = require("express");
const router = Router();
const userSoftwareController = require("../controllers/userSoftwareController.js");

router.post("/new", userSoftwareController.addSoftware);
router.post("/newbulk", userSoftwareController.addSoftwareBulk);
router.get("/all", userSoftwareController.getAllUserSoftware)
router.get("/software/:id", userSoftwareController.getUserSoftwareById)
router.get("/:id", userSoftwareController.getUserSoftwareBySite)


module.exports = router;