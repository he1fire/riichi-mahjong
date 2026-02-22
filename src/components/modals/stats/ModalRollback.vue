<script setup lang="ts">
import type { Records, ModalInfo } from "@/types/types.d"
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**props 정의*/
interface Props {
  records: Records,
  modalInfo: ModalInfo
}
defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'rollback-record', time: number): void,
}
const emit = defineEmits<Emits>()
</script>

<template>
<!-- 점수 롤백확인창 -->
<div class="rollback_desc">
  {{ t('comments.rollbackRecord', {time : records.time[Number(modalInfo.status)]}) }}
</div>
<div class="rollback_ok" @click.stop="emit('rollback-record', Number(modalInfo.status))">
  OK
</div>
</template>

<style scoped>
/* 점수 롤백확인창 */
.rollback_desc{
  font-size: 20px;
  margin: 20px;
}
.rollback_ok{
  font-size: 30px;
  margin: 20px;
}
</style>