const express = require("express")
const Group = require("../Models/group")
const User = require("../Models/user")
const Attendance = require("../Models/attendance")
const attendaceRouter = express.Router()
const moment = require("moment")
const { zeroAdd, attendance, checkId } = require("../custom")


attendaceRouter.get("/all", async (req, res) => {

    let { id, role } = await checkId(req.user)

    if (role == "adminstrator" || role == "direktor" || role == "menejer") {
        let attendance = await Attendance.find().populate("_groupId").populate("_studentId", { _id: 0, __v: 0, password: 0, date: 0 })
        if (!attendance) {
            res.status(404).send("not found")
        }


        res.status(200).send(attendance)
    }


    res.status(500).send("Ma'lumotlarini olish uchun huquqingiz yo'q")
})

attendaceRouter.post("/create", async (req, res) => {
    let { id, role } = await checkId(req.user)

    if (role == "adminstrator" || role == "menejer") {
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

    }

    res.status(500).send("Bu Operatsiya uchun huquqingiz yo'q")
})



attendaceRouter.get("/get/:id/spread", async (req, res) => {
    let { id, role } = await checkId(req.user)
    console.log(role);
    if (role == "adminstrator" || role == "menejer") {
        let { id } = req.params


        let attendace = await Attendance.findById(id, { _id: 0, __v: 0 })
            .populate("_studentId")
        console.log(attendace);
        if (!attendace) {
            res.status(404).send("This Attendance not found")
            return
        }

        res.status(200).send(attendace)
        return
    }


    res.status(500).send("Bu Operatsiya uchun huquqingiz yo'q")
})



attendaceRouter.post("/attendance-update", async (req, res) => {

    let { id, role } = await checkId(req.user)

    let { _groupId, _studentId, date, attend } = req.body

    let group = await Group.findById(_groupId).populate("teacher")

    let userID = group.toJSON().teacher._id
    console.log(userID);
    if (role === "teacher" && userID == id.toJSON()) {
        let attendance = await Attendance.findOneAndUpdate(
            { _groupId, _studentId, "daysAttendance.date": date },
            { $set: { "daysAttendance.$.attend": attend } },
            { new: true }
        );
        res.send("ok")

        return
    }
    res.status(500).send("Bu Operatsiya uchun huquqingiz yo'q")
})


attendaceRouter.delete("/studentIdRemove/:id", async (req, res) => {

})




attendaceRouter.get("/one/:id", async (req, res) => {


})



module.exports = attendaceRouter