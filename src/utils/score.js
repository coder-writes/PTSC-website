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

  let finalScore = 0;
      for (const metric in weights) {
        const { min, max } = fixedMinMax[metric];
        const value = student[metric] || 0; // Default to 0 if undefined
        const normalized = normalize(value, min, max);
        finalScore += (normalized * (weights[metric] / 100));
      }
    
      return parseFloat(finalScore.toFixed(2)); // Return score rounded to 2 decimal places
    }
  


///smaple Data for the student verfication

  // const studentData = {
  //   problemsCountgfg: 444,
  //   ratingcf: 1122,
  //   ratingcc: 1588,
  //   problemsCountlc: 698,
  //   ratinglc: 1616.8320734108756,
  // };
  // const score = calculateStudentScore(studentData);
  // console.log("Student Score:", score);
  

module.exports = {
  calculateStudentScore,
  fixedMinMax,
  weights,
  normalize
}