<script setup lang="ts">
import graphics from "@/components/graphics.vue"
import type { Player, Option } from "@/types/types.d";
import { computed } from "vue"

/**props 정의*/
interface Props {
  player: Player,
  option: Option,
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'toggle-active-riichi', seat: string): void,
  (e: 'toggle-show-gap', seat: string, toggle: boolean): void
}
const emit = defineEmits<Emits>()

/**100 자리 이상 점수*/
const displayScoreHigh = computed(() => {
  return Math.floor(props.player.displayScore/100);
})

/**100 자리 이하 점수*/
const displayScoreLow = computed(() => {
  return Math.abs(props.player.displayScore%100);
})

/**100 자리 이상 점수 차이*/
const gapScoreHigh = computed(() => {
  return Math.floor(props.player.gapScore/100);
})

/**순위별 접미사*/
const displayRank = computed(() => {
  return props.player.rank+['st', 'nd', 'rd', 'th'][props.player.rank-1];
})

/**자풍이 東이라면 붉은색 표시*/
const windStyle = () => {
  return {color: props.player.wind==='東' ? 'red' : ''}
}

/**리치가 불가능하면 회색 표시*/
const displayScoreStyle = () => {
  return {color: props.player.displayScore<1000 && props.option.tobi===true ? 'gray' : ''}
}

/**리치봉 표시*/
const riichiStickVisibility = () => {
  return {visibility: props.player.isRiichi===true ? 'visible' : 'hidden'}
}

/**점수 부호에 따른 색상*/
const getSignColor = (x: number) => {
  if (x>0)
    return {color: 'limegreen'}
  else if (x<0)
    return {color: 'red'}
  else
    return {color: ''}
}
</script>

<template>
<div class="container_player" :id=player.seat>
  <!-- 리치봉 -->
  <graphics kind="riichiStick" class="stick" :style="riichiStickVisibility()"/>
  <!-- 현재 바람 -->
  <div class="wind" :style="windStyle()"
    @mousedown="emit('toggle-show-gap', player.seat, true)"
    @mouseup="emit('toggle-show-gap', player.seat, false)"
    @mouseleave="emit('toggle-show-gap', player.seat, false)"
    @touchstart="emit('toggle-show-gap', player.seat, true)"
    @touchend="emit('toggle-show-gap', player.seat, false)"
    @touchcancel="emit('toggle-show-gap', player.seat, false)"
  >
    {{ player.wind }}
  </div>
  <!-- 현재 점수 -->
  <div class="score">
    <div v-if="isNaN(player.gapScore)" :style="displayScoreStyle()" @click="emit('toggle-active-riichi', player.seat)">
      {{ displayScoreHigh }}<span style="font-size: 50px;"><span v-show="displayScoreLow<10">0</span>{{ displayScoreLow }}</span>
    </div>
    <div v-else :style="getSignColor(player.gapScore)">
      <span v-show="gapScoreHigh>0">+</span>{{ gapScoreHigh }}<span style="font-size: 50px;">00</span>
    </div>
  </div>
  <!-- 순위 표시 -->
  <div v-show="player.rank!==0" class="rank" :style="{color: player.rank===1 ? 'red' : ''}">
    {{ displayRank }}
  </div>
  <!-- 변경되는 점수 -->
  <div v-show="player.effectScore!==0" class="change" :style="getSignColor(player.effectScore)">
    <span v-show="player.effectScore>0">+</span>{{ player.effectScore }}
  </div>
</div>
</template>

<style scoped>
/* 플레이어창 위치 */
#Down{
  bottom: 0;
  right: 50%;
  transform: translate(50%, 0%) translateY(5px);
}
#Right{
  top: 50%;
  right: 0;
  -ms-transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg) translate(25%, 50%) translateY(5px);
}
#Up{
  top: 0;
  right: 50%;
  -ms-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg) translate(-50%, 0%) translateY(5px);
}
#Left{
  top: 50%;
  left: 0;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg) translate(-25%, 50%) translateY(5px);
}
/* 플레이어창 */
.container_player{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(4, auto);
  grid-template-areas: 
    '. stick stick .'
    'rank wind score change';
  position: fixed;
  text-align: center;
  font-size: 80px;
}
.stick{
  grid-area: stick;
}
.wind{
  grid-area: wind;
  margin: auto;
}
.score{
  grid-area: score;
  width: 200px;
  margin: auto;
  white-space: nowrap;
}
.rank{
  grid-area: rank;
  width: 0px;
  font-size: 25px;
  font-weight: bold;
  transform: rotate(-90deg) translate(-10px, 30px);
}
.change{
  grid-area: change;
  width: 0px;
  font-size: 30px;
  text-align: left;
  transform: translate(-100px, -10px);
}
</style>