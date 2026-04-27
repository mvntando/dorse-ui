import express from 'express'
import { WebSocketServer } from 'ws'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const wss = new WebSocketServer({ port: 3001 })

wss.on('connection', () => console.log('Vue app connected'))

app.post('/position', (req, res) => {
    const { fen } = req.body
    if (!fen) return res.status(400).json({ error: 'fen required' })

    wss.clients.forEach(client => client.send(fen))
    console.log('Sent FEN:', fen)
    res.json({ ok: true, fen })
})

app.listen(3000, () => console.log('HTTP on :3000, WS on :3001'))
