<script setup>
import graphics from '@/components/graphics.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

/**i18n 속성 가져오기*/
const { t, locale } = useI18n()

/**props 정의*/
const props = defineProps({
  players: Array,
  scoringState: Object,
  panelInfo: Object,
  dice: Object,
  seatTile: Object,
  records: Object,
  option: Object,
  modalInfo: Object,
})

/**emits 정의*/
const emit = defineEmits([
  'show-modal',
  'hide-modal',
  'set-arrow-button',
  'set-toggle-button',
  'set-fanbu-button',
  'set-seat-tile',
  'check-invalid-status',
  'calculate-win',
  'calculate-draw',
  'save-round',
  'roll-dice',
  'copy-record',
  'rollback-record'
])

/**data 정의*/
const arr_arrow = ["▼", "▶", "▲", "◀"]
const arr_wind = ["東", "南", "西", "北"];
const arr_seat = ["option.east", "option.south", "option.west", "option.north",]
const arr_resultsheet = ["resultSheet.wind", "resultSheet.name", "resultSheet.score", "resultSheet.riichi", "resultSheet.win", "resultSheet.lose"]
const class_check = ["down_check", "right_check", "up_check", "left_check"]
const class_score_diff = ["down_score_diff", "right_score_diff", "up_score_diff", "left_score_diff"]
const class_dice = ["down_dice", "right_dice", "up_dice", "left_dice"]
const class_name = ["down_name", "right_name", "up_name", "left_name"]
const class_record = ["down_record", "right_record", "up_record", "left_record"]
const class_resultsheet = ["wind", "name", "score", "riichi", "win", "lose"]
const fan = ["1", "2", "3", "4", "5", "6+", "8+", "11+", "13+", "1", "2", "3", "4", "5","6"]
const bu = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110]

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

/**ok 버튼 색상*/
const okButtonStyle = (status) => {
  let cntWin=props.players.filter(x => x.isWin===true).length; // 화료 인원 세기
  let cntLose=props.players.filter(x => x.isLose===true).length; // 방총 인원 세기
  if (status==='win') // 화료 ok 버튼
    return {color: (cntWin===0 || cntWin===4) ? 'gray' : ''}; // 화료한 사람이 없거나 4명임 (불가능한 경우)
  else if (status==='lose') // 방총 ok 버튼
    return {color: (cntWin!==1 && cntLose===0) ? 'gray' : ''}; // 2명 이상 화료했는데 쯔모임 (불가능한 경우)
  else if (status==='cheat') // 촌보 ok 버튼
    return {color: props.scoringState.whoCheat===-1 ? 'gray' : ''}; // 촌보한 사람이 없음 (불가능한 경우)
  else if (status==='fao') // 책임지불 ok 버튼
    return {color: props.scoringState.whoFao===-1 ? 'gray' : ''}; // 책임지불할 사람이 없음 (불가능한 경우)
}

/**화살표 버튼 색상*/
const arrowButtonStyle = (status, idx) => {
  if (status==='win') // 화료 화살표 버튼
    return {color: props.players[idx].isWin===true ? 'red' : ''}; // 선택시 빨간색
  else if (status==='lose') // 방총 화살표 버튼
    return {color: props.players[idx].isWin!==true ? (props.players[idx].isLose===true ? 'red' : '') : 'gray'}; // 선택시 빨간색, 불가능시 회색
  else if (status==='cheat') // 촌보 화살표 버튼
    return {color: props.scoringState.whoCheat===idx ? 'red' : ''}; // 선택시 빨간색
  else if (status==='fao') // 책임지불 화살표 버튼
    return {color: props.scoringState.whoWin!==idx && props.scoringState.whoLose!==idx ? (props.scoringState.whoFao===idx ? 'red' : '') : 'gray'}; // 선택시 빨간색, 불가능시 회색
  else if (status==='tenpai') // 텐파이 화살표 버튼
    return {color: (props.players[idx].isTenpai===true || props.players[idx].isRiichi===true) ? 'red' : ''}; // 선택 또는 리치시 빨간색
}

/**토글 버튼 색상*/
const toggleButtonStyle = (status) => {
  if (status==='isfao') // 점수창 책임지불 OX
    return {color: props.scoringState.isFao===true ? 'mediumblue' : 'red'};
  else if (status==='roundmangan') // 유국만관 옵션
    return {color: props.option.roundMangan===true ? 'mediumblue' : 'red'};
  else if (status==='minusriichi') // 음수리치 옵션
    return {color: props.option.minusRiichi===true ? 'mediumblue' : 'red'};
  else if (status==='cheatscore') // 촌보점수 옵션
    return {color: props.option.cheatScore===true ? 'mediumblue' : 'red'};
  else if (status==='endriichi') // 공탁처리 옵션
    return {color: props.option.riichiPayout===true ? 'mediumblue' : 'red'};
}

/**판/부 버튼 색상*/
const fanBuButtonStyle = (status, idx) => {
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
const yakumanVisibility = (idx) => {
  return {display: ((props.scoringState.inputFan<9 && idx===9) || idx===props.scoringState.inputFan) ? '' : 'none'};
}

/**주사위 모달창 회전*/
const diceModalTransform = () => {
  return {transform: `translate(-50%, -50%) rotate(${360-props.players.findIndex(player => player.wind==='東')*90}deg)`};
}

/**주사위 패산 방향 표시*/
const wallDirectionVisibility = (idx) => {
  return {visibility: props.dice.wallDirection[idx]===true ? 'visible' : 'hidden'};
}

/**타일 앞뒤 표시*/
const seatTileStyle = (idx) => {
  return {gridArea: `tile_${idx+1}`, color: props.seatTile.isOpened[idx]===true ? (props.seatTile.value[idx]==='東' ? 'red' : '') : 'orange', backgroundColor: props.seatTile.isOpened[idx]===true ? '' : 'orange'};
}

/**점수 부호에 따른 색상*/
const getSignColor = (sign, x) => {
  if (sign>0)
    return {color: 'limegreen'};
  else if (sign<0)
    return {color: 'red'};
  else if (x===true)
    return {color: 'white'};
  else
    return {color: ''};
}

/**책임지불이 켜져있는지 확인*/
const checkFao = () => {
  if (props.scoringState.isFao===true) // 책임지불이 있다면 선택창 키기
    emitEvent('show-modal', 'check_player_fao', props.modalInfo.status);
  else
    emitEvent('calculate-win');
}

/**$emit 이벤트 발생*/
const emitEvent = (eventName, ...args) => {
  emit(eventName, ...args);
}
</script>

<template>
<div class="modal" @click="emitEvent('hide-modal')">
  <!-- 화료 인원 선택창 -->
  <div v-if="modalInfo.type==='check_player_win'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        {{ t('comments.checkPlayerWin') }}
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="arrowButtonStyle('win', i)"
        @click.stop="emitEvent('set-arrow-button', 'win', i)"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="okButtonStyle('win')" @click.stop="emitEvent('check-invalid-status', 'win')">
        OK
      </div>
    </div>
  </div>
  <!--방총 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_lose'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        {{ t('comments.checkPlayerLose') }}
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="arrowButtonStyle('lose', i)"
        @click.stop="emitEvent('set-arrow-button', 'lose', i)"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="okButtonStyle('lose')" @click.stop="emitEvent('check-invalid-status', 'lose')">
        OK
      </div>
    </div>
  </div>
  <!-- 판/부 선택창 -->
  <div v-else-if="modalInfo.type==='choose_score'" class="modal_content" @click.stop>
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
        @click.stop="emitEvent('set-fanbu-button', 'fan', i)"
        >
          {{ fan[i] }}
        </span>
        <br>
        <span v-for="(_, i) in fan.slice(9)"
        :key="i"
        :style="[fanBuButtonStyle('fan', i+9), yakumanVisibility(i+9)]"
        @click.stop="emitEvent('set-fanbu-button', 'fan', i+9)"
        >
          {{ t('score.yakuman', {num: fan[i+9]}) }}
        </span>
        <span v-show="scoringState.inputFan>=9" style="font-size: 20px;" @click.stop="emitEvent('set-toggle-button', 'isfao')">({{ t('score.fao') }}
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
          @click.stop="emitEvent('set-fanbu-button', 'bu', i)"
        >
          {{ bu[i] }}
        </span>
        <br>
        <span v-for="(_, i) in bu.slice(6)"
          :key="i"
          :style="fanBuButtonStyle('bu', i+6)"
          @click.stop="emitEvent('set-fanbu-button', 'bu', i+6)"
        >
          {{ bu[i+6] }}
        </span>
      </div>
    </div>
    <div style="font-size: 30px;" @click.stop="checkFao()">
      OK
    </div>
  </div>
  <!--책임지불 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_fao'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        {{ t('comments.checkPlayerFao') }}
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="arrowButtonStyle('fao', i)"
        @click.stop="emitEvent('set-arrow-button', 'fao', i)"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="okButtonStyle('fao')" @click.stop="emitEvent('check-invalid-status', 'fao')">
        OK
      </div>
    </div>
  </div>
  <!-- 책임지불 점수 선택창 -->
  <div v-else-if="modalInfo.type==='choose_score_fao'" class="modal_content" @click.stop>
    <div>
      {{ t('comments.chooseScoreFao') }}
    </div>
    <div class="container_choose_fao_score">
      <span v-for="(_, i) in fan.slice(9)"
        :key="i"
        :style="fanBuButtonStyle('inputfao', i)"
        @click.stop="emitEvent('set-fanbu-button', 'inputfao', i)"
      >
      {{ t('score.yakuman', {num: fan[i+9]}) }}
      </span>
    </div>
    <div style="font-size: 30px;" @click.stop="emitEvent('calculate-win');">
      OK
    </div>
  </div>
  <!-- 유국 종류 선택창 -->
  <div v-else-if="modalInfo.type==='choose_draw_kind'" class="modal_content" @click.stop>
    <div class="modal_choose_draw" @click.stop="emitEvent('show-modal','check_player_tenpai')">
      {{ t('drawKind.normalDraw') }}
    </div>
    <div class="modal_choose_draw" @click.stop="emitEvent('show-modal','show_score', 'special_draw')">
      {{ t('drawKind.specialDraw') }}
    </div>
  </div>
  <!-- 텐파이 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_tenpai'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        {{ t('comments.checkPlayerTenpai') }}
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="arrowButtonStyle('tenpai', i)"
        @click.stop="emitEvent('set-arrow-button', 'tenpai', i)"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" @click.stop="emitEvent('calculate-draw')">
        OK
      </div>
    </div>
  </div>
  <!-- 촌보 인원 선택창 -->
  <div v-else-if="modalInfo.type==='check_player_cheat'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        {{ t('comments.checkPlayerCheat') }}
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="arrowButtonStyle('cheat', i)"
        @click.stop="emitEvent('set-arrow-button', 'cheat', i)"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="okButtonStyle('cheat')" @click.stop="emitEvent('check-invalid-status', 'cheat')">
        OK
      </div>
    </div>
  </div>
  <!-- 점수 확인창 -->
  <div v-else-if="modalInfo.type==='show_score'" class="modal_content" style="border-radius:50%;" @click.stop>
    <div class="container_show_score_diff">
      <div v-for="(_, i) in class_score_diff"
        :key="i"
        :class="class_score_diff[i]"
        :style="getSignColor(players[i].deltaScore, true)"
      >
        <span v-show="players[i].deltaScore>0">+</span>{{ players[i].deltaScore }}
      </div>
      <div class="ok" @click.stop="emitEvent('save-round')">
        OK
      </div>
    </div>
  </div>
  <!-- 주사위 굴림창 -->
  <div v-else-if="modalInfo.type==='roll_dice'" class="modal_content" :style="diceModalTransform()" @click.stop>
    <div class="container_roll" @click.stop="emitEvent('roll-dice')">
      <graphics kind="dice" :value="dice.value[0]" style="grid-area: dice_1; transform: scale(2);"/>
      <graphics kind="dice" :value="dice.value[1]" style="grid-area: dice_2; transform: scale(2);"/>
      <div class="sum">
        <span v-show="dice.wallDirection.every(x => x===false)">?</span>
        <span v-show="dice.wallDirection.some(x => x===true)">{{ dice.value[0]+dice.value[1] }}</span>
      </div>
      <div v-for="(_, i) in class_dice"
        :key="i"
        :class="class_dice[i]"
        :style="wallDirectionVisibility(i)"
      >
        {{ arr_arrow[i] }}
      </div>
    </div>
  </div>
  <!-- 동남서북 선택창 -->
  <div v-else-if="modalInfo.type==='choose_seat'" class="modal_content" @click.stop>
    <div class="container_tile">
      <graphics v-for="(_, i) in seatTile.value"
        :key="i"
        kind="tile"
        :style="seatTileStyle(i)"
        :value="seatTile.value[i]"
        @click.stop="emitEvent('set-seat-tile', i)"
      ></graphics>
    </div>
  </div>
  <!-- 옵션 종류 선택창 -->
  <div v-else-if="modalInfo.type==='choose_menu_kind'" class="modal_content" @click.stop>
    <div class="container_choose_menu">
      <div @click.stop="emitEvent('show-modal', 'result_sheet')">
        {{ t('menu.resultSheet') }}
      </div>
      <div @click.stop="emitEvent('show-modal', 'show_record')">
        {{ t('menu.record') }}
      </div>
      <div @click.stop="emitEvent('show-modal', 'set_options')">
        {{ t('menu.option') }}
      </div>
      <a href="https://github.com/he1fire/riichi-mahjong" target="_blank" style="font-size: 20px; "><img src="/github-logo.svg" alt="SVG" />Github</a>
    </div>
  </div>
  <!-- 게임 결과창 -->
  <div v-else-if="modalInfo.type==='result_sheet'" class="modal_content" @click.stop>
    <div class="container_resultsheet">
      <div v-for="(_, i) in class_resultsheet" 
        :key="i"
        :class="class_resultsheet[i]"
        style="font-size: 25px;"
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
        {{ scoreSheetInfo[i].score }}(<span :style="getSignColor(scoreSheetInfo[i].point, false)"><span v-show="scoreSheetInfo[i].point>0">+</span>{{ scoreSheetInfo[i].point }}</span>)
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
  <!-- 점수 기록창 -->
  <div v-else-if="modalInfo.type==='show_record'" class="modal_content" @click.stop>
    <div class="container_record">
      <div class="copy" @click.stop="emitEvent('copy-record')">
        {{ t('record.copy') }}
      </div>
      <div v-for="(_, i) in class_name"
        :key="i"
        :class="class_name[i]"
      >
        {{ players[i].name }}
      </div>
      <div class="container_record_scroll">
        <div class="when">
          <div v-for="(_, i) in records.time"
            :key="i"
            @click.stop="i%2===1 ? emitEvent('show-modal','rollback_record', i) : {}"
          >
            {{ records.time[i] }}
          </div>
        </div>
        <div v-for="(_, i) in class_record"
          :key="i"
          :class="class_record[i]"
        >
          <div v-for="(_, j) in records.score[i]"
            :key="j"
            :style="j%2===1 ? getSignColor(records.score[i][j], true) : {}"
          >
            <span v-show="j%2===1 && records.score[i][j]>0">+</span>{{ records.score[i][j] }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 점수 롤백창 -->
  <div v-else-if="modalInfo.type==='rollback_record'" class="modal_content" @click.stop>
    <div class="modal_text">
      {{ t('comments.rollbackRecord', {time : records.time[modalInfo.status]}) }}
    </div>
    <div class="modal_text" style="font-size: 30px;" @click.stop="emitEvent('rollback-record', modalInfo.status)">
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
        {{ t(arr_seat[i]) }}({{ arr_wind[i] }})<br>
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
          :placeholder="25000"
          :name="'startingScore'"
        >
      </div>
      <div style="grid-area: option1;">
        {{ t('option.returnScore') }}<br>
        <input 
          type="number"
          v-model="option.returnScore"
          :placeholder="30000"
          :name="'returnScore'"
        >
      </div>
      <div style="grid-area: option2;" @click.stop="emitEvent('set-toggle-button', 'roundmangan')">
        {{ t('option.roundMangan') }}<br>
        <span :style="toggleButtonStyle('roundmangan')">
          <span v-show="option.roundMangan===true">O</span>
          <span v-show="option.roundMangan===false">X</span>
        </span>
      </div>
      <div style="grid-area: option3;" @click.stop="emitEvent('set-toggle-button', 'minusriichi')">
        {{ t('option.minusRiichi') }}<br>
        <span :style="toggleButtonStyle('minusriichi')">
          <span v-show="option.minusRiichi===true">O</span>
          <span v-show="option.minusRiichi===false">X</span>
        </span>
      </div>
      <div style="grid-area: option4;">
        {{ t('option.rankUma') }} (1-2-3-4)<br>
        <input
          v-for="(_, i) in option.rankUma"
          :key="i"
          style="width: 41px;"
          type="number"
          v-model="option.rankUma[i]"
          :placeholder="t('option.rank', {idx:i+1})"
          :name="`uma${i+1}`"
          :style="{ marginRight: i===option.rankUma.length-1 ? '0px' : '10px' }"
        >
      </div>  
      <div style="grid-area: option5;" @click.stop="emitEvent('set-toggle-button', 'cheatscore')">
        {{ t('option.cheatScore') }}<br>
        <span :style="toggleButtonStyle('cheatscore')">
          <span v-show="option.cheatScore===true">3000 All</span>
          <span v-show="option.cheatScore===false">{{ t('option.mangan') }}</span>
        </span>
      </div>
      <div style="grid-area: option6;" @click.stop="emitEvent('set-toggle-button', 'endriichi')">
        {{ t('option.riichiPayout') }}<br>
        <span :style="toggleButtonStyle('endriichi')">
          <span v-show="option.riichiPayout===true">{{ t('option.firstPlace') }}</span>
          <span v-show="option.riichiPayout===false">X</span>
        </span>
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
  font-size: 20px;
}

/* 유국 선택창 */
.modal_choose_draw{
  font-size: 40px;
  margin: 20px;
}

/* 메시지 팝업창 */
.modal_text{
  margin: 20px;
}

/* 체크창 */
.container_check{
  display: grid;
  grid-template-rows: auto repeat(3, 100px);
  grid-template-columns: repeat(3, 100px);
  grid-template-areas: 
    "guide_message guide_message guide_message"
    ". up_check ."
    "left_check ok right_check"
    ". down_check .";
  text-align: center;
  font-size: 70px;
  place-items: center;
}
.guide_message{
  grid-area: guide_message;
  font-size: 20px;
}
.down_check{
  grid-area: down_check;
}
.right_check{
  grid-area: right_check;
}
.up_check{
  grid-area: up_check;
}
.left_check{
  grid-area: left_check;
}

/* 부/판 체크창 */
.container_check_fanbu{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 60px auto;
  grid-template-areas:
  "fan fan_check"
  "bu bu_check";
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

/* 점수 확인창 */
.container_show_score_diff{
  display: grid;
  grid-template-rows: repeat(3, 100px);
  grid-template-columns: repeat(3, 100px);
  grid-template-areas:
    ". up_score_diff ."
    "left_score_diff ok right_score_diff"
    ". down_score_diff .";
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

/* 주사위 굴림창 */
.container_roll{
  display: grid;
  grid-template-rows: 15px 86px 15px;
  grid-template-columns: repeat(3, 15px 86px) 15px;
  grid-template-areas:
    ". dice_1 . up_dice . dice_2 ."
    ". dice_1 left_dice sum right_dice dice_2 ."
    ". dice_1 . down_dice . dice_2 .";
  text-align: center;
  font-size: 15px;
}
.sum{
  grid-area: sum;
  font-size: 50px;
  line-height: 82px;
  text-underline-position: under;
  text-decoration: underline red 3px;
}
.down_dice{
  grid-area: down_dice;
  visibility: hidden;
  line-height: 15px;
  color: red;
}
.right_dice{
  grid-area: right_dice;
  visibility: hidden;
  line-height: 82px;
  color: red;
}
.up_dice{
  grid-area: up_dice;
  visibility: hidden;
  line-height: 15px;
  color: red;
}
.left_dice{
  grid-area: left_dice;
  visibility: hidden;
  line-height: 82px;
  color: red;
}

/* 자리 선택창 */
.container_tile{
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(3, 86px 15px) 86px;
  grid-template-areas:
    "tile_1 . tile_2 . tile_3 . tile_4";
  text-align: center;
  font-size: 80px;
  margin: 15px;
}

/* 옵션 선택창 */
.container_choose_menu{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(2, auto);
  font-size: 30px;
  gap: 30px;
  margin: 15px;
  place-items: center;
}

/* 점수 기록창 */
.container_record{
  display: grid;
  grid-template-rows: 35px 200px;
  grid-template-columns: 120px repeat(4, 100px);
  grid-template-areas: 
  "copy down_name right_name up_name left_name"
  "scroll scroll scroll scroll scroll";
  text-align: center;
  font-size: 25px;
  margin: 5px;
}
.copy{
  grid-area: copy;
  color: red; 
  font-size: 20px;
}
.container_record_scroll{
  grid-area: scroll;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 120px repeat(4, 100px);
  grid-template-areas: 
  "when down_record right_record up_record left_record";
  text-align: center;
  font-size: 20px;
  overflow: auto;
}
.when{
  grid-area: when;
}

/* 옵션 선택창 */
.container_option{
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-template-columns: repeat(4, auto);
  grid-template-areas:
  "input_name0 input_name1 input_name2 input_name3"
  "option0 option1 option2 option3"
  "option4 option4 option5 option6";
  text-align: center;
  gap: 10px;
  margin: 5px;
}
/* 게임 결과창 */
.container_resultsheet{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 60px 100px 150px repeat(3, 60px);
  grid-template-areas:
  "wind name score riichi win lose"
  "wind_contents name_contents score_contents riichi_contents win_contents lose_contents";
  text-align: center;
  margin: 5px;
}
.container_resultsheet div{
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>
