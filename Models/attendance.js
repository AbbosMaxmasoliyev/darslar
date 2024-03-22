const mongoose = require("mongoose")
const { Schema } = require("mongoose")


const AttendanceSchema = new mongoose.Schema({
    _groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        require: true
    },
    beginDate: {
        type: Number
    },
    daysAttendance: [{
        date: {
            type: Number,
        },
        attend: {
            type: Boolean
        }

    }],
    summa: {
        type: Number
    },
    finishDate: {
        type: Number
    },

    _studentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    _teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    
})


const Attendance = mongoose.model('Attendance', AttendanceSchema);

module.exports = Attendance