const {db} = require("../config/db.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

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
    getuser: async(user_id) => {
        try {
            const [user] = await db("user").select("user_id", "email").where({user_id});
            return user;
        } catch (error) {
            throw error;
        }
    },
    generateResetToken: async (email) => {
        try {
            const [user] = await db('user').where({email})
            if (!user) throw new Error("User not found");
            const token = await crypto.randomBytes(32).toString("hex");
            const expiresAfter = new Date(Date.now() + 1000 * 60 * 60 * 24) // Token lasts 24 hours

            await db('password_resets')
                    .where({ email })
                    .del(); 
            
            await db('password_resets').insert({
                email,
                token: token,
                expires_after: expiresAfter
                });

            return {token, expiresAfter};
        } catch (error){
            console.log('error in generateresettoken', error);
            throw error;
        }
    },
    resetPassword: async(email, token, newPassword) => {
        try {
            const [resetRecord] = await db('password_resets').where({email, token})
            if(!resetRecord) throw new Error("Token not found");
            if (new Date(resetRecord.expires_after) < new Date()) {
                throw new Error('Token expired');
            };
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await db('user').where({ email }).update({ password: hashedPassword });

            await db('password_resets').where({ email }).del();

            return { message: 'Password reset successful' };
            
        } catch (error) {
            console.log("Error changing password", error);
            throw error;
        }
    }
}
