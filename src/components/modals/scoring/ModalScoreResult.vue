<script setup lang="ts">
import type { Player } from "@/types/types.d"

/**props 정의*/
interface Props {
  players: Player[]
}
defineProps<Props>() // 스크립트에서는 사용x

/**emits 정의*/
type Emits = {
  (e: 'save-round'): void,
}
const emit = defineEmits<Emits>()

/**data 정의*/
const class_score_diff = ['down_score_diff', 'right_score_diff', 'up_score_diff', 'left_score_diff']

/**점수 부호에 따른 색상*/
const getSignColor = (sign: number, x: boolean) => {
  if (sign>0)
    return {color: 'limegreen'};
  else if (sign<0)
    return {color: 'red'};
  else if (x===true)
    return {color: 'white'};
  else
    return {color: ''};
}
</script>

<template>
<!-- 점수 확인창 -->
<div class="container_show_score_diff">
  <div v-for="(_, i) in class_score_diff"
    :key="i"
    :class="class_score_diff[i]"
    :style="getSignColor(players[i].deltaScore, true)"
  >
    <span v-show="players[i].deltaScore>0">+</span>{{ players[i].deltaScore }}
  </div>
  <div class="ok" @click.stop="emit('save-round')">
    OK
  </div>
</div>
</template>

<style scoped>
/* 점수 확인창 */
.container_show_score_diff{
  display: grid;
  grid-template-rows: repeat(3, 100px);
  grid-template-columns: repeat(3, 100px);
  grid-template-areas:
    '. up_score_diff .'
    'left_score_diff ok right_score_diff'
    '. down_score_diff .';
  text-align: center;
  line-height: 100px;
  font-size: 30px;
  place-items: center;
}
.down_score_diff{
  grid-area: down_score_diff;
  transform: rotate(0deg);
}
.right_score_diff{
  grid-area: right_score_diff;
  transform: rotate(270deg);
}
.up_score_diff{
  grid-area: up_score_diff;
  transform: rotate(180deg);
}
.left_score_diff{
  grid-area: left_score_diff;
  transform: rotate(90deg);
}
.ok{
  grid-area: ok;
  font-size: 60px;
}
</style>