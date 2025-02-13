const userSoftwareModel = require("../models/userSoftwareModel.js");
module.exports = {
    addSoftware: async (req, res) => {
        const {name, type, installed_version, installed_version_date, website_id} = req.body;
        try {
            const software = await userSoftwareModel.addSoftwareToSite(name, type, installed_version, installed_version_date, website_id);
            res.status(201).json({
                message: "Software registered successfully",
                software,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error"
            })
        }
    },
    addSoftwareBulk: async (req, res) => {
        const softwareArray = req.body; // Expecting an array of software objects in the body
    
        try {
            // Check if the request body is an array
            if (!Array.isArray(softwareArray)) {
                return res.status(400).json({
                    message: "The body should contain an array of software objects"
                });
            }
    
            // Loop through each software object in the array and add them
            const softwarePromises = softwareArray.map(async (software) => {
                const { name, type, installed_version, installed_version_date, website_id } = software;
                return await userSoftwareModel.addSoftwareToSite(name, type, installed_version, installed_version_date, website_id);
            });
    
            // Wait for all insert operations to complete
            const softwareResults = await Promise.all(softwarePromises);
    
            res.status(201).json({
                message: "Software registered successfully in bulk",
                software: softwareResults,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    },
    getAllUserSoftware: async (req, res) => {
        try {
            const software = await userSoftwareModel.getAllUserSoftware();
            res.status(200).json(software);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error"
            })
        }
    },
    getUserSoftwareBySite: async (req, res) => {
        const id = req.params.id;
        try {
            const software = await userSoftwareModel.getSoftwareByWebsiteId(id)
            res.status(200).json(software);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    },
    getUserSoftwareById: async (req, res) => {
        const id = req.params.id;
        try {
            const software = await userSoftwareModel.getSoftwareByID(id)
            res.status(200).json(software);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "internal server error"

            });
        }
    }
}