/**@type {HTMLCanvasElement} */

const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 440

const rewindInput = document.querySelector('.rewind')
const btnOpenRewind = document.querySelector('.btn-open-rewind')
const btnRewind = document.querySelector('.btn-rewind')
const btnCancel = document.querySelector('.btn-cancel')
const scoreEl = document.querySelector('.game-info .score')
const finalScore = document.querySelector('.score')
const gameEl = document.querySelector('.game-wrapper')
const gameoverEl = document.querySelector('.gameover-wrapper')
const pauseEl = document.querySelector('.pause-wrapper')
const timeEl = document.querySelector('.time')
const rewind = document.querySelector('.rewind')
const nameInput = document.querySelector('.name')
const btnMenu = document.querySelector('.btn-menu')
const playerName = document.querySelector('.player-name')
const menuWrapper = document.querySelector('.menu-wrapper')
const gameWrapper = document.querySelector('.game-wrapper')

const board = {
    width: 40,
    height: 22
}

let score = 0

function drawBoard(board){
    let boards = []

    for(let i = 0; i < board.height; ++i){
        for(let j = 0; j < board.width; ++j){
            const position = {
                x: j,
                y: i
            }
            const color = ((i + j) % 2) ? 'lightgreen' : 'limegreen'
            boards.push(new Board(position, color))
        }
    }

    return boards
}

function drawFood(){
    let foods = []

    for(let i = 0; i < 5; ++i){
        const position = {
            x: Math.floor(Math.random() * board.width),
            y: Math.floor(Math.random() * board.height)
        }

        foods.push(new Food(position))
    }

    return foods
}

function addFood(){
    const position = {
        x: Math.floor(Math.random() * board.width),
        y: Math.floor(Math.random() * board.height)
    }

    return new Food(position)
}

function isSnakeEatFood(snake, food){
    return snake.x == food.position.x &&
        snake.y == food.position.y
}

function isSnakeEatHisBody(snakes){
    const [head] = snakes
    snakes.forEach((snake, index) => {
        if(index == 0){
            return
        }else{
            if(head.x == snake.x && head.y == snake.y){
                const gameoverAudio = new Audio('./assets/audio/dead.mp3')
                gameoverAudio.play()
                gameover = true
                gameEl.style.display = 'none'
                finalScore.innerHTML = score
                gameoverEl.style.display = 'flex'
            }
        }
    })

    // const [head] = snakes

    // snakes.forEach((snake, index) => {
    //     if(index == 0) return

    //     if(head.x == snake.x && head.y == snake.y){
    //         isPause = true
    //     }
    // })
}

class Board{
    constructor(position, color){
        this.position = position
        this.color = color
        this.width = 20
        this.height = 20
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x * this.width, this.position.y * this.height, this.width, this.height)
    }

    update(){
        
    }
}

class Food{
    constructor(position){
        this.image = new Image()
        this.image.src = './assets/image/food.png'
        this.position = position
        this.width = 20
        this.height = 20
    }

    draw(){
        ctx.drawImage(this.image, this.position.x * this.width, this.position.y * this.height, this.width, this.height)
    }

    update(){
        
    }
}

class Snake{
    constructor(){
        this.snakes = [
            {
                x: board.width / 2 + 1,
                y: board.height / 2 - 1
            },
            {
                x: board.width / 2,
                y: board.height / 2 - 1
            },
            {
                x: board.width / 2 - 1,
                y: board.height / 2 - 1
            },
            {
                x: board.width / 2 - 2,
                y: board.height / 2 - 1
            },
            {
                x: board.width / 2 - 3,
                y: board.height / 2 - 1
            },
            {
                x: board.width / 2 - 4,
                y: board.height / 2 - 1
            },
        ]
        this.color = 'yellow'
        this.width = 20
        this.height = 20
        this.direction = 'RIGHT'
        this.freeze = false
        this.speedX = 0
        this.speedY = 0
        this.maxSpeed = 1
    }

    moveUp(){
        this.speedY = -this.maxSpeed
    }

    moveDown(){
        this.speedY = this.maxSpeed
    }

    moveRight(){
        this.speedX = this.maxSpeed
    }

    moveLeft(){
        this.speedX = -this.maxSpeed
    }

    stop(){
        this.speedX = 0
        this.speedY = 0
    }

    draw(){
        ctx.fillStyle = this.color
        ctx.strokeStyle = 'black'
        this.snakes.forEach(snake => {
            ctx.fillRect(snake.x * 20, snake.y * 20, this.width, this.height)
        })
    }

    update(){
        this.freeze = false
        if(this.snakes[0].x > board.width){
            this.snakes[0].x = 0
        }

        if(this.snakes[0].x < 0){
            this.snakes[0].x = board.width
        }

        if(this.snakes[0].y > board.height){
            this.snakes[0].y = 0
        }

        if(this.snakes[0].y < 0){
            this.snakes[0].y = board.height
        }

        if(this.direction == 'RIGHT'){
            this.moveRight()
        }else if(this.direction == 'LEFT'){
            this.moveLeft()
        }else if(this.direction == 'UP'){
            this.moveUp()
        }else if(this.direction == 'DOWN'){
            this.moveDown()
        }

        const head = {x: this.snakes[0].x + this.speedX, y: this.snakes[0].y + this.speedY}
        this.snakes.unshift(head)
        this.snakes.pop()
    }
}

class InputHandler{
    constructor(game){
        document.addEventListener('keydown', (e) => {
            switch(e.key){
                case 'w':
                    if(game.snake.direction != 'DOWN' && !game.snake.freeze){
                        const upAudio = new Audio('./assets/audio/up.mp3')
                        upAudio.play()
                        game.snake.stop()
                        game.snake.direction = 'UP'
                        game.snake.freeze = true
                    }
                    break;
                case 's':
                    if(game.snake.direction != 'UP' && !game.snake.freeze){
                        const downAudio = new Audio('./assets/audio/down.mp3')
                        downAudio.play()
                        game.snake.stop()
                        game.snake.direction = 'DOWN'
                        game.snake.freeze = true
                    }
                    break;
                case 'a':
                    if(game.snake.direction != 'RIGHT' && !game.snake.freeze){
                        const leftAudio = new Audio('./assets/audio/left.mp3')
                        leftAudio.play()
                        game.snake.stop()
                        game.snake.direction = 'LEFT'
                        game.snake.freeze = true
                    }
                    break;
                case 'd':
                    if(game.snake.direction != 'LEFT' && !game.snake.freeze){
                        const rightAudio = new Audio('./assets/audio/right.mp3')
                        rightAudio.play()
                        game.snake.stop()
                        game.snake.direction = 'RIGHT'
                        game.snake.freeze = true
                    }
                    break;
                case 'Escape':
                    if(pause){
                        pauseEl.style.display = 'none'
                        pause = false
                        gameEl.style.display = 'flex'
                        animate()
                    }else{
                        gameEl.style.display = 'none'
                        pauseEl.style.display = 'flex'
                        pause = true
                    }
                    break;
                default:
                    break;
            }
        })
    }
}

class Game{
    constructor(){
        this.setup()
    }

    setup(){
        this.boards = drawBoard(board)
        this.snake = new Snake()
        this.foods = drawFood()
        new InputHandler(this)
    }

    draw(){
        [...this.boards, ...this.foods, this.snake].forEach(e => e.draw())
    }
    
    update(){
        [...this.boards, ...this.foods, this.snake].forEach(e => e.update())

        if(this.foods.length < 5){
            this.foods.push(addFood())
        }

        this.foods.forEach((food, index) => {
            if(isSnakeEatFood(this.snake.snakes[0], food)){
                this.foods.splice(index, 1)
                this.snake.snakes.length += 1
                score += 10
                const eatAudio = new Audio('./assets/audio/eat.mp3')
                eatAudio.play()
            }
        })

        isSnakeEatHisBody(this.snake.snakes)
    }
}

let pause = true
let gameover = false
let time = 0
let time_second = 0
let time_minute = 0
let time_hour = 0
let time_format = '00:00:00'

let detail = []

const game = new Game()


setInterval(() => {
    if(pause || gameover){
        return
    }else{
        time++

        if(detail.length < 5){
            let newSnake = game.snake.snakes.slice();
            detail.push({
                snakes: newSnake,
                timer: time,
                direction: game.snake.direction
            })
        }else{
            detail.shift()
        }

        localStorage.setItem('detail', detail)

        const second = Math.floor(time % 60)
        const minute = Math.floor(time / 60)
        const hour = Math.floor(minute / 60)

        if(second < 10){
            time_second = '0' + second
        }else{
            time_second = second
        }

        if(minute < 10){
            time_minute = '0' + minute
        }else{
            time_minute = minute
        }

        if(hour < 10){
            time_hour = '0' + hour
        }else{
            time_hour = hour
        }

        time_format = `${time_hour}:${time_minute}:${time_second}`
        timeEl.innerHTML = time_format
    }
}, 1000)

function animate(){
    if(pause || gameover){
        return
    }else{
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update()
        game.draw()
    
        scoreEl.innerHTML = score
    
        setTimeout(() => {
            requestAnimationFrame(animate)
        }, 250)
    }
}

function play(){
    playerName.innerHTML = nameInput.value
    menuWrapper.style.display = 'none'
    gameWrapper.style.display = 'flex'
    pause = false
    game.snake.direction = 'RIGHT'
    animate()
}

function openRewind(){
    pause = true
    btnOpenRewind.style.display = 'none'
    rewindInput.style.display = 'block'
    btnCancel.style.display = 'inline'
    btnRewind.style.display = 'inline'
}

function closeRewind(){
    rewindInput.style.display = 'none'
    btnCancel.style.display = 'none'
    btnRewind.style.display = 'none'
    btnOpenRewind.style.display = 'block'
    rewind.value = 5
    pause = false
    animate()
}

function changePosition(e){
    game.snake.snakes = (detail[e.target.value].snakes == undefined) ? game.snake.snakes : detail[e.target.value].snakes
    game.snake.stop()
    game.snake.direction = detail[e.target.value].direction
    time = detail[e.target.value].timer
}

function checkInput(){
    if(nameInput.value == ''){
        btnMenu.style.pointerEvents = 'none'
        btnMenu.style.backgroundColor = 'rgb(102, 102, 102)'
    }else{
        btnMenu.style.pointerEvents = 'all'
        btnMenu.style.backgroundColor = 'salmon'
    }
}

btnOpenRewind.addEventListener('click', openRewind)
btnCancel.addEventListener('click', closeRewind)
rewind.addEventListener('input', changePosition)
btnRewind.addEventListener('click', closeRewind)
nameInput.addEventListener('input', checkInput)
btnMenu.addEventListener('click', play)