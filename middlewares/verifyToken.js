const jwt = require("jsonwebtoken");
require("dotenv").config();

const {ACCESS_TOKEN_SECRET} = process.env;

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies["accessToken"];
    if(!accessToken) {
        res.status(401).json({message: "unauthorized user"});
        return;
    }
    if(accessToken) {
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decode)  => {
            if(err) {
                res.status(401).json({message: "Forbidden"});
                return;
            }
            console.log(decode);
            req.user = decode;
            next();
        })
    }
}
module.exports = {
    verifyToken,
}