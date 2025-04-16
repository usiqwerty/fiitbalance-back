import { BalanceScales } from "./BalanceScales.js"

document.addEventListener("DOMContentLoaded", async () => {
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const dateParam = params.get("date")

    if (!dateParam) {
        const currentDate = new Date().toISOString().split("T")[0]
        window.location.href = `/weekStat?date=${currentDate}`
        return
    }

    const selectedDate = new Date(dateParam)
    const dayOfWeek = selectedDate.getDay() // 0 = Sunday, 1 = Monday, etc.

    const monday = new Date(selectedDate)
    monday.setDate(selectedDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const mondayFormatted = formatDate(monday)
    const sundayFormatted = formatDate(sunday)

    document.getElementById("week-range").textContent = `${mondayFormatted} - ${sundayFormatted} balance`

    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const weekData = []

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(monday)
        currentDate.setDate(monday.getDate() + i)
        const formattedDate = currentDate.toISOString().split("T")[0]

        try {
            const response = await fetch(`/api/tasks/for_date?date=${formattedDate}`, {
                method: "GET",
                credentials: "include",
            })

            if (!response.ok) {
                throw new Error(`Error loading tasks for ${formattedDate}`)
            }

            const tasks = await response.json()
            weekData.push({
                day: weekDays[i],
                date: formattedDate,
                tasks: tasks,
            })
        } catch (error) {
            console.error("Error:", error)
            weekData.push({
                day: weekDays[i],
                date: formattedDate,
                tasks: [],
            })
        }
    }

    let busiestDay = { day: "", workload: 0 }
    let totalWorkDifficulty = 0
    let totalWorkTasks = 0
    let totalRestDifficulty = 0
    let totalRestTasks = 0
    let allTasks = []

    weekData.forEach((dayData) => {
        const workTasks = dayData.tasks.filter((task) => task.difficulty > 0)
        const restTasks = dayData.tasks.filter((task) => task.difficulty < 0)

        const dayWorkload = workTasks.reduce((sum, task) => sum + task.difficulty, 0)

        if (dayWorkload > busiestDay.workload) {
            busiestDay = { day: dayData.day, workload: dayWorkload }
        }

        totalWorkDifficulty += dayWorkload
        totalWorkTasks += workTasks.length
        totalRestDifficulty += Math.abs(restTasks.reduce((sum, task) => sum + task.difficulty, 0))
        totalRestTasks += restTasks.length

        const dayScaleId = `balance-scales-${dayData.day.toLowerCase()}`
        const dayBalanceScales = new BalanceScales(`#${dayScaleId}`)
        dayBalanceScales.updateBalance(dayData.tasks)

        allTasks = allTasks.concat(dayData.tasks)
    })

    const avgWorkload = totalWorkTasks > 0
        ? (totalWorkDifficulty / totalWorkTasks).toFixed(1)
        : 0
    const avgRest = totalRestTasks > 0
        ? (totalRestDifficulty / totalRestTasks).toFixed(1)
        : 0

    document.getElementById("busiest-day").innerHTML = `<strong>Busiest day:</strong> ${busiestDay.day}`
    document.getElementById("avg-workload").innerHTML = `<strong>Average workload:</strong> ${avgWorkload}/10`
    document.getElementById("avg-rest").innerHTML = `<strong>Average rest level:</strong> ${avgRest}/10`

    const weekBalanceScales = new BalanceScales("#balance-scales-week")
    weekBalanceScales.updateBalance(allTasks)
})

function formatDate(date) {
    const day = date.getDate()
    const month = date.toLocaleString("en-US", { month: "long" })

    let suffix = "th"
    if (day === 1 || day === 21 || day === 31) {
        suffix = "st"
    } else if (day === 2 || day === 22) {
        suffix = "nd"
    } else if (day === 3 || day === 23) {
        suffix = "rd"
    }

    return `${day}${suffix} of ${month}`
}
