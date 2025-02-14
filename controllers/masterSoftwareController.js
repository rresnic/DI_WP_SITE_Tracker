// const {db} = require("../config/db.js");
const masterSoftwareModel = require("../models/masterSoftwareModel.js");
module.exports = {
    registerSoftware: async (req, res) => {
        const {name, type, latest_version, last_update_date, update_notes, update_url} = req.body;
        try {
            const software = await masterSoftwareModel.createSoftware(name, type, latest_version, last_update_date, update_notes, update_url );
            res.status(201).json({
                message: "Software registered successfully",
                software,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    },
    getAllMasterSoftware: async (req, res)=> {
        try {
            const software = await masterSoftwareModel.getAllSoftware();
            res.status(200).json(software);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
            return;
        }
    },
    deleteSoftwareId: async (req, res) => {
        const {id} = req.params;
        try {
            const deleted = await masterSoftwareModel.deleteSoftwareById(id);
            res.status(202).json(deleted);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
            return;
        }
    },
    updateSoftwareId: async (req, res) => {
        const {id} = req.params;
        const {name, type, latest_version, last_update_date, update_notes, update_url} = req.body;
        try {
            const software = await masterSoftwareModel.updateSoftwareById(id, name, type, latest_version, last_update_date, update_notes, update_url );
            res.status(201).json({
                message: "Software updated successfully",
                software,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            });
        }
    },
    getSoftwareId: async (req, res) => {
        const {id} = req.params;
        try {
            const software = await masterSoftwareModel.getSoftwareByID(id);
            res.status(200).json(software);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
            return;
        }
    }, 
    getSoftwareName: async (req, res)=> {
        const {name} = req.params;
        try {
            const software = await masterSoftwareModel.getSoftwareByName(name);
            res.status(200).json(software);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
            return;
        }
    }, 
} 