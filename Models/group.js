const mongoose = require("mongoose")
const { Schema } = require("mongoose")


const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        require: false,
        default: "anonymous"
    },
    beginDate: {
        type: Number,
        require: true
    },

    summa: {
        type: Number,
        require: true
    },
    duration: {
        type: Number,
        require: true
    },
    finishDate: {
        type: Number,
        require: true
    },
    weekDay: {
        type: [String],
        require: true
    },
    time: {
        type: Number,
        require: true
    },
    room: {
        type: String,
        require: true
    },
    subjectId: {
        require: false,
        type: [String]
    },
    active: {
        type: Boolean,
        require: true
    },
    _studentsId: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    teacher: {

        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attendance: {
        type:[Date],
        
    }
})


const Group = mongoose.model('Group', GroupSchema);

module.exports = Group