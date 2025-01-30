const {db} = require("./config/db.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const usersRouter = require("./routes/usersRouter.js");
const {PORT} = process.env;
app.listen(PORT || 5002, ()=>{
    console.log(`running on ${PORT || 5002}`);
})
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    // origin: ['http://localhost:5173']
}))

app.use("/api/users", usersRouter);

async function test(){
    try {
        const response = await db.raw('select version()');
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
}
// test();