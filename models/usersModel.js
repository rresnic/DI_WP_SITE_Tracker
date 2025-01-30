const {db} =require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
    createUser: async (password, email, role="user") => {
        const trx = await db.transaction();
        try {
            const hashPassword = await bcrypt.hash(password+"", 10);
            const [user] = await trx("users").insert(
                    {
                        email: email.toLowerCase(),
                        password: hashPassword,
                        role: role,
                    }, 
                    ["email", "users_id", "role"]
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
            const [user] = await db("users")
                                .select(["email", "password", "role"])
                                .where({email: email.toLowerCase()});
            return user;
        } catch (error) {
            console.log(error);
        }
    },
    getUsers: async() => {
        try {
            const users = await db("users").select("users_id", "email");
            return users;
        } catch (error) {
            throw error;
        }
    },
}
