const {Router} = require("express");
const router = Router();
const masterSoftwareController = require("../controllers/masterSoftwareController.js");
const { verifyToken } = require("../middlewares/verifyToken.js");
const { checkUserRole } = require("../middlewares/checkUserRole");

router.post("/new", verifyToken, checkUserRole("admin"), masterSoftwareController.registerSoftware);
router.get("/all", masterSoftwareController.getAllMasterSoftware);
router.get("/name/:name", masterSoftwareController.getSoftwareName);
router.get("/:id", masterSoftwareController.getSoftwareId);
router.put("/:id", masterSoftwareController.updateSoftwareId);
router.delete("/:id", masterSoftwareController.deleteSoftwareId);
module.exports = router;