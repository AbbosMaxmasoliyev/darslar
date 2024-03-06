const mongoose = require("mongoose")
const { Schema } = require("mongoose")


const ExamineSchema = new mongoose.Schema({
    mode: {
        type: String,
        enum: ["test", "practise", "question", "writing", "reading"],
        require: true
    },
    date: {
        type: Number,
        require: true
    },
    _teacherId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    _groupId: {
        type: Schema.Types.ObjectId,
        ref: "Group",
        require: true
    }
})


const Examine = mongoose.model('Examine', ExamineSchema);

module.exports = Examine