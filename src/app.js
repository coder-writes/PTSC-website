const express = require('express');
const { connectDb } = require('./config/database');
const app = express();
const { Student } = require('./models/students');
const {Leaderboard} = require('./models/leaderboard'); // Ensure this path is correct
const { validategfgCodingPlatform, validateCodeForcesCodingPlatform, validateCodeChefCodingPlatform, validateLeetCodeCodingPlatform } = require('./utils/validation');
const { getGfgData, getLeetcodeData, getCodeChefData, getCodeForcesData } = require('./utils/updateLeaderBoard');
const { calculateStudentScore, weights, fixedMinMax, normalize } = require('./utils/score');
app.use(express.json());



app.post('/leaderboard/add', async (req, res) => {
    try {
        const validationResultgfg = await validategfgCodingPlatform(req);
        const validationResultCodeForces = await validateCodeForcesCodingPlatform(req);
        const validateResultCodeChef = await validateCodeChefCodingPlatform(req);
        const validateResultLeetcode = await validateLeetCodeCodingPlatform(req);
        // const student_info = req.body;

        // console.log(validationResult);
        if (validationResultgfg && validationResultCodeForces && validateResultCodeChef && validateResultLeetcode) {
            console.log("inside if block");
            const student = new Student(req.body);
            await student.save();
            res.status(200).json({
                message: "Student added successfully",
                student: req.body
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error: " + err.message);
    }

});


app.post('/leaderboard/update', async (req, res) => {
    try {
        const students = await Student.find();
        const updateLeaderBoard = [];
        for (const student of students) {
            const ObjectId = student._id;
            // console.log(student.gfgId);
            const problemsCountgfg = await getGfgData(student.gfgId);
            const problemsCountlc = (await getLeetcodeData(student.leetcodeId)).totalSolved;
            const ratinglc = (await getLeetcodeData(student.leetcodeId)).rating;
            const ratingcc = await getCodeChefData(student.codechefId);
            console.log("CodeforceId: " + student.codeforcesId);
            const ratingcf = await getCodeForcesData(student.codeforcesId);

            // if(validationResultgfg && validationResultCodeForces && validateResultCodeChef && validateResultLeetcode){
            console.log("inside if block");
            const studentData = {
                problemsCountgfg: problemsCountgfg,
                ratingcf: ratingcf,
                ratingcc: ratingcc,
                problemsCountlc: problemsCountlc,
                ratinglc: ratinglc,
            };
            // var studentScore = 0;
            const score = await new Promise((resolve, reject) => {
                calculateStudentScore(studentData)
                    .then(resolve)
                    .catch(reject);
            });
            studentData.score = score;
            studentData.studentId = ObjectId;
            console.log("Student Data:", studentData); // Example output: Student Data: { ... }
            const isStudentPresentInLeaderboard = await Leaderboard.updateOne(
                { studentId: ObjectId },
                { $set: studentData },
                { upsert: true, new: true }
            );


            if(isStudentPresentInLeaderboard.upsertedCount > 0){
                console.log("Student data added successfully in the leaderboard");
            } else {
                console.log("Student data updated successfully in the leaderboard");
            }

            updateLeaderBoard.push(studentData);
            // }

        }

        res.status(200).send({
            message: "The leaderboard is updated successfully",
            data: updateLeaderBoard,
        })

    }
    catch (err) {
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
