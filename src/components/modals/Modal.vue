<script setup lang="ts">
import { ModalChooseDraw, ModalCheckPlayer, ModalScoreSelect, ModalScoreResult } from "@/components/modals/scoring";
import { ModalDice, ModalTile } from "@/components/modals/setup";
import { ModalChooseMenu, ModalOptions, ModalSync } from "@/components/modals/system";
import { ModalRecordList, ModalRollback, ModalResultSheet, ModalResultChart } from "@/components/modals/stats";
import type { Player, ScoringState, PanelInfo, Dice, SeatTile, Records, Option, ModalInfo, SyncInfo } from "@/types/types.d"

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

/**주사위 모달창 회전*/
const diceModalTransform = () => {
  return {transform: `translate(-50%, -50%) rotate(${360-props.players.findIndex(player => player.wind==='東')*90}deg)`};
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
    <ModalResultSheet
      :players
      :panelInfo
      :records
      :option
      @show-modal="(type, status?) => emit('show-modal', type, status)"
    />
  </div>
  <!-- 게임 결과창(차트) -->
  <div v-else-if="modalInfo.type==='result_chart'" class="modal_content" @click.stop>
    <ModalResultChart
      :players
      :records
      @show-modal="(type, status?) => emit('show-modal', type, status)"
    />
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
    <ModalRollback
      :records
      :modalInfo
      @rollback-record="(time) => emit('rollback-record', time)"
    />
  </div>
  <!-- 설정 창 -->
  <div v-else-if="modalInfo.type==='set_options'" class="modal_content" @click.stop>
    <ModalOptions
      :players
      :option
      @show-modal="(type, status?) => emit('show-modal', type, status)"
      @set-toggle-button="(status) => emit('set-toggle-button', status)"
    />
  </div>
  <!-- 동기화 창 -->
  <div v-else-if="modalInfo.type==='sync'" class="modal_content" @click.stop>
    <ModalSync
      :syncInfo
      @init-multiplayer="(id?) => emit('init-multiplayer', id)"
      @copy-room-id="emit('copy-room-id')"
    />
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
</style>