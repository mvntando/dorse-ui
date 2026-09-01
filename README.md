# Chess Position Editor

A web-based board editor for setting up chess positions.

## Features

- Board editor with tags, in style of <a href="https://lichess.org/editor" target="_blank">lichess</a>
- Tag individual pieces with a number (for tracking specific pieces)

## Tag Notation

Piece tags are appended to the standard FEN as a suffix in parentheses:

```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 (e4:1 d5:2)
```

Each `square:number` pair assigns a tag to the piece on that square.

## Receiving Positions

The app opens a WebSocket connection to the backend and updates the board whenever a new FEN is pushed to it.

### Sending a position

```
POST http://localhost:3000/position
Content-Type: application/json

{ "fen": "<fen string>" }
```

On success, the server broadcasts the FEN to all connected clients and the board updates.

## Running

- All: `npm run dev:all` (runs both frontend and backend)
- Frontend: `npm run dev` (Vite, default `http://localhost:5173`)
- Backend: `node server.js` (HTTP + WebSocket on `http://localhost:3000`)