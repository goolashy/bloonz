const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const randomX = (blnSize) => Math.random() * (canvas.width - 2 * blnSize) + blnSize
const randomY = (blnSize) => Math.random() * (canvas.height - 2 * blnSize) + blnSize
const scoreEl = document.querySelector("#scoreEl")
const timerEl = document.querySelector("#timerEl")
const startEl = document.querySelector("#startBtn")
let bloonz = []
let blnSize = window.innerHeight * 0.075
let color = "rgb(255,179,186)"
let animationId = null
let score = 0
let timer = 5
let intervalTimer = null
let counterSize = window.innerHeight * 0.3
let onTheRun = false

const init = () => {
    canvas.width = window.innerHeight
    canvas.height = window.innerHeight
    blnSize = window.innerHeight * 0.05
    counterSize = window.innerHeight * 0.3
    onTheRun = false
    score = 0
    scoreEl.innerHTML = score
    timer = 5
    timerEl.innerHTML = timer
    bloonz = []
}

const resizeCanvas = () => {
    cancelAnimationFrame(animationId)
    init()
    clear()
    stopTimer()
}

addEventListener("resize", resizeCanvas, false)

class Balloon {
    constructor() {
        this.blnSize = blnSize
        this.x = randomX(blnSize)
        this.y = randomY(blnSize)
        this.color = color
        this.clicked = false
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.blnSize, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.strokeStyle = "black"
        ctx.stroke()
    }
}

const addBalloon = () => {
    const bln = new Balloon()
    bloonz.push(bln)
    if (bloonz.length > 1) {
        bloonz.forEach((balloon) => collisionCheck(balloon, bln))
    }
    removeBalloon(bloonz)
    redraw()
}

const clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
const redraw = () => {
    clear()
    bloonz.forEach((balloon) => balloon.draw())
}

canvas.addEventListener("click", function (event) {
    let x = event.offsetX,
        y = event.offsetY
    bloonz.forEach((balloon) => {
        if (
            x < balloon.x + balloon.blnSize &&
            x > balloon.x - balloon.blnSize &&
            y < balloon.y + balloon.blnSize &&
            y > balloon.y - balloon.blnSize
        ) {
            score += 1
            scoreEl.innerHTML = score
            balloon.clicked = true
            removeBalloon(bloonz)
        }
    })
})

const removeBalloon = (arr) => {
    arr.forEach((ball, index) => {
        if (ball.clicked == true) {
            arr.splice(index, 1)
        }
    })
}

const collisionCheck = (ball, newBall) => {
    const distance = Math.hypot(ball.x - newBall.x, ball.y - newBall.y)
    if (distance <= ball.blnSize + newBall.blnSize && distance != 0) {
        newBall.clicked = true
    }
}

function animate() {
    animationId = requestAnimationFrame(animate)
    if (bloonz.length < 5) addBalloon()
}

const start = () => {
    if (!onTheRun) {
        onTheRun = true
        countdown()
    }
}
const stop = () => {
    cancelAnimationFrame(animationId)
    clear()
    stopTimer()
    init()
}

const countdown = () => {
    ctx.textAlign = "center"
    ctx.font = `${counterSize}px Poppins`
    setTimeout(function () {
        ctx.fillText(3, canvas.width / 2, canvas.height / 2)
    }, 1000)
    setTimeout(function () {
        clear()
        ctx.fillText(2, canvas.width / 2, canvas.height / 2)
    }, 2000)
    setTimeout(function () {
        clear()
        ctx.fillText(1, canvas.width / 2, canvas.height / 2)
    }, 3000)
    setTimeout(function () {
        clear()
        startTimer()
        animate()
    }, 4000)
}

const startTimer = () => {
    interval = setInterval(function () {
        timer -= 1
        timerEl.innerHTML = timer

        if (timer == 0) {
            timerEl.innerHTML = timer
            clearInterval(interval)
            stop()
        }
    }, 1000)
}

const stopTimer = () => {
    clearInterval(interval)
}

startEl.addEventListener("click", () => {
    start()
})
let x = document.querySelector("#x")
console.log(x)

let endGameEl = document.querySelector("#endGame")
