'use client'
import { useEffect, useState } from 'react'
import { UAParser } from 'ua-parser-js'
import { Canvas } from './canvas'

const canvas = new Canvas()

export default function Home() {
  const [browser, setBrowser] = useState<string>('')
  const [os, setOs] = useState<string>('')
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const initCanvas = async() => {

      await canvas.init()

      document.getElementById('pixi-canvas')?.appendChild(canvas.app.canvas)

      window?.addEventListener('mousewheel', (event) => {
        event.preventDefault()
      }, { passive: false })
      
      canvas.on('history:change', () => {
        setHistory([...canvas.history])
      })
    }

    const parser = new UAParser(window.navigator.userAgent)
    setBrowser(parser.getBrowser().name ?? '')
    setOs(parser.getOS().name ?? '')

    initCanvas()

    return () => {
      window.removeEventListener('mousewheel', () => {})
      canvas.off('history:change')
    }
  }, [])

  if(!canvas.app) return <div>Loading...</div>

  const clearHistory = () => {
    canvas.history = [];
    setHistory([])
  }

  return <div>
    <h3>Browser: {browser}</h3>
    <h3>OS: {os}</h3>
    <h3 onClick={() => canvas.switchPointerMove()}>Pointer move enabled: {canvas.pointerMoveEnabled ? 'true' : 'false'}</h3>
    <h3 onClick={() => canvas.switchTouchMove()}>Touch move enabled: {canvas.touchMoveEnabled ? 'true' : 'false'}</h3>
    <button onClick={clearHistory}>Clear history </button>
    <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid white' }}>
      {history.map((item, index) => <div key={index}>{item}</div>)}
    </div>
    <div style={{ border: '1px solid red' }} id="pixi-canvas"></div>
  </div>
}
