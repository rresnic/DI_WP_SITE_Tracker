const {db} = require("../config/db.js");
const masterSoftwareModel = require("./masterSoftwareModel");
  
module.exports = {
    addSoftwareToSite: async (name, type, installed_version, installed_version_date, website_id) => {
        const trx = await db.transaction();
        try {
            if(type !== "plugin" && type !== "theme"){
                throw new Error("Unsupported type")
            }
            const existingSoftware = await masterSoftwareModel.getSoftwareByName(name);
            console.log('existing');
            console.log(existingSoftware);
            // Determine ms_id: use the existing software's ID or null
            const software_id = existingSoftware ? existingSoftware.ms_id : null;
            const [software] = await trx("website_software").insert(
                    {
                        website_id,
                        name: name.toLowerCase(),
                        software_id,
                        type,
                        installed_version,
                        installed_version_date,
                    }, 
                    ["name", "software_id", "type", "installed_version", "installed_version_date", "website_id"]
                )
            await trx.commit();
            return software;
        } catch (error) {
            await trx.rollback();
            console.log("error adding software to website", error);
            throw(error)
        }
    },
    getSoftwareByID: async (id) => {
       try {
            const [software] = await db("website_software")
                                    .select([
                                        "name",
                                        "type",
                                        "installed_version",
                                        "installed_version_date",
                                        "website_id"
                                    ])
                                    .where({ws_id: id});
            return software;
       } catch (error) {
        console.log(error);
       } 
    },
    getSoftwareByWebsiteId: async (website_id) => {
        try {
             const software = await db("website_software")
                                     .select([
                                         "name",
                                         "type",
                                         "installed_version",
                                         "installed_version_date",
                                         "software_id",
                                     ])
                                     .where({website_id});
                    return software;
        } catch (error) {
         console.log(error);
        } 
     },
     getAllUserSoftware: async () => {
        try {
             const software = await db("website_software")
                                     .select([
                                         "name",
                                         "type",
                                         "installed_version",
                                         "installed_version_date",
                                         "website_id",
                                         "software_id",
                                     ])
                        return software;
        } catch (error) {
         console.log(error);
        } 
     },
}