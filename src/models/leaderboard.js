const {mongoose} = require('mongoose');
const {Schema} = mongoose;
const validator = require('validator');

const leaderboardSchema = new Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    problemsCountlc: {
        type: Number,
        required: true,
    },
    ratinglc: {
        type: Number,
        required: true,
    },
    ratingcf: {
        type: Number,
        required: true,
    },
    ratingcc: {
        type: Number,
        required: true,
    },
    problemsCountgfg: {
        type: Number,
        required: true,
    },
    rank:{
        type: Number,
        required: true,
    }
},
{
    timestamps: true
}
);

const Leaderboard = mongoose.model('Leaderboard',leaderboardSchema);

module.exports = {
    Leaderboard
};