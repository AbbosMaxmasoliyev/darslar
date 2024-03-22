const express = require("express")
const Group = require("../Models/group")
const User = require("../Models/user")
const groupRouter = express.Router()

async function checkId(user) {
    let { username } = req.user
    let userCheck = await User.findOne({ username })
    console.log(userCheck);

    return { id: _id, role: role }
}

groupRouter.get("/all", async (req, res) => {
    let { id, role } = await checkId(req.user)

    if (role === "teacher") {
        try {
            let groups = await Group.find({ teacher: id }).populate("teacher", { _id: 0, __v: 0, password: 0, date: 0 })
            console.log(groups);
            if (groups.length) {
                res.status(200).send(groups)
                return
            }
            res.status(404).send("not found")
        } catch (error) {
            res.status(500).send("Server Error")

        }
    } else if (role === "menejer" || role === "adminstrator" || role === "direktor") {
        try {
            let groups = await Group.find()

            if (groups.length) {
                res.status(200).send(groups)
                return
            }
            res.status(404).send("not found")
        } catch (error) {
            res.status(500).send("Server Error")

        }
    } else if (role === "student") {
        try {
            let groups = await Group.find({ _studentsId: { $in: [studentId] } })

            if (groups.length) {
                res.status(200).send(groups)
                return
            }
            res.status(404).send("not found")
        } catch (error) {
            res.status(500).send("Server Error")
            return;
        }
    }
})

groupRouter.post("/create", async (req, res) => {


    let { id, role } = await checkId(req.user)
    if (role == "adminstrator" || role == "direktor" || role == "menejer") {
        let { name, beginDate, finishDate, summa, duration, weekDay, time, room, active } = req.body

        if (!name || !beginDate || !finishDate || !summa || !duration || !weekDay || !time || !room || !active) {
            console.log();
            res.status(500).send("all fields required")
        } else {
            let existingGroupWithName = await Group.findOne({ name })
            console.log(existingGroupWithName);

            if (existingGroupWithName?._id) {

                res.status(200).send("Already exists the group")

            } else {

                let group = await Group.create(req.body)
                console.log(group)
                if (group._id) {
                    res.status(200).send({ msg: "Group created succesfully" })
                }
            }
        }
        return;
    }

    res.status(500).send("Bu Operatsiya uchun huquqingiz yo'q")


})


groupRouter.post("/addTeacher/:id", async (req, res) => {

    let { id, role } = await checkId(req.user)
    if (role == "adminstrator" || role == "direktor" || role == "menejer") {
        let groupId = req.params.id
        let { _teacherId } = req.body

        const user = await User.findById(_teacherId);

        if (!user) {
            res.status(404).send("Teacher not Found")
            return;
        }

        if (user.role === "teacher") {

            const group = await Group.findById(groupId);

            console.log(group)
            if (!group) {
                console.log("Group not found");
                res.status(404).send("group not found")
                return;
            }

            // Studentni groupga qo'shish

            group.teacher = _teacherId;
            await group.save();
            res.status(200).send(`Group:${group.name} teacher is successfully update `)
            console.log("Student added to group successfully");

        } else {
            res.status(409).send("This User is not Teacher")
        }

    }

    res.status(500).send("Bu operatsiya uchun huquqingiz yo'q")




})

groupRouter.put("/studentsUpdate/:id", async (req, res) => {
    let { id, role } = await checkId(req.user)

    if (role == "adminstrator" || role == "direktor" || role == "menejer") {
        let groupId = req.params.id
        let { _userId } = req.body

        const group = await Group.findById(groupId);

        console.log(group)
        if (!group) {
            console.log("Group not found");
            res.status(404).send("group not found")
            return;
        }

        // Studentni groupga qo'shish
        if (!group._studentsId.includes(_userId)) {
            group._studentsId.push(_userId);
            await group.save();
            res.status(200).send(`Group:${group.name} students are successfully update `)
            console.log("Student added to group successfully");
        } else {
            res.status(403).send("This id already exits group")
        }

        return
    }
    res.status(500).send("Bu operatsiya uchun huquqingiz yo'q")


})


groupRouter.delete("/studentIdRemove/:id", async (req, res) => {

    let { id, role } = await checkId(req.user)

    if (role == "adminstrator" || role == "direktor" || role == "menejer") {
        let groupId = req.params.id
        let { _userId } = req.body

        const group = await Group.findById(groupId);

        console.log(group)
        if (!group) {
            console.log("Group not found");
            res.status(404).send("group not found")
            return;
        }

        // Studentni groupga qo'shish
        if (group._studentsId.includes(_userId)) {
            group._studentsId.pull(_userId);
            await group.save();
            res.status(200).send(`Group:${group.name} studentsId is successfully remove `)
        } else {
            res.status(404).send("This id not found group")
        }


    }
    res.status(500).send("Bu operatsiya uchun huquqingiz yo'q")


})




groupRouter.get("/one/:id", async (req, res) => {

    let { id, role } = await checkId(req.user)

    if (role == "adminstrator" || role == "direktor" || role == "menejer") {
        let { id } = req.params


        Group.findById(id).then(response => {
            res.status(200).send(response.toJSON())
        }).catch(err => {
            res.status(400).send("failed")
        })
    }


    res.status(500).send("Bu operatsiya uchun huquqingiz yo'q")


})








module.exports = groupRouter