<script>
import graphics from './graphics.vue'
export default {
  components: {
    graphics,
  },
  props: {
    winds: Array,
    scoresDiff: Array,
    names: Array,
    focusWinner: Number,
    isFao: Boolean,
    focusFao: Number,
    inputFan: Number,
    inputBu: Number,
    isWin: Array,
    isLose: Array,
    isTenpai: Array,
    roundStatus: String,
    diceValue: Array,
    isWall: Array,
    isOpened: Array,
    randomSeats: Array,
    modalType: String,
  },
  emits: ['show-modal', 'hide-modal', 'toggle-check-status', 'check-invalid-status', 'calculate-win', 'calculate-draw', 'save-round', 'roll-dice'],
  data(){
    return {
      arr_arrow: ["▼", "▶", "▲", "◀"],
      class_check: ["down_check", "right_check", "up_check", "left_check"],
      class_score_diff: ["down_score_diff", "right_score_diff", "up_score_diff", "left_score_diff"],
      class_dice: ["down_dice", "right_dice", "up_dice", "left_dice"],
      fan: ["1", "2", "3", "4", "5", "6+", "8+", "11+", "13+", "1배역만", "2배역만", "3배역만", "4배역만", "5배역만","6배역만"],
      bu: [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110],
    };
  },
  methods: {
    /**체크 표시시 색상 변경*/
    isChecked(x, status) {
      let cntWin=0, cntLose=0;
      if (status==='win'){ // 화료 체크
        if (x===-1){ // ok버튼
          for (let i=0;i<this.isWin.length;i++){
            if (this.isWin[i]===true) // 화료 인원 세기
              cntWin++;
          }
          if (cntWin===0 || cntWin===4) // 화료한 사람이 없거나 4명임 (불가능한 경우)
            return {color: 'gray'};
        }
        else
          return {color: this.isWin[x]===true ? 'red' : ''};
      }
      else if (status==='lose'){  // 방총 체크
        if (x===-1){ // ok버튼
          for (let i=0;i<this.isWin.length;i++){
            if (this.isWin[i]===true) // 화료 인원 세기
              cntWin++;
            if (this.isLose[i]===true) // 방총 인원 세기
              cntLose++;
          }
          if (cntWin!==1 && cntLose===0) // 2명 이상 화료했는데 쯔모임 (불가능한 경우)
            return {color: 'gray'};
        }
        else{
          if (this.isWin[x]===true) // 승자와 같을때
            return {color: 'gray'};
          else
            return {color: this.isLose[x]===true ? 'red' : ''};
        }
      }
      else if (status==='tenpai')  // 텐파이 체크
        return {color: this.isTenpai[x]===true ? 'red' : ''};
      else if (status==='fan')  // 판 체크
        return {color: x===this.inputFan ? 'red' : ''};
      else if (status==='bu'){ // 부 체크
        if (this.roundStatus==='ron' && x===0) // 론일때 20부 이하 비활성화
          return {color: 'gray'};
        else if (this.inputFan===0 && x<=1) // 1판 25부 이하 비활성화
          return {color: 'gray'};
        else if (this.inputFan>=4) // 만관 이상일때 부수 비활성화
          return {color: 'gray'};
        else
          return {color: x===this.inputBu ? 'red' : ''};
      }
      else if (status==='fao'){ // 책임지불 체크
        if (x===-1){
          if (this.focusFao===-1) // 책임지불할 사람이 없음 (불가능한 경우)
            return {color: 'gray'};
        }
        else{
          if (this.focusWinner===x) // 현재 승자와 같을때
            return {color: 'gray'};
          else
            return {color: this.focusFao===x ? 'red' : ''};
        }
      }
      else if (status==='isfao') // 점수창 OX
        return {color: this.isFao===true ? 'blue' : 'red'};
      else if (status==='dicemodal') // 주사위창 회전
        return {transform: `translate(-50%, -50%) rotate(${360-this.winds.indexOf('東')*90}deg)`};
      else if (status==='dice') // 주사위 방향 보이기
        return {visibility: this.isWall[x]===true ? 'visible' : 'hidden'};
      else if (status==='tile'){ // 타일 뒤집기
        return {gridArea: `tile_${x+1}`, color: this.isOpened[x]===true ? (this.randomSeats[x]==='東' ? 'red' : '') : 'orange', backgroundColor: this.isOpened[x]===true ? '' : 'orange'};
      }
    },
    /**역만인지 확인하고 숨기기*/
    isYakuman(x){
      return {display: ((this.inputFan < 9 && x === 9) || x === this.inputFan) ? '' : 'none'};
    },
    /**점수 변동에 따른 글자색*/
    isDiff(x) {
      if (this.scoresDiff[x]>0)
        return {color: 'limegreen'};
      else if (this.scoresDiff[x]<0)
        return {color: 'red'};
      else
        return {color: ''};
    },
    /**책임지불이 켜져있는지 확인*/
    checkFao(){
      if (this.isFao===true) // 책임지불이 있다면 선택창 키기
        this.showModal('check_player_fao',this.roundStatus+'_fao');
      else
        this.calculateWin();
    },
    /**모달 창 켜기*/
    showModal(type, status){
      this.$emit('show-modal', type, status);
    },
    /**모달 창 끄기*/
    hideModal(){
      this.$emit('hide-modal');
    },
    /**화료, 방총, 텐파이, 판/부, 책임지불 체크*/
    toggleCheckStatus(idx, status){
      this.$emit('toggle-check-status', idx, status);
    },
    /**화료 및 방총 불가능한 경우 반환*/
    checkInvalidStatus(status){
      this.$emit('check-invalid-status', status);
    },
    /**화료 점수계산*/
    calculateWin(){
      this.$emit('calculate-win');
    },
    /**유국 점수계산*/
    calculateDraw(){
      this.$emit('calculate-draw');
    },
    /**국 결과값 처리*/
    saveRound(){
      this.$emit('save-round');
    },
    /**주사위 굴리기*/
    rollDice(){
      this.$emit('roll-dice');
    },
  }
};
</script>

<template>
<div class="modal" @click="hideModal">
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
        @click.stop="toggleCheckStatus(i, 'win')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="isChecked(-1, 'win')" @click.stop="checkInvalidStatus('win')">
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
        @click.stop="toggleCheckStatus(i, 'lose')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="isChecked(-1, 'lose')" @click.stop="checkInvalidStatus('lose')">
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
        @click.stop="toggleCheckStatus(i, 'fan')"
        >
          {{ fan[i] }}
        </span>
        <div></div>
        <span v-for="(_, i) in fan.slice(9)"
        :key="i"
        :style="[isChecked(i+9, 'fan'), isYakuman(i+9)]"
        @click.stop="toggleCheckStatus(i+9, 'fan')"
        >
          {{ fan[i+9] }}
        </span>
        <span v-if="inputFan>=9" style="font-size: 20px;" @click.stop="toggleCheckStatus(-1, 'isfao')">(책임지불
          <span :style="isChecked(-1, 'isfao')">
            <span v-if="isFao===true">O</span>
            <span v-if="isFao===false">X</span>
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
        @click.stop="toggleCheckStatus(i, 'bu')"
        >
          {{ bu[i] }}
        </span>
        <div></div>
        <span v-for="(_, i) in bu.slice(6)"
        :key="i"
        :style="isChecked(i+6, 'bu')"
        @click.stop="toggleCheckStatus(i+6, 'bu')"
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
        @click.stop="toggleCheckStatus(i, 'fao')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" :style="isChecked(-1, 'fao')" @click.stop="checkInvalidStatus('fao')">
        OK
      </div>
    </div>
  </div>
  <!-- 유국 종류 선택창 -->
  <div v-else-if="modalType==='choose_draw_kind'" class="modal_content" @click.stop>
    <div class="modal_choose_draw" @click.stop="showModal('check_player_tenpai')">
      일반유국
    </div>
    <div class="modal_choose_draw" @click.stop="showModal('show_score', 'special_draw')">
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
        @click.stop="toggleCheckStatus(i, 'tenpai')"
      >
        {{ arr_arrow[i] }}
      </div>
      <div class="ok" @click.stop="calculateDraw()">
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
        :style="isDiff(i)"
      >
        <span v-show="scoresDiff[i]>0">+</span>{{ scoresDiff[i] }}
      </div>
      <div class="ok" @click.stop="saveRound()">
        OK
      </div>
    </div>
  </div>
  <!-- 주사위 굴림창 -->
  <div v-else-if="modalType==='roll_dice'" class="modal_content" :style="isChecked(-1, 'dicemodal')" @click.stop>
    <div class="container_roll" @click.stop="rollDice()">
      <graphics kind="dice" :value="diceValue[0]" style="grid-area: dice_1; transform: scale(2);"/>
      <graphics kind="dice" :value="diceValue[1]" style="grid-area: dice_2; transform: scale(2);"/>
      <div class="sum">
        <span v-if="isWall.every(x => x===false)">?</span>
        <span v-if="isWall.some(x => x===true)">{{ diceValue[0]+diceValue[1] }}</span>
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
        @click.stop="toggleCheckStatus(i, 'tile')"
      ></graphics>
    </div>
  </div>
  <!-- 메시지 팝업창 -->
  <div v-else if class="modal_content" @click.stop>
    <div class="modal_text">{{ modalType }}</div>
  </div>
</div>
</template>

<style scoped>
/* 기본 모달창 */
.modal {
  position: fixed;
  z-index: 2;
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
  z-index: 2;
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
</style>
