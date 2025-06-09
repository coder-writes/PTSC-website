const mongoose = require("mongoose");
const {Schema} = mongoose;
const validator = require('validator');

const studentSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        maxlenght: 50,
        match: [/^[a-zA-Z\s'-.]+$/, 'Please enter a valid full name'],
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        maxlenght: 50,
        match: [/^[a-zA-Z\s'-.]+$/, 'Please enter a valid full name'],
        trim: true
    },
    branch: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxLength: 10,
        validate(value){
            if(!validator.isMobilePhone(value)){
                throw new Error("Invalid Phone Number: " + value);
            }
        }

    },
    email: {
        type: String,
         required: true, 
         trim: true,
         unique: true,
         index: true,
         validate(value){
             value = validator.normalizeEmail(value);
             if(!validator.isEmail(value)){
                 throw new Error("Invalid Email Address: " + value);
                }
         }

    },
    rollNo: {
        type: Number,
        required: true,
        unique: true,
    },
    leetcodeId: {
        type: String,
        required: true,
        unique: true,
    },
    codechefId: {
        type: String,
        required: true,
        unique: true,
    },
    codeforcesId: {
        type: String,
        required: true,
        unique: true,
    },

    gfgId:{
        type: String,
        required: true,
        unique: true,
    } 
},
{
    timestamps: true
}
)


const Student = mongoose.model('Student',studentSchema);

module.exports = {
    Student
}