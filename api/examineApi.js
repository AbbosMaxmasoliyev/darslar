const express = require("express")
const Group = require("../Models/group")
const User = require("../Models/user")
const Examine = require("../Models/examine")
const examineRouter = express.Router()



examineRouter.post("/create", async (req, res) => {
    let { mode, date, _teacherId, _groupId } = req.body
    console.log({ mode, date, _teacherId, _groupId })

    if (!mode || !date || !_teacherId || !_groupId) {
        console.log();
        res.status(500).send("all fields required")
    } else {
        let existingExamine = await Examine.findOne({ date, _groupId })
        console.log(existingExamine);

        if (existingExamine?._id) {

            res.status(200).send("Already exists Examine in the group")

        } else {

            let group = await Examine.create(req.body)
            console.log(group)
            if (group._id) {
                res.status(200).send({ msg: "Examine created succesfully" })
            }
        }
    }

})


examineRouter.put("/update/:id", async (req, res) => {
    let examineId = req.params.id
    let body = req.body

    const examine = await Examine.findById(examineId);

    console.log(examine)
    if (!examine) {
        console.log("Examine not found");
        res.status(404).send("Examine not found")
        return;
    }



    try {
        const updatedExamine = await Examine.findByIdAndUpdate(examineId, body, { new: true });
        res.status(200).send({ msg: "Success" })
    } catch (error) {
        console.error('Failed to update examine:', error);
        res.status(500).send({ msg: "Fail" })

    }






})

examineRouter.delete("/examine/:id", async (req, res) => {
    let examineId = req.params.id


    const examine = await Examine.findById(groupId);

    console.log(examine)
    if (!examine) {
        console.log("Examine not found");
        res.status(404).send("Examine not found")
        return;
    }

    let examineDelete = await Examine.findByIdAndDelete(examineId)

    if (!examineDelete) {
        res.status(500).send("Internal server Error")

        return;
    }

    res.status(200).send(examineDelete)




})



examineRouter.get("/one/:id", async (req, res) => {
    let { id } = req.params


    let examine = await Examine.findById(id, { __v: 0, _id: 0 }).populate("_groupId").populate("_teacherId")
    res.status(200).send(examine.toObject())

})



module.exports = examineRouter