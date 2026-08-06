<script setup lang="ts">
import type { Player, Option } from "@/types/types.d"
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**props 정의*/
interface Props {
  players: Player[],
  option: Option
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void,
  (e: 'set-toggle-button', status: string): void
}
const emit = defineEmits<Emits>()

/**data 정의*/
const arr_wind = ['東', '南', '西', '北']
const arr_seat = ['option.east', 'option.south', 'option.west', 'option.north']

/**토글 버튼 색상*/
const toggleButtonStyle = (status: string) => {
  if (status==='roundmangan') // 유국만관 옵션
    return {color: props.option.roundMangan===true ? 'mediumblue' : 'red'};
  else if (status==='tobi') // 토비 옵션
    return {color: props.option.tobi===true ? 'mediumblue' : 'red'};
  else if (status==='cheatscore') // 촌보점수 옵션
    return {color: props.option.cheatScore===true ? 'mediumblue' : 'red'};
  else if (status==='riichipayout') // 공탁처리 옵션
    return {color: props.option.riichiPayout===true ? 'mediumblue' : 'red'};
}
</script>

<template>
<!-- 옵션 설정창 -->
<div class="container_option">
  <div
    v-for="(_, i) in arr_seat"
    :key="i"
    :style="`grid-area: input_name${i};`"
  >
    {{ arr_wind[i] }}({{ t(arr_seat[i]) }})<br>
    <input
      type="text"
      maxlength="4"
      v-model="players[i].name"
      :placeholder="t('option.name', {idx:i+1})"
      :name="`name${i+1}`"
    >
  </div>
  <div style="grid-area: option0;">
    {{ t('option.startingScore') }}<br>
    <input 
      type="number"
      v-model="option.startingScore"
      :placeholder="String(25000)"
      :name="'startingScore'"
    >
  </div>
  <div style="grid-area: option1;">
    {{ t('option.returnScore') }}<br>
    <input 
      type="number"
      v-model="option.returnScore"
      :placeholder="String(30000)"
      :name="'returnScore'"
    >
  </div>
  <div style="grid-area: option2;" @click.stop="emit('set-toggle-button', 'roundmangan')">
    {{ t('option.roundMangan') }}<br>
    <span :style="toggleButtonStyle('roundmangan')">
      <span v-show="option.roundMangan===true">O</span>
      <span v-show="option.roundMangan===false">X</span>
    </span>
  </div>
  <div style="grid-area: option3;" @click.stop="emit('set-toggle-button', 'tobi')">
    {{ t('option.tobi') }}<br>
    <span :style="toggleButtonStyle('tobi')">
      <span v-show="option.tobi===true">O</span>
      <span v-show="option.tobi===false">X</span>
    </span>
  </div>
  <div style="grid-area: option4;">
    {{ t('option.rankUma') }} (1-2-3-4)<br>
    <input
      v-for="(_, i) in option.rankUma"
      :key="i"
      style="width: 51px;"
      type="number"
      v-model="option.rankUma[i]"
      :placeholder="t('option.rank', {idx:i+1})"
      :name="`uma${i+1}`"
      :style="{ marginRight: i===option.rankUma.length-1 ? '0px' : '10px' }"
    >
  </div>  
  <div style="grid-area: option5;" @click.stop="emit('set-toggle-button', 'cheatscore')">
    {{ t('option.cheatScore') }}<br>
    <span :style="toggleButtonStyle('cheatscore')">
      <span v-show="option.cheatScore===true">{{ t('option.mangan') }}</span>
      <span v-show="option.cheatScore===false">3000 All</span>
    </span>
  </div>
  <div style="grid-area: option6;" @click.stop="emit('set-toggle-button', 'riichipayout')">
    {{ t('option.riichiPayout') }}<br>
    <span :style="toggleButtonStyle('riichipayout')">
      <span v-show="option.riichiPayout===true">{{ t('option.firstPlace') }}</span>
      <span v-show="option.riichiPayout===false">X</span>
    </span>
  </div>
</div>
</template>

<style scoped>
/* 옵션 설정정창 */
.container_option{
  display: grid;
  grid-template-rows: repeat(3, 60px);
  grid-template-columns: repeat(4, 120px);
  grid-template-areas:
  'input_name0 input_name1 input_name2 input_name3'
  'option0 option1 option2 option3'
  'option4 option4 option5 option6';
  text-align: center;
  font-size: 20px;
  gap: 10px;
  margin: 5px;
}
</style>