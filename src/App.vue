<script setup lang="ts">
import player from "@/components/player.vue"
import panel from "@/components/panel.vue"
import modal from "@/components/modal.vue"
import { reactive, onMounted } from "vue"
import { useI18n } from "vue-i18n"

/**i18n 속성 가져오기*/
const { t, locale } = useI18n()

/**data 정의*/
const players = reactive([ // 플레이어
  /* 위치, 이름, 자풍, 순위,
  현재 점수, 이펙트용 점수, 점수 차이, 변하는 점수
  리치, 화료, 방총, 텐파이 유무 */
  {seat: "Down",  name: "▼", wind: "東", rank: 0,
    displayScore: 25000, effectScore: 0, gapScore: NaN, deltaScore: 0,
    isRiichi: false, isWin: false, isLose: false, isTenpai: false,},
  {seat: "Right", name: "▶", wind: "南", rank: 0,
    displayScore: 25000, effectScore: 0, gapScore: NaN, deltaScore: 0,
    isRiichi: false, isWin: false, isLose: false, isTenpai: false,},
  {seat: "Up",    name: "▲", wind: "西", rank: 0,
    displayScore: 25000, effectScore: 0, gapScore: NaN, deltaScore: 0,
    isRiichi: false, isWin: false, isLose: false, isTenpai: false,},
  {seat: "Left",  name: "◀", wind: "北", rank: 0,
    displayScore: 25000, effectScore: 0, gapScore: NaN, deltaScore: 0,
    isRiichi: false, isWin: false, isLose: false, isTenpai: false,}
])
const scoringState = reactive({ // 점수계산 요소
  whoWin: -1, // 현재 점수 입력하는 플레이어
  whoLose: -1, // 현재 방총 플레이어
  whoCheat: -1, // 현재 촌보 플레이어
  isFao: false, // 책임지불 유무
  whoFao: -1, // 현재 책임지불하는 플레이어
  inputFan: 0, // 현재 점수 (판)
  inputBu: 2, // 현재 점수 (부)
  inputFao: -1, // 현재 책임지불 점수 (판)
})
const panelInfo = reactive({ // 패널
  wind: "東", // 현재 장풍
  round: 1, // 현재 국
  riichi: 0, // 현재 누적 리치봉
  renchan: 0, // 현재 누적 연장봉
})
const dice = reactive({ // 주사위
  value: [1, 6], // 값
  wallDirection: [false, false, false, false], // 주사위 값에 따른 패산방향
})
const seatTile = reactive({ // 자리정하기 타일
  value: ["東", "南", "西", "北"], // 랜덤 타일값
  isOpened: [false, false, false, false], // 타일이 공개되었는지
})
const records = reactive({ // 기록
  time: ["ㅤ"], // 시간
  score: [[25000],[25000],[25000],[25000]], // 점수
  riichi: [[false, false, false, false]], // 리치 횟수
  win: [[false, false, false, false]], // 화료 횟수
  lose: [[false, false, false, false]], // 방총 횟수
})
const option = reactive({ // 옵션
  startingScore: 25000, // 시작 점수
  returnScore: 30000, // 반환 점수
  rankUma: [30, 10, -10, -30], // 순위 우마
  roundMangan: false, // 절상만관
  tobi: true, // 들통
  cheatScore: false, // 촌보 지불 점수
  riichiPayout: true, // 남은 공탁금 처리
})
const modalInfo = reactive({ // 모달창
  isOpen: false, // on/off
  type: "", // 종류
  status: "", // 라운드 형태 - 론 쯔모 일반유국 특수유국
})

/**시작시 자리선택 타일창 띄우기*/
onMounted(() => {
  document.title=t('pageTitle') // 페이지 이름 설정
  for (let i=3;i>0;i--){ // 자리 섞기
    let j=Math.floor(Math.random()*(i+1));
    [seatTile.value[i], seatTile.value[j]]=[seatTile.value[j], seatTile.value[i]];
  }
  showModal('choose_seat');
})

/**전체화면 활성화/비활성화*/
const toggleFullScreen = () => {
  const element=document.documentElement;
  if (!document.fullscreenElement) {
    if (element.requestFullscreen)
      return element.requestFullscreen();
  } 
  else {
    if (document.exitFullscreen)
      return document.exitFullscreen();
  }
}

/**언어 변경*/
const changeLocale = (language: string) => {
  locale.value=language; // 언어 변경
  document.title=t('pageTitle') // 페이지 이름 설정
  localStorage.setItem("language", locale.value); // 로컬 스토리지에 저장
}

/**리치 활성화/비활성화*/
const toggleActiveRiichi = (seat: string) => {
  let idx=players.findIndex(x => x['seat']===seat); // 위치 기준 인덱스 반환
  if (players[idx].isRiichi===false){ // 리치 활성화
    if (players[idx].displayScore<1000 && option.tobi===true) // 리치를 걸수 없을 때
      return;
    else if (players[idx].effectScore!==0) // 점수변동 이펙트 도중이면 실행 x
      return;
    else{ // 1000점 이상 있거나 음수리치가 가능하다면
      players[idx].displayScore-=1000;
      players[idx].isRiichi=true;
      panelInfo.riichi++;
    }
  }
  else{ // 리치 비활성화
    players[idx].displayScore+=1000;
    players[idx].isRiichi=false;
    panelInfo.riichi--;
  }
}

/**점수 차이 활성화/비활성화*/
const toggleShowGap = (seat: string, toggle: boolean) => {
  let idx=players.findIndex(x => x['seat']===seat); // 위치 기준 인덱스 반환
  if (players[idx].effectScore!==0) // 점수변동 이펙트 도중이면 실행 x
    return;
  if (toggle===true){ // 활성화
    for (let i=0;i<players.length;i++){
      if (i!==idx) // 본인이 아니면 점수 차 표시 켜기
        players[i].gapScore=players[idx].displayScore-players[i].displayScore;
      else
        players[i].gapScore=NaN;
      players[i].rank=players.filter(x => x.displayScore>players[i].displayScore).length+1; // 순위 표시 켜기
    }
  }
  else{ // 비활성화
    for (let i=0;i<players.length;i++){
      players[i].gapScore=NaN; // 점수 차 표시 끄기
      players[i].rank=0; // 순위 표시 끄기
    }
  }
}

/**바람 및 라운드 변경*/
const changeWindsAndRounds = () => {
  let allWinds=["東", "南", "西", "北"];
  let cnt=0;
  let playerWinds=players.map(x => x.wind); // 개인 바람 복사
  playerWinds.unshift(playerWinds.pop()!); // 개인 바람 변경
  players.forEach((x, idx) => {x.wind=playerWinds[idx];}); // 개인 바람 덮어씌우기
  for (let i=0;i<allWinds.length;i++){
    if (panelInfo.wind===allWinds[i]) // 현재 라운드 계산
      cnt+=i*4;
  }
  cnt+=panelInfo.round; // 국 증가
  panelInfo.wind=allWinds[Math.floor((cnt%16)/4)]; // 현재 바람 수정
  panelInfo.round=cnt%4+1; // 현재 라운드 수정
}

/**점수 변동 효과*/
const changeScores = () => {
  let currentScore=players.map(x => x.displayScore); // 현재 점수 저장
  let arrCut: number[][]=[[],[],[],[]];
  for (let i=0;i<players.length;i++){
    for (let j=0;j<50;j++) // 변경될 점수 사이를 50등분해서 저장
      arrCut[i].push(currentScore[i]+(players[i].deltaScore/50)*(j+1));
    players[i].effectScore=players[i].deltaScore; // 이펙트 켜기
  }
  let timecnt=0;
  let effect=setInterval(() => { // 시간에 따라 반복
    for (let i=0;i<players.length;i++)
      players[i].displayScore=arrCut[i][timecnt]; // 이펙트 점수 변경
    timecnt++;
    if (timecnt>=50){
      clearInterval(effect);
      timecnt=0;
      for (let i=0;i<players.length;i++){
        players[i].effectScore=0; // 이펙트 끄기
        players[i].rank=players.filter(x => x.displayScore>players[i].displayScore).length+1; // 순위 표시 켜기
        setTimeout(() => {players[i].rank=0;}, 1000); // 1초 후 순위 표시 끄기
      }
    }
  }, 20); // 0.02초 * 50번 = 1초동안 실행
}

/**실제 점수계산후 반환*/
const calculateScore = (who: number) => {
  let arrFan=[1, 2, 3, 4, 5, 6, 8, 11, 13, 13, 14, 15, 16, 17, 18];
  let arrBu=[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
  let arrMangan=[2000,3000,3000,4000,4000,4000,6000,6000,8000,16000,24000,32000,40000,48000]; // 만관 이상 인당 점수
  let fan=arrFan[scoringState.inputFan], bu=arrBu[scoringState.inputBu];
  let baseScore=0;
  if ((fan===3 && bu>=70) || (fan===4 && bu>=40)) // 3판 70부, 4판 40부 이상이면 만관
    fan=5;
  if (((fan===3 && bu>=60) || (fan===4 && bu>=30)) && option.roundMangan) // 절상만관시 3판 60부, 4판 30부 인정
    fan=5;
  if (5<=fan)
    baseScore=arrMangan[fan-5]; // 만관 이상이면 배열 참조
  else
    baseScore=bu*Math.pow(2,fan+2); // 아니면 점수 계산식으로 계산
  if (modalInfo.status==='ron'){ // 론일 때
    if (players[scoringState.whoWin].wind==='東') // 친이라면 6배
      return Math.ceil(baseScore*6/100)*100;
    else // 자라면 4배
      return Math.ceil(baseScore*4/100)*100;
  }
  else if (modalInfo.status==='tsumo'){ // 쯔모일 때
    if (players[scoringState.whoWin].wind==='東'){ // 이긴사람이 친이라면
      if (who===scoringState.whoWin) // 이겼다면 3배
        return Math.ceil(baseScore*2/100)*100*3;
      else // 졌다면 그대로
        return Math.ceil(baseScore*2/100)*100;
    }
    else{ // 이긴사람이 자라면
      if (who===scoringState.whoWin) // 내가 이겼다면
        return Math.ceil(baseScore*2/100)*100+Math.ceil(baseScore/100)*100*2;
      else if (players[who].wind==='東') // 내가 친이라면 
        return Math.ceil(baseScore*2/100)*100;
      else
        return Math.ceil(baseScore/100)*100;
    }
  }
  return NaN; // 잘못된 경우
}

/**동1국 처음으로 리셋*/
const resetAll = () => {
  let allWinds=["東", "南", "西", "北"];
  while (1<records.time.length){ // 점수기록 지우기
    records.time.pop();
    for (let i=0;i<records.score.length;i++)
      records.score[i].pop();
  }
  while (1<records.riichi.length){ // 리치, 화료, 방총기록 지우기
    records.riichi.pop();
    records.win.pop();
    records.lose.pop();
  }
  for (let i=0;i<records.score.length;i++)
    records.score[i][0]=option.startingScore;
  players.forEach((x) => {x.isRiichi=false;}); // 리치봉 제거
  players.forEach((x) => {x.displayScore=option.startingScore;}); // 점수 설정
  panelInfo.wind="東"; // 장풍 설정
  panelInfo.round=1; // 국 설정
  panelInfo.renchan=0; // 연장 설정
  players.forEach((x, idx) => {x.wind=allWinds[idx];}); // 개인 바람 설정
  panelInfo.riichi=0; // 리치봉 설정
}

/**모달 창 켜기*/
const showModal = (type: string, status?: string) => {
  Object.assign(modalInfo, {
    isOpen: true,
    type: type,
    status: status,
  });
}

/**모달 창 끄기*/
const hideModal = () => {
  if (modalInfo.type==='set_options'){ // 옵션 설정창이라면 확인
    let arrows=["▼", "▶", "▲", "◀"];
    let cntScore=players.reduce((acc, x) => acc+x.displayScore, panelInfo.riichi*1000); // 현재 총점
    let cntUma=option.rankUma.reduce((acc, x) => acc+x, 0); // 현재 총우마
    for (let i=0;i<players.length;i++){
      if (players[i].name==='') // 이름이 없는 경우
        players[i].name=arrows[i]; // 기본이름으로 추가
    }
    if (option.startingScore*4!==cntScore){ // 시작점수가 변경되었다면
      if (option.startingScore%100!==0 || String(option.startingScore)==='') // 이상한 값이면 롤백
        option.startingScore=cntScore/4;
      else // 아니라면 동1국으로 롤백
        resetAll();
    }
    if (option.startingScore>option.returnScore) // 시작점수가 반환점수보다 큰 경우
      option.returnScore=option.startingScore;
    if (cntUma!==0) // 우마 합계가 0이 아니라면 초기화
      option.rankUma=[30, 10, -10, -30];
  }
  Object.assign(modalInfo, { // 모달창 끄기
    isOpen: false,
    type: "",
    status: "",
  });
  Object.assign(scoringState, { // 점수계산 관련 변수 초기화
    whoWin: -1,
    whoLose: -1,
    whoCheat: -1,
    isFao: false,
    whoFao: -1,
    inputFan: 0,
    inputBu: 2,
    inputFao: -1,
  });
  players.forEach((x) => { // 승자/패자 및 변동점수 초기화
    x.deltaScore=0;
    x.isWin=false;
    x.isLose=false;
    x.isTenpai=false;
  });
}

/**화살표 버튼 동작 설정*/
const setArrowButton = (status: string, idx: number) => {
  if (status==='win') // 화료 버튼
    players[idx].isWin=!players[idx].isWin;
  else if (status==='lose'){ // 방총 버튼
    if (players[idx].isWin) // 화료한 사람이랑 겹치는 경우 비활성화
      return;
    if (players[idx].isLose===false){ // 방총당한 사람을 바꾸는 경우
      for (let i=0;i<players.length;i++){
        if (i!==idx) // 자신이 아닌 사람들의 체크를 해제
          players[i].isLose=false;
      }
    }
    players[idx].isLose=!players[idx].isLose;
  }
  else if (status==='cheat'){ // 촌보 버튼
    if (scoringState.whoCheat===idx)
      scoringState.whoCheat=-1;
    else
      scoringState.whoCheat=idx;
  }
  else if (status==='fao'){ // 책임지불 버튼
    if (scoringState.whoWin===idx || scoringState.whoLose===idx) // 현재 승자 또는 패자와 같을때 비활성화
      return;
    if (scoringState.whoFao===idx)
      scoringState.whoFao=-1;
    else
      scoringState.whoFao=idx;
  }
  else if (status==='tenpai') // 텐파이 버튼
    players[idx].isTenpai=!players[idx].isTenpai;
}

/**토글 버튼 동작 설정*/
const setToggleButton = (status: string) => {
  if (status==='isfao') // 점수창 책임지불 OX 토글
    scoringState.isFao=!scoringState.isFao;
  else if (status==='roundmangan') // 절상만관 토글
    option.roundMangan=!option.roundMangan;
  else if (status==='tobi') // 토비 토글
    option.tobi=!option.tobi;
  else if (status==='cheatscore') // 촌보점수 토글
    option.cheatScore=!option.cheatScore;
  else if (status==='endriichi') // 공탁처리 토글
    option.riichiPayout=!option.riichiPayout;
}

/**판/부 버튼 동작 설정*/
const setFanBuButton = (status: string, idx: number) => {
  if (status==='fan'){ // 판 체크
    if (idx>=9 && scoringState.inputFan===idx) // 역만일경우 처리
      scoringState.inputFan<14 ? scoringState.inputFan++ : scoringState.inputFan=9;
    else{
      scoringState.isFao=false; // 책임지불 초기화
      scoringState.inputFan=idx;
    }
    scoringState.inputBu=2; // 30부로 초기화
  }
  else if (status==='bu'){ // 부 체크
    if (modalInfo.status==='ron' && idx===0) // 론일때 20부 이하 비활성화
      return;
    else if (scoringState.inputFan===0 && idx<=1) // 1판 25부 이하 비활성화
      return;
    else if (scoringState.inputFan>=4) // 만관 이상일때 부수 비활성화
      return;
    scoringState.inputBu=idx;
  }
  else if (status=='inputfao'){ // 책임지불 점수창
    if (scoringState.inputFan-9<idx) // 입력 판수보다 크면 불가능
      return;
    scoringState.inputFao=idx;
  }
}

/**자리타일 동작 설정*/
const setSeatTile = (idx: number) => {
  seatTile.isOpened[idx]=true;
}

/**화료 및 방총 불가능한 경우 반환*/
const checkInvalidStatus = (status: string) => {
  let cntWin=players.filter(x => x.isWin===true).length; // 화료 인원 세기
  let cntLose=players.filter(x => x.isLose===true).length; // 방총 인원 세기
  if (status==='win'){ // 화료일때
    if (cntWin===0 || cntWin===4) // 화료한 사람이 없거나 4명임 (불가능한 경우)
      return;
    showModal('check_player_lose');
  }
  else if (status==='lose'){ // 방총일때
    if (cntWin!==1 && cntLose===0) // 2명 이상 화료했는데 쯔모임 (불가능한 경우)
      return;
    if (!cntLose){ // 쯔모
      scoringState.whoWin=players.findIndex(x => x['isWin']===true); // 승자 찾아서 저장
      showModal('choose_score', 'tsumo');
    }
    else{ // 론
      scoringState.whoLose=players.findIndex(x => x['isLose']===true); // 패자 찾아서 저장
      for (let i=0;i<players.length;i++){
        if (players[(scoringState.whoLose+i)%4].isWin===true){ // 승자 찾아서 저장 (선하네 순서로 탐색)
          scoringState.whoWin=(scoringState.whoLose+i)%4;
          break;
        }
      }
      showModal('choose_score', 'ron');
    }
  }
  else if (status==='fao'){ // 책임지불일때
    scoringState.inputFao=scoringState.inputFan-9;
    if (scoringState.whoFao===-1) // 책임지불할 사람이 없음 (불가능한 경우)
      return;
    if (scoringState.inputFan>=10) // 2배역만 이상이면 점수 선택
      showModal('choose_score_fao', modalInfo.status);
    else
      calculateWin();
  }
  else if (status==='cheat'){ // 촌보일때
    if (scoringState.whoCheat===-1) // 촌보한 사람이 없음 (불가능한 경우)
      return;
    calculateCheat();
  }
}

/**화료 점수계산*/
const calculateWin = () => {
  if (modalInfo.status==='tsumo'){ // 쯔모
    if (scoringState.isFao===false){
      for (let i=0;i<players.length;i++){
        if (i===scoringState.whoWin) // 승자
          players[i].deltaScore+=calculateScore(i)+panelInfo.riichi*1000+panelInfo.renchan*300;
        else // 패자
          players[i].deltaScore-=calculateScore(i)+panelInfo.renchan*100;
      }
    }
    else{ // 책임지불시
      let tmp=scoringState.inputFan;
      scoringState.inputFan=scoringState.inputFao+9; // 책임지불할 점수
      players[scoringState.whoWin].deltaScore+=calculateScore(scoringState.whoWin)+panelInfo.riichi*1000+panelInfo.renchan*300;
      players[scoringState.whoFao].deltaScore-=calculateScore(scoringState.whoWin)+panelInfo.renchan*300;
      scoringState.inputFan=tmp-scoringState.inputFao-1; // 롤백
      if (scoringState.inputFan>=9){ // 다른사람도 여전히 지불해야 하는 경우
        for (let i=0;i<players.length;i++){
          if (i===scoringState.whoWin) // 승자
            players[i].deltaScore+=calculateScore(i);
          else // 패자
            players[i].deltaScore-=calculateScore(i);
        }
      }
    }
    showModal('show_score', 'tsumo');
  }
  else if (modalInfo.status==='ron'){ // 론
    let firstWinner=-1, chkFinish=false;
    for (let i=1;i<players.length;i++){
      if (players[(scoringState.whoLose+i)%4].isWin===true){
        firstWinner=(scoringState.whoLose+i)%4; // 선하네 판별
        break;
      }
    }
    if (firstWinner===scoringState.whoWin) { // 승자+선하네
      players[scoringState.whoWin].deltaScore+=calculateScore(scoringState.whoWin)+panelInfo.riichi*1000+panelInfo.renchan*300;
      players[scoringState.whoLose].deltaScore-=calculateScore(scoringState.whoLose)+panelInfo.renchan*300;
    }
    else{ // 나머지 승자
      players[scoringState.whoWin].deltaScore+=calculateScore(scoringState.whoWin);
      players[scoringState.whoLose].deltaScore-=calculateScore(scoringState.whoLose);
    }
    if (scoringState.isFao===true){ // 책임지불시 절반 지불
      scoringState.inputFan=scoringState.inputFao+9; // 책임지불할 점수
      players[scoringState.whoLose].deltaScore+=Math.floor(calculateScore(scoringState.whoLose)/2);
      players[scoringState.whoFao].deltaScore-=Math.floor(calculateScore(scoringState.whoLose)/2);
    }
    for (let i=1;i<players.length;i++){
      if ((scoringState.whoWin+i)%4===scoringState.whoLose){ // 1바퀴를 모두 돌았을때
        chkFinish=true;
        break;
      }
      else if (players[(scoringState.whoWin+i)%4].isWin===true){ // 다음 승자가 남아있을때
        scoringState.whoWin=(scoringState.whoWin+i)%4; // 현재 승자 변경
        scoringState.isFao=false;
        scoringState.whoFao=-1;
        scoringState.inputFan=0;
        scoringState.inputBu=2;
        showModal('choose_score', 'ron'); // 다음 승자 점수 입력
        break;
      }
    }
    if (chkFinish) // 모든 승자의 점수를 체크했다면
      showModal('show_score', 'ron');
  }
}

/**유국 점수계산*/
const calculateDraw = () => {
  players.forEach((x) => {x.isTenpai||=x.isRiichi;}); // 리치자 텐파이로 변경
  let cntTenpai=players.filter(x => x.isTenpai===true).length; // 총 텐파이 인원
  if (0<cntTenpai && cntTenpai<4){ //올텐파이나 올노텐이 아니라면
    for (let i=0;i<players.length;i++){
      if (players[i].isTenpai===true) // 텐파이라면
        players[i].deltaScore=3000/cntTenpai; // 3000 나눠서 획득
      else
        players[i].deltaScore=-3000/(players.length-cntTenpai); 
    }
  }
  showModal('show_score', 'normal_draw');
}

/**촌보 점수계산*/
const calculateCheat = () => {
  if (option.cheatScore===true){ // 만관 지불
    for (let i=0;i<players.length;i++){
      if (scoringState.whoCheat===i){
        if (players[i].wind==='東') // 친일경우
          players[i].deltaScore=-12000;
        else
          players[i].deltaScore=-8000;
      }
      else{
        if (players[i].wind==='東' || players[scoringState.whoCheat].wind==='東') //촌보자가 친이거나 내가 친일때
          players[i].deltaScore=4000;
        else
          players[i].deltaScore=2000;
      }
    }
  }
  else{ // 3000점씩 지불 
    for (let i=0;i<players.length;i++){
      if (scoringState.whoCheat===i)
        players[i].deltaScore=-9000;
      else
        players[i].deltaScore=3000;
    }
  }
  showModal('show_score', 'cheat');
}

/**국 결과값 처리*/
const saveRound = () => {
  if (modalInfo.status==='cheat'){ // 촌보의 경우 리치봉 반환
    for (let i=0;i<players.length;i++){
      if (players[i].isRiichi===true){
        players[i].displayScore+=1000;
        players[i].isRiichi=false;
        panelInfo.riichi--;
      }
    }
  }
  changeScores(); // 점수 배분및 기록
  for (let i=0;i<players.length;i++){ // 점수 기록창에 점수 기록
    records.score[i].push(players[i].deltaScore);
    records.score[i].push(players[i].displayScore+players[i].deltaScore);
  }
  records.time.push(panelInfo.wind+panelInfo.round+'局 '+panelInfo.renchan+'本場'); // 점수 기록창에 국+본장 기록
  records.time.push('ㅤ');
  records.riichi.push(players.map(x => x.isRiichi)); // 리치 기록에 추가
  records.win.push(players.map(x => x.isWin)); // 화료 기록에 추가
  records.lose.push(players.map(x => x.isLose)); // 방총 기록에 추가
  players.forEach((x) => {x.isRiichi=false;}); // 리치봉 수거
  let chin=players[players.findIndex(x => x['wind']==='東')]; // 친이 누구인지 저장
  if (modalInfo.status==='tsumo' || modalInfo.status==='ron'){ // 화료로 끝났다면
    if (chin.isWin===false){ // 친이 화료를 못했다면
      changeWindsAndRounds(); // 바람 및 라운드 변경
      panelInfo.renchan=0; // 연장봉 초기화
    }
    else // 연장에 성공했다면
      panelInfo.renchan++; // 연장봉 추가
    panelInfo.riichi=0; // 리치봉 초기화
  }
  else if (modalInfo.status==='normal_draw'){ // 일반유국이라면
    if (chin.isTenpai===false) // 친이 노텐이라면
      changeWindsAndRounds(); // 바람 및 라운드 변경
    panelInfo.renchan++; // 연장봉 추가
  }
  else if (modalInfo.status==='special_draw'){ // 특수유국이라면
    panelInfo.renchan++; // 연장봉 추가
  }
  hideModal(); // 모달 창 끄기
}

/**주사위 굴리기*/
const rollDice = () => {
  let timecnt=0;
  dice.wallDirection=[false, false, false, false]; // 패산 떼는 방향 초기화
  let roll=setInterval(() => { // 시간에 따라 반복
    dice.value[0]=Math.floor(Math.random()*6)+1;
    dice.value[1]=Math.floor(Math.random()*6)+1;
    timecnt++;
    if (timecnt>=10){
        clearInterval(roll);
        dice.wallDirection[(dice.value[0]+dice.value[1]-1)%4]=true; // 패산 떼는 방향 표시
    }
  }, 50); // 0.05초 * 10번 = 0.5초동안 실행
}

/**점수 기록 복사*/
const copyRecord = () => {
  let str=t('resultSheet.name')+'\t';
  for (let i=0;i<players.length;i++)
    str+=players[i].name+'\t'; // 이름 복사
  str+='\n';
  for (let i=0;i<records.time.length;i++){
    if (records.time[i]!=="ㅤ") // 공백 제거
      str+=records.time[i]; // 라운드 복사
    str+='\t';
    for (let j=0;j<records.score.length;j++){
      if (records.score[j][i]!==0 || i%2===0) // 0점 이동 제거
        str+=String(records.score[j][i]); // 점수 복사
      str+='\t';
    }
    str+='\n';
  }
  navigator.clipboard.writeText(str); // 클립보드로 복사
  showModal(t('comments.copyRecord'));
}

/**해당 국으로 롤백하기*/
const rollbackRecord = (idx: number) => {
  let allWinds=["東", "南", "西", "北"];
  let arr=records.time[idx].match(/[\u4e00-\u9fff]|\d+|\S/g)!; // 시간 값 분리
  let sumScore=0;
  while (idx<records.time.length){ // 점수기록 지우기
    records.time.pop();
    for (let i=0;i<records.score.length;i++)
      records.score[i].pop();
  }
  while (Math.floor(idx/2)+1<records.riichi.length){ // 리치, 화료, 방총기록 지우기
    records.riichi.pop();
    records.win.pop();
    records.lose.pop();
  }
  players.forEach((x) => {x.isRiichi=false;}); // 리치봉 제거
  for (let i=0;i<records.score.length;i++){
    players[i].displayScore=Number(records.score[i][records.score[i].length-1]); // 점수 설정
    sumScore+=players[i].displayScore;
  }
  panelInfo.wind=arr[0]; // 장풍 설정
  panelInfo.round=Number(arr[1]); // 국 설정
  panelInfo.renchan=Number(arr[3]); // 연장 설정
  for (let i=1;i<panelInfo.round;i++)
    allWinds.unshift(allWinds.pop()!); // 현재 바람 세기
  players.forEach((x, idx) => {x.wind=allWinds[idx];}); // 개인 바람 설정
  panelInfo.riichi=Math.floor((option.startingScore*4-sumScore)/1000); // 리치봉 설정
  hideModal(); // 모달 창 끄기
}
</script>

<template>
<div class="background" @dblclick.self="toggleFullScreen()">
  <!-- 각 방향별 player 컴포넌트 생성 -->
  <player v-for="(_, i) in players"
    :key="i"
    :player="players[i]"
    :option
    @toggle-active-riichi="toggleActiveRiichi"
    @toggle-show-gap="toggleShowGap"
  />
  <!-- 중앙 panel 컴포넌트 생성 -->
  <panel
    :panelInfo
    @show-modal="showModal"
    @roll-dice="rollDice"
  />
  <!-- modal 컴포넌트 생성 -->
  <modal
    v-if="modalInfo.isOpen"
    :players
    :scoringState
    :panelInfo
    :dice
    :seatTile
    :records
    :option
    :modalInfo
    @show-modal="showModal"
    @hide-modal="hideModal"
    @set-arrow-button="setArrowButton"
    @set-toggle-button="setToggleButton"
    @set-fanbu-button="setFanBuButton"
    @set-seat-tile="setSeatTile"
    @check-invalid-status="checkInvalidStatus"
    @calculate-win="calculateWin"
    @calculate-draw="calculateDraw"
    @save-round="saveRound"
    @roll-dice="rollDice"
    @copy-record="copyRecord"
    @rollback-record="rollbackRecord"
    @change-locale="changeLocale"
  />
</div>
</template>

<style>
</style>