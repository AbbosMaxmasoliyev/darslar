const express = require("express")
const Group = require("../Models/group")
const User = require("../Models/user")
const Attendance = require("../Models/attendance")
const attendaceRouter = express.Router()
const moment = require("moment")
const { zeroAdd, attendance } = require("../custom")


attendaceRouter.get("/all", async (req, res) => {

    let attendance = await Attendance.find()
    if (!attendance) {
        res.status(404).send("not found")
    }


    res.status(200).send(attendance)
})

attendaceRouter.post("/create", async (req, res) => {

    let startDate = new Date().getTime()

    let { _groupId, _userId } = req.body



    let attendanceResponse = await Attendance.findOne({ _groupId: _groupId, _studentId: _userId })

    if (attendanceResponse?._id) {
        res.status(500).send("Attendace already exists")
    }


    let group = await Group.findById(_groupId)
    if (!group) {
        res.status(404).send("Group not found")
    }


    let { finishDate, summa, teacher, weekDay } = group
    console.log(weekDay);
    let zeroDate = zeroAdd(startDate)
    console.log(zeroAdd(startDate));
    let { dates, lessonCount, payPerOneLesson } = await attendance(zeroDate, weekDay, summa)


    let daysAttendance = dates.map(value => {
        return {
            date: value,
            attend: false
        }
    })

    console.log(daysAttendance);






    try {

        let attendanceCreate = await Attendance.create({
            finishDate, summa, _teacher: teacher._id, beginDate: startDate, _studentId: _userId, daysAttendance
        })

        if (attendanceCreate._id) {


            res.status(200).send(attendanceCreate)

            return;
        }
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }


})



attendaceRouter.get("/get/:id/spread", async (req, res) => {
    let { id } = req.params


    let attendace = await Attendance.findById(id)
        .populate("_studentId", "user")
        .populate("_teacher", "user")

    if (!attendace?._id) {
        res.status(404).send("This Attendace not found")
    }

    res.status(200).send(attendace)
})

attendaceRouter.post("/addTeacher/:id", async (req, res) => {


})

attendaceRouter.post("/attendance-update", async (req, res) => {
    let { _groupId, _studentId, date, attend } = req.body
    let attendance = await Attendance.findOneAndUpdate(
        { _groupId, _studentId, "daysAttendance.date": date },
        { $set: { "daysAttendance.$.attend": attend } },
        { new: true }
    );
    console.log(attendance);
    res.send("ok")


})


attendaceRouter.delete("/studentIdRemove/:id", async (req, res) => {

})




attendaceRouter.get("/one/:id", async (req, res) => {


})



module.exports = attendaceRouter