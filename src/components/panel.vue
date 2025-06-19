<script setup lang='ts'>
import graphics from '@/components/graphics.vue';
import type { PanelInfo } from '@/types/types.d';
import { useI18n } from 'vue-i18n'

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**props 정의*/
interface Props {
  panelInfo: PanelInfo,
}
defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', modal: string): void,
  (e: 'roll-dice'): void
}
const emit = defineEmits<Emits>()
</script>

<template>
<div class="container_mid" id='Mid'>
  <!-- 현재 라운드 -->
  <div class="now" @click="emit('show-modal', 'roll_dice'), emit('roll-dice')">
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
  <div class="win" @click="emit('show-modal', 'check_player_win')">
    {{ t('panel.win') }}
  </div>
  <!-- 유국 버튼 -->
  <div class="draw" @click="emit('show-modal', 'choose_draw_kind')">
    {{ t('panel.draw') }}
  </div>
  <!-- 촌보 버튼 -->
  <div class="cheat" @click="emit('show-modal', 'check_player_cheat')">
    {{ t('panel.cheat') }}
  </div>
</div>
<!-- 옵션 버튼 -->
<div id='Menu' @click="emit('show-modal', 'choose_menu_kind')">
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