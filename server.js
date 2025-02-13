const {db} = require("./config/db.js");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const usersRouter = require("./routes/userRouter.js");
const masterSoftwareRouter = require("./routes/masterSoftwareRouter.js")
const usersSiteRouter = require("./routes/userSiteRouter.js");
const usersSoftwareRouter = require("./routes/userSoftwareRouter.js");
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
app.use("/api/mastersoftware", masterSoftwareRouter);
app.use("/api/sites", usersSiteRouter);
app.use("/api/usersoft", usersSoftwareRouter);

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.static(path.join(__dirname, "/client/dist")));

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

async function test(){
    try {
        const response = await db.raw('select version()');
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
}
// test();