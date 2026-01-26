<template>
  <div class="fixed bottom-6 right-2 p-5 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 rounded-3xl z-[9999] w-72 transition-all">
    <h3 class="text-sm font-bold text-gray-800 mb-4 flex items-center justify-end gap-2">
      실시간 점수 공유 (P2P)
      <span :class="['w-2.5 h-2.5 rounded-full animate-pulse', isHost ? 'bg-indigo-500' : 'bg-emerald-500']"></span>
    </h3>

    <div v-if="!myId">
      <button @click="initPeer" class="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-bold shadow-lg text-sm transition-all active:scale-95">
        멀티 모드 활성화
      </button>
    </div>

    <div v-else class="space-y-3 text-right">
      <button @click="copyShareLink" class="w-full bg-indigo-50 text-indigo-600 py-2 rounded-xl font-bold text-[11px] hover:bg-indigo-100 transition border border-indigo-100">
        초대 링크 복사 (자동 입장)
      </button>

      <div class="bg-gray-50 p-3 rounded-xl border border-gray-100">
        <p class="text-[10px] text-gray-400 uppercase font-black mb-1 text-left">
          {{ isHost ? '방장(HOST)' : '참가자(GUEST)' }} 코드
        </p>
        <div class="flex justify-between items-center gap-2">
          <code class="text-gray-600 font-mono font-bold tracking-tight text-[10px] overflow-hidden text-ellipsis">{{ myId }}</code>
          <button @click="copyId" class="shrink-0 text-[10px] bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-500 font-bold hover:bg-gray-100 transition">복사</button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <div v-if="!isConnected" class="flex flex-col gap-2 text-left">
          <input v-model="targetId" placeholder="상대방 코드 입력" class="border border-gray-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full" />
          <button @click="connectToPeer" class="w-full bg-emerald-500 text-white py-3 rounded-xl hover:bg-emerald-600 font-bold shadow-lg text-sm transition-all active:scale-95">
            연결하기
          </button>
        </div>
        <div v-else class="flex items-center justify-end gap-3 py-3 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-black ring-1 ring-emerald-100">
          실시간 동기화 중
          <span class="relative flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Peer, DataConnection } from 'peerjs';

const props = defineProps<{
  players: any[], panelInfo: any, scoringState: any, 
  option: any, records: any, dice: any, seatTile: any, modalInfo: any
}>();

const route = useRoute();
const peer = ref<Peer | null>(null);
const myId = ref('');
const targetId = ref('');
const isConnected = ref(false);
const isHost = ref(false);
const connections = ref<DataConnection[]>([]);
let timeout: any = null;
const isReceiving = ref(false);

onMounted(() => {
  const roomQuery = route.query.room as string;
  if (roomQuery) {
    targetId.value = roomQuery;
    autoJoin(roomQuery);
  }
});

const autoJoin = async (_id: string) => {
  initPeer();
  const timer = setInterval(() => {
    if (myId.value) {
      clearInterval(timer);
      connectToPeer();
    }
  }, 500);
};

const initPeer = () => {
  peer.value = new Peer();
  // 수정된 부분: id 인자를 myId.value에 할당하여 경고 해결
  peer.value.on('open', (id) => { 
    myId.value = id; 
    isHost.value = true; 
  });
  peer.value.on('connection', (conn) => { setupConnection(conn); });
};

const connectToPeer = () => {
  if (!targetId.value || !peer.value) return;
  isHost.value = false;
  const conn = peer.value.connect(targetId.value);
  setupConnection(conn);
};

const setupConnection = (conn: DataConnection) => {
  conn.on('open', () => {
    connections.value.push(conn);
    isConnected.value = true;
    if (isHost.value) sendAll();
  });

  conn.on('data', async (data: any) => {
    if (!data || !data.players) return;
    isReceiving.value = true;
    
    // splice를 사용해 원본 배열의 참조를 유지하며 데이터를 강제 주입
    props.players.splice(0, props.players.length, ...data.players);
    Object.assign(props.panelInfo, data.panelInfo);
    Object.assign(props.scoringState, data.scoringState);
    Object.assign(props.option, data.option);
    Object.assign(props.modalInfo, data.modalInfo);
    
    if (data.records && data.records.score) {
      data.records.score.forEach((s: any, i: number) => {
        if (props.records.score[i]) props.records.score[i].splice(0, props.records.score[i].length, ...s);
      });
      props.records.time.splice(0, props.records.time.length, ...data.records.time);
    }

    await nextTick();
    setTimeout(() => { isReceiving.value = false; }, 800);
  });
  conn.on('close', () => { isConnected.value = false; connections.value = []; });
};

const sendAll = () => {
  if (isReceiving.value || !isConnected.value) return;
  const payload: any = {};
  Object.keys(props).forEach(key => {
    // @ts-ignore
    payload[key] = JSON.parse(JSON.stringify(props[key as keyof typeof props]));
  });
  connections.value.forEach(c => { if (c.open) c.send(payload); });
};

watch(() => [props.players, props.panelInfo], () => {
  if (isReceiving.value || !isConnected.value) return;
  clearTimeout(timeout);
  timeout = setTimeout(sendAll, 400);
}, { deep: true });

const copyShareLink = () => {
  if (!myId.value) return;
  const url = new URL(window.location.href);
  url.searchParams.set('room', myId.value);
  navigator.clipboard.writeText(url.toString());
  alert("초대 링크가 복사되었습니다!");
};

const copyId = () => { navigator.clipboard.writeText(myId.value); alert("코드가 복사되었습니다!"); };
</script>