const {db} = require("../config/db.js");

module.exports = {
    createSoftware: async (name, type, latest_version, last_update_date, update_notes ="", update_url="") => {
        const trx = await db.transaction();
        try {
            if(type !== "plugin" && type !== "theme"){
                throw new Error("Unsupported type")
            }
            const [software] = await trx("master_software").insert(
                    {
                        name: name.toLowerCase(),
                        type,
                        latest_version,
                        last_update_date,
                        update_notes,
                        update_url,
                    }, 
                    ["name", "ms_id", "type", "latest_version", "last_update_date", "update_notes", "update_url"]
                )
            await trx.commit();
            return software;
        } catch (error) {
            await trx.rollback();
            console.log(error);
            throw(error);
        }
    },
    getSoftwareByID: async (id) => {
       try {
            const [software] = await db("master_software")
                                    .select([
                                        "name",
                                        "type",
                                        "latest_version",
                                        "last_update_date",
                                        "update_notes",
                                        "update_url"
                                    ])
                                    .where({ms_id: id});
            return software;
       } catch (error) {
        console.log(error);
        throw(error)
       } 
    },
    getSoftwareByName: async (name) => {
        try {
             const [software] = await db("master_software")
                                     .select([
                                         "name",
                                         "type",
                                         "latest_version",
                                         "last_update_date",
                                         "update_notes",
                                         "update_url",
                                         "ms_id",
                                     ])
                                     .where({name: name.toLowerCase()});
                    return software;
        } catch (error) {
         console.log(error);
         throw(error);
        } 
     },
     deleteSoftwareById: async (ms_id) => {
        const trx = await db.transaction();
        try {
            const deleted = await trx('master_software').where({ms_id}).del().returning(["ms_id", "name", "type"])
            await trx.commit();
            return deleted;
        } catch (error) {
            await trx.rollback();
            console.log(error);
            throw(error);
        }
     },
     getAllSoftware: async () => {
        try {
             const software = await db("master_software")
                                     .select([
                                         "name",
                                         "type",
                                         "latest_version",
                                         "last_update_date",
                                         "update_notes",
                                         "update_url",
                                         "ms_id"
                                     ])
                        return software;
        } catch (error) {
         console.log(error);
         throw(error);
        } 
     },
}