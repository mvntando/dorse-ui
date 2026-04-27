<!-- PieceToolbar.vue -->
<template>
  <div class="w-[525px] bg-neutral-600 rounded-lg flex items-center [&_*]:cursor-pointer">
    <!-- Ducktape fix: width should be 530px to match the chessground board at the parrent (App.vue). 
    Problem at the chessground board, its smaller than the set 530px width, chessgrounds adds some padding 
    think you can just pass the size of the chessboard from App.vue (for later) -->

    <!-- Hand cursor -->
    <button @click="selectSpecial('hand')"
      :class="['flex-1 text-black aspect-square flex items-center justify-center rounded-l-lg',
        isSpecialSelected('hand') ? 'bg-lime-600/50' : 'hover:bg-lime-700/50']">
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" class="size-16" viewBox="0 0 550 400" enable-background="new 0 0 550 400" xml:space="preserve">
        <symbol id="hand" viewBox="-364.275 -463.175 728.602 926.3">
          <g>
            <path fill-rule="evenodd" clip-rule="evenodd" fill="none" stroke="#000000" stroke-width="65.65" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="3" d="M209.5,105.85c-0.1,3-0.433,6.55-1,10.65c-1.4,10.267-3.983,19.667-7.75,28.2c-12,27.333-33.417,41-64.25,41    c-17.9,0-31.433,0.333-40.6,1h-8.4v-42v-75 M87.5,144.7c-0.1,3-0.433,6.55-1,10.65c-1.4,10.267-3.983,19.667-7.75,28.2    c-12,27.334-33.417,41-64.25,41c-17.9,0-31.433,0.334-40.6,1h-8.4v-117 M-34.5,225.55V350.65c-0.067,3-0.367,6.55-0.9,10.649    c-1.3,10.267-3.684,19.667-7.15,28.2c-10.367,25.533-28.35,39.134-53.95,40.8c-25.567-1.666-43.533-15.267-53.9-40.8    c-3.467-8.533-5.85-17.934-7.15-28.2c-0.534-4.1-0.85-7.649-0.95-10.649V-22.4c-90.6,112.1-148.25,110.783-172.95-3.95    c107.767-96.367,179.75-231.033,215.95-404l364,1c13.7,37.833,29.367,89.1,47,153.8c17.667,64.7,29.583,157.767,35.75,279.2    l0.25,51c0.033,3.4-0.3,7.667-1,12.8c-1.4,10.267-3.983,19.667-7.75,28.2c-12,27.333-33.417,41-64.25,41    c-17.9,0-31.433,0.333-40.6,1l-8.4,1v-32.8c0-0.4,0-0.817,0-1.25l-0.15-68.4l0.15-15.55 M209.05,11.7l0.3,24.5"/>
          </g>
        </symbol>
        <use xlink:href="#hand" width="728.602" height="926.3" x="-364.275" y="-463.175" transform="matrix(0.353 0 0 -0.353 256.5 196.6499)" overflow="visible"/>
      </svg>
    </button>

    <!-- Pieces -->
    <button v-for="role in pieces" :key="role"
      @click="selectPiece(role)"
      @mousedown.prevent="e => { if (e.target.tagName !== 'SELECT') emit('piece-drag', { role, color: props.color }, e) }"
      :class="['flex-1 aspect-square flex items-center justify-center',
        isSelected(role) ? 'bg-gray-700/75' : 'hover:bg-gray-600/75']">
      <!-- <piece> matches chessground's own piece elements, keeping CSS selectors unified -->
      <piece :class="[role, color, 'block', 'bg-cover', 'size-16', 'relative']">
        <!-- Tag -->
        <div class="absolute bottom-0 right-0 corner-tag-white">
          <select :value="props.tagNumbers[`${props.color}-${role}`] ?? '-'"
          @mousedown.stop @click.stop
          @change="emit('tag-selected', { role, color: props.color, number: $event.target.value })"
          class="absolute appearance-none bg-transparent border-none outline-none cursor-pointer font-bold text-xs text-neutral-600 corner-tag-select">
            <option>-</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
          </select>
        </div>
      </piece>
    </button>

    <!-- Trash -->
    <button @click="selectSpecial('bin')"
      :class="['flex-1 text-black aspect-square flex items-center justify-center rounded-r-lg',
        isSpecialSelected('bin') ? 'bg-red-500/50' : 'hover:bg-red-600/25']">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-12">
          <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  color: { type: String, required: true },
  selectedPiece: { type: Object, default: null },
  tagNumbers: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['piece-selected', 'piece-drag', 'tag-selected'])
const pieces = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn']

const isSelected = (role) =>
  props.selectedPiece?.role === role && props.selectedPiece?.color === props.color

const isSpecialSelected = (tool) =>
  props.selectedPiece?.role === tool  // No color check, shared across both toolbars

function selectSpecial(tool) {
    emit('piece-selected', { role: tool, color: null })
}

function selectPiece(role) {
  emit('piece-selected', { role, color: props.color })
}
</script>

<style scoped>
.corner-tag {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 24px 24px;
  border-color: transparent transparent transparent transparent;
}

.corner-tag-white {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 0 24px 24px;
  border-color: transparent transparent rgb(240, 240, 240) transparent;
}

.corner-tag-select {
  width: 24px;
  height: 24px;
  bottom: -28px;
  left: -20px;
  text-align: center;
}
</style>
