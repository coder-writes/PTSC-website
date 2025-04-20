const express = require('express');
const {connectDb} = require('./config/database');
const app = express();
const {Student} = require('./models/students');
const {validategfgCodingPlatform,validateCodeForcesCodingPlatform,validateCodeChefCodingPlatform , validateLeetCodeCodingPlatform} = require('./utils/validation');
app.use(express.json());



app.post('/leaderboard/add' , async (req, res) => {
    try{
        const student_info = req.body;
        const validationResultgfg = await validategfgCodingPlatform(req);
        const validationResultCodeForces = await validateCodeForcesCodingPlatform(req);
        const validateResultCodeChef = await validateCodeChefCodingPlatform(req);
        const validateResultLeetcode = await validateLeetCodeCodingPlatform(req);

        // console.log(validationResult);
        if(validationResultgfg && validationResultCodeForces && validateResultCodeChef && validateResultLeetcode){
            console.log("inside if block");
            const student = new Student(student_info);
            await student.save();
            res.status(200).json({
                message: "Student added successfully",
                student: req.body
            });
        }
    }catch(err){
        console.log(err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }
});



connectDb().then(() => {
    console.log("connection to the database is successful");
    app.listen(7777, () => console.log("the Server is running on the port http://localhost:7777"));
}).catch((err) => {
    console.error("Database cannnot be connected: " + err.message);
});
