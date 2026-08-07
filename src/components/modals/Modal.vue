<script setup lang="ts">
import { type ModalConfig, modalConfigMap } from "@/components/modals/modalConfig.ts"
import type { Player, ScoringState, PanelInfo, Dice, SeatTile, Records, Option, ModalInfo, SyncInfo } from "@/types/types.d"
import { computed } from 'vue'

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
/**
 * 현재 modalInfo.type에 맞는 모달 설정을 반환합니다.
 * 등록되지 않은 type인 경우 기본값으로 ModalMessage를 렌더링합니다.
 */
const currentModalConfig = computed<ModalConfig>(() => {
  return modalConfigMap[props.modalInfo.type] || modalConfigMap['message'];
});

/**모달 스타일 동적 계산*/
const modalContentStyle = computed(() => {
  if (props.modalInfo.type==='roll_dice') {
    return {transform: `translate(-50%, -50%) rotate(${360-props.players.findIndex(player => player.wind==='東')*90}deg)`};
  }
  if (props.modalInfo.type==='show_score') {
    return { borderRadius: '50%' };
  }
  return {};
});
</script>

<template>
<div class="modal" @click="emit('hide-modal')">
  <div class="modal_content" :style="modalContentStyle" @click.stop>
    <component
      :is="currentModalConfig.Modal"
      :players="players"
      :scoringState="scoringState"
      :panelInfo="panelInfo"
      :dice="dice"
      :seatTile="seatTile"
      :records="records"
      :option="option"
      :modalInfo="modalInfo"
      :syncInfo="syncInfo"
      :message="modalInfo.type"
      v-bind="currentModalConfig.props"
      @show-modal="(type: string, status?: string) => emit('show-modal', type, status)"
      @hide-modal="emit('hide-modal')"
      @set-arrow-button="(status: string, idx: number) => emit('set-arrow-button', status, idx)"
      @set-toggle-button="(status: string) => emit('set-toggle-button', status)"
      @set-fanbu-button="(status: string, idx: number) => emit('set-fanbu-button', status, idx)"
      @set-seat-tile="(idx: number) => emit('set-seat-tile', idx)"
      @check-invalid-status="(status: string) => emit('check-invalid-status', status)"
      @calculate-win="emit('calculate-win')"
      @calculate-draw="emit('calculate-draw')"
      @save-round="emit('save-round')"
      @roll-dice="emit('roll-dice')"
      @copy-record="emit('copy-record')"
      @rollback-record="(time: number) => emit('rollback-record', time)"
      @change-locale="(language: string) => emit('change-locale', language)"
      @init-multiplayer="(id?: string) => emit('init-multiplayer', id)"
      @copy-room-id="emit('copy-room-id')"
    />
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
</style>