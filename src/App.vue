<script>
import player from './components/player.vue'
import panel from './components/panel.vue'
import modal from './components/modal.vue'
export default {
  components: {
    player,
    panel,
    modal
  },
  data(){
    return {
      seats: ["Down", "Right", "Up", "Left"], // 플레이어별 위치
      winds: ["東", "南", "西", "北"], // 플레이어별 현재 자풍
      scoresHigh: [250, 250, 250, 250], // 플레이어별 현재 점수 (100자리 이상)
      scoresLow: [0, 0, 0, 0], // 플레이어별 현재 점수 (100자리 이하)
      ranks: [0, 0, 0, 0], // 플레이어별 순위
      scoresEffect: [0, 0, 0, 0], // 플레이어별 이펙트 점수
      scoresDiff: [0, 0, 0, 0], // 플레이어별 변동 점수
      scoresGap: [0, 0, 0, 0], // 플레이어간 점수 차이
      names: ["▼", "▶", "▲", "◀"], // 플레이어별 이름
      focusWinner: -1, // 현재 점수 입력하는 플레이어
      focusLoser: -1, // 현재 방총 플레이어
      isFao: false, // 책임지불 유무
      focusFao: -1, // 현재 책임지불하는 플레이어
      inputFan: 0, // 현재 점수 (판)
      inputBu: 2, // 현재 점수 (부)
      isGap: [false, false, false, false], // 플레이어간 점수 차이 표시 유무
      isRiichi: [false, false, false, false], // 플레이어별 리치 유무
      isWin: [false, false, false, false], // 플레이어별 화료 유무
      isLose: [false, false, false, false], // 플레이어별 방총 유무
      isTenpai: [false, false, false, false], // 플레이어별 텐파이 유무
      isCheat: [false, false, false, false], // 플레이어별 촌보 유무
      currentWind: "東", // 현재 장풍
      currentRound: 1, // 현재 국
      countRiichi: 0, // 현재 누적 리치봉
      countRenchan: 0, // 현재 누적 연장봉
      roundStatus: "", // 라운드 형태 - 론 쯔모 일반유국 특수유국
      diceValue: [1, 6], // 주사위 값
      isWall: [false, false, false, false], // 주사위 값에 따른 패산방향
      isOpened: [false, false, false, false], // 타일이 공개되었는지
      randomSeats: ["東", "南", "西", "北"], // 랜덤 타일값
      recordsTime: ["ㅤ"], // 라운드 기록
      recordsScore: [[25000],[25000],[25000],[25000]], //  점수 기록
      recordsRiichi: [[false, false, false, false]], // 리치 기록
      recordsWin: [[false, false, false, false]], // 화료 기록
      recordsLose: [[false, false, false, false]], // 방총 기록
      setScore: [25000, 30000], // 시작, 반환 점수
      rankUma: [30, 10, -10, -30], // 순위 우마
      optRoundMangan: false, // 절상만관 옵션
      optMinusRiichi: false, // 음수리치 옵션
      optCheatScore: false, // 촌보 지불 점수
      modal: false, // 모달창 활성화
      modalType: "", // 모달창 종류
    };
  },
  mounted() {
    // 자리 선택 창
    for (let i=3;i>0;i--){ // 자리 섞기
      let j=Math.floor(Math.random()*(i+1));
      [this.randomSeats[i], this.randomSeats[j]]=[this.randomSeats[j], this.randomSeats[i]];
    }
    this.showModal('choose_seat');
  },
  methods: {
    /**전체화면 활성화/비활성화*/
    toggleFullScreen(){
      const element=document.documentElement;
      if (!document.fullscreenElement) {
        if (element.requestFullscreen)
          return element.requestFullscreen();
        if (element.webkitRequestFullscreen)
          return element.webkitRequestFullscreen();
        if (element.mozRequestFullScreen)
          return element.mozRequestFullScreen();
        if (element.msRequestFullscreen)
          return element.msRequestFullscreen();
      } 
      else {
        if (document.exitFullscreen)
          return document.exitFullscreen();
        if (document.webkitCancelFullscreen)
          return document.webkitCancelFullscreen();
        if (document.mozCancelFullScreen)
          return document.mozCancelFullScreen();
        if (document.msExitFullscreen)
          return document.msExitFullscreen();
      }
    },
    /**리치 활성화/비활성화*/
    toggleActiveRiichi(seat){
      let idx=this.seats.indexOf(seat); // 위치 기준 인덱스 반환
      if (this.isRiichi[idx]===false){ //  리치 활성화
        if (this.scoresHigh[idx]<10 && this.optMinusRiichi===false) // 리치를 걸수 없을 때
          return;
        else { // 1000점 이상 있거나 음수리치가 가능하다면
          this.scoresHigh[idx]-=10;
          this.isRiichi[idx]=true;
          this.countRiichi++;
        }
      }
      else{ // 리치 비활성화
        this.scoresHigh[idx]+=10;
        this.isRiichi[idx]=false;
        this.countRiichi--;
      }
    },
    /**점수 차이 활성화/비활성화*/
    toggleShowGap(seat, x){
      let idx=this.seats.indexOf(seat); // 위치 기준 인덱스 반환
      if (x===true){ // 활성화
        for (let i=0;i<this.isGap.length;i++){
          if (i===idx)
            this.isGap[i]=false;
          else{ // 본인이 아니면 표시 변경
            this.isGap[i]=true;
            this.scoresGap[i]=this.scoresHigh[idx]-this.scoresHigh[i];
          }
          this.ranks[i]=1; // 순위 표시 켜기
          for (let j=0;j<this.scoresHigh.length;j++){ // 순위 계산
            if (i!==j && this.scoresHigh[i]<this.scoresHigh[j])
              this.ranks[i]++;
          }
        }
      }
      else{ // 비활성화
        for (let i=0;i<this.isGap.length;i++){
          this.isGap[i]=false;
          this.scoresGap[i]=0;
          this.ranks[i]=0; // 순위 표시 끄기
        }
      }
    },
    /**바람 및 라운드 변경*/
    changeWindsAndRounds(){
      let allWinds="東南西北";
      let cnt=0;
      this.winds.unshift(this.winds.pop()); // 개인 바람 변경
      for (let i=0;i<allWinds.length;i++){
        if (this.currentWind===allWinds[i]) // 현재 라운드 계산
          cnt+=i*4;
      }
      cnt+=this.currentRound; // 국 증가
      this.currentWind=allWinds[Math.floor((cnt%16)/4)]; // 현재 바람 수정
      this.currentRound=cnt%4+1; // 현재 라운드 수정
    },
    /**점수 변동 효과*/
    changeScores(idx){
      let startScore=this.scoresHigh[idx]*100;
      let arrCut=[];
      for (let i=0;i<50;i++) // 변경될 점수 사이를 50등분해서 저장
        arrCut[i]=startScore+(this.scoresDiff[idx]/50)*(i+1);
      this.scoresEffect[idx]=this.scoresDiff[idx]; // 이펙트 켜기
      let timecnt=0;
      let repeat=setInterval(() => { // 시간에 따라 반복
        let x=Math.floor(arrCut[timecnt]/100), y=Math.abs(arrCut[timecnt]%100);
        this.scoresHigh[idx]=x // 100의 자리 변경
        this.scoresLow[idx]=y // 10의자리 변경
        timecnt++;
        if (timecnt>=50){
          clearInterval(repeat); 
          this.scoresEffect[idx]=0; // 이펙트 끄기
        }
      }, 20); // 0.02초 * 50번 = 1초동안 실행
    },
    /**실제 점수계산후 반환*/
    calculateScore(who){
      let arrFan= [1, 2, 3, 4, 5, 6, 8, 11, 13, 13, 14, 15, 16, 17, 18];
      let arrBu= [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
      let arrMangan=[2000,3000,3000,4000,4000,4000,6000,6000,8000,16000,24000,32000,40000,48000]; // 만관 이상 인당 점수
      let fan=arrFan[this.inputFan], bu=arrBu[this.inputBu];
      let ret=0, chinScore=0, score=0;
      if ((fan===3 && bu>=70) || (fan===4 && bu>=40)) // 3판 70부, 4판 40부 이상이면 만관
        fan=5;
      if (((fan===3 && bu>=60) || (fan===4 && bu>=30)) && this.optRoundMangan) // 절상만관시 3판 60부, 4판 30부 인정
        fan=5;
      if (5<=fan)
        chinScore=score=arrMangan[fan-5]; // 만관 이상이면 배열 참조
      else
        chinScore=score=bu*Math.pow(2,fan+2); // 아니면 점수 계산식으로 계산
      if (this.roundStatus==='ron' || this.roundStatus==='ron_fao'){ // 론일 때
        if (this.winds[this.focusWinner]==='東') // 친이라면 6배
          score*=6;
        else // 자라면 4배
          score*=4;
        score=Math.ceil(score/100)*100;
        ret=score;
      }
      else if (this.roundStatus==='tsumo' || this.roundStatus==='tsumo_fao'){ // 쯔모일 때
        chinScore*=2; // 친이라면 2배
        chinScore=Math.ceil(chinScore/100)*100;
        score=Math.ceil(score/100)*100;
        if (this.winds[this.focusWinner]==='東'){ // 이긴사람이 친이라면
          if (who===this.focusWinner) // 이겼다면 3배
            ret=chinScore*3;
          else // 졌다면 그대로
            ret=chinScore;
        }
        else{ // 이긴사람이 자라면
          if (who===this.focusWinner) // 내가 이겼다면
            ret=chinScore+score*2;
          else if (this.winds[who]==='東') // 내가 친이라면 
            ret=chinScore;
          else
            ret=score;
        }
      }
      return ret;
    },
    /**동1국 처음으로 리셋*/
    resetAll(){
      let allWinds = ["東", "南", "西", "北"];
      while (1<this.recordsTime.length){ // 점수기록 지우기
        this.recordsTime.pop();
        for (let i=0;i<this.recordsScore.length;i++)
          this.recordsScore[i].pop();
      }
      while (1<this.recordsRiichi.length){ // 리치, 화료, 방총기록 지우기
        this.recordsRiichi.pop();
        this.recordsWin.pop();
        this.recordsLose.pop();
      }
      for (let i=0;i<this.recordsScore.length;i++)
        this.recordsScore[i][0]=this.setScore[0];
      for (let i=0;i<this.isRiichi.length;i++) // 리치봉 제거
        this.isRiichi[i]=false;
      this.currentWind="東"; // 장풍 설정
      this.currentRound=1; // 국 설정
      for (let i=0;i<this.recordsScore.length;i++)
        this.scoresHigh[i]=Math.floor(this.setScore[0]/100); // 점수 설정
      this.countRenchan=0; // 연장 설정
      this.countRiichi=0; // 리치봉 설정
      for (let i=0;i<this.winds.length;i++)
        this.winds[i]=allWinds[i]; // 개인 바람 설정
    },
    /**모달 창 켜기*/
    showModal(type, status){
      this.modalType=type;
      this.roundStatus=status;
      this.modal=true;
    },
    /**모달 창 끄기*/
    hideModal(){
      if (this.modalType==='set_options'){ // 옵션 설정창이라면 확인
        let arrows=["▼", "▶", "▲", "◀"];
        let cntScore=this.scoresHigh.reduce((acc, cur) => acc + cur, this.countRiichi*10)*100; // 현재 총점
        let cntUma=this.rankUma.reduce((acc, cur) => acc + cur, 0); // 현재 총우마
        for (let i=0;i<this.names.length;i++){
          if (this.names[i]==='') // 이름이 없는 경우
            this.names[i]=arrows[i]; // 기본이름으로 추가
        }
        if (this.setScore[0]*4!==cntScore){ // 시작점수가 변경되었다면
          if (this.setScore[0]%100!==0) // 이상한 값이면 롤백
            this.setScore[0]=cnt/4;
          else // 아니라면 동1국으로 롤백
            this.resetAll();
        }
        if (this.setScore[0]>this.setScore[1]) // 시작점수가 반환점수보다 큰 경우
          this.setScore[1]=this.setScore[0];
        if (cntUma!==0) // 우마 합계가 0이 아니라면 초기화
          this.rankUma=[30, 10, -10, -30];
      }
      this.modalType='';
      this.roundStatus='';
      this.scoresDiff=[0, 0, 0, 0];
      this.focusWinner=-1;
      this.focusLoser=-1;
      this.isFao=false;
      this.focusFao=-1;
      this.inputFan=0;
      this.inputBu=2;
      this.isWin=[false, false, false, false];
      this.isLose=[false, false, false, false];
      this.isTenpai=[false, false, false, false];
      this.isCheat=[false, false, false, false];
      this.modal=false;
    },
    /**화료, 방총, 텐파이, 판/부, 책임지불 체크*/
    toggleCheckStatus(idx, status){
      if (status==='win') // 화료 체크
        this.isWin[idx]=!this.isWin[idx];
      else if (status==='lose'){ // 방총 체크
        if (this.isWin[idx])// 화료한 사람이랑 겹치는 경우 스킵
          return;
        if (!this.isLose[idx]){ // 방총당한 사람을 바꾸는 경우
          for (let i=0;i<this.isLose.length;i++){
            if (i!==idx) // 자신이 아닌 사람들의 체크를 해제
              this.isLose[i]=false;
          }
        }
        this.isLose[idx]=!this.isLose[idx];
      }
      else if (status==='tenpai') // 텐파이 체크
        this.isTenpai[idx]=!this.isTenpai[idx];
      else if (status==='cheat'){ // 촌보 체크
        if (!this.isCheat[idx]){ // 방총당한 사람을 바꾸는 경우
          for (let i=0;i<this.isCheat.length;i++){
            if (i!==idx) // 자신이 아닌 사람들의 체크를 해제
              this.isCheat[i]=false;
          }
        }
        this.isCheat[idx]=!this.isCheat[idx];
      }
      else if (status==='fan'){ // 판 체크
        if (idx>=9 && this.inputFan===idx) // 역만일경우 처리
          this.inputFan<14 ? this.inputFan++ : this.inputFan=9;
        else{
          this.isFao=false; // 책임지불 초기화
          this.inputFan=idx;
        }
        this.inputBu=2; // 30부로 초기화
      }
      else if (status==='bu'){ // 부 체크
        if (this.roundStatus==='ron' && idx===0) // 론일때 20부 이하 비활성화
          return;
        else if (this.inputFan===0 && idx<=1) // 1판 25부 이하 비활성화
          return;
        else if (this.inputFan>=4) // 만관 이상일때 부수 비활성화
          return;
        this.inputBu=idx;
      }
      else if (status==='fao'){
        if (this.focusWinner===idx) // 현재 승자와 같을때 비활성화
          return;
        if (this.focusFao===idx)
          this.focusFao=-1;
        else
          this.focusFao=idx;
      }
      else if (status==='isfao') // 책임지불 토글
        this.isFao=!this.isFao;
      else if (status==='tile') // 타일 뒤집기
        this.isOpened[idx]=true;
      else if (status==='roundmangan') // 절상만관 토글
        this.optRoundMangan=!this.optRoundMangan;
      else if (status==='minusriichi') // 음수리치 토글
        this.optMinusRiichi=!this.optMinusRiichi;
      else if (status==='cheatscore') // 촌보 점수 토글
        this.optCheatScore=!this.optCheatScore;
    },
    /**화료 및 방총 불가능한 경우 반환*/
    checkInvalidStatus(status){
      let cntWin=0, cntLose=0;
      for (let i=0;i<this.isWin.length;i++){
        if (this.isWin[i]===true) // 화료 인원 세기
          cntWin++;
        if (this.isLose[i]===true) // 방총 인원 세기
          cntLose++;
      }
      if (status==='win'){ // 화료일때
        if (cntWin===0 || cntWin===4) // 화료한 사람이 없거나 4명임 (불가능한 경우)
          return -1;
        this.showModal('check_player_lose');
      }
      else if (status==='lose'){ // 방총일때
        if (cntWin!==1 && cntLose===0) // 2명 이상 화료했는데 쯔모임 (불가능한 경우)
          return;
        if (!cntLose){ // 쯔모
          this.focusWinner=this.isWin.indexOf(true); // 승자 찾아서 저장
          this.showModal('check_score', 'tsumo');
        }
        else{ // 론
          this.focusLoser=this.isLose.indexOf(true); // 패자 찾아서 저장
          for (let i=0;i<this.isWin.length;i++){
            if (this.isWin[(this.focusLoser+i)%4]===true){ // 승자 찾아서 저장 (선하네 순서로 탐색)
              this.focusWinner=(this.focusLoser+i)%4;
              break;
            }
          }
          this.showModal('check_score', 'ron');
        }
      }
      else if (status==='fao'){ // 책임지불일때
        if (this.focusFao===-1) // 책임지불할 사람이 없음 (불가능한 경우)
          return;
        this.calculateWin();
      }
      else if (status==='cheat'){ // 촌보일때
        if (this.isCheat.every(x => x===false)) // 촌보한 사람이 없음 (불가능한 경우)
          return;
        this.calculateCheat();
      }
    },
    /**화료 점수계산*/
    calculateWin(){
      if (this.roundStatus==='tsumo' || this.roundStatus==='tsumo_fao'){ // 쯔모
        if (this.roundStatus==='tsumo'){
          for (let i=0;i<this.seats.length;i++){
            if (i===this.focusWinner) // 승자
              this.scoresDiff[i]+=this.calculateScore(i)+this.countRiichi*1000+this.countRenchan*300;
            else // 패자
              this.scoresDiff[i]-=this.calculateScore(i)+this.countRenchan*100;
          }
        }
        else if (this.roundStatus==='tsumo_fao'){ // 책임지불시
          this.scoresDiff[this.focusWinner]+=this.calculateScore(this.focusWinner)+this.countRiichi*1000+this.countRenchan*300;
          this.scoresDiff[this.focusFao]-=this.calculateScore(this.focusWinner)+this.countRenchan*300;
        }
        this.showModal('show_score', 'tsumo');
      }
      else if (this.roundStatus==='ron' || this.roundStatus==='ron_fao'){ // 론
        let firstWinner=-1, chkFinish=false;
        for (let i=1;i<this.isWin.length;i++){
          if (this.isWin[(this.focusLoser+i)%4]===true){
            firstWinner=(this.focusLoser+i)%4; // 선하네 판별
            break;
          }
        }
        if (firstWinner===this.focusWinner) { // 승자+선하네
          this.scoresDiff[this.focusWinner]+=this.calculateScore(this.focusWinner)+this.countRiichi*1000+this.countRenchan*300;
          this.scoresDiff[this.focusLoser]-=this.calculateScore(this.focusWinner)+this.countRenchan*300;
        }
        else{ // 나머지 승자
          this.scoresDiff[this.focusWinner]+=this.calculateScore(this.focusWinner);
          this.scoresDiff[this.focusLoser]-=this.calculateScore(this.focusWinner);
        }
        if (this.roundStatus==='ron_fao'){ // 책임지불시 절반 지불
          this.scoresDiff[this.focusLoser]+=Math.floor(this.calculateScore(this.focusWinner)/2);
          this.scoresDiff[this.focusFao]-=Math.floor(this.calculateScore(this.focusWinner)/2);
        }
        for (let i=1;i<this.isWin.length;i++){
          if ((this.focusWinner+i)%4===this.focusLoser){ // 1바퀴를 모두 돌았을때
            chkFinish=true;
            break;
          }
          else if (this.isWin[(this.focusWinner+i)%4]===true){ // 다음 승자가 남아있을때
            this.focusWinner=(this.focusWinner+i)%4; // 현재 승자 변경
            this.inputFan=0;
            this.inputBu=2;
            this.isFao=false;
            this.focusFao=-1;
            this.showModal('check_score', 'ron'); // 다음 승자 점수 입력
            break;
          }
        }
        if (chkFinish) // 모든 승자의 점수를 체크했다면
          this.showModal('show_score', 'ron');
      }
    },
    /**유국 점수계산*/
    calculateDraw(){
      let cntTenpai=0; // 총 텐파이 인원
      for (let i=0;i<this.isTenpai.length;i++){
        this.isTenpai[i]||=this.isRiichi[i];
        if (this.isTenpai[i]===true) // 텐파이 인원 세기
          cntTenpai++;
      }
      if (0<cntTenpai && cntTenpai<4){ //올텐파이나 올노텐이 아니라면
        for (let i=0;i<this.isTenpai.length;i++){
          if (this.isTenpai[i]===true) // 텐파이라면
            this.scoresDiff[i]=3000/cntTenpai; // 3000 나눠서 획득
          else
            this.scoresDiff[i]=-3000/(this.seats.length-cntTenpai); 
        }
      }
      this.showModal('show_score', 'normal_draw');
    },
    /**촌보 점수계산*/
    calculateCheat(){
      if (this.optCheatScore===true){ // 만관 지불
        for (let i=0;i<this.isCheat.length;i++){
          if (this.isCheat[i]===true){
            if (this.winds[i]==='東') // 친일경우
              this.scoresDiff[i]=-12000;
            else
              this.scoresDiff[i]=-8000;
          }
          else{
            if (this.winds[i]==='東' || this.winds[this.isCheat.indexOf(true)]==='東') //촌보자가 친이거나 내가 친일때
              this.scoresDiff[i]=4000;
            else
              this.scoresDiff[i]=2000;
          }
        }
      }
      else{ // 3000점씩 지불
        for (let i=0;i<this.isCheat.length;i++){
          if (this.isCheat[i]===true)
            this.scoresDiff[i]=-9000;
          else
            this.scoresDiff[i]=3000; 
        }
      }
      this.showModal('show_score', 'cheat');
    },
    /**국 결과값 처리*/
    saveRound(){
      if (this.roundStatus==='cheat'){ // 촌보의 경우 리치봉 반환
        for (let i=0;i<this.isRiichi.length;i++){
          if (this.isRiichi[i]){
            this.scoresHigh[i]+=10;
            this.isRiichi[i]=false;
            this.countRiichi--;
          }
        }
      }
      else{
        this.recordsRiichi.push([...this.isRiichi]); // 리치 기록에 추가
        for (let i=0;i<this.isRiichi.length;i++) // 리치봉 수거
          this.isRiichi[i]=false;
      }
      for (let i=0;i<this.scoresDiff.length;i++) // 점수 배분및 기록
        this.changeScores(i);
      for (let i=0;i<this.scoresDiff.length;i++){ // 점수 기록창에 점수 기록
        this.recordsScore[i].push(this.scoresDiff[i]);
        this.recordsScore[i].push(this.scoresHigh[i]*100+this.scoresDiff[i]);
      }
      this.recordsTime.push(this.currentWind+this.currentRound+'局 '+this.countRenchan+'本場');// 점수 기록창에 국+본장 기록
      this.recordsTime.push('ㅤ');
      this.recordsWin.push([...this.isWin]);
      this.recordsLose.push([...this.isLose]);
      if (this.roundStatus==='tsumo' || this.roundStatus==='ron'){ // 화료로 끝났다면
        let chinWin=this.isWin[this.winds.indexOf('東')]; // 친이 화료했는지 체크
        if (chinWin===false){ // 친이 화료를 못했다면
          this.changeWindsAndRounds(); // 바람 및 라운드 변경
          this.countRenchan=0; // 연장봉 초기화
        }
        else // 연장에 성공했다면
          this.countRenchan++; // 연장봉 추가
        this.countRiichi=0; // 리치봉 초기화
      }
      else if (this.roundStatus==='normal_draw'){ // 일반유국이라면
        let chinTenpai=this.isTenpai[this.winds.indexOf('東')]; // 친이 노텐인지 체크
        if (chinTenpai===false) // 친이 노텐이라면
          this.changeWindsAndRounds(); // 바람 및 라운드 변경
        this.countRenchan++; // 연장봉 추가
      }
      else if (this.roundStatus==='special_draw'){ // 특수유국이라면
        this.countRenchan++; // 연장봉 추가
      }
      this.hideModal(); // 모달 창 끄기
    },
    /**주사위 굴리기*/
    rollDice(){
      let timecnt=0;
      this.isWall=[false, false, false, false]; // 패산 떼는 방향 초기화
      let repeat=setInterval(() => { // 시간에 따라 반복
        this.diceValue[0]=Math.floor(Math.random()*6)+1;
        this.diceValue[1]=Math.floor(Math.random()*6)+1;
        timecnt++;
        if (timecnt>=10){
            clearInterval(repeat);
            for (let i=0;i<this.isWall.length;i++){ // 패산 떼는 방향 표시
              if (i===(this.diceValue[0]+this.diceValue[1]-1)%4)
                this.isWall[i]=true;
              else
                this.isWall[i]=false;
            }
        }
      }, 50); // 0.05초 * 10번 = 0.5초동안 실행
    },
    /**점수 기록 복사*/
    copyRecord(){
      let str='이름\t';
      for (let i=0;i<this.names.length;i++)
        str+=this.names[i]+'\t'; // 이름 복사
      str+='\n';
      for (let i=0;i<this.recordsTime.length;i++){
        if (this.recordsTime[i]!=="ㅤ")
          str+=this.recordsTime[i]; // 라운드 복사
        str+='\t';
        for (let j=0;j<this.recordsScore.length;j++){
          if (this.recordsScore[j][i]!==0)
            str+=String(this.recordsScore[j][i]); // 점수 복사
          str+='\t';
        }
        str+='\n';
      }
      navigator.clipboard.writeText(str); // 클립보드로 복사
      this.showModal('클립보드에 기록을 복사했습니다.');
    },
    /**해당 국으로 롤백하기*/
    rollbackRecord(){
      let allWinds = ["東", "南", "西", "北"];
      let arr=this.roundStatus.match(/[\u4e00-\u9fff]|\d+|\S/g); // 시간 값 분리
      let idx=this.recordsTime.indexOf(this.roundStatus);
      let cnt=0;
      while (idx<this.recordsTime.length){ // 점수기록 지우기
        this.recordsTime.pop();
        for (let i=0;i<this.recordsScore.length;i++)
          this.recordsScore[i].pop();
      }
      while (Math.floor(idx/2)+1<this.recordsRiichi.length){ // 리치, 화료, 방총기록 지우기
        this.recordsRiichi.pop();
        this.recordsWin.pop();
        this.recordsLose.pop();
      }
      for (let i=0;i<this.isRiichi.length;i++) // 리치봉 제거
        this.isRiichi[i]=false;
      this.currentWind=arr[0]; // 장풍 설정
      this.currentRound=Number(arr[1]); // 국 설정
      for (let i=0;i<this.recordsScore.length;i++){
        this.scoresHigh[i]=Math.floor(Number(this.recordsScore[i][this.recordsScore[i].length-1])/100); // 점수 설정
        cnt+=this.scoresHigh[i];
      }
      this.countRenchan=Number(arr[3]); // 연장 설정
      this.countRiichi=Math.floor((Math.floor(this.setScore[0]*4/100)-cnt)/10); // 리치봉 설정
      for (let i=1;i<this.currentRound;i++)
        allWinds.unshift(allWinds.pop()); // 현재 바람 세기
      for (let i=0;i<this.winds.length;i++)
        this.winds[i]=allWinds[i]; // 개인 바람 설정
      this.hideModal(); // 모달 창 끄기
    },
  }
};
</script>

<template>
<div class="background" @dblclick.self="toggleFullScreen()">
  <!-- 각 방향별 player 컴포넌트 생성 -->
  <player v-for="(_, i) in seats"
    :key="i"
    :seat="seats[i]"
    :wind="winds[i]"
    :scoreHigh="scoresHigh[i]"
    :scoreLow="scoresLow[i]"
    :rank="ranks[i]"
    :scoreEffect="scoresEffect[i]"
    :scoreGap="scoresGap[i]"
    :isRiichi="isRiichi[i]"
    :isGap="isGap[i]"
    :optMinusRiichi
    @toggle-active-riichi="toggleActiveRiichi"
    @toggle-show-gap="toggleShowGap"
  />
  <!-- 중앙 panel 컴포넌트 생성 -->
  <panel
    :currentWind
    :currentRound
    :countRiichi
    :countRenchan
    @show-modal="showModal"
    @roll-dice="rollDice"
  />
  <!-- modal 컴포넌트 생성 -->
  <modal
    v-if="modal"
    :winds
    :scoresHigh
    :scoresDiff
    :names
    :focusWinner
    :isFao
    :focusFao
    :inputFan
    :inputBu
    :isRiichi
    :isWin
    :isLose
    :isTenpai
    :isCheat
    :roundStatus
    :diceValue
    :isWall
    :isOpened
    :randomSeats
    :recordsTime
    :recordsScore
    :recordsRiichi
    :recordsWin
    :recordsLose
    :setScore
    :rankUma
    :optRoundMangan
    :optMinusRiichi
    :optCheatScore
    :modalType
    @show-modal="showModal"
    @hide-modal="hideModal"
    @toggle-check-status="toggleCheckStatus"
    @check-invalid-status="checkInvalidStatus"
    @calculate-win="calculateWin"
    @calculate-draw="calculateDraw"
    @save-round="saveRound"
    @roll-dice="rollDice"
    @copy-record="copyRecord"
    @rollback-record="rollbackRecord"
  />
</div>
</template>

<style>
/* 전체 설정 */
*{
  margin: 0;
  -webkit-text-size-adjust:none;
  /* 글자 드래그 방지 */
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
html{
  overflow: hidden;
  overscroll-behavior: none;
}
.background{
  position: relative;
  height: 100vh;
  width: 100vw;
  font-family: 'Noto Serif KR', serif;
}
a {
  text-decoration: none;
  color: inherit;
}
input[type='text'], input[type='number']{
  font-size: 15px;
  width: 100px;
  font-family: 'Noto Serif KR', serif;
  text-align: center;
}
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* 가로모드 활성화 */
@media (orientation: portrait) {
	html{
		transform: rotate(-90deg);
		transform-origin: top left;
		position: absolute;
		top: 100%;
		left: 0;
		width: 100vh;
    height: 100vw;
	}
  .background{
    width: 100vh;
    height: 100vw;
  }
}
</style>
