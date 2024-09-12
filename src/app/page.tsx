'use client'
import { useEffect, useState } from 'react'
import { UAParser } from 'ua-parser-js'
import { Canvas } from './canvas'

const canvas = new Canvas()

export default function Home() {
  const parser = new UAParser(window.navigator.userAgent)
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const initCanvas = async() => {

      await canvas.init()

      document.getElementById('pixi-canvas')?.appendChild(canvas.app.canvas)

      window.addEventListener('mousewheel', (event) => {
        event.preventDefault()
      }, { passive: false })
      
      canvas.on('history:change', () => {
        setHistory([...canvas.history])
      })
    }

    initCanvas()

    return () => {
      window.removeEventListener('mousewheel', () => {})
      canvas.off('history:change')
    }
  }, [])

  if(!canvas.app) return <div>Loading...</div>

  return <div>
    <h1>Browser: {parser.getBrowser().name}</h1>
    <h1>OS: {parser.getOS().name}</h1>
    <h1 onClick={() => canvas.switchPointerMove()}>Pointer move enabled: {canvas.pointerMoveEnabled ? 'true' : 'false'}</h1>
    <h1 onClick={() => canvas.switchTouchMove()}>Touch move enabled: {canvas.touchMoveEnabled ? 'true' : 'false'}</h1>
    <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid white' }}>
      {history.map((item, index) => <div key={index}>{item}</div>)}
    </div>
    <div style={{ border: '1px solid red' }} id="pixi-canvas"></div>
  </div>
}
