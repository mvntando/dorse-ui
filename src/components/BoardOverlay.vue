<!-- BoardOverlay.vue -->
<template>
  <Teleport v-if="target" :to="target">
    <div class="absolute inset-0 pointer-events-none"
      style="display: grid; grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(8, 1fr);">
      <div v-for="square in squares" :key="square" class="relative">
        <div v-if="tagMap[square]" class="absolute bottom-0 right-0 corner-tag-white">
          <select :value="tagMap[square]" @mousedown.stop
            @change="emit('tag-changed', { square, number: $event.target.value })"
            class="absolute appearance-none bg-transparent border-none outline-none cursor-pointer font-bold text-xs text-neutral-600 pointer-events-auto corner-tag-select">
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
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  target: { type: Object, default: null },
  tagMap: { type: Object, default: null},
  flipped: { type: Boolean, default: false }
})

const emit = defineEmits(['tag-changed'])

const files = ['a','b','c','d','e','f','g','h']

const squares = computed(() => {
  const result = []
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const fileIdx = props.flipped ? 7 - col : col
      const rankIdx = props.flipped ? row : 7 - row
      result.push(files[fileIdx] + (rankIdx + 1))
    }
  }
  return result
})
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
  z-index: 10;
}

.corner-tag-select {
  width: 24px;
  height: 24px;
  bottom: -28px;
  left: -20px;
  text-align: center;
}
</style>