<script setup lang="ts">
import type { Player, ScoringState, ModalInfo } from "@/types/types.d"
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**props 정의*/
interface Props {
  players: Player[],
  scoringState: ScoringState,
  modalInfo: ModalInfo,
  actionType: 'fanbu' | 'fao'
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void,
  (e: 'set-toggle-button', status: string): void,
  (e: 'set-fanbu-button', status: string, idx: number): void,
  (e: 'calculate-win'): void
}
const emit = defineEmits<Emits>()

/**data 정의*/
const fan = ['1', '2', '3', '4', '5', '6+', '8+', '11+', '13+', '1', '2', '3', '4', '5','6']
const bu = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]

/**부/판 버튼 색상*/
const fanBuButtonStyle = (status: string, idx: number) => {
  if (status==='fan') // 판 체크
    return {color: idx===props.scoringState.inputFan ? 'red' : ''};
  else if (status==='bu'){ // 부 체크
    if (props.modalInfo.status==='ron' && idx===0) // 론일때 20부 이하시 회색
      return {color: 'gray'};
    else if (props.scoringState.inputFan===0 && idx<=1) // 1판 25부 이하시 회색
      return {color: 'gray'};
    else if (props.scoringState.inputFan>=4) // 만관 이상일때 부수 회색
      return {color: 'gray'};
    else
      return {color: idx===props.scoringState.inputBu ? 'red' : ''}; // 선택시 빨간색
  }
  else if (status==='inputfao'){ // 책임지불 점수창
    if (props.scoringState.inputFan-9<idx) // 입력 판수보다 크면 불가능
      return {color: 'gray'};
    else
      return {color: idx===props.scoringState.inputFao ? 'red' : ''}; // 선택시 빨간색
  }
}

/**역만인지 확인하고 숨기기*/
const yakumanVisibility = (idx: number) => {
  return {display: ((props.scoringState.inputFan<9 && idx===9) || idx===props.scoringState.inputFan) ? '' : 'none'};
}

/**토글 버튼 색상*/
const toggleButtonStyle = (status: string) => {
  if (status==='isfao') // 점수창 책임지불 OX
    return {color: props.scoringState.isFao===true ? 'mediumblue' : 'red'};
}

/**책임지불이 켜져있는지 확인*/
const checkFao = () => {
  if (props.scoringState.isFao===true) // 책임지불이 있다면 선택창 키기
    emit('show-modal', 'check_player_fao', props.modalInfo.status);
  else // 아니라면 점수계산으로
    emit('calculate-win');
}
</script>

<template>
<!-- 부/판 선택창 -->
<div v-if="actionType==='fanbu'">
  <div>
    {{ t('comments.chooseScore', {name: players[scoringState.whoWin].name}) }}
  </div>
  <div class="container_check_fanbu">
    <div class="fan">
      {{ t('score.fan') }}:
    </div>
    <div class="fan_check">
      <span v-for="(_, i) in fan.slice(0, 9)"
      :key="i"
      :style="fanBuButtonStyle('fan', i)"
      @click.stop="emit('set-fanbu-button', 'fan', i)"
      >
        {{ fan[i] }}
      </span>
      <br>
      <span v-show="scoringState.inputFan<9"
      @click.stop="emit('set-fanbu-button', 'fan', 9)"
      >
        {{ t('score.yakuman') }}
      </span>
      <span v-show="scoringState.inputFan>=9" v-for="(_, i) in fan.slice(9)"
      :key="i"
      :style="[fanBuButtonStyle('fan', i+9), yakumanVisibility(i+9)]"
      @click.stop="emit('set-fanbu-button', 'fan', i+9)"
      >
        {{ t('score.multipleYakuman', {num: fan[i+9]}) }}
      </span>
      <span v-show="scoringState.inputFan>=9" style="font-size: 20px;" @click.stop="emit('set-toggle-button', 'isfao')">({{ t('score.fao') }}
        <span :style="toggleButtonStyle('isfao')">
          <span v-show="scoringState.isFao===true">O</span>
          <span v-show="scoringState.isFao===false">X</span>
        </span>
      )</span>
    </div>
    <div class="bu">
      {{ t('score.bu') }}:
    </div>
    <div class="bu_check">
      <span v-for="(_, i) in bu.slice(0, 6)"
        :key="i"
        :style="fanBuButtonStyle('bu', i)"
        @click.stop="emit('set-fanbu-button', 'bu', i)"
      >
        {{ bu[i] }}
      </span>
      <br>
      <span v-for="(_, i) in bu.slice(6)"
        :key="i"
        :style="fanBuButtonStyle('bu', i+6)"
        @click.stop="emit('set-fanbu-button', 'bu', i+6)"
      >
        {{ bu[i+6] }}
      </span>
    </div>
  </div>
  <div style="font-size: 30px;" @click.stop="checkFao()">
    OK
  </div>
</div>
<!-- 책임지불 점수 선택창 -->
<div v-else-if="actionType==='fao'">
  <div>
    {{ t('comments.chooseScoreFao') }}
  </div>
  <div class="container_choose_fao_score">
    <span v-for="(_, i) in fan.slice(9)"
      :key="i"
      :style="fanBuButtonStyle('inputfao', i)"
      @click.stop="emit('set-fanbu-button', 'inputfao', i)"
    >
    {{ t('score.multipleYakuman', {num: fan[i+9]}) }}
    </span>
  </div>
  <div style="font-size: 30px;" @click.stop="emit('calculate-win');">
    OK
  </div>
</div>
</template>

<style scoped>
/* 부/판 선택창 */
.container_check_fanbu{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 70px auto;
  grid-template-areas:
  'fan fan_check'
  'bu bu_check';
  text-align: center;
  font-size: 30px;
}
.fan{
  grid-area: fan;
}
.bu{
  grid-area: bu;
}
.fan_check{
  grid-area: fan_check;
}
.bu_check{
  grid-area: bu_check;
}
.fan_check > span,
.bu_check > span {
  padding-right: 5px;
  padding-left: 5px;
}

/* 책임지불 점수 선택창 */
.container_choose_fao_score{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(3, auto);
  font-size: 30px;
  gap: 10px;
  margin: 5px;
  place-items: center;
}
</style>