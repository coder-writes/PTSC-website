const fixedMinMax = {
  problemsCountlc: { min: 0, max: 3000 },
  ratinglc: { min: 800, max: 2500 },
  ratingcf: { min: 800, max: 2000 },
  ratingcc: { min: 800, max: 2500 },
  problemsCountgfg: { min: 0, max: 3000 },
};
const weights = {
  problemsCountlc: 12.5,
  ratinglc: 12.5,
  ratingcf: 30,
  ratingcc: 30,
  problemsCountgfg: 15,
};
const normalize = async (value, min, max) => {
      const normalized = ((value - min) / (max - min)) * 100;
      return Math.min(Math.max(normalized, 0), 100); 
}

const calculateStudentScore = async (student) => {

  try{

    let finalScore = 0;
    for (const metric in weights) {
      const { min, max } = await fixedMinMax[metric];
      const value = await student[metric] || 0; // Default to 0 if undefined
      const normalized = await normalize(value, min, max);
      finalScore +=  (normalized * (weights[metric] / 100));
    }
    
    return parseFloat(finalScore.toFixed(2)); // Return score rounded to 2 decimal places
  }
  catch(err){
    console.log(err.message);
    throw new Error("Error calculating score: " + err.message);
  }
}
  


// /smaple Data for the student verfication

//   const studentData = {
//     problemsCountgfg: 444,
//     ratingcf: 1122,
//     ratingcc: 1588,
//     problemsCountlc: 698,
//     ratinglc: 1616.8320734108756,
//   };

// calculateStudentScore(studentData).then((score) => {
//     console.log("Student Score:", score); // Example output: Student Score: 85.00
// })
//   .catch((error) => {
//     console.error("Error:", error.message);
//   });

module.exports = {
  calculateStudentScore,
  normalize,
  weights,
  fixedMinMax,
}