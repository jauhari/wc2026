"use client"

import * as React from "react"

const COLORS = [
  "oklch(0.699 0.185 142)", // brand green
  "oklch(0.352 0.135 264)", // brand blue
  "oklch(0.588 0.239 27)", // brand red
  "oklch(0.85 0.18 90)", // gold
]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  spin: number
  life: number
}

/** Ledakan confetti ringan berbasis canvas — dipicu tiap kali `trigger` berubah. */
export function ConfettiBurst({ trigger }: { trigger: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const frameRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (trigger === 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
    }
    resize()

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    const originX = w / 2

    const particles: Particle[] = Array.from({ length: 90 }, () => {
      const angle = Math.random() * Math.PI - Math.PI / 2 - Math.PI / 2
      const speed = 4 + Math.random() * 7
      return {
        x: originX,
        y: h * 0.35,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 5 + Math.random() * 5,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.4,
        life: 1,
      }
    })

    const gravity = 0.18
    let running = true

    const step = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(dpr, dpr)

      let alive = false
      for (const p of particles) {
        if (p.life <= 0) continue
        p.vy += gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.spin
        p.life -= 0.012
        if (p.life <= 0 || p.y > h + 20) continue
        alive = true

        ctx.save()
        ctx.globalAlpha = Math.max(p.life, 0)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        ctx.restore()
      }

      ctx.restore()

      if (alive) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    frameRef.current = requestAnimationFrame(step)

    return () => {
      running = false
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 size-full"
    />
  )
}
