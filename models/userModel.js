const {db} =require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
    createUser: async (password, email, role="user") => {
        const trx = await db.transaction();
        try {
            const hashPassword = await bcrypt.hash(password+"", 10);
            const [user] = await trx("user").insert(
                    {
                        email: email.toLowerCase(),
                        password: hashPassword,
                        role: role,
                    }, 
                    ["email", "user_id", "role"]
                )
            await trx.commit();
            return user;
        } catch (error) {
            await trx.rollback();
            console.log(error);
        }
    },
    getUserByEmail: async (email) => {
        try {
            const [user] = await db("user")
                                .select(["email","user_id", "password", "role"])
                                .where({email: email.toLowerCase()});
            return user;
        } catch (error) {
            console.log(error);
        }
    },
    getuser: async() => {
        try {
            const user = await db("user").select("user_id", "email");
            return user;
        } catch (error) {
            throw error;
        }
    },
}
