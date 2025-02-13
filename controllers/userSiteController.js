const userSiteModel = require("../models/userSiteModel.js");
module.exports = {
    createSite: async (req, res) => {
        const {url} = req.body;
        const userid = req.user.userid;
        try {
            const website = await userSiteModel.createWebsite(userid, url);
            res.status(201).json({
                message: "Website registered successfully",
                website,
            });            
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    },
    getAllSites: async (req, res) => {
        try {
            const sites = await userSiteModel.getAllWebsites();
            res.status(200).json(sites);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    },
    getSitesByUserId: async (req, res) => {
        const {id} = req.params;
        
        try {
            const sites = await userSiteModel.getWebsitesByUserId(id);
            res.status(200).json(sites);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    }
}