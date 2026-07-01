require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT;
const pool = require("./modules/db");

async function queryDatabase(){
    try {
        const res = await pool.query('SELECT NOW()');
        console.log(res.rows[0]);
    } catch (error) {
        console.log(error);
    }
}

queryDatabase();

app.use(cors());
app.use(express.json());
app.use("/pgcet", require("./routes/app"));

app.get("/testing", (req, res)=>{
       return res.json({
           message: "working........"
       });
});

app.listen(PORT, ()=>{
    console.log("Server is running........", PORT)
})