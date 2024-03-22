const express = require("express")
const app = express()
const cors = require("cors")
const fs = require("fs")
const { authMiddleware } = require("./uploads/middleware/authentication")
const User = require("./Models/user")
const Group = require("./Models/group")
const multer = require('multer')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const groupRouter = require("./api/groupApi")
const userRouter = require("./api/userApi")
const examineRouter = require("./api/examineApi")
const attendance = require("./custom")
const moment = require("moment")
const attendaceRouter = require("./api/attendanceApi")


// const uri = "mongodb+srv://abbos007:ddcj4rlKdJgZWWTS@cluster1.rwfz6mv.mongodb.net/?retryWrites=true&w=majority";
const uri = 'mongodb://127.0.0.1:27017'



// MongoDB-ga ulanish
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

// MongoDB-ga ulanish muvaffaqiyatli bo'lsa
db.once('open', () => {
    console.log('MongoDB-ga muvaffaqiyatli ulanildi');
});

// MongoDB-ga ulanishda xatolik bo'lsa
db.on('error', (err) => {
    console.error('MongoDB-ga ulanishda xatolik yuz berdi:', err.message);
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/images")
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

        cb(null, file.fieldname + "_" + uniqueSuffix + ".png")
    }
})



const upload = multer({ storage: storage })

app.post('/profile', authMiddleware, upload.single('avatar'), function (req, res, next) {

    res.send({ msg: "ok" })

})


app.post("/create-avatar", upload.single("imageAvatar"), function (req, res, next) {

    console.log(req.file);

})


const PORT = 3000

let secretKey = "1p08a92tk0"
app.use(cors())
app.use(require("body-parser")({ extended: true }))

function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid User' });
        }
        req.user = decoded;
        next();
    });
}

app.get("/auth", verifyToken, async (req, res) => {

    let { username, password } = req.user
    console.log(req.user);
    res.send(jwt.sign({ username: username, password: password }, secretKey))
})


app.get('/login', async (req, res) => {
    const { username, password } = req.headers;
    // Find user in the mock database
    try {
        const user = await User.findOne({ username });


        if (user) {

            const token = jwt.sign({ username: user.username, date: user.date, password: user.password }, secretKey);
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });

    }

});

app.post('/signup', async (req, res) => {
    const { username, password, beginDate, role } = req.body;
    // Check if the username already exists
    const existingUser = User.find({ username });
    if (existingUser.length) {
        return res.status(409).json({ message: 'Username already exists' });
    }
    // Add new user to the mock database
    let createUser = await User.create({ username, password, beginDate, role });
    console.log(createUser)
    if (createUser._id) {

        res.status(201).json({ message: 'User created successfully' });
    } else {
        res.status(400).json({ message: 'Internal server Error' });

    }
});





app.get('/protected', verifyToken, async (req, res) => {
    let username = req.user.username

    let userInfo = await User.findOne({ username })

    if (userInfo._id) {

        res.status(200).json("success");
    } else {
        res.status(400).send("fail")
    }

});

app.use("/user", userRouter)


app.use("/group", verifyToken, groupRouter)
app.use("/examine", examineRouter)
app.use("/attendance", attendaceRouter)
app.post("/group/calendar-add/:id", async (req, res) => {
    console.log(req.body);
    let id = req.params.id
    let { startDate } = req.body

    let group = await Group.findById(id)
    let { weekDay, summa } = group

    let calendar = await attendance(startDate, weekDay, 50000)
    console.log(calendar.dates)
    group.attendance = await calendar.dates

    group.save().then(response => {
        res.send(response)
    })
})




app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})