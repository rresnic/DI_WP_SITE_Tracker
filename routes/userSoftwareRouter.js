const {Router} = require("express");
const router = Router();
const userSoftwareController = require("../controllers/userSoftwareController.js");

router.post("/new", userSoftwareController.addSoftware);
router.post("/newbulk", userSoftwareController.addSoftwareBulk);
router.get("/all", userSoftwareController.getAllUserSoftware)
router.get("/software/:id", userSoftwareController.getUserSoftwareById)
router.get("/:id", userSoftwareController.getUserSoftwareBySite) //TODO move this to the site controller
router.put("/software/:id", userSoftwareController.updateSoftwareId);
router.delete("/software/:id", userSoftwareController.deleteSoftwareId);
module.exports = router;