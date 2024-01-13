const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')  // c is canvas context

canvas.width = 1024
canvas.height = 576
c.fillStyle = 'white'
c.fillRect(0 , 0 , canvas.width , canvas.height)

const collisionsMap = []
for (let i = 0 ; i < collisions.length; i += 100) {
    collisionsMap.push(collisions.slice(i , i +100))
}

class Boundary {
    static width = 36
    static height = 36
    constructor({position}) {
        this.position = position
        this.width = 36
        this.height = 36
    }
    draw() {
        c.fillStyle = 'rgba(255,0,0,0)'
        c.fillRect(this.position.x , this.position.y , this.width , this.height)
    }
}

const boundaries = []

const offset = {
    x: -1513,
    y: -2125
}

collisionsMap.forEach((row , i) => {
    row.forEach((symbol , j) => {
        if (symbol === 5264){
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
image.src = './imgs/Final_Map_300.png'

const playerDownImage = new Image()
playerDownImage.src = './imgs/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = './imgs/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './imgs/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './imgs/playerRight.png'

const foregroundimage = new Image()
foregroundimage.src = './imgs/Map_foreground_300.png'
 

class Sprite {
    constructor({position , velocity , _image , frames = {max: 1}, sprites,animate=false}) {
        this.position = position
        this.image = _image
        this.frames = {...frames,val:0,elapsed:0}
        this.image.onload = () => {
            this.width = this.image.width/ this.frames.max
            this.height = this.image.height/ this.frames.max
        }
        this.animate=animate
        this.sprites=sprites
    }

    draw() {
        c.drawImage(this.image,
             this.frames.val*this.width,
             0 ,
             this.image.width/this.frames.max ,
             this.image.height ,
             this.position.x,
             this.position.y,
             this.image.width/this.frames.max ,
             this.image.height 
        )
        if(!this.animate) return

        if(this.frames.max>1){
          this.frames.elapsed++
        }
        if(this.frames.elapsed%10==0){
        if(this.frames.val<this.frames.max-1) this.frames.val++
        else this.frames.val=0
        }
    }
}

const player = new Sprite({
    position :{
        x : canvas.width/2 - 192/8,
        y : canvas.height/2 - 68/2
    },
    _image : playerDownImage,
    frames : {max: 4},
    sprites:{
      up:playerUpImage,
      left:playerLeftImage,
      right:playerRightImage,
      down:playerDownImage,

    }
})

const background = new Sprite({
    position:{
        x : offset.x ,
        y : offset.y 
    },
    _image: image
})
const foreground = new Sprite({
    position:{
        x : offset.x ,
        y : offset.y 
    },
    _image: foregroundimage
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

const movables = [background , ...boundaries,foreground]

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
    foreground.draw()
    
    let  moving = true
    player.animate=false
    if (keys.w.pressed && lastKey === 'w') {
        player.animate=true
        player.image=player.sprites.up
      
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
            })}}
    
    
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate=true
      
      player.image=player.sprites.left  
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
            })
    }}
    else if (keys.s.pressed && lastKey === 's') {
        player.animate=true
      
      player.image=player.sprites.down
        
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
            movables.forEach((movable) => {
            movable.position.y -= 3
        })}
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate=true
      player.image=player.sprites.right
      
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
}}

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
