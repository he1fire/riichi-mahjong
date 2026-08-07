<script setup lang="ts">
/**props 정의*/
interface Props {
  message: string
}
defineProps<Props>()
</script>

<template>
<!-- 메시지 팝업창 -->
<div class="modal_text">
  {{ message }}
</div>
</template>

<style scoped>
/* 메시지 팝업창 */
.modal_text{
  font-size: 20px;
  margin: 20px;
}
</style>