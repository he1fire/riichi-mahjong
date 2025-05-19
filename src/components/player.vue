<script>
import graphics from './graphics.vue'
export default {
  components: {
    graphics,
  },
  props: {
    seat: String,
    wind: String,
    scoreHigh: Number,
    scoreLow: Number,
    rank: Number,
    scoreEffect: Number,
    scoreGap: Number,
    isRiichi: Boolean,
    isGap: Boolean,
    optMinusRiichi: Boolean,
  },
  emits: ['toggle-active-riichi', 'toggle-show-gap'],
  data(){
    return {
    };
  },
  methods: {
    /**본인 바람이 동이라면 붉은색 표시*/
    isEast() {
      return {color: this.wind==='東' ? 'red' : ''};
    },
    /**리치가 불가능하면 회색 표시*/
    ableRiichi() {
      return {color: (this.scoreHigh<10 && this.optMinusRiichi===false) ? 'gray' : ''};
    },
    /**리치봉 표시*/
    showRiichi() {
      return {visibility: this.isRiichi===true ? 'visible' : 'hidden'};
    },
    /**점수 변동에 따른 글자색*/
    isDiff(x) {
      if (x>0) // 양수일때
        return {color: 'limegreen'};
      else if (x<0) // 음수일때
        return {color: 'red'};
      else
        return {color: ''};
    },
    /**$emit 이벤트 발생*/
    emitEvent(eventName, ...args) {
      this.$emit(eventName, ...args);
    },
    /**점수 차이 보여주기*/
    toggleShowGap(x){
      this.emitEvent('toggle-show-gap', this.seat, x);
    },
  }
};
</script>

<template>
<div class="container_player" :id=seat>
  <!-- 리치봉 -->
  <graphics kind="riichiStick" class="stick" :style="showRiichi()"/>
  <!-- 현재 바람 -->
  <div class="wind" :style="isEast()"
    @mousedown="toggleShowGap(true)"
    @mouseup="toggleShowGap(false)"
    @mouseleave="toggleShowGap(false)"
    @touchstart="toggleShowGap(true)"
    @touchend="toggleShowGap(false)"
    @touchcancel="toggleShowGap(false)"
    >
    {{ wind }}
  </div>
  <!-- 현재 점수 -->
  <div class="score" >
    <div v-if="isGap===false" :style="ableRiichi()" @click="emitEvent('toggle-active-riichi', this.seat)">
      {{ scoreHigh }}<span style="font-size: 50px;"><span v-if="this.scoreLow<10">0</span>{{ scoreLow }}</span>
    </div>
    <div v-else :style="isDiff(this.scoreGap)">
      <span v-show="scoreGap>0">+</span>{{ scoreGap }}<span style="font-size: 50px;">00</span>
    </div>
  </div>
  <!-- 순위 표시 -->
  <div v-show="rank!==0" class="rank" :style="{color: this.rank===1 ? 'red' : ''}">
    {{ rank }}
  </div>
  <!-- 변경되는 점수 -->
  <div v-show="scoreEffect!==0" class="change" :style="isDiff(this.scoreEffect)">
    <span v-show="scoreEffect>0">+</span>{{ scoreEffect }}
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
