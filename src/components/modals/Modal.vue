<script setup lang="ts">
import Graphics from "@/components/Graphics.vue"
import { ModalChooseDraw, ModalCheckPlayer, ModalScoreSelect, ModalScoreResult } from "@/components/modals/scoring";
import { ModalDice, ModalTile } from "@/components/modals/setup";
import { ModalChooseMenu } from "@/components/modals/system";
import { ModalRecordList } from "@/components/modals/stats";
import type { Player, ScoringState, PanelInfo, Dice, SeatTile, Records, Option, ModalInfo, SyncInfo } from "@/types/types.d"
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { Line as LineChart } from "vue-chartjs"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, type ChartOptions } from "chart.js"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**차트 컴포넌트 등록*/
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
ChartJS.defaults.font.family = "'Noto Serif KR', 'Noto Serif JP', 'Noto Serif', serif" // 폰트 설정
ChartJS.defaults.color = '#000000' // 기본 글자색 설정

/**props 정의*/
interface Props {
  players: Player[],
  scoringState: ScoringState,
  panelInfo: PanelInfo,
  dice: Dice,
  seatTile: SeatTile,
  records: Records,
  option: Option,
  modalInfo: ModalInfo,
  syncInfo: SyncInfo
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void,
  (e: 'hide-modal'): void,
  (e: 'set-arrow-button', status: string, idx: number): void,
  (e: 'set-toggle-button', status: string): void,
  (e: 'set-fanbu-button', status: string, idx: number): void,
  (e: 'set-seat-tile', idx: number): void,
  (e: 'check-invalid-status', status: string): void,
  (e: 'calculate-win'): void,
  (e: 'calculate-draw'): void,
  (e: 'save-round'): void,
  (e: 'roll-dice'): void,
  (e: 'copy-record'): void,
  (e: 'rollback-record', time: number): void,
  (e: 'change-locale', language: string): void,
  (e: 'init-multiplayer', id?: string): void,
  (e: 'copy-room-id'): void,
}
const emit = defineEmits<Emits>()

/**data 정의*/
const arr_wind = ['東', '南', '西', '北']
const arr_seat = ['option.east', 'option.south', 'option.west', 'option.north',]
const arr_resultsheet = ['resultSheet.wind', 'resultSheet.name', 'resultSheet.score', 'resultSheet.riichi', 'resultSheet.win', 'resultSheet.lose']
const class_resultsheet = ['wind', 'name', 'score', 'riichi', 'win', 'lose']

import { ref } from 'vue';
const targetRoomId = ref('');     // 입력창에 적힌 방 ID

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

/**점수차트 정보 계산*/
const scoreChartInfo = computed(() => {
  let datasets=props.players.map((_, idx) => ({
    label: props.players[idx].name, // 이름 가져오기
    data: props.records.score[idx].filter((_, i) => i%2===0), // 점수기록 가져오기)
    borderColor: ['#ff6384', '#4bc0c0', '#36a2eb', '#ffce56'][idx], // 선 색상
    backgroundColor: ['#ff6384', '#4bc0c0', '#36a2eb', '#ffce56'][idx], // 점 색상
    pointRadius: 3, // 점 크기
  }));
  let times=['', ...props.records.time.filter((_, i) => i%2===1)]; // 시간 가져오기
  let tmp='';
  for (let i=1;i<times.length;i++){
    if (tmp==='' || tmp!==times[i][0]+times[i][1]){ // 이전국이랑 다르면
      tmp=times[i][0]+times[i][1]; // 앞 두 글자 저장
      times[i]=tmp;
    }
    else
      times[i]=''; // 같으면 빈 문자열로 변경
  }
  let data={
    labels: times,
    datasets: datasets
  };
  let options: ChartOptions<'line'> = {
    responsive: true, // 반응형
    maintainAspectRatio: false, // 크기조절
    animations: {
      y: {
        from: (ctx) => {
          const yScale = ctx.chart.scales.y;
          return yScale.getPixelForValue(25000); // 애니메이션 시작점 25000
        }
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // 모든 라벨 표시
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true, // 범례 모양 변경
          pointStyle: 'rectRounded',
        }
      },
    },
  };
  return {
    data: data,
    options: options
  };
})

/**토글 버튼 색상*/
const toggleButtonStyle = (status: string) => {
  if (status==='isfao') // 점수창 책임지불 OX
    return {color: props.scoringState.isFao===true ? 'mediumblue' : 'red'};
  else if (status==='roundmangan') // 유국만관 옵션
    return {color: props.option.roundMangan===true ? 'mediumblue' : 'red'};
  else if (status==='tobi') // 토비 옵션
    return {color: props.option.tobi===true ? 'mediumblue' : 'red'};
  else if (status==='cheatscore') // 촌보점수 옵션
    return {color: props.option.cheatScore===true ? 'mediumblue' : 'red'};
  else if (status==='endriichi') // 공탁처리 옵션
    return {color: props.option.riichiPayout===true ? 'mediumblue' : 'red'};
  else if (status==='isonline') // 싱크 온/오프라인
    return {color: props.syncInfo.isConnected===true ? 'limegreen' : 'gray'};
}

/**주사위 모달창 회전*/
const diceModalTransform = () => {
  return {transform: `translate(-50%, -50%) rotate(${360-props.players.findIndex(player => player.wind==='東')*90}deg)`};
}

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
<div class="modal" @click="emit('hide-modal')">
  <!-- 화료 인원 선택창 -->
  <div v-if="modalInfo.type==='check_player_win'" class="modal_content" @click.stop>
    <ModalCheckPlayer
      :players
      :scoringState
      actionType="win"
      @set-arrow-button="(status, idx) => emit('set-arrow-button', status, idx)"
      @check-invalid-status="(status) => emit('check-invalid-status', status)"
    />
  </div>
  <!--방총 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_lose'" class="modal_content" @click.stop>
    <ModalCheckPlayer
      :players
      :scoringState
      actionType="lose"
      @set-arrow-button="(status, idx) => emit('set-arrow-button', status, idx)"
      @check-invalid-status="(status) => emit('check-invalid-status', status)"
    />
  </div>
  <!-- 부/판 선택창 -->
  <div v-else-if="modalInfo.type==='choose_score'" class="modal_content" @click.stop>
    <ModalScoreSelect
      :players
      :scoringState
      :modalInfo
      actionType="fanbu"
      @show-modal="(type, status?) => emit('show-modal', type, status)"
      @set-toggle-button="(status) => emit('set-toggle-button', status)"
      @set-fanbu-button="(status, idx) => emit('set-fanbu-button', status, idx)"
      @calculate-win="emit('calculate-win')"
    />
  </div>
  <!--책임지불 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_fao'" class="modal_content" @click.stop>
    <ModalCheckPlayer
      :players
      :scoringState
      actionType="fao"
      @set-arrow-button="(status, idx) => emit('set-arrow-button', status, idx)"
      @check-invalid-status="(status) => emit('check-invalid-status', status)"
    />
  </div>
  <!-- 책임지불 점수 선택창 -->
  <div v-else-if="modalInfo.type==='choose_score_fao'" class="modal_content" @click.stop>
    <ModalScoreSelect
      :players
      :scoringState
      :modalInfo
      actionType="fao"
      @show-modal="(type, status?) => emit('show-modal', type, status)"
      @set-toggle-button="(status) => emit('set-toggle-button', status)"
      @set-fanbu-button="(status, idx) => emit('set-fanbu-button', status, idx)"
      @calculate-win="emit('calculate-win')"
    />
  </div>
  <!-- 유국 종류 선택창 -->
  <div v-else-if="modalInfo.type==='choose_draw_kind'" class="modal_content" @click.stop>
    <ModalChooseDraw
      @show-modal="(type, status?) => emit('show-modal', type, status)"
    />
  </div>
  <!-- 텐파이 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_tenpai'" class="modal_content" @click.stop>
    <ModalCheckPlayer
      :players
      :scoringState
      actionType="tenpai"
      @set-arrow-button="(status, idx) => emit('set-arrow-button', status, idx)"
      @check-invalid-status="(status) => emit('check-invalid-status', status)"
    />
  </div>
  <!-- 촌보 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_cheat'" class="modal_content" @click.stop>
    <ModalCheckPlayer
      :players
      :scoringState
      actionType="cheat"
      @set-arrow-button="(status, idx) => emit('set-arrow-button', status, idx)"
      @check-invalid-status="(status) => emit('check-invalid-status', status)"
    />
  </div>
  <!-- 점수 확인창 -->
  <div v-else-if="modalInfo.type==='show_score'" class="modal_content" style="border-radius:50%;" @click.stop>
    <ModalScoreResult
      :players
      @save-round="emit('save-round')"
    />
  </div>
  <!-- 주사위 굴림창 -->
  <div v-else-if="modalInfo.type==='roll_dice'" class="modal_content" :style="diceModalTransform()" @click.stop>
    <ModalDice
      :dice
      @roll-dice="emit('roll-dice')"
    />
  </div>
  <!-- 동남서북 선택창 -->
  <div v-else-if="modalInfo.type==='choose_seat'" class="modal_content" @click.stop>
    <ModalTile
      :seatTile
      @set-seat-tile="(idx) => emit('set-seat-tile', idx)"
    />
  </div>
  <!-- 메뉴 선택창 -->
  <div v-else-if="modalInfo.type==='choose_menu_kind'" class="modal_content" @click.stop>
    <ModalChooseMenu
      @show-modal="(type, status?) => emit('show-modal', type, status)"
      @change-locale="(language) => emit('change-locale', language)"
    />
  </div>
  <!-- 게임 결과창(표) -->
  <div v-else-if="modalInfo.type==='result_sheet'" class="modal_content" @click.stop>
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
        {{ scoreSheetInfo[i].score }}(<span :style="getSignColor(Number(scoreSheetInfo[i].point), false)"><span v-show="Number(scoreSheetInfo[i].point)>0">+</span>{{ scoreSheetInfo[i].point }}</span>)
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
  </div>
  <!-- 게임 결과창(차트) -->
  <div v-else-if="modalInfo.type==='result_chart'" class="modal_content" @click.stop>
    <div class="container_resultchart" @click.stop="emit('show-modal', 'result_sheet')">
      <LineChart :data="scoreChartInfo.data" :options="scoreChartInfo.options"/>
    </div>
  </div>
  <!-- 점수 기록창 -->
  <div v-else-if="modalInfo.type==='show_record'" class="modal_content" @click.stop>
    <ModalRecordList
      :players
      :records
      @show-modal="(type, status?) => emit('show-modal', type, status)"
      @copy-record="emit('copy-record')"
    />
  </div>
  <!-- 점수 롤백창 -->
  <div v-else-if="modalInfo.type==='rollback_record'" class="modal_content" @click.stop>
    <div class="modal_text">
      {{ t('comments.rollbackRecord', {time : records.time[Number(modalInfo.status)]}) }}
    </div>
    <div class="modal_text" style="font-size: 30px;" @click.stop="emit('rollback-record', Number(modalInfo.status))">
      OK
    </div>
  </div>
  <!-- 설정 창 -->
  <div v-else-if="modalInfo.type==='set_options'" class="modal_content" @click.stop>
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
      <div style="grid-area: option6;" @click.stop="emit('set-toggle-button', 'endriichi')">
        {{ t('option.riichiPayout') }}<br>
        <span :style="toggleButtonStyle('endriichi')">
          <span v-show="option.riichiPayout===true">{{ t('option.firstPlace') }}</span>
          <span v-show="option.riichiPayout===false">X</span>
        </span>
      </div>
    </div>
  </div>
  <!-- 동기화 창 -->
  <div v-else-if="modalInfo.type==='sync'" class="modal_content" @click.stop>
    <div v-if="!syncInfo.isConnected" class="container_sync">
      <div class="on_off" :style="toggleButtonStyle('isonline')">
        <Graphics kind="dot" :status="syncInfo.isConnected"/>
        {{ t('sync.offline') }}
      </div>
      <div style="grid-area: room_id;">
        <input
          type="text"
          v-model="targetRoomId"
          :placeholder="t('sync.roomCode')"
          name="roomCode"
        />
      </div>
      <div class="sync_button">
        <div v-if="!targetRoomId">
          <div @click.stop="emit('init-multiplayer')">
            {{ t('sync.create') }}
          </div>
        </div>
        <div v-else>
          <div @click.stop="emit('init-multiplayer', targetRoomId)">
            {{ t('sync.join') }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="container_sync">
      <div class="on_off" :style="toggleButtonStyle('isonline')">
        <graphics kind="dot" :status="syncInfo.isConnected"/>
        {{ t('sync.online') }}
      </div>
      <div style="grid-area: room_id;">
        {{ t('sync.roomCode') }}: {{ syncInfo.roomId }}
      </div>
      <div class="sync_button">
        <div @click.stop="emit('copy-room-id')">
          {{ t('sync.copy') }}
        </div>
      </div>
    </div>
  </div>
  <!-- 메시지 팝업창 -->
  <div v-else class="modal_content" @click.stop>
    <div class="modal_text">{{ modalInfo.type }}</div>
  </div>
</div>
</template>

<style scoped>
/* 기본 모달창 */
.modal {
  position: fixed;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}
.modal_content {
  background-color: #ffffff;
  position: fixed;
  text-align: center;
  white-space: nowrap;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  padding: 5px;
  z-index: 10;
}

/* 메시지 팝업창 */
.modal_text{
  font-size: 20px;
  margin: 20px;
}

/* 옵션 선택창 */
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

/* 게임 결과창(차트)*/
.container_resultchart{
  width: 490px;
  height: 240px;
  margin: 5px;
}

/* 점수 연동창 */
.container_sync{
  display: grid;
  grid-template-rows: 50px 75px;
  grid-template-columns: 170px 180px;
  grid-template-areas:
    'on_off sync_button'
    'room_id room_id';
  text-align: center;
  font-size: 30px;
  margin: 10px;
  place-items: center;
}
.on_off{
  grid-area: on_off;
  font-size: 25px;
}
.sync_button{
  grid-area: sync_button;
  color: red;
}
.container_sync input{
  font-size: 30px;
  width: 300px;
}
.container_sync input::placeholder {
  font-size: 25px;
}
</style>