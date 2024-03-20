

let days = {
    "Mo": 1,
    "Tu": 2,
    "We": 3,
    "Th": 4,
    "Fr": 5,
    "Sa": 6,
    "Su": 7,
}

async function attendance(dateString, selectedDays, summa) {

    console.log(dateString, selectedDays, summa);

    let monthFilterByDay = {
        "01": "31", "03": "31", "05": "31", "07": "31", "08": "31", "10": "31", "12": "31",
        "04": "30", "06": "30", "09": "30", "11": "30",
        "02": "28"
    }


    let days = {
        "Mo": 1,
        "Tu": 2,
        "We": 3,
        "Th": 4,
        "Fr": 5,
        "Sa": 6,
        "Su": 7,
    }

    console.log(selectedDays);

    let userDays = selectedDays.map(day => days[day])
    console.log(userDays);

    let allDays = []



    let dateArray = dateString.split("-")
    let monthFilterDate = parseInt(monthFilterByDay[dateArray[1]])
    console.log(monthFilterDate);
    let summaryDay = monthFilterDate - dateArray[2]

    for (let index = 0; index < summaryDay; index++) {
        let currentDate = parseInt(dateArray[2]) < 10 ? `0${(parseInt(dateArray[2]) + 1)}` : `${(parseInt(dateArray[2]) + 1)}`

        dateArray[2] = currentDate
        let day = new Date(dateArray.join("-"))
        let currentDay = day.getDay()
        console.log(currentDay, " = ", day);
        if (userDays.includes(currentDay)) {
            allDays.push(new Date(day).getTime())
        }
    }
    allDays.unshift(new Date(dateString).getTime())


    let payPerOneLesson = summa / 13
    let returnData = {
        payPerOneLesson,
        lessonCount: allDays.length,
        dates: allDays
    }
    return returnData
}




const zeroAdd = (date) => {


    let [year, monnth, day] = [new Date(date).getFullYear(), new Date(date).getMonth() + 1, new Date(date).getDate()]
    let txt = [year, monnth, day].map((dateElement) => {
        if (dateElement < 10) {
            return `0${dateElement}`
        } else {
            return `${dateElement}`
        }
    }).join("-")

    return txt




}


module.exports = { attendance, zeroAdd }