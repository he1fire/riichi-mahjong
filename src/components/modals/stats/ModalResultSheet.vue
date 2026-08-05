<script setup lang="ts">
import type { Player, PanelInfo, Records, Option } from "@/types/types.d"
import { computed } from "vue"
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**props 정의*/
interface Props {
  players: Player[],
  panelInfo: PanelInfo,
  records: Records,
  option: Option
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void
}
const emit = defineEmits<Emits>()

/**data 정의*/
const arr_wind = ['東', '南', '西', '北']
const arr_resultsheet = ['resultSheet.wind', 'resultSheet.name', 'resultSheet.score', 'resultSheet.riichi', 'resultSheet.win', 'resultSheet.lose']
const class_resultsheet = ['wind', 'name', 'score', 'riichi', 'win', 'lose']

/**순위표 정보 계산*/
const scoreSheetInfo = computed(() => {
  return props.players.map((_, idx) => {
    let myScore=props.players[idx].displayScore;
    let point=0 // 점수기반
    let oka=(props.option.returnScore*4-props.option.startingScore*4)/1000; // 오카
    let uma=0; // 우마
    let rank=props.players.filter(x => x.displayScore>myScore).length+1; // 순위
    let cnt=props.players.filter(x => x.displayScore===myScore).length; // 동점자 수
    for (let i=0;i<cnt;i++) // 동점자의 모든 우마 더하기
      uma+=Number(props.option.rankUma[rank+i-1]);
    if (rank===1){ // 1위라면 오카도 더하기
      uma+=oka;
      if (props.option.riichiPayout) // 1위에게 공탁금을 몰아주는 경우 (100점단위)
        myScore+=Math.floor(((props.panelInfo.riichi*1000)/cnt)/100)*100;
    }
    uma/=cnt; // 동점자 수만큼 우마 나누기
    point=(myScore-props.option.returnScore)/1000+uma;
    let cntRiichi=0, cntWin=0, cntLose=0;
    for (let i=0;i<props.records.riichi.length;i++){
      if (props.records.riichi[i][idx]===true)
        cntRiichi++;
      if (props.records.win[i][idx]===true)
        cntWin++;
      if (props.records.lose[i][idx]===true)
        cntLose++;
    }
    return {
      score: myScore,
      point: point.toFixed(1),
      cntRiichi,
      cntWin,
      cntLose
    };
  });
})

/**점수 부호에 따른 색상*/
const getSignColor = (sign: number) => {
  if (sign>0)
    return {color: 'limegreen'};
  else if (sign<0)
    return {color: 'red'};
  else
    return {color: ''};
}
</script>

<template>
<!-- 게임 결과창(표) -->
<div class="container_resultsheet" @click.stop="emit('show-modal', 'result_chart')">
  <div v-for="(_, i) in class_resultsheet" 
    :key="i"
    :class="class_resultsheet[i]"
    style="font-weight: bold;"
  >
    {{ t(arr_resultsheet[i]) }}
  </div>
  <div style="grid-area: wind_contents;">
    <div v-for="(_, i) in arr_wind" :key="i">{{ arr_wind[i] }}</div>
  </div>
  <div style="grid-area: name_contents;">
    <div v-for="(_, i) in players" :key="i">{{ players[i].name }}</div>
  </div>
  <div style="grid-area: score_contents;">
    <div v-for="(_, i) in scoreSheetInfo" :key="i">
    {{ scoreSheetInfo[i].score }}(<span :style="getSignColor(Number(scoreSheetInfo[i].point))"><span v-show="Number(scoreSheetInfo[i].point)>0">+</span>{{ scoreSheetInfo[i].point }}</span>)
    </div>
  </div>
  <div style="grid-area: riichi_contents;">
    <div v-for="(_, i) in scoreSheetInfo" :key="i">{{ scoreSheetInfo[i].cntRiichi }}</div>
  </div>
  <div style="grid-area: win_contents;">
    <div v-for="(_, i) in scoreSheetInfo" :key="i">{{ scoreSheetInfo[i].cntWin }}</div>
  </div>
  <div style="grid-area: lose_contents;">
    <div v-for="(_, i) in scoreSheetInfo" :key="i">{{ scoreSheetInfo[i].cntLose }}</div>
  </div>
</div>
</template>

<style scoped>
/* 게임 결과창(표)*/
.container_resultsheet{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 60px 100px 150px repeat(3, 60px);
  grid-template-areas:
  'wind name score riichi win lose'
  'wind_contents name_contents score_contents riichi_contents win_contents lose_contents';
  text-align: center;
  font-size: 20px;
  margin: 5px;
}
.container_resultsheet div{
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>