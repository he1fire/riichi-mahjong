<script setup>
import graphics from './graphics.vue'
import {computed} from 'vue'

/**props 정의*/
const props = defineProps({
  player: Object,
  isRiichi: Boolean,
  option: Object,
})

/**emits 정의*/
const emit = defineEmits([
  'toggle-active-riichi',
  'toggle-show-gap'
])

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

/**자풍이 東이라면 붉은색 표시*/
const windStyle = () => {
  return {color: props.player.wind==='東' ? 'red' : ''}
}

/**리치가 불가능하면 회색 표시*/
const displayScoreStyle = () => {
  return {color: props.player.displayScore<1000 && props.option.minusRiichi===false ? 'gray' : ''}
}

/**리치봉 표시*/
const riichiStickVisibility = () => {
  return {visibility: props.isRiichi===true ? 'visible' : 'hidden'}
}

/**점수 부호에 따른 색상*/
const getSignColor = (x) => {
  if (x>0)
    return {color: 'limegreen'}
  else if (x<0)
    return {color: 'red'}
  else
    return {color: ''}
}

/**emit 이벤트 발생*/
const emitEvent = (eventName, ...args) => {
  emit(eventName, ...args)
}
</script>

<template>
<div class="container_player" :id=player.seat>
  <!-- 리치봉 -->
  <graphics kind="riichiStick" class="stick" :style="riichiStickVisibility()"/>
  <!-- 현재 바람 -->
  <div class="wind" :style="windStyle()"
    @mousedown="emitEvent('toggle-show-gap', player.seat, true)"
    @mouseup="emitEvent('toggle-show-gap', player.seat, false)"
    @mouseleave="emitEvent('toggle-show-gap', player.seat, false)"
    @touchstart="emitEvent('toggle-show-gap', player.seat, true)"
    @touchend="emitEvent('toggle-show-gap', player.seat, false)"
    @touchcancel="emitEvent('toggle-show-gap', player.seat, false)"
  >
    {{ player.wind }}
  </div>
  <!-- 현재 점수 -->
  <div class="score">
    <div v-if="player.gapScore===null" :style="displayScoreStyle()" @click="emitEvent('toggle-active-riichi', player.seat)">
      {{ displayScoreHigh }}<span style="font-size: 50px;"><span v-show="displayScoreLow<10">0</span>{{ displayScoreLow }}</span>
    </div>
    <div v-else :style="getSignColor(player.gapScore)">
      <span v-show="gapScoreHigh>0">+</span>{{ gapScoreHigh }}<span style="font-size: 50px;">00</span>
    </div>
  </div>
  <!-- 순위 표시 -->
  <div v-show="player.rank!==0" class="rank" :style="{color: player.rank===1 ? 'red' : ''}">
    {{ player.rank }}
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
  margin: 0 -140px 0 0;
  transform: translate(0px, 5px);
}
#Right{
  top: 50%;
  right: 0;
  margin: -70px 0 0 0;
  -ms-transform: rotate(270deg);
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg) translate(0, 78px);
}
#Up{
  top: 0;
  right: 50%;
  margin: 0 -140px 0 0;
  -ms-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg) translate(0px, 5px);
}
#Left{
  top: 50%;
  left: 0;
  margin: -70px 0 0 0;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg) translate(0, 78px);
}
/* 플레이어창 */
.container_player{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(4, auto);
  grid-template-areas: 
    ". stick stick ."
    "rank wind score change ";
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
  font-size: 30px;
  text-align: left;
  font-weight: bold;
  text-decoration: underline 3px;
  transform: translate(-15px, 15px);
}
.change{
  grid-area: change;
  width: 0px;
  font-size: 30px;
  text-align: left;
  transform: translate(-100px, -10px);
}
</style>
