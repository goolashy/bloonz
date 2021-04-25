const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")
const randomX = (blnSize) => Math.random() * (canvas.width - 2 * blnSize) + blnSize
const randomY = (blnSize) => Math.random() * (canvas.height - 2 * blnSize) + blnSize
const highscoreEl = document.querySelector("#highscoreEl")
const timerEl = document.querySelector("#timerEl")
const startEl = document.querySelector("#startBtn")
const menuEl = document.querySelector("#menuEl")
const scoreEl = document.querySelector("#scoreEl")
const resultEl = document.querySelector("#resultEl")
let bloonz = []
let blnSize = window.innerHeight * 0.07
let blnColor = "#cc3b3b"
let animationId = null
let score = 0
let highscore = 0
let timer = 5
let intervalTimer = null
let counterSize = window.innerHeight * 0.3
let onTheRun = false

const init = () => {
    canvas.width = window.innerHeight
    canvas.height = window.innerHeight
    blnSize = window.innerHeight * 0.07
    counterSize = window.innerHeight * 0.3
    onTheRun = false
    score = 0
    timer = 5
    bloonz = []
    timerEl.innerHTML = timer
    menuEl.style.display = "flex"
}

class Balloon {
    constructor() {
        this.blnSize = blnSize
        this.x = randomX(blnSize)
        this.y = randomY(blnSize)
        this.color = blnColor
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

const redraw = () => {
    clearCanv()
    bloonz.forEach((balloon) => balloon.draw())
}

const clearCanv = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

//popping bloon
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

//after hit
const removeBalloon = (arr) => {
    arr.forEach((ball, index) => {
        if (ball.clicked == true) {
            arr.splice(index, 1)
        }
    })
}

//prevent bloon from spawning on other bloon
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
        score = 0
        menuEl.style.display = "none"
        countdown()
    }
}
const stop = () => {
    cancelAnimationFrame(animationId)
    clearCanv()
    stopTimer()
    highscoreUpdate()
    onTheRun = false
    init()
}

addEventListener("resize", stop)

const countdown = () => {
    ctx.textAlign = "center"
    ctx.font = `${counterSize}px Poppins`
    setTimeout(function () {
        ctx.fillText(3, canvas.width / 2, canvas.height / 2)
    }, 1000)
    setTimeout(function () {
        clearCanv()
        ctx.fillText(2, canvas.width / 2, canvas.height / 2)
    }, 2000)
    setTimeout(function () {
        clearCanv()
        ctx.fillText(1, canvas.width / 2, canvas.height / 2)
    }, 3000)
    setTimeout(function () {
        clearCanv()
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

const highscoreUpdate = () => {
    if (score > highscore) {
        highscore = score
        highscoreEl.innerHTML = score
        resultEl.innerHTML = "Congratz! New record!"
    } else resultEl.innerHTML = "Try again!"
}

startEl.addEventListener("click", () => {
    start()
})
