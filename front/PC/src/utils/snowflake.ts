interface Star {
  x: number
  y: number
  endY: number
  speed: number
}

export default (): void => {
  const canvas = document.querySelector("canvas")
  const ctx = canvas?.getContext("2d")
  if (ctx && canvas) {
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight

    const MAX_STARS = 10
    const STAR_COLORS = 'rgba(255, 255, 255, 0.5)'

    const creatStar = (): Star => {
      const x = ~~(Math.random() * canvas.width)
      const y = ~~(Math.random() * canvas.height)
      const random = ~~(Math.random() * canvas.height)
      const endY = random < y
        ? random
        : y - random > 0
          ? y - random
          : 0
      const speed = Math.round(Math.random() * (8 - 4) + 4) / 10
      return { x, y, endY, speed }
    }

    class Stars {
      stars: Star[] = []
      constructor() {
        // this.stars = []
        for (let i = 0; i < MAX_STARS; i++) {
          this.stars.push(creatStar())
        }
      }

      draw() {
        for (let i = 0; i < MAX_STARS; i++) {
          const star = this.stars[i]
          ctx!.lineWidth = 1
          ctx!.fillStyle = STAR_COLORS
          ctx?.fillRect(star.x, star.y, 2.5, 2.5)
        }
      }

      update() {
        for (let i = 0; i < MAX_STARS; i++) {
          this.stars[i].y -= this.stars[i].speed
          const isOutScreen = this.stars[i].y < this.stars[i].endY
          if (isOutScreen) {
            this.stars.splice(i, 1)
            this.stars.push(creatStar())
          }
        }
      }
    }


    const stars = new Stars()

    const clearScreen = () => ctx.clearRect(0, 0, canvas.width, canvas.height)

    const loop = () => {
      clearScreen()
      requestAnimationFrame(loop)
      stars.update()
      stars.draw()
    }

    loop()
  }
}