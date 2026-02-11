<script setup lang="ts">
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void
}
const emit = defineEmits<Emits>()
</script>

<template>
<!-- 유국 종류 선택창 -->
<div class="modal_choose_draw" @click.stop="emit('show-modal', 'check_player_tenpai')">
  {{ t('drawKind.normalDraw') }}
</div>
<div class="modal_choose_draw" @click.stop="emit('show-modal', 'show_score', 'special_draw')">
  {{ t('drawKind.specialDraw') }}
</div>
</template>

<style scoped>
/* 유국 종류 선택창 */
.modal_choose_draw{
  font-size: 40px;
  margin: 20px;
}
</style>