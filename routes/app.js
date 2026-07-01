const express = require("express");
const routes = express.Router();
const bulkdata = require("./sampledata"); 
const pool = require("../modules/db")

routes.post("/data", async(req, res)=>{
      const {rank} = req.body;
      const data = [
          ["C639", "College 1", 0, 9443, 12142, 6523, 6361, 10280, 6108, 0, 15105],
          ["C640", "College 2", 100, 5000, 8000, 7000, 6000, 9000, 5500, 200, 10000],
          ["C641", "College 3", 300, 6000, 9000, 7500, 6500, 9500, 5800, 400, 11000]
     ];
      try{
         if(!rank){
             return res.json({
                 message: "Rank is required..."
             })
         }
         const values = [];
         const placeholders = [];
         
         bulkdata.forEach((row, rowindex)=>{
               const start = rowindex * 11;
               placeholders.push(
                    `($${start+1},$${start+2},$${start+3},$${start+4},$${start+5},$${start+6},$${start+7},$${start+8},$${start+9},$${start+10},$${start+11})`
               );

             values.push(
                    row.college_code,
                    row.college_name,
                    row.cutoffs["oneg"],
                    row.cutoffs["twoag"],
                    row.cutoffs["twobg"],
                    row.cutoffs["threeag"],
                    row.cutoffs["threebg"],
                    row.cutoffs["GM"],
                    row.cutoffs["NKN"],
                    row.cutoffs["SCG"],
                    row.cutoffs["STG"]
                    );

          });
         
         const queryText = `
            INSERT INTO mca 
            (college_code, college_name, oneg, twoag, twobg, threeag, threebg, gm, nkn, scg, stg) 
            VALUES ${placeholders.join(',')} RETURNING *
        `;
         const result = await pool.query(queryText, values)
         return res.json({
              success: true,
              data: values
         })
      }catch(err){
          return res.status(502).json({
               success: false,
               message: err.message
          })
      }
});

module.exports = routes;