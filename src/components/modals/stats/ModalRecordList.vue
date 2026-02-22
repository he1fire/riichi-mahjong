<script setup lang="ts">
import type { Player, Records } from "@/types/types.d"
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**props 정의*/
interface Props {
  players: Player[],
  records: Records
}
defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void,
  (e: 'copy-record'): void
}
const emit = defineEmits<Emits>()

/**data 정의*/
const class_name = ['down_name', 'right_name', 'up_name', 'left_name']
const class_record = ['down_record', 'right_record', 'up_record', 'left_record']

/**점수 부호에 따른 색상*/
const getSignColor = (sign: number, x: number) => {
  if (sign>0)
    return {color: 'limegreen'};
  else if (sign<0)
    return {color: 'red'};
  else if (x%4<2)
    return {color: 'whitesmoke'};
  else
    return {color: 'gainsboro'};
}
</script>

<template>
<!-- 점수 기록창 -->
<div class="container_record">
  <div class="copy" @click.stop="emit('copy-record')">
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
        :style="{backgroundColor: (i%4<2) ? 'whitesmoke' : 'gainsboro'}"
        @click.stop="i%2===1 ? emit('show-modal', 'rollback_record', String(i)) : {}"
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
        :style="[j%2===1 ? getSignColor(records.score[i][j], j) : {}, {backgroundColor: (j%4<2) ? 'whitesmoke' : 'gainsboro'}]"
      >
        <span v-show="j%2===1 && records.score[i][j]>0">+</span>{{ records.score[i][j] }}
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
/* 점수 기록창 */
.container_record{
  display: grid;
  grid-template-rows: 35px 200px;
  grid-template-columns: 120px repeat(4, 100px);
  grid-template-areas: 
  'copy down_name right_name up_name left_name'
  'scroll scroll scroll scroll scroll';
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
  'when down_record right_record up_record left_record';
  text-align: center;
  font-size: 20px;
  overflow-y: auto;
}
.when{
  grid-area: when;
}
</style>