const validator = require('validator');
const axios = require('axios');


const validategfgCodingPlatform = async (req) => {
    const { gfgId } = req.body;
    if (gfgId) {
        console.log(gfgId);
        const gfgUrl = `https://geeks-for-geeks-api.vercel.app/${gfgId}`;
        // console.log(gfgUrl);
        try {
            const response = await axios.get(gfgUrl);
            if (response.data && response.data.info && response.data.info.userName === gfgId) {
                console.log("inside if block of gfg validation");
                return true;
            } else {
                throw new Error('Invalid GFG ID 1');
            }
        } catch (error) {
            console.error(error.message);
            throw new Error('Invalid GFG ID 2');
        }
    }
}

const validateCodeForcesCodingPlatform = async (req) => {
    const { codeforcesId } = req.body;
    if (codeforcesId) {
        console.log(codeforcesId);
        const cfUrl = `https://codeforces.com/api/user.info?handles=${codeforcesId}`;
        // const cfUrl2 = `https://codeforces.com/api/user.rating?handle=${codeforcesId}`;
        try {
            const response = await axios.get(cfUrl);
            if (response.status === 200) {
                // const response2 = await axios.get(cfUrl2);
                // const rating = await response2.data.result[response2.data.result.length - 1].newRating;
                // req.body.ratingcf = rating;
                // console.log("inside if block of codeforces validation");
                // console.log(rating);
                return true;
            } else {
                throw new Error('Invalid CodeForces ID 1');
            }
        } catch (error) {
            console.error(error.message);
            throw new Error('Invalid CodeForces ID 1');
        }
    }
}

const validateCodeChefCodingPlatform = async (req) => { 
    const { codechefId } = req.body;
    if (codechefId) {
        console.log(codechefId);
        const ccUrl = `https://www.codechef.com/users/${codechefId}`;
        try {
            const response = await axios.get(ccUrl);
            const html = response.data.toLowerCase();
            if(html.includes(codechefId.toLowerCase())){
                // const ratingMatch = html.match(/<div class="rating-number">(\d+)<\/div>/);
                // if (ratingMatch) {
                //     // req.body.ratingcc = parseInt(ratingMatch[1], 10);
                //     // console.log("CodeChef rating:", req.body.ratingcc);
                // } else {
                //     throw new Error('Unable to extract CodeChef rating');
                // }
                return true;
            }
            else {
                throw new Error('Invalid CodeChef ID 2');
            }
        } catch (error) {
            console.error(error.message);
            throw new Error('Invalid CodeChef ID 1');
        }
    }
}

const checkLeetCodeProfileExists = async (username) => {
  if (!username || typeof username !== 'string') {
    return false;
  }
  const headers = {
    'Content-Type': 'application/json',
    'Referer': `https://leetcode.com/${username}/`,
    'Origin': 'https://leetcode.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  };
  const query = `
    query userProblemsSolved($username: String!) {
      matchedUser(username: $username) {
        username
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      { query, variables: { username } },
      { headers }
    );
    const matchedUser = response?.data?.data?.matchedUser;
    return !!matchedUser;
  } catch (err) {
    console.error('❌ Error checking LeetCode profile:', err.response?.data || err.message);
    return false;
  }
};


const validateLeetCodeCodingPlatform = async (req) => { 
    const { leetcodeId } = req.body;

    const response = await checkLeetCodeProfileExists(leetcodeId);
    
    console.log(response);
    if (response) {
        req.body.problremsCountlc = response.totalSolved;
        req.body.ratinglc = response.rating;
        console.log("inside if block of leetcode validation");
        return true;
    } else {
        throw new Error('Invalid LeetCode ID 1');
    }
    
}




  
module.exports = {
    validategfgCodingPlatform,
    validateCodeForcesCodingPlatform,
    validateCodeChefCodingPlatform,
    validateLeetCodeCodingPlatform
}