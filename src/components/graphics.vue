<script>
export default {
  props: {
    kind: String,
    value: [Number, String],
  },
  data(){
    return {
    };
  },
  methods: {
  }
};
</script>

<template>
<!--리치봉 -->
<div v-if="kind==='riichiStick'" class="stick">
  <div class="riichi_circle"></div>
</div>
<!--미니리치봉 -->
<div v-else-if="kind==='riichiStickMini'" class="stick_mini">
  <div class="riichi_circle_mini"></div>
</div>
<!--미니연장봉 -->
<div v-else-if="kind==='renchanStickMini'" class="stick_mini">
  <div class="renchan_circle_mini" style="margin: auto 0px 5px 0px;visibility: hidden;"></div>
  <div class="renchan_circle_mini"></div>
  <div class="renchan_circle_mini" style="margin: auto 0px 3px 0px;"></div>
  <div class="renchan_circle_mini"></div>
  <div class="renchan_circle_mini" style="margin: auto 0px 3px 0px;"></div>
  <div class="renchan_circle_mini"></div>
  <div class="renchan_circle_mini" style="margin: auto 0px 3px 0px;"></div>
  <div class="renchan_circle_mini"></div>
  <div class="renchan_circle_mini" style="margin: auto 0px 3px 0px;"></div>
  <div class="renchan_circle_mini" style="margin: 5px 0px auto 0px; visibility: hidden;"></div>
</div>
<!-- 주사위 -->
<div v-else-if="kind==='dice'" class="container_dice">
  <div v-if="value===1" class="dice_circle" style="grid-area: _1; background-color: red;"></div>
  <div v-if="(value-2)%2===1" class="dice_circle" style="grid-area: _1;"></div>
  <div v-if="value>=2" class="dice_circle" style="grid-area: _2;"></div>
  <div v-if="value>=2" class="dice_circle" style="grid-area: _3;"></div>
  <div v-if="value>=4" class="dice_circle" style="grid-area: _4;"></div>
  <div v-if="value>=4" class="dice_circle" style="grid-area: _5;"></div>
  <div v-if="value===6" class="dice_circle" style="grid-area: _6;"></div>
  <div v-if="value===6" class="dice_circle" style="grid-area: _7;"></div>
</div>
<!-- 바람 타일 -->
<div v-else-if="kind==='tile'" class="tile" >{{ value }}</div>
</template>

<style scoped>
/* 리치봉 */
.stick{
  visibility: hidden;
  border: 2px solid black;
  border-radius: 5px;
  transform: translate(0, 20px);
}
.riichi_circle{
  background-color:red;
  width:15px;
  height:15px;
  border-radius:50%;
  margin: 3px auto 3px auto;
}

/* 미니 리치봉, 연장봉 */
.stick_mini{
  width: 50px;
  height: 10px;
  font-size: 0px;
  border: 1px solid black;
  border-radius: 3px;
  transform: rotate(-50deg) translate(-52px,-10px);
}
.riichi_circle_mini{
  background-color:red;
  width:5px;
  height:5px;
  border-radius:50%;
  margin: 3px auto 3px auto;
}
.renchan_circle_mini{
  display: inline-block;
  background-color:black;
  width:3px;
  height:3px;
  border-radius:50%;
  margin: 3px 0px auto 0px;
}

/* 주사위 */
.container_dice{
  display: grid;
  width:35px;
  height:35px;
  grid-template-rows: repeat(7, 5px);
  grid-template-columns: repeat(7, 5px);
  grid-template-areas: 
  ". . . . . . ."
  ". _2 . . . _5 ."
  ". . . . . . ."
  ". _6 . _1 . _7 ."
  ". . . . . . ."
  ". _4 . . . _3 ."
  ". . . . . . ."
  ;
  vertical-align: middle;
  text-align: center;
  border: 3px solid black;
  border-radius:5px;
  margin: auto;
}
.dice_circle{
  background-color: black;
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

/* 타일 */
.tile{
  border: 3px solid black;
  border-radius:5px;
}
</style>
