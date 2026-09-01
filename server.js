import http from 'http'
import express from 'express'
import { WebSocketServer } from 'ws'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', () => console.log('Vue app connected'))

app.post('/position', (req, res) => {
    const { fen } = req.body
    if (!fen) return res.status(400).json({ error: 'fen required' })

    wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) client.send(fen)
    })
    console.log('Sent FEN:', fen)
    res.json({ ok: true, fen })
})

server.listen(3000, () => console.log('HTTP + WS on :3000'))