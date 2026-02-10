<script setup lang="ts">
import Graphics from "@/components/Graphics.vue"
import type { SeatTile } from "@/types/types.d"

/**props 정의*/
interface Props {
  seatTile: SeatTile
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'set-seat-tile', idx: number): void
}
const emit = defineEmits<Emits>()

/**타일 앞뒤 표시*/
const seatTileStyle = (idx: number) => {
  return {
    gridArea: `tile_${idx+1}`,
    color: props.seatTile.isOpened[idx]===true ? (props.seatTile.value[idx]==='東' ? 'red' : '') : 'orange',
    backgroundColor: props.seatTile.isOpened[idx]===true ? '' : 'orange'};
}
</script>

<template>
<div class="container_tile">
  <Graphics v-for="(_, i) in seatTile.value"
    :key="i"
    kind="tile"
    :style="seatTileStyle(i)"
    :wind="seatTile.value[i]"
    @click.stop="emit('set-seat-tile', i)"
  />
</div>
</template>

<style>
/* 자리 선택창 */
.container_tile{
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(3, 86px 15px) 86px;
  grid-template-areas:
    'tile_1 . tile_2 . tile_3 . tile_4';
  text-align: center;
  font-size: 80px;
  margin: 15px;
}
</style>