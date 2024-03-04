const express = require("express")
const User = require("../Models/user")
const { role } = require("../middleware/role")




const userRouter = express.Router()


userRouter.post("/create", role, async (req, res) => {
    let {
        username,
        firstName,
        lastName,
        age,
        password,
        role
    } = req.body

    let user = User.findOne({ username })
    console.log(user);


    if (user._id) {

        res.status(403).send("This user already exists")

        return;
    }

    try {

        let UserCreate = await User.create({
            username,
            firstName,
            lastName,
            age,
            password,
            role
        })

        if (UserCreate._id) {


            res.status(200).send(UserCreate)

            return;
        }
    } catch (error) {
        res.status(500).send("Internal Server Error")
    }


})

userRouter.get("/get/:id", async (req, res) => {

    let { id } = req.params

    if (!id) {

        res.status(500).send("Id is required")

        return;
    }

    try {

        let user = await User.findById(id, { password: 0, _id: 0, __v: 0 })

        if (!user) {

            res.status(404).send("not found")

            return;
        }

        res.status(200).send(user)
        return;

    } catch (error) {
        res.status(500).send("fail")

        return;
    }
})


module.exports = userRouter