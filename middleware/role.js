const User = require("../Models/user");
const jwt = require('jsonwebtoken');

let secretKey = "1p08a92tk0"



let create = {
    menejer: ["student", "teacher", "adminstrator"],
    direktor: ["adminstrator", "menejer"],
    teacher: [],
    adminstrator: ["student"]
}

async function role(req, res, next) {

    const token = req.headers.authorization;
    let bodyRole = req.body.role


    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }
    let reqUser;
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        reqUser = decoded;
        console.log(reqUser);

    });

    let user = await User.findOne({ username: reqUser.username, password: reqUser.password })


    let role = user.role


    let checkingRole = create[role].includes(bodyRole)

    console.log(`${role} rolli user ${bodyRole} rolga ega userni yaratmoqchi va javob: ${checkingRole}`);
    if (!checkingRole) {
        return res.status(403).send("Sen bu Userni yarata olmaysan")
    }

    next()
}




let rate = {
    direktor: ["teacher", "adminstrator", "menejer"],
    adminstrator: [],
    teacher: ["student"],
    menejer: ["teacher"],
    student: ["teacher", "adminstrator"]
}





module.exports = { role }