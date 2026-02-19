<script setup lang="ts">
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { locale, t, messages } = useI18n()

/**emits 정의*/
type Emits = {
  (e: 'show-modal', type: string, status?: string): void,
  (e: 'change-locale', language: string): void
}
const emit = defineEmits<Emits>()

/**언어에 따른 색상*/
const getLocaleColor = (x: string) => {
  return {color: locale.value===x ? 'red' : ''};
}
</script>

<template>
<!-- 메뉴 선택창 -->
<div class="container_choose_menu">
  <div @click.stop="emit('show-modal', 'result_sheet')">
    {{ t('menu.resultSheet') }}
  </div>
  <div @click.stop="emit('show-modal', 'show_record')">
    {{ t('menu.record') }}
  </div>
  <div @click.stop="emit('show-modal', 'set_options')">
    {{ t('menu.option') }}
  </div>
  <div @click.stop="emit('show-modal', 'sync')">
    {{ t('menu.sync') }}
  </div>
  <div style="font-size: 20px;">
    <div style="display: flex; align-items: center;">
      <img src="/globe.svg" alt="SVG"/>
      <span v-for="(x, i) in Object.keys(messages)"
        :key="i"
        @click.stop="emit('change-locale', x)"
      >
        <span v-show="i!==0">/</span><span :style="getLocaleColor(x)">{{ x.toUpperCase() }}</span>
      </span>
    </div>
    <a style="display: flex; align-items: center;" href="https://github.com/he1fire/riichi-mahjong" target="_blank"><img src="/github-logo.svg" alt="SVG"/>Github</a>
  </div>
</div>
</template>

<style scoped>
/* 메뉴 선택창 */
.container_choose_menu{
  display: grid;
  grid-template-rows: repeat(2, 60px);
  grid-template-columns: repeat(3, 120px);
  font-size: 30px;
  gap: 20px;
  margin: 15px;
  place-items: center;
}
</style>