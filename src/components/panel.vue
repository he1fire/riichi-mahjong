<script setup>
import graphics from '@/components/graphics.vue';

/**props 정의*/
const props = defineProps({
  panelInfo: Object,
})

/**emits 정의*/
const emit = defineEmits([
  'show-modal',
  'roll-dice'
])

/**emit 이벤트 발생*/
const emitEvent = (eventName, ...args) => {
  emit(eventName, ...args)
}
</script>

<template>
<div class="container_mid" id='Mid'>
  <!-- 현재 라운드 -->
  <div class="now" @click="emitEvent('show-modal', 'roll_dice'), emitEvent('roll-dice')">
    {{ panelInfo.wind }} {{ panelInfo.round }} 局
  </div>
  <!-- 현재 총 리치봉 -->
  <div class="riichi">
    <graphics kind="riichiStickMini"/>
    <span>x {{ panelInfo.riichi }}</span>
  </div>
  <!-- 현재 연장봉 -->
  <div class="renchan">
    <graphics kind="renchanStickMini"/>
    <span>x {{ panelInfo.renchan }}</span>
  </div>
  <!-- 화료 버튼 -->
  <div class="win" @click="emitEvent('show-modal', 'check_player_win')">
    화료
  </div>
  <!-- 유국 버튼 -->
  <div class="draw" @click="emitEvent('show-modal', 'choose_draw_kind')">
    유국
  </div>
  <!-- 촌보 버튼 -->
  <div class="cheat" @click="emitEvent('show-modal', 'check_player_cheat')">
    촌보
  </div>
</div>
<!-- 옵션 버튼 -->
<div id='Menu' @click="emitEvent('show-modal', 'choose_menu_kind')">
  <graphics kind="gear"/>
</div>
</template>

<style scoped>
/* 정보창 위치 */
#Mid{
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 메뉴창 위치 */
#Menu{
  position: fixed;
  transform: scale(0.75);
  top: 5px;
  left: 5px;
}

/* 정보창 */
.container_mid{
  display: grid;
  grid-template-rows: 50px 50px 70px;
  grid-template-columns: repeat(3, 130px);
  grid-template-areas: 
    "now now win"
    "now now draw"
    "riichi renchan cheat";
  position: fixed;
  text-align: center;
  font-size: 40px;
  place-items: center;
}
.now{
  grid-area: now;
  font-size: 70px;
}
.riichi{
  grid-area: riichi;
  margin: 0 auto 0 auto;
  transform: translate(20px,-10px);
}
.renchan{
  grid-area: renchan;
  margin: auto;
  transform: translate(20px,-10px);
}
.cheat{
  grid-area: cheat;
  /* display: flex; */
}
.win{
  grid-area: win;
}
.draw{
  grid-area: draw;
}
</style>
