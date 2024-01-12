const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')  // c is canvas context

canvas.width = 1024
canvas.height = 576
c.fillStyle = 'white'
c.fillRect(0 , 0 , canvas.width , canvas.height)

const collisionsMap = []
for (let i = 0 ; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i , i +70))
}

class Boundary {
    static width = 48
    static height = 48
    constructor({position}) {
        this.position = position
        this.width = 48
        this.height = 48
    }
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x , this.position.y , this.width , this.height)
    }
}

const boundaries = []

const offset = {
    x: -728,
    y: -650
}

collisionsMap.forEach((row , i) => {
    row.forEach((symbol , j) => {
        if (symbol === 1025){
        boundaries.push(
            new Boundary ({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
        }))}
    })
})

const image = new Image()
image.src = './imgs/Pellet Town.png'

const playerImage = new Image()
playerImage.src = './imgs/playerDown.png'

class Sprite {
    constructor({position , velocity , _image , frames = {max: 1}}) {
        this.position = position
        this.image = _image
        this.frames = frames
        this.image.onload = () => {
            this.width = this.image.width/ this.frames.max
            this.height = this.image.height/ this.frames.max
        }
    }

    draw() {
        c.drawImage(this.image,
             0 ,
             0 ,
             this.image.width/this.frames.max ,
             this.image.height ,
             this.position.x,
             this.position.y,
             this.image.width/this.frames.max ,
             this.image.height 
        );
    }
}

const player = new Sprite({
    position :{
        x : canvas.width/2 - 192/8,
        y : canvas.height/2 - 68/2
    },
    _image : playerImage,
    frames : {max: 4}
})

const background = new Sprite({
    position:{
        x : offset.x ,
        y : offset.y 
    },
    _image: image
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

const movables = [background , ...boundaries]

function rectangularCollision({ rectangle1 , rectangle2}) {
    return(
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}

function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach((boundary) => {
        boundary.draw()
    })
    player.draw()
    
    let moving = true
    if (keys.w.pressed && lastKey === 'w') {
        for (let i =0; i < boundaries.length ; i++) {
        const boundary = boundaries[i]
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary , position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })
            ){
                moving = false
                break
            }}
        
        if(moving) {
            movables.forEach((movable) => {
            movable.position.y += 3
            })}
    else if (keys.a.pressed && lastKey === 'a') {
        for (let i =0; i < boundaries.length ; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary , position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y 
                    }}
                })
                ){
                    moving = false
                    break
                }}
            
            if(moving) {
            movables.forEach((movable) => {
            movable.position.x += 3
            })}
    }
    else if (keys.s.pressed && lastKey === 's') {
        for (let i =0; i < boundaries.length ; i++) {
        const boundary = boundaries[i]
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary , position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }}
            })
            ){
                moving = false
                break
            }}
        
        if(moving) {
            for (let i =0; i < boundaries.length ; i++) {
                const boundary = boundaries[i]
                if (
                    rectangularCollision({
                        rectangle1: player,
                        rectangle2: {...boundary , position: {
                            x: boundary.position.x - 3,
                            y: boundary.position.y 
                        }}
                    })
                    ){
                        moving = false
                        break
                    }}
                
                if(moving) {
            movables.forEach((movable) => {
            movable.position.y -= 3
        })}
    }}
    else if (keys.d.pressed && lastKey === 'd') {
        for (let i =0; i < boundaries.length ; i++) {
            const boundary = boundaries[i]
            if (
                rectangularCollision({
                    rectangle1: player,
                    rectangle2: {...boundary , position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    }}
                })
                ){
                    moving = false
                    break
                }}
            
            if(moving) {
            movables.forEach((movable) => {
            movable.position.x -= 3
        })
    }
}}}

animate()

let lastKey = ''

window.addEventListener('keydown' , (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w' 
            break

        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break

        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break

        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
        
    }
})

window.addEventListener('keyup' , (e) => {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 's':
            keys.s.pressed = false
            break

        case 'd':
            keys.d.pressed = false
            break
        
    }
})
