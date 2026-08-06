<script setup lang="ts">
import type { Player, Records } from "@/types/types.d"
import { computed } from "vue"
import { Line as LineChart } from "vue-chartjs"
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, type ChartOptions } from "chart.js"

/**차트 컴포넌트 등록*/
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)
ChartJS.defaults.font.family = "'Noto Serif KR', 'Noto Serif JP', 'Noto Serif', serif" // 폰트 설정
ChartJS.defaults.color = '#000000' // 기본 글자색 설정

/**props 정의*/
interface Props {
  players: Player[],
  records: Records,
}
const props = defineProps<Props>()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void
}
const emit = defineEmits<Emits>()

/**점수차트 정보 계산*/
const scoreChartInfo = computed(() => {
  let datasets=props.players.map((_, idx) => ({
    label: props.players[idx].name, // 이름 가져오기
    data: props.records.score[idx].filter((_, i) => i%2===0), // 점수기록 가져오기)
    borderColor: ['#ff6384', '#4bc0c0', '#36a2eb', '#ffce56'][idx], // 선 색상
    backgroundColor: ['#ff6384', '#4bc0c0', '#36a2eb', '#ffce56'][idx], // 점 색상
    pointRadius: 3, // 점 크기
  }));
  let times=['', ...props.records.time.filter((_, i) => i%2===1)]; // 시간 가져오기
  let tmp='';
  for (let i=1;i<times.length;i++){
    if (tmp==='' || tmp!==times[i][0]+times[i][1]){ // 이전국이랑 다르면
      tmp=times[i][0]+times[i][1]; // 앞 두 글자 저장
      times[i]=tmp;
    }
    else
      times[i]=''; // 같으면 빈 문자열로 변경
  }
  let data={
    labels: times,
    datasets: datasets
  };
  let options: ChartOptions<'line'> = {
    responsive: true, // 반응형
    maintainAspectRatio: false, // 크기조절
    animations: {
      y: {
        from: (ctx) => {
          const yScale = ctx.chart.scales.y;
          return yScale.getPixelForValue(25000); // 애니메이션 시작점 25000
        }
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false, // 모든 라벨 표시
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true, // 범례 모양 변경
          pointStyle: 'rectRounded',
        }
      },
    },
  };
  return {
    data: data,
    options: options
  };
})
</script>

<template>
<!-- 게임 결과창 (차트) -->
<div class="container_resultchart" @click.stop="emit('show-modal', 'result_sheet')">
  <LineChart :data="scoreChartInfo.data" :options="scoreChartInfo.options"/>
</div>
</template>

<style scoped>
/* 게임 결과창 (차트) */
.container_resultchart{
  width: 490px;
  height: 240px;
  margin: 5px;
}
</style>