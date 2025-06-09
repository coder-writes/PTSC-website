const axios = require('axios');

//graphQL API of the Leetcode
const getLeetCodeUserStats = async (username) => {
  if (!username || typeof username !== 'string') {
    return { valid: false, message: 'Invalid username input' };
  }
  console.log(username);
  const headers = {
    'Content-Type': 'application/json',
    'Referer': `https://leetcode.com/${username}/`,
    'Origin': 'https://leetcode.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  };

  try {
    // ✅ First Query: Submission Stats
    const statsQuery = `
        query userProblemsSolved($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;
    const statsResponse = await axios.post(
      'https://leetcode.com/graphql',
      { query: statsQuery, variables: { username } },
      { headers }
    );

    const matchedUser = statsResponse?.data?.data?.matchedUser;

    if (!matchedUser) {
      return { valid: false, message: 'User not found on LeetCode' };
    }

    const totalSolved = matchedUser.submitStats.acSubmissionNum.find(
      (entry) => entry.difficulty === 'All'
    )?.count || 0;

    // ✅ Second Query: Contest Info
    const contestQuery = `
        query userContestRankingInfo($username: String!) {
          userContestRanking(username: $username) {
            rating
            globalRanking
            attendedContestsCount
          }
        }
      `;

    const contestResponse = await axios.post(
      'https://leetcode.com/graphql',
      { query: contestQuery, variables: { username } },
      { headers }
    );

    const contestInfo = contestResponse?.data?.data?.userContestRanking || {};

    return {
      valid: true,
      username,
      totalSolved,
      rating: contestInfo.rating || 0,
      globalRanking: contestInfo.globalRanking || 0,
      contestsAttended: contestInfo.attendedContestsCount || 0,
    };
  } catch (err) {
    console.error('❌ Error fetching LeetCode stats:', err.response?.data || err.message);
    return { valid: false, message: 'Failed to fetch data from LeetCode' };
  }
};

const getGfgData = async (gfgId) => {
  const gfgUrl = `https://geeks-for-geeks-api.vercel.app/${gfgId}`;
  try {
    const response = await axios.get(gfgUrl);
    if (response.status === 200) {
      // console.log(response.data.info.totalProblemsSolved);
      return response.data.info.totalProblemsSolved;
    } else {
      throw new Error('Invalid GFG ID');
    }
  } catch (error) {
    console.error(error.message);
    throw new Error('Invalid GFG ID');
  }
}

const getLeetcodeData = async (leetcodeId) => {
  try {
    const leetcodeData = await getLeetCodeUserStats(leetcodeId);
    console.log(leetcodeData);
    return leetcodeData;
  } catch (err) {
    console.log(err.message);
    throw new Error("Invalid GFG Id");
  }
}

const getCodeForcesData = async (codeforcesId) => {
  const codeforcesUrl = `https://codeforces.com/api/user.rating?handle=${codeforcesId}`;
  try {
    const response = await axios.get(codeforcesUrl);
    if (response.status === 200) {
      const ratingcf1 = await response.data.result[response.data.result.length - 1].newRating;
      return ratingcf1;
    } else {
      throw new Error('Invalid Codeforces ID');
    }
  } catch (error) {
    console.error(error.message);
    throw new Error('Invalid Codeforces ID');
  }
}

const getCodeChefData = async (codechefId) => {
  if (codechefId) {
    const ccUrl = `https://www.codechef.com/users/${codechefId}`;
    try {
      const response = await axios.get(ccUrl);
      const html = response.data.toLowerCase();
      if (html.includes(codechefId.toLowerCase())) {
        const ratingMatch = html.match(/<div class="rating-number">(\d+)<\/div>/);
        if (ratingMatch && ratingMatch[1]) {
          const ratingcc = parseInt(ratingMatch[1], 10) || 0;
          // console.log(ratingcc);
          return ratingcc;
        } else {
          throw new Error('Unable to extract CodeChef rating');
        }
      }
      else {
        throw new Error('Invalid CodeChef ID 1');
      }
    } catch (error) {
      console.error(error.message);
      throw new Error('Invalid CodeChef ID 2');
    }
  }
}

// getLeetcodeData("Abdul_Saleem");
module.exports = {
  getGfgData,
  getLeetcodeData,
  getCodeForcesData,
  getCodeChefData
};

