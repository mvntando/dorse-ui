<!-- App.vue -->
<template>
  <div class="min-h-screen flex items-start justify-center gap-4 p-6">

    <!-- Board + piece toolbar -->
    <div class="flex flex-col gap-2">
      
      <!-- Black piece toolbar -->
      <PieceToolbar @piece-selected="onPieceSelected" @piece-drag="onPieceDrag" @tag-selected="onTagSelected" :color="flipped ? 'white' : 'black'" :selected-piece="selectedPiece" :tag-numbers="selectedTags" />
      
      <!-- Board -->
      <div class="relative w-[530px]" style="padding-bottom: 530px; height: 0;">
        <div ref="boardEl" class="absolute inset-0"></div>
        <BoardOverlay :target="cgContainer" :tag-map="tagMap" @tag-changed="onBoardTagChanged" :flipped="flipped" />
      </div>
      
      <!-- White piece toolbar -->
      <PieceToolbar @piece-selected="onPieceSelected" @piece-drag="onPieceDrag" @tag-selected="onTagSelected" :color="flipped ? 'black' : 'white'" :selected-piece="selectedPiece" :tag-numbers="selectedTags" />
      
      <!-- FEN -->
      <div class="w-[530px] flex items-center gap-2 rounded-lg mt-2">
        <span class="text-gray-400 font-semibold shrink-0 px-2">FEN</span>
        <input
          :value="fen"
          @keydown.enter="loadFen($event.target.value)"
          :class="['flex-1 text-neutral-300 text-sm py-2 px-2 rounded-lg outline-none border placeholder:text-neutral-600',
            fenValid ? 'border-gray-500' : 'border-red-500']"
          @input="fenValid = true"
        />
      </div>
    </div>

    <!-- Sidebar -->
    <div class="flex flex-col gap-4 w-80">

      <!-- Settings card -->
      <div class="rounded-lg p-3 flex flex-col gap-3 bg-neutral-800">

        <!-- Turn to play -->
        <select v-model="turnColor" class="text-gray-200 rounded-lg px-3 py-2 text-sm outline-none border border-neutral-500 cursor-pointer">
          <option value="white" selected>White to play</option>
          <option value="black">Black to play</option>
        </select>

        <!-- Castling rights -->
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center text-sm text-gray-300">
            <span>White O-O</span>
            <div class="flex gap-3">
              <label class="flex items-center gap-1 text-gray-400 text-xs [&_*]:cursor-pointer">
                <input v-model="castling.K" type="checkbox" /> O-O
              </label>
              <label class="flex items-center gap-1 text-gray-400 text-xs [&_*]:cursor-pointer">
                <input v-model="castling.Q" type="checkbox" /> O-O-O
              </label>
            </div>
          </div>
          <div class="flex justify-between items-center text-sm text-gray-300">
            <span>Black O-O</span>
            <div class="flex gap-3">
              <label class="flex items-center gap-1 text-gray-400 text-xs [&_*]:cursor-pointer">
                <input v-model="castling.k" type="checkbox" /> O-O
              </label>
              <label class="flex items-center gap-1 text-gray-400 text-xs [&_*]:cursor-pointer">
                <input v-model="castling.q" type="checkbox" /> O-O-O
              </label>
            </div>
          </div>
        </div>

        <!-- En passant -->
        <div class="flex justify-between items-center text-sm text-gray-300">
          <span>En passant</span>
          <select v-model="enPassant" class="text-gray-300 rounded px-2.5 py-1 text-sm outline-none border border-neutral-500 cursor-pointer">
            <option>-</option>
            <option>a3</option><option>b3</option><option>c3</option><option>d3</option>
            <option>e3</option><option>f3</option><option>g3</option><option>h3</option>
            <option>a6</option><option>b6</option><option>c6</option><option>d6</option>
            <option>e6</option><option>f6</option><option>g6</option><option>h6</option>
          </select>
        </div>

      </div>

      <!-- Action buttons -->
      <div class="flex flex-col">
        <button @click="setStartingPosition" class="flex items-center gap-2 text-gray-300 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg> Starting position
        </button>
        <button @click="clearBoard" class="flex items-center gap-2 text-gray-300 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg> Clear board
        </button>
        <button @click="flipBoard" class="flex items-center gap-2 text-gray-300 px-3 py-2 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
          </svg> Flip board
        </button>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chessground } from 'chessground'
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'

import PieceToolbar from '@/components/PieceToolbar.vue'
import BoardOverlay from '@/components/BoardOverlay.vue'

const boardEl = ref(null)
const cgContainer = ref(null)

const tagMap = ref({})

const fen = ref('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
const turnColor = ref('white')
const castling = ref({ K: true, Q: true, k: true, q: true })
const enPassant = ref('-')

const selectedTags = ref({})
const selectedPiece = ref({ role: 'hand', color: null })
const flipped = ref(false)
const fenValid = ref(true)

let cg = null
let isDraggingFromToolbar = false

onMounted(() => {
  cg = Chessground(boardEl.value, {
    movable: {
      color: 'both',
      free: true,
    },
    animation: { enabled: true, duration: 120 },
    highlight: { lastMove: false, check: false },
    draggable: { enabled: true },
    events: {
      change: () => { fen.value = cgToFen() },
      move: (orig, dest) => {
        if (tagMap.value[orig] !== undefined) {
          tagMap.value[dest] = tagMap.value[orig]
          delete tagMap.value[orig]
          tagMap.value = { ...tagMap.value }  // force reactivity since delete doesn't trigger it
        }
      }
    },
  })

  cgContainer.value = boardEl.value.querySelector('cg-container')

  cgContainer.value = boardEl.value.querySelector('cg-container')

  // WebSocket — receive FEN from external source
  const ws = new WebSocket('ws://localhost:3001')
  ws.onopen = () => console.log('Connected to position server')
  ws.onmessage = (e) => loadFen(e.data)
  ws.onerror = (e) => console.warn('WS error', e)
  ws.onclose = () => console.log('WS disconnected')

  // Piece and tag placement
  function placePiece(key) {
    const piece = selectedPiece.value
    if (!piece || piece.role === 'hand' || !key) return
    if (piece.role === 'bin') {
      cg.setPieces(new Map([[key, undefined]]))
      delete tagMap.value[key]
    } else {
      cg.setPieces(new Map([[key, { role: piece.role, color: piece.color }]]))
      const tag = selectedTags.value[`${piece.color}-${piece.role}`] ?? null
      if (tag && tag !== '-') tagMap.value[key] = tag
      else delete tagMap.value[key]
    }
    tagMap.value = { ...tagMap.value }
    fen.value = cgToFen()
  }

  let isMouseDown = false
  boardEl.value.addEventListener('mousedown', (e) => {
    isMouseDown = true
    const key = keyFromEvent(e)
    const piece = selectedPiece.value
    const existing = cg.state.pieces.get(key)
    if (existing && piece && existing.role === piece.role && existing.color === piece.color) {
      cg.setPieces(new Map([[key, undefined]]))
      delete tagMap.value[key]
      tagMap.value = { ...tagMap.value }
      fen.value = cgToFen()
    } else {
      placePiece(key)
    }
  })
  boardEl.value.addEventListener('mouseup',    () => isMouseDown = false)
  boardEl.value.addEventListener('mouseleave', () => isMouseDown = false)
  boardEl.value.addEventListener('mousemove',  (e) => {
    if (!isMouseDown) return
    placePiece(keyFromEvent(e))
  })

})

function keyFromEvent(e) {
  const bounds = boardEl.value.getBoundingClientRect()
  const file = Math.floor((e.clientX - bounds.left) / bounds.width  * 8)
  const rank = Math.floor((e.clientY - bounds.top)  / bounds.height * 8)
  if (file < 0 || file > 7 || rank < 0 || rank > 7) return null
  const files = 'abcdefgh'
  return cg.state.orientation === 'white'
      ? `${files[file]}${8 - rank}`
      : `${files[7 - file]}${rank + 1}`
}

function onPieceDrag(piece, event) {
  isDraggingFromToolbar = true
  cg.dragNewPiece({ role: piece.role, color: piece.color }, event, true)
  document.addEventListener('mouseup', (e) => {
    isDraggingFromToolbar = false
    selectedPiece.value = { role: 'hand', color: null }
    const key = keyFromEvent(e)
    if (key) {
      const tag = selectedTags.value[`${piece.color}-${piece.role}`]
      if (tag && tag !== '-') tagMap.value[key] = tag
      else delete tagMap.value[key]
      tagMap.value = { ...tagMap.value }
    }
    fen.value = cgToFen()
  }, { once: true })
}

watch([turnColor, castling, enPassant], () => {
  fen.value = cgToFen()
}, { deep: true })

watch(selectedPiece, (piece) => {
  if (!cg) return
  const isPlacement = piece && piece.role !== 'hand'
  cg.set({ movable: { color: isPlacement ? null : 'both', free: !isPlacement } })
})

function setStartingPosition() {
  tagMap.value = {}
  loadFen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
}

function clearBoard() {
  tagMap.value = {}
  selectedTags.value = {}
  loadFen('8/8/8/8/8/8/8/8 w - - 0 1')
}

function flipBoard() {
  cg.toggleOrientation()
  flipped.value = !flipped.value
  cgContainer.value = boardEl.value.querySelector('cg-container')
}

function loadFen(input) {
  loadTagFen(input)
  const cleanInput = input.replace(/\s*\([^)]*\)/, '').trim()

  // Simple protection mechanism to guard agains invalid fen
  const parts = cleanInput.split(' ')
  if (parts.length < 4) return fenValid.value = false

  const ranks = parts[0].split('/')
  if (ranks.length !== 8) return fenValid.value = false

  const validPieces = /^[pnbrqkPNBRQK1-8]+$/
  const rankSum = (rank) => [...rank].reduce((sum, c) => sum + (isNaN(c) ? 1 : parseInt(c)), 0)

  if (ranks.some(r => !validPieces.test(r) || rankSum(r) !== 8)) return fenValid.value = false

  cg.set({ fen: parts[0] })
  turnColor.value = parts[1] === 'b' ? 'black' : 'white'

  const c = parts[2]
  castling.value = { K: c.includes('K'), Q: c.includes('Q'), k: c.includes('k'), q: c.includes('q') }

  enPassant.value = parts[3] ?? '-'

  fen.value = cgToFen()
  fenValid.value = true
}

function cgToFen() {
  const c = castling.value
  const castlingStr = [c.K?'K':'', c.Q?'Q':'', c.k?'k':'', c.q?'q':''].join('') || '-'
  const turn = turnColor.value === 'white' ? 'w' : 'b'

  return `${cg.getFen()} ${turn} ${castlingStr} ${enPassant.value} 0 1 ${tagsToFenPart()}`
}

function tagsToFenPart() {
  const tags = Object.entries(tagMap.value)
  if (tags.length === 0) return ''
  return ' (' + tags.map(([sq, num]) => `${sq}:${num}`).join(' ') + ')'
}

function loadTagFen(input) {
  const tagMatch = input.match(/\(([^)]+)\)/)
  if (tagMatch) {
    const newTagMap = {}
    for (const entry of tagMatch[1].split(' ')) {
      const [sq, num] = entry.split(':')
      if (sq && num) newTagMap[sq] = num
    }
    tagMap.value = newTagMap
  } else {
    tagMap.value = {}
  }
}

function onPieceSelected(piece) {
  selectedPiece.value = piece
}

function onTagSelected({ role, color, number }) {
  const key = `${color}-${role}`
  selectedTags.value[key] = number === '-' ? null : number
}

function onBoardTagChanged({ square, number }) {
  if (number === '-') delete tagMap.value[square]
  else tagMap.value[square] = number
  tagMap.value = { ...tagMap.value }
  fen.value = cgToFen()
}
</script>
