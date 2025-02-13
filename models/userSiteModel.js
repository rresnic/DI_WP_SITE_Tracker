const {db} = require("../config/db.js");

module.exports = {
    createWebsite: async (user_id,url) => {
        const trx = await db.transaction();
        try {
            const [website] = await trx("user_websites").insert({
                user_id,
                website_url: url.toLowerCase(),
                last_update_performed: new Date().toISOString(),
            }, ["uw_id", "user_id", "website_url", "last_update_performed"])
            await trx.commit();
            return website;
        } catch (error) {
            await trx.rollback();
            console.log(error);
            throw error;
        }
    },
    getAllWebsites: async () => {
        try {
            const websites = await db("user_websites").select(
                ["uw_id", "user_id", "website_url", "last_update_performed"]
            );
            return websites;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getWebsitesByUserId: async (user_id) => {
        try {
            const websites = await db("user_websites").select(
                ["uw_id", "user_id", "website_url", "last_update_performed"]
            ).where({user_id});
            return websites;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}