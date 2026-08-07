import { ModalChooseDraw, ModalCheckPlayer, ModalScoreSelect, ModalScoreResult } from "@/components/modals/scoring"
import { ModalDice, ModalTile } from "@/components/modals/setup"
import { ModalChooseMenu, ModalOptions, ModalSync, ModalMessage } from "@/components/modals/system"
import { ModalRecordList, ModalRollback, ModalResultSheet, ModalResultChart } from "@/components/modals/stats"
import { markRaw, type Component } from 'vue'

/**매핑 테이블 타입 정의*/
export interface ModalConfig {
  Modal: Component;
  props?: Record<string, unknown>;
}

/**헬퍼 함수: 반복되는 markRaw와 기본 구조를 줄여줍니다.*/
const createModal = (Modal: Component, props?: Record<string, unknown>): ModalConfig => ({
  Modal: markRaw(Modal),
  ...(props && { props })
});

/** 
 * 모달 설정 매핑 테이블
 * markRaw를 통해 Vue가 컴포넌트 객체를 반응형(Proxy)으로 변환하는 오버헤드를 방지
 */
export const modalConfigMap: Record<string, ModalConfig> = {
  check_player_win: createModal(ModalCheckPlayer, { actionType: 'win' }),
  check_player_lose: createModal(ModalCheckPlayer, { actionType: 'lose' }),
  check_player_fao: createModal(ModalCheckPlayer, { actionType: 'fao' }),
  check_player_tenpai: createModal(ModalCheckPlayer, { actionType: 'tenpai' }),
  check_player_cheat: createModal(ModalCheckPlayer, { actionType: 'cheat' }),
  choose_score: createModal(ModalScoreSelect, { actionType: 'fanbu' }),
  choose_score_fao: createModal(ModalScoreSelect, { actionType: 'fao' }),
  choose_draw_kind: createModal(ModalChooseDraw),
  show_score: createModal(ModalScoreResult),
  roll_dice: createModal(ModalDice),
  choose_seat: createModal(ModalTile),
  choose_menu_kind: createModal(ModalChooseMenu),
  result_sheet: createModal(ModalResultSheet),
  result_chart: createModal(ModalResultChart),
  show_record: createModal(ModalRecordList),
  rollback_record: createModal(ModalRollback),
  set_options: createModal(ModalOptions),
  sync: createModal(ModalSync),
  message: createModal(ModalMessage)
};