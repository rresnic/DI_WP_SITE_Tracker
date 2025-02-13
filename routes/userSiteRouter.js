const {Router} = require("express");
const userSiteController = require("../controllers/userSiteController.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const { checkUserRole } = require("../middlewares/checkUserRole");
const { limitedAccess } = require("../middlewares/limitedAccess.js");
const router = Router();

router.post("/new", verifyToken, userSiteController.createSite);
router.get("/all", verifyToken, checkUserRole("admin"), userSiteController.getAllSites)
router.get("/:id", verifyToken, limitedAccess(), userSiteController.getSitesByUserId)

module.exports = router;