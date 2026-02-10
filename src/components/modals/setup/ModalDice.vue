<script setup lang="ts">
import Graphics from "@/components/Graphics.vue"
import type { Dice } from "@/types/types.d"

/**props 정의*/
interface Props {
  dice: Dice
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'roll-dice'): void
}
const emit = defineEmits<Emits>()

/**data 정의*/
const arr_arrow = ['▼', '▶', '▲', '◀']
const class_dice = ['down_dice', 'right_dice', 'up_dice', 'left_dice']

/**주사위 패산 방향 표시*/
const wallDirectionVisibility = (idx: number): { visibility: 'visible' | 'hidden' } => {
  return {visibility: props.dice.wallDirection[idx]===true ? 'visible' : 'hidden'};
}
</script>

<template>
<!-- 주사위 굴림창 -->
<div class="container_roll" @click.stop="emit('roll-dice')">
  <Graphics kind="dice" :value="dice.value[0]" style="grid-area: dice_1; transform: scale(2);"/>
  <Graphics kind="dice" :value="dice.value[1]" style="grid-area: dice_2; transform: scale(2);"/>
  <div class="sum">
    <span v-show="dice.wallDirection.every(x => x===false)">?</span>
    <span v-show="dice.wallDirection.some(x => x===true)">{{ dice.value[0]+dice.value[1] }}</span>
  </div>
  <div v-for="(_, i) in class_dice"
    :key="i"
    :class="class_dice[i]"
    :style="wallDirectionVisibility(i)"
  >
    {{ arr_arrow[i] }}
  </div>
</div>
</template>

<style>
/* 주사위 굴림창 */
.container_roll{
  display: grid;
  grid-template-rows: 15px 86px 15px;
  grid-template-columns: repeat(3, 15px 86px) 15px;
  grid-template-areas:
    '. dice_1 . up_dice . dice_2 .'
    '. dice_1 left_dice sum right_dice dice_2 .'
    '. dice_1 . down_dice . dice_2 .';
  text-align: center;
  font-size: 15px;
}
.sum{
  grid-area: sum;
  font-size: 50px;
  line-height: 82px;
  text-underline-position: under;
  text-decoration: underline red 3px;
}
.down_dice{
  grid-area: down_dice;
  visibility: hidden;
  line-height: 15px;
  color: red;
}
.right_dice{
  grid-area: right_dice;
  visibility: hidden;
  line-height: 82px;
  color: red;
}
.up_dice{
  grid-area: up_dice;
  visibility: hidden;
  line-height: 15px;
  color: red;
}
.left_dice{
  grid-area: left_dice;
  visibility: hidden;
  line-height: 82px;
  color: red;
}
</style>