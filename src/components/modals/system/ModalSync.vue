<script setup lang="ts">
import Graphics from "@/components/Graphics.vue"
import type { SyncInfo } from "@/types/types.d"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t } = useI18n()

/**props 정의*/
interface Props {
  syncInfo: SyncInfo
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'init-multiplayer', id?: string): void,
  (e: 'copy-room-id'): void
}
const emit = defineEmits<Emits>()

const targetRoomId = ref('');// 입력창에 적힌 방 ID

/**토글 버튼 색상*/
const toggleButtonStyle = () => {
  return {color: props.syncInfo.isConnected===true ? 'limegreen' : 'gray'};
}
</script>

<template>
<!-- 동기화 창 -->
<div v-if="!syncInfo.isConnected" class="container_sync">
  <div class="on_off" :style="toggleButtonStyle()">
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
  <div class="on_off" :style="toggleButtonStyle()">
    <Graphics kind="dot" :status="syncInfo.isConnected"/>
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
</template>

<style scoped>
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