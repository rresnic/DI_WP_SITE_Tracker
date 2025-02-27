const { db } = require("../config/db.js");
const masterSoftwareModel = require("./masterSoftwareModel.js");

module.exports = {
    addSoftwareToSite: async (name, slug, type, installed_version, installed_version_date, website_id) => {
        const trx = await db.transaction();
        try {
            if (type !== "plugin" && type !== "theme") {
                throw new Error("Unsupported type");
            }
            const existingSoftware = await masterSoftwareModel.getSoftwareByName(name);
            
            let software_id = null;

            if (existingSoftware) {
                if (existingSoftware.type === type) {
                    software_id = existingSoftware.ms_id;
                } else {
                    throw new Error(`Type mismatch: existing software is of type ${existingSoftware.type}`);
                }
            }

            const [software] = await trx("website_software").insert(
                {
                    website_id,
                    name: name.toLowerCase(),
                    slug,
                    software_id,
                    type,
                    installed_version,
                    installed_version_date,
                },
                ["ws_id", "name", "slug", "software_id", "type", "installed_version", "installed_version_date", "website_id"]
            );

            await trx.commit();
            return software;
        } catch (error) {
            await trx.rollback();
            console.log("error adding software to website", error);
            throw error;
        }
    },

    updateSoftwareId: async (ws_id, name, slug, type, installed_version, installed_version_date, website_id, software_id) => {
        const trx = await db.transaction();
        try {
            if (type !== "plugin" && type !== "theme") {
                throw new Error("Unsupported type");
            }

            if (software_id == null) {
                const existingSoftware = await masterSoftwareModel.getSoftwareByName(name);

                if (existingSoftware) {
                    if (existingSoftware.type === type) {
                        software_id = existingSoftware.ms_id;
                    } else {
                        throw new Error(`Type mismatch: existing software is of type ${existingSoftware.type}`);
                    }
                }
            }

            const [software] = await trx("website_software")
                .update(
                    {
                        website_id,
                        name: name.toLowerCase(),
                        slug,
                        software_id,
                        type,
                        installed_version,
                        installed_version_date,
                    },
                    ["ws_id", "name", "slug", "software_id", "type", "installed_version", "installed_version_date", "website_id"]
                )
                .where({ ws_id });

            await trx.commit();
            return software;
        } catch (error) {
            await trx.rollback();
            console.log("error updating software", error);
            throw error;
        }
    },

    deleteSoftwareById: async (ws_id) => {
        const trx = await db.transaction();
        try {
            const deleted = await trx("website_software").where({ ws_id }).del().returning(["ws_id", "name", "slug", "type"]);
            await trx.commit();
            return deleted;
        } catch (error) {
            await trx.rollback();
            console.log(error);
            throw error;
        }
    },

    getSoftwareByID: async (id) => {
        try {
            const [software] = await db("website_software")
                .select(["ws_id", "name", "slug", "type", "installed_version", "installed_version_date", "website_id"])
                .where({ ws_id: id });
            return software;
        } catch (error) {
            console.log(error);
        }
    },

    getSoftwareByWebsiteId: async (website_id) => {
        try {
            const software = await db("website_software")
                .select(["ws_id", "name", "slug", "type", "installed_version", "installed_version_date", "software_id"])
                .where({ website_id });
            return software;
        } catch (error) {
            console.log(error);
        }
    },

    getAllUserSoftware: async () => {
        try {
            const software = await db("website_software").select([
                "ws_id",
                "name",
                "slug",
                "type",
                "installed_version",
                "installed_version_date",
                "website_id",
                "software_id",
            ]);
            return software;
        } catch (error) {
            console.log(error);
        }
    },
};