const usersModel = require("../models/usersModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
    registerUser: async (req, res) => {
        const {password, email} = req.body;
        try {
            const user = await usersModel.createUser(password, email);
            res.status(201).json({
                message: "User registered successfully",
                user,
            });
        } catch (error) {
            console.log(error);
            if(error.code === "23505") {
                res.status(500).json({
                    message: "Email already exists"
                })
            }
            else {
                res.status(500).json({
                    message: "Internal Server Error"
                })
            }
        }
    },
    registerAdmin: async (req, res) => {
        const {password, email} = req.body;
        try {
            const user = await usersModel.createUser(password, email, "admin");
            res.status(201).json({
                message: "Admin registered successfully",
                user,
            });
        } catch (error) {
            console.log(error);
            if(error.code === "23505") {
                res.status(500).json({
                    message: "Email already exists"
                })
            }
            else {
                res.status(500).json({
                    message: "Internal Server Error"
                })
            }
        }
    },
    loginUser: async (req, res) => {
        const {password, email} = req.body;
        try {
            const user = await usersModel.getUserByEmail(email);
            if(!user){
                res.status(404).json({message:"User not found"});
                return;
            }
            const passwordMatch = await bcrypt.compare(password+"", user.password );
            if(!passwordMatch) {
                res.status(404).json({message:"Wrong password"});
                return;
            }
            const {ACCESS_TOKEN_SECRET} = process.env;
            const accessToken = jwt.sign(
                {userid:user.users_id, email:user.email, role: user.role},
                ACCESS_TOKEN_SECRET,
                {expiresIn: "15m"}
            );

            res.cookie("accessToken", accessToken, {
                httpOnly:true,
                maxAge: 15 *60*1000,
                secure:true,
                sameSite:"None",
            });

            res.status(200).json({
                message:"Login successful",
                user: {userid: user.users_id, email:user.email, role:user.role},
                accessToken
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error",
            });
        }
    },
    getAllUsers: async (req, res)=> {
        try {
            const users = await usersModel.getUsers();
            res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal Server Error"
            })
            return;
        }
    },
    logoutUser: async (req, res) => {
        res.clearCookie("accessToken", {httpOnly:true, secure: true, sameSite: "None"});
        req.cookies['accessToken'] = null;
        delete req.cookies['accessToken'];
        // TODO : when we start adding token to db for logging in, remember to unset it here
        res.sendStatus(200);
    },
    verifyAuth: (req, res) => {
        const {userid, email, role} = req.user;
        const {ACCESS_TOKEN_SECRET} = process.env;
        const newAccessToken = jwt.sign(
            {userid, email, role},
            ACCESS_TOKEN_SECRET,
            {expiresIn: "15m"}
        );
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 15*60*1000,
            sameSite: "None"
        });
        res.json({
            message: "refreshed token",
            user: {userid, email, role},
            token: newAccessToken,
        });
    }
}