<script setup>
import graphics from './graphics.vue'

/**props 정의*/
const props = defineProps({
  players: Array,
  scoresDiff: Array,
  names: Array,
  focusWinner: Number,
  isFao: Boolean,
  focusFao: Number,
  inputFao: Number,
  inputFan: Number,
  inputBu: Number,
  isRiichi: Array,
  isWin: Array,
  isLose: Array,
  isTenpai: Array,
  isCheat: Array,
  panel: Object,
  roundStatus: String,
  diceValue: Array,
  isWall: Array,
  isOpened: Array,
  randomSeats: Array,
  recordsTime: Array,
  recordsScore: Array,
  recordsRiichi: Array, 
  recordsWin: Array, 
  recordsLose: Array,
  setScore: Array,
  rankUma: Array,
  option: Object,
  modalType: String,
})

/**emits 정의*/
const emit = defineEmits([
  'show-modal',
  'hide-modal',
  'toggle-check-status',
  'check-invalid-status',
  'calculate-win',
  'calculate-draw',
  'save-round',
  'roll-dice',
  'copy-record',
  'rollback-record'
])

/**data 정의*/
const arr_arrow = ["▼", "▶", "▲", "◀"];
const arr_seat = ["동(東)", "남(南)", "서(西)", "북(北)"];
const arr_scoresheet = ["바람", "이름", "점수", "리치", "화료", "방총"];
const class_check = ["down_check", "right_check", "up_check", "left_check"];
const class_score_diff = ["down_score_diff", "right_score_diff", "up_score_diff", "left_score_diff"];
const class_dice = ["down_dice", "right_dice", "up_dice", "left_dice"];
const class_name = ["down_name", "right_name", "up_name", "left_name"];
const class_record = ["down_record", "right_record", "up_record", "left_record"];
const class_scoresheet = ["wind", "name", "score", "riichi", "win", "lose"];
const fan = ["1", "2", "3", "4", "5", "6+", "8+", "11+", "13+", "1배역만", "2배역만", "3배역만", "4배역만", "5배역만","6배역만"];
const bu = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

/**체크 표시시 색상 변경*/
const isChecked = (x, status) => {
  let cntWin=0, cntLose=0;
  if (status==='win'){ // 화료 체크
    if (x===-1){ // ok버튼
      for (let i=0;i<props.isWin.length;i++){
        if (props.isWin[i]===true) // 화료 인원 세기
          cntWin++;
      }
      if (cntWin===0 || cntWin===4) // 화료한 사람이 없거나 4명임 (불가능한 경우)
        return {color: 'gray'};
    }
    else
      return {color: props.isWin[x]===true ? 'red' : ''};
  }
  else if (status==='lose'){ // 방총 체크
    if (x===-1){ // ok버튼
      for (let i=0;i<props.isWin.length;i++){
        if (props.isWin[i]===true) // 화료 인원 세기
          cntWin++;
        if (props.isLose[i]===true) // 방총 인원 세기
          cntLose++;
      }
      if (cntWin!==1 && cntLose===0) // 2명 이상 화료했는데 쯔모임 (불가능한 경우)
        return {color: 'gray'};
    }
    else{
      if (props.isWin[x]===true) // 승자와 같을때
        return {color: 'gray'};
      else
        return {color: props.isLose[x]===true ? 'red' : ''};
    }
  }
  else if (status==='tenpai') // 텐파이 체크
    return {color: (props.isTenpai[x]===true || props.isRiichi[x]===true) ? 'red' : ''};
  else if (status==='cheat'){ // 촌보 체크
    if (x===-1) // ok버튼
      return {color: props.isCheat.every(x => x===false) ? 'gray' : ''};
    else
      return {color: props.isCheat[x]===true ? 'red' : ''};
  }
  else if (status==='fan') // 판 체크
    return {color: x===props.inputFan ? 'red' : ''};
  else if (status==='bu'){ // 부 체크
    if (props.roundStatus==='ron' && x===0) // 론일때 20부 이하 비활성화
      return {color: 'gray'};
    else if (props.inputFan===0 && x<=1) // 1판 25부 이하 비활성화
      return {color: 'gray'};
    else if (props.inputFan>=4) // 만관 이상일때 부수 비활성화
      return {color: 'gray'};
    else
      return {color: x===props.inputBu ? 'red' : ''};
  }
  else if (status==='fao'){ // 책임지불 체크
    if (x===-1){
      if (props.focusFao===-1) // 책임지불할 사람이 없음 (불가능한 경우)
        return {color: 'gray'};
    }
    else{
      if (props.focusWinner===x) // 현재 승자와 같을때
        return {color: 'gray'};
      else
        return {color: props.focusFao===x ? 'red' : ''};
    }
  }
  else if (status==='isfao') // 점수창 OX
    return {color: props.isFao===true ? 'mediumblue' : 'red'};
  else if (status==='inputfao'){ // 책임지불 점수창
    if (props.inputFan-9<x) // 입력값보다 크면 불가능
      return {color: 'gray'};
    else
      return {color: x===props.inputFao ? 'red' : ''};
  }
  else if (status==='dicemodal') // 주사위창 회전
    return {transform: `translate(-50%, -50%) rotate(${360-props.players.findIndex(player => player.wind==='東')*90}deg)`};
  else if (status==='dice') // 주사위 방향 보이기
    return {visibility: props.isWall[x]===true ? 'visible' : 'hidden'};
  else if (status==='tile'){ // 타일 뒤집기
    return {gridArea: `tile_${x+1}`, color: props.isOpened[x]===true ? (props.randomSeats[x]==='東' ? 'red' : '') : 'orange', backgroundColor: props.isOpened[x]===true ? '' : 'orange'};
  }
  else if (status==='roundmangan') // 유국만관 옵션
    return {color: props.option.roundMangan===true ? 'mediumblue' : 'red'};
  else if (status==='minusriichi') // 음수리치 옵션
    return {color: props.option.minusRiichi===true ? 'mediumblue' : 'red'};
  else if (status==='cheatscore') // 촌보점수 옵션
    return {color: props.option.cheatScore===true ? 'mediumblue' : 'red'};
  else if (status==='endriichi') // 공탁처리 옵션
    return {color: props.option.endRiichi===true ? 'mediumblue' : 'red'};
};

/**역만인지 확인하고 숨기기*/
const isYakuman = (x) => {
  return {display: ((props.inputFan<9 && x===9) || x===props.inputFan) ? '' : 'none'};
};

/**점수 변동에 따른 글자색*/
const isDiff = (x) => {
  if (x>0)
    return {color: 'limegreen'};
  else if (x<0)
    return {color: 'red'};
  else
    return {color: 'white'};
};

/**책임지불이 켜져있는지 확인*/
const checkFao = () => {
  if (props.isFao===true) // 책임지불이 있다면 선택창 키기
    emitEvent('show-modal', 'check_player_fao', props.roundStatus+'_fao');
  else
    emitEvent('calculate-win');
};

/**순위표 점수 계산*/
const calculatePoint = (idx) => {
  let myScore=props.players[idx].displayScore;
  let point=0 // 점수기반
  let oka=(props.setScore[1]*4-props.setScore[0]*4)/1000; // 오카
  let rank=1, uma=0, cnt=0;
  for (let i=0;i<props.players.length;i++){
    if (myScore<props.players[i].displayScore)
      rank++; //순위 체크
    else if (myScore===props.players[i].displayScore)
      cnt++; // 동점자 체크
  }
  for (let i=0;i<cnt;i++) // 동점자의 모든 우마 더하기
    uma+=Number(props.rankUma[rank+i-1]);
  if (rank===1){ // 1위라면 오카도 더하기
    uma+=oka;
    if (props.option.endRiichi) // 1위에게 공탁금을 몰아주는 경우
      myScore+=Math.floor(((props.panel.riichi*1000)/cnt)/100)*100;
  }
  uma/=cnt;
  point=(myScore-props.setScore[1])/1000+uma;
  return String(myScore)+'('+point.toFixed(1)+')';
};

/**순위표 기록 계산*/
const calculateRecord = (arr, idx) => {
  let ret=0;
  for (let i=0;i<arr.length;i++){
    if (arr[i][idx]===true)
      ret++;
  }
  return ret;
};

/**$emit 이벤트 발생*/
const emitEvent = (eventName, ...args) => {
  emit(eventName, ...args);
};
</script>

<template>
<div class="modal" @click="emitEvent('hide-modal')">
  <!-- 화료 인원 선택창 -->
  <div v-if="modalType==='check_player_win'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        화료한 사람을 선택해 주세요.
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="isChecked(i, 'win')"
        @click.stop="emitEvent('toggle-check-status', i, 'win')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="isChecked(-1, 'win')" @click.stop="emitEvent('check-invalid-status', 'win')">
        OK
      </div>
    </div>
  </div>
  <!--방총 인원 선택창 -->
  <div v-else-if="modalType==='check_player_lose'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        방총당한 사람을 선택해 주세요.
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="isChecked(i, 'lose')"
        @click.stop="emitEvent('toggle-check-status', i, 'lose')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="isChecked(-1, 'lose')" @click.stop="emitEvent('check-invalid-status', 'lose')">
        OK
      </div>
    </div>
  </div>
  <!-- 판/부 선택창 -->
  <div v-else-if="modalType==='check_score'" class="modal_content" @click.stop>
    <div>
      {{ names[focusWinner] }}의 점수를 입력해주세요.
    </div>
    <div class="container_check_fanbu">
      <div class="fan">
        판:
      </div>
      <div class="fan_check">
        <span v-for="(_, i) in fan.slice(0, 9)"
        :key="i"
        :style="isChecked(i, 'fan')"
        @click.stop="emitEvent('toggle-check-status', i, 'fan')"
        >
          {{ fan[i] }}
        </span>
        <div></div>
        <span v-for="(_, i) in fan.slice(9)"
        :key="i"
        :style="[isChecked(i+9, 'fan'), isYakuman(i+9)]"
        @click.stop="emitEvent('toggle-check-status', i+9, 'fan')"
        >
          {{ fan[i+9] }}
        </span>
        <span v-show="inputFan>=9" style="font-size: 20px;" @click.stop="emitEvent('toggle-check-status', -1, 'isfao')">(책임지불
          <span :style="isChecked(-1, 'isfao')">
            <span v-show="isFao===true">O</span>
            <span v-show="isFao===false">X</span>
          </span>
        )</span>
      </div>
      <div class="bu">
        부:
      </div>
      <div class="bu_check">
        <span v-for="(_, i) in bu.slice(0, 6)"
          :key="i"
          :style="isChecked(i, 'bu')"
          @click.stop="emitEvent('toggle-check-status', i, 'bu')"
        >
          {{ bu[i] }}
        </span>
        <div></div>
        <span v-for="(_, i) in bu.slice(6)"
          :key="i"
          :style="isChecked(i+6, 'bu')"
          @click.stop="emitEvent('toggle-check-status', i+6, 'bu')"
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
  <div v-else-if="modalType==='check_player_fao'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        책임지불할 사람을 선택해 주세요.
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="isChecked(i, 'fao')"
        @click.stop="emitEvent('toggle-check-status', i, 'fao')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="isChecked(-1, 'fao')" @click.stop="emitEvent('check-invalid-status', 'fao')">
        OK
      </div>
    </div>
  </div>
  <!-- 책임지불 점수 선택창 -->
  <div v-else-if="modalType==='choose_fao_score'" class="modal_content" @click.stop>
    <div>
      책임지불할 점수를 입력해주세요.
    </div>
    <div class="container_choose_fao_score">
      <span v-for="(_, i) in fan.slice(9)"
        :key="i"
        :style="[isChecked(i, 'inputfao')]"
        @click.stop="emitEvent('toggle-check-status', i, 'inputfao')"
      >
        {{ fan[i+9] }}
      </span>
    </div>
    <div style="font-size: 30px;" @click.stop="emitEvent('calculate-win');">
      OK
    </div>
  </div>
  <!-- 유국 종류 선택창 -->
  <div v-else-if="modalType==='choose_draw_kind'" class="modal_content" @click.stop>
    <div class="modal_choose_draw" @click.stop="emitEvent('show-modal','check_player_tenpai')">
      일반유국
    </div>
    <div class="modal_choose_draw" @click.stop="emitEvent('show-modal','show_score', 'special_draw')">
      도중유국
    </div>
  </div>
  <!-- 텐파이 인원 선택창 -->
  <div v-else-if="modalType==='check_player_tenpai'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        텐파이한 사람을 선택해 주세요.
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="isChecked(i, 'tenpai')"
        @click.stop="emitEvent('toggle-check-status', i, 'tenpai')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" @click.stop="emitEvent('calculate-draw')">
        OK
      </div>
    </div>
  </div>
  <!-- 촌보 인원 선택창 -->
  <div v-else-if="modalType==='check_player_cheat'" class="modal_content" @click.stop>
    <div class="container_check">
      <div class="guide_message">
        촌보한 사람을 선택해 주세요.
      </div>
      <div v-for="(_, i) in class_check"
        :key="i"
        :class="class_check[i]"
        :style="isChecked(i, 'cheat')"
        @click.stop="emitEvent('toggle-check-status', i, 'cheat')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="isChecked(-1, 'cheat')" @click.stop="emitEvent('check-invalid-status', 'cheat')">
        OK
      </div>
    </div>
  </div>
  <!-- 점수 확인창 -->
  <div v-else-if="modalType==='show_score'" class="modal_content" style="border-radius:50%;" @click.stop>
    <div class="container_show_score_diff">
      <div v-for="(_, i) in class_score_diff"
        :key="i"
        :class="class_score_diff[i]"
        :style="isDiff(scoresDiff[i])"
      >
        <span v-show="scoresDiff[i]>0">+</span>{{ scoresDiff[i] }}
      </div>
      <div class="ok" @click.stop="emitEvent('save-round')">
        OK
      </div>
    </div>
  </div>
  <!-- 주사위 굴림창 -->
  <div v-else-if="modalType==='roll_dice'" class="modal_content" :style="isChecked(-1, 'dicemodal')" @click.stop>
    <div class="container_roll" @click.stop="emitEvent('roll-dice')">
      <graphics kind="dice" :value="diceValue[0]" style="grid-area: dice_1; transform: scale(2);"/>
      <graphics kind="dice" :value="diceValue[1]" style="grid-area: dice_2; transform: scale(2);"/>
      <div class="sum">
        <span v-show="isWall.every(x => x===false)">?</span>
        <span v-show="isWall.some(x => x===true)">{{ diceValue[0]+diceValue[1] }}</span>
      </div>
      <div v-for="(_, i) in class_dice"
        :key="i"
        :class="class_dice[i]"
        :style="isChecked(i, 'dice')"
      >
        {{ arr_arrow[i] }}
      </div>
    </div>
  </div>
  <!-- 동남서북 선택창 -->
  <div v-else-if="modalType==='choose_seat'" class="modal_content" @click.stop>
    <div class="container_tile">
      <graphics v-for="(_, i) in randomSeats"
        :key="i"
        kind="tile"
        :style="isChecked(i, 'tile')"
        :value="randomSeats[i]"
        @click.stop="emitEvent('toggle-check-status', i, 'tile')"
      ></graphics>
    </div>
  </div>
  <!-- 옵션 종류 선택창 -->
  <div v-else-if="modalType==='choose_option_kind'" class="modal_content" @click.stop>
    <div class="container_choose_option">
      <div @click.stop="emitEvent('show-modal', 'score_sheet')">
        게임결과
      </div>
      <div @click.stop="emitEvent('show-modal', 'show_record')">
        점수기록
      </div>
      <div @click.stop="emitEvent('show-modal', 'set_options')">
        설정
      </div>
      <a href="https://github.com/he1fire/riichi-mahjong" target="_blank" style="font-size: 20px; "><img src="/github-logo.svg" alt="SVG" />Github</a>
    </div>
  </div>
  <!-- 점수 기록창 -->
  <div v-else-if="modalType==='show_record'" class="modal_content" @click.stop>
    <div class="container_record">
      <div class="copy" @click.stop="emitEvent('copy-record')">
        복사
      </div>
      <div v-for="(_, i) in class_name"
        :key="i"
        :class="class_name[i]"
      >
        {{ names[i] }}
      </div>
      <div class="container_record_scroll">
        <div class="when">
          <div v-for="(_, i) in recordsTime"
            :key="i"
            @click.stop="i%2===1 ? emitEvent('show-modal','rollback_record', recordsTime[i]) : {}"
          >
            {{ recordsTime[i] }}
          </div>
        </div>
        <div v-for="(_, i) in class_record"
          :key="i"
          :class="class_record[i]"
        >
          <div v-for="(_, j) in recordsScore[i]"
            :key="j"
            :style="j%2===1 ? isDiff(recordsScore[i][j]) : {}"
          >
            <span v-show="j%2===1 && recordsScore[i][j]>0">+</span>{{ recordsScore[i][j] }}
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 점수 롤백창 -->
  <div v-else-if="modalType==='rollback_record'" class="modal_content" @click.stop>
    <div class="modal_text">
      {{ roundStatus }}으로 되돌리시겠습니까?
    </div>
    <div class="modal_text" style="font-size: 30px;" @click.stop="emitEvent('rollback-record')">
      OK
    </div>
  </div>
  <!-- 설정 창 -->
  <div v-else-if="modalType==='set_options'" class="modal_content" @click.stop>
    <div class="container_option">
      <div
        v-for="(_, i) in arr_seat"
        :key="i"
        :style="`grid-area: input_name${i};`"
      >
        {{ arr_seat[i] }}<br>
        <input
          type="text"
          maxlength="4"
          v-model="names[i]"
          :placeholder="`이름${i+1}`"
          :name="`name${i+1}`"
        >
      </div>
      <div style="grid-area: option0;">
        시작점수<br>
        <input 
          type="number"
          v-model="setScore[0]"
          :placeholder="25000"
          :name="'startScore'"
        >
      </div>
      <div style="grid-area: option1;">
        반환점수<br>
        <input 
          type="number"
          v-model="setScore[1]"
          :placeholder="30000"
          :name="'endScore'"
        >
      </div>
      <div style="grid-area: option2;" @click.stop="emitEvent('toggle-check-status', -1, 'roundmangan')">
        절상만관<br>
        <span :style="isChecked(-1, 'roundmangan')">
          <span v-show="option.roundMangan===true">O</span>
          <span v-show="option.roundMangan===false">X</span>
        </span>
      </div>
      <div style="grid-area: option3;" @click.stop="emitEvent('toggle-check-status', -1, 'minusriichi')">
        음수리치<br>
        <span :style="isChecked(-1, 'minusriichi')">
          <span v-show="option.minusRiichi===true">O</span>
          <span v-show="option.minusRiichi===false">X</span>
        </span>
      </div>
      <div style="grid-area: option4;">
        순위우마 (1-2-3-4)<br>
        <input
          v-for="(_, i) in rankUma"
          :key="i"
          style="width: 41px;"
          type="number"
          v-model="rankUma[i]"
          :placeholder="`${i+1}위`"
          :name="`uma${i+1}`"
          :style="{ marginRight: i===rankUma.length-1 ? '0px' : '10px' }"
        >
      </div>  
      <div style="grid-area: option5;" @click.stop="emitEvent('toggle-check-status', -1, 'cheatscore')">
        촌보점수<br>
        <span :style="isChecked(-1, 'cheatscore')">
          <span v-show="option.cheatScore===true">3000 All</span>
          <span v-show="option.cheatScore===false">만관</span>
        </span>
      </div>
      <div style="grid-area: option6;" @click.stop="emitEvent('toggle-check-status', -1, 'endriichi')">
        공탁처리<br>
        <span :style="isChecked(-1, 'endriichi')">
          <span v-show="option.endRiichi===true">1위</span>
          <span v-show="option.endRiichi===false">X</span>
        </span>
      </div>
    </div>
  </div>
  <!-- 게임 결과창 -->
  <div v-else-if="modalType==='score_sheet'" class="modal_content" @click.stop>
    <div class="container_scoresheet">
      <div v-for="(_, i) in class_scoresheet" 
        :key="i"
        :class="class_scoresheet[i]"
        style="font-size: 25px;"
      >
        {{ arr_scoresheet[i] }}
      </div>
      <div style="grid-area: wind_contents;">
        <div v-for="(_, i) in arr_seat" :key="i">{{ arr_seat[i][2] }}</div>
      </div>
      <div style="grid-area: name_contents;">
        <div v-for="(_, i) in names" :key="i">{{ names[i] }}</div>
      </div>
      <div style="grid-area: score_contents;">
        <div v-for="(_, i) in players" :key="i">{{calculatePoint(i)}}</div>
      </div>
      <div style="grid-area: riichi_contents;">
        <div v-for="(_, i) in recordsRiichi[0]" :key="i">{{calculateRecord(recordsRiichi, i)}}</div>
      </div>
      <div style="grid-area: win_contents;">
        <div v-for="(_, i) in recordsWin[0]" :key="i">{{calculateRecord(recordsWin, i)}}</div>
      </div>
      <div style="grid-area: lose_contents;">
        <div v-for="(_, i) in recordsLose[0]" :key="i">{{calculateRecord(recordsLose, i)}}</div>
      </div>
    </div>
  </div>
  <!-- 메시지 팝업창 -->
  <div v-else class="modal_content" @click.stop>
    <div class="modal_text">{{ modalType }}</div>
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
.container_choose_option{
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
  grid-template-columns: 120px auto;
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
.container_scoresheet{
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 50px 125px 150px repeat(3, 60px);
  grid-template-areas:
  "wind name score riichi win lose"
  "wind_contents name_contents score_contents riichi_contents win_contents lose_contents";
  text-align: center;
  margin: 5px;
}
.container_scoresheet div{
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>
