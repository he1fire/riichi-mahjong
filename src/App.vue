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
      players: [ // 위치, 자풍, 현재 점수, 순위, 이펙트용 점수, 점수 차이
        {seat: "Down",  name: "▼", wind: "東", displayScore: 25000, rank: 0, effectScore: 0, gapScore: 0},
        {seat: "Right", name: "▶", wind: "南", displayScore: 25000, rank: 0, effectScore: 0, gapScore: 0},
        {seat: "Up",    name: "▲", wind: "西", displayScore: 25000, rank: 0, effectScore: 0, gapScore: 0},
        {seat: "Left",  name: "◀", wind: "北", displayScore: 25000, rank: 0, effectScore: 0, gapScore: 0}
      ],
      scoresDiff: [0, 0, 0, 0], // 플레이어별 변동 점수
      focusWinner: -1, // 현재 점수 입력하는 플레이어
      focusLoser: -1, // 현재 방총 플레이어
      isFao: false, // 책임지불 유무
      focusFao: -1, // 현재 책임지불하는 플레이어
      inputFao: -1, // 현재 책임지불
      inputFan: 0, // 현재 점수 (판)
      inputBu: 2, // 현재 점수 (부)
      isGap: [false, false, false, false], // 플레이어간 점수 차이 표시 유무
      isRiichi: [false, false, false, false], // 플레이어별 리치 유무
      isWin: [false, false, false, false], // 플레이어별 화료 유무
      isLose: [false, false, false, false], // 플레이어별 방총 유무
      isTenpai: [false, false, false, false], // 플레이어별 텐파이 유무
      isCheat: [false, false, false, false], // 플레이어별 촌보 유무
      panel: { // 패널
        wind: "東", // 현재 장풍
        round: 1, // 현재 국
        riichi: 0, // 현재 누적 리치봉
        renchan: 0, // 현재 누적 연장봉
      },
      roundStatus: "", // 라운드 형태 - 론 쯔모 일반유국 특수유국
      dice: { // 주사위
        value: [1, 6], // 값
        wallDirection: [false, false, false, false], // 주사위 값에 따른 패산방향
      },
      seatTile: { // 자리정하기 타일
        value: ["東", "南", "西", "北"], // 랜덤 타일값
        isOpened: [false, false, false, false], // 타일이 공개되었는지
      },
      records : { // 기록
        time: ["ㅤ"], // 시간
        score: [[25000],[25000],[25000],[25000]], // 점수
        riichi: [[false, false, false, false]], // 리치 횟수
        win: [[false, false, false, false]], // 화료 횟수
        lose: [[false, false, false, false]], // 방총 횟수
      },
      option: { // 옵션
        startingScore: 25000, // 시작 점수
        returnScore: 30000, // 반환 점수
        rankUma: [30, 10, -10, -30], // 순위 우마
        roundMangan: false, // 절상만관
        minusRiichi: false, // 음수리치
        cheatScore: true, // 촌보 지불 점수
        endRiichi: true, // 남은 공탁금 처리
      },
      modal: {
        isOpen :false, // 모달창 on/off
        type: "", // 모달창 종류
      },
    };
  },
  mounted() {
    // 자리 선택 창
    for (let i=3;i>0;i--){ // 자리 섞기
      let j=Math.floor(Math.random()*(i+1));
      [this.seatTile.value[i], this.seatTile.value[j]]=[this.seatTile.value[j], this.seatTile.value[i]];
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
    /**배열에서 같은값의 인덱스 반환*/
    returnIndex(arr, keyOrValue, value){
      if (value===undefined)
        return arr.indexOf(keyOrValue);
      else
        return arr.findIndex(x => x[keyOrValue]===value);
    },
    /**리치 활성화/비활성화*/
    toggleActiveRiichi(seat){
      let idx=this.returnIndex(this.players, 'seat', seat); // 위치 기준 인덱스 반환
      if (this.isRiichi[idx]===false){ // 리치 활성화
        if (this.players[idx].displayScore<1000 && this.option.minusRiichi===false) // 리치를 걸수 없을 때
          return;
        else if (this.players[idx].effectScore!==0) // 점수변동 이펙트 도중이면 실행 x
          return;
        else{ // 1000점 이상 있거나 음수리치가 가능하다면
          this.players[idx].displayScore-=1000;
          this.isRiichi[idx]=true;
          this.panel.riichi++;
        }
      }
      else{ // 리치 비활성화
        this.players[idx].displayScore+=1000;
        this.isRiichi[idx]=false;
        this.panel.riichi--;
      }
    },
    /**점수 차이 활성화/비활성화*/
    toggleShowGap(seat, toggle){
      let idx=this.returnIndex(this.players, 'seat', seat); // 위치 기준 인덱스 반환
      if (this.players[idx].effectScore!==0) // 점수변동 이펙트 도중이면 실행 x
        return;
      if (toggle===true){ // 활성화
        for (let i=0;i<this.isGap.length;i++){
          if (i===idx)
            this.isGap[i]=false;
          else{ // 본인이 아니면 표시 변경
            this.isGap[i]=true;
            this.players[i].gapScore=this.players[idx].displayScore-this.players[i].displayScore;
          }
          this.players[i].rank=1; // 순위 표시 켜기
          for (let j=0;j<this.players.length;j++){ // 순위 계산
            if (i!==j && this.players[i].displayScore<this.players[j].displayScore)
              this.players[i].rank++;
          }
        }
      }
      else{ // 비활성화
        for (let i=0;i<this.isGap.length;i++){
          this.isGap[i]=false;
          this.players[i].gapScore=0;
          this.players[i].rank=0; // 순위 표시 끄기
        }
      }
    },
    /**바람 및 라운드 변경*/
    changeWindsAndRounds(){
      let allWinds="東南西北";
      let cnt=0;
      let playerWinds=this.players.map(player => player.wind); // 개인 바람 복사
      playerWinds.unshift(playerWinds.pop()); // 개인 바람 변경
      this.players.forEach((player, idx) => {player.wind=playerWinds[idx];}); // 개인 바람 덮어씌우기
      for (let i=0;i<allWinds.length;i++){
        if (this.panel.wind===allWinds[i]) // 현재 라운드 계산
          cnt+=i*4;
      }
      cnt+=this.panel.round; // 국 증가
      this.panel.wind=allWinds[Math.floor((cnt%16)/4)]; // 현재 바람 수정
      this.panel.round=cnt%4+1; // 현재 라운드 수정
    },
    /**점수 변동 효과*/
    changeScores(idx){
      let currentScore=this.players[idx].displayScore;
      let arrCut=[];
      for (let i=0;i<50;i++) // 변경될 점수 사이를 50등분해서 저장
        arrCut[i]=currentScore+(this.scoresDiff[idx]/50)*(i+1);
      this.players[idx].effectScore=this.scoresDiff[idx]; // 이펙트 켜기
      let timecnt=0;
      let repeat=setInterval(() => { // 시간에 따라 반복
        this.players[idx].displayScore=arrCut[timecnt] // 100의 자리 변경
        timecnt++;
        if (timecnt>=50){
          clearInterval(repeat); 
          this.players[idx].effectScore=0; // 이펙트 끄기
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
      if (((fan===3 && bu>=60) || (fan===4 && bu>=30)) && this.option.roundMangan) // 절상만관시 3판 60부, 4판 30부 인정
        fan=5;
      if (5<=fan)
        chinScore=score=arrMangan[fan-5]; // 만관 이상이면 배열 참조
      else
        chinScore=score=bu*Math.pow(2,fan+2); // 아니면 점수 계산식으로 계산
      if (this.roundStatus==='ron' || this.roundStatus==='ron_fao'){ // 론일 때
        if (this.players[this.focusWinner].wind==='東') // 친이라면 6배
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
        if (this.players[this.focusWinner].wind==='東'){ // 이긴사람이 친이라면
          if (who===this.focusWinner) // 이겼다면 3배
            ret=chinScore*3;
          else // 졌다면 그대로
            ret=chinScore;
        }
        else{ // 이긴사람이 자라면
          if (who===this.focusWinner) // 내가 이겼다면
            ret=chinScore+score*2;
          else if (this.players[who].wind==='東') // 내가 친이라면 
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
      while (1<this.records.time.length){ // 점수기록 지우기
        this.records.time.pop();
        for (let i=0;i<this.records.score.length;i++)
          this.records.score[i].pop();
      }
      while (1<this.records.riichi.length){ // 리치, 화료, 방총기록 지우기
        this.records.riichi.pop();
        this.records.win.pop();
        this.records.lose.pop();
      }
      for (let i=0;i<this.records.score.length;i++)
        this.records.score[i][0]=this.option.startingScore;
      for (let i=0;i<this.isRiichi.length;i++) // 리치봉 제거
        this.isRiichi[i]=false;
      this.panel.wind="東"; // 장풍 설정
      this.panel.round=1; // 국 설정
      for (let i=0;i<this.records.score.length;i++)
        this.players[i].displayScore=this.option.startingScore; // 점수 설정
      this.panel.renchan=0; // 연장 설정
      this.panel.riichi=0; // 리치봉 설정
      for (let i=0;i<this.players.length;i++)
        this.players[i].wind=allWinds[i]; // 개인 바람 설정
    },
    /**모달 창 켜기*/
    showModal(type, status){
      this.modal.type=type;
      this.roundStatus=status;
      this.modal.isOpen=true;
    },
    /**모달 창 끄기*/
    hideModal(){
      if (this.modal.type==='set_options'){ // 옵션 설정창이라면 확인
        let arrows=["▼", "▶", "▲", "◀"];
        let cntScore=this.players.reduce((acc, player) => acc+player.displayScore, this.panel.riichi*1000); // 현재 총점
        let cntUma=this.option.rankUma.reduce((acc, cur) => acc + cur, 0); // 현재 총우마
        for (let i=0;i<this.players.length;i++){
          if (this.players[i].name==='') // 이름이 없는 경우
            this.players[i].name=arrows[i]; // 기본이름으로 추가
        }
        if (this.option.startingScore*4!==cntScore){ // 시작점수가 변경되었다면
          if (this.option.startingScore%100!==0 || this.option.startingScore==='') // 이상한 값이면 롤백
            this.option.startingScore=cntScore/4;
          else // 아니라면 동1국으로 롤백
            this.resetAll();
        }
        if (this.option.startingScore>this.option.returnScore) // 시작점수가 반환점수보다 큰 경우
          this.option.returnScore=this.option.startingScore;
        if (cntUma!==0) // 우마 합계가 0이 아니라면 초기화
          this.option.rankUma=[30, 10, -10, -30];
      }
      this.modal.type='';
      this.roundStatus='';
      this.scoresDiff=[0, 0, 0, 0];
      this.focusWinner=-1;
      this.focusLoser=-1;
      this.isFao=false;
      this.focusFao=-1;
      this.inputFao=-1;
      this.inputFan=0;
      this.inputBu=2;
      this.isWin=[false, false, false, false];
      this.isLose=[false, false, false, false];
      this.isTenpai=[false, false, false, false];
      this.isCheat=[false, false, false, false];
      this.modal.isOpen=false;
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
      else if (status=='inputfao') // 책임지불 점수창
        this.inputFao=idx;
      else if (status==='tile') // 타일 뒤집기
        this.seatTile.isOpened[idx]=true;
      else if (status==='roundmangan') // 절상만관 토글
      this.option.roundMangan=!this.option.roundMangan;
      else if (status==='minusriichi') // 음수리치 토글
        this.option.minusRiichi=!this.option.minusRiichi;
      else if (status==='cheatscore') // 촌보 점수 토글
        this.option.cheatScore=!this.option.cheatScore;
      else if (status==='endriichi') // 공탁금 처리 토글
        this.option.endRiichi=!this.option.endRiichi;
    },
    /**화료 및 방총 불가능한 경우 반환*/
    checkInvalidStatus(status){
      let cntWin=this.isWin.filter(x => x===true).length; // 화료 인원 세기
      let cntLose=this.isLose.filter(x => x===true).length; // 방총 인원 세기
      let cntCheat=this.isCheat.filter(x => x===true).length; // 촌보 인원 세기
      if (status==='win'){ // 화료일때
        if (cntWin===0 || cntWin===4) // 화료한 사람이 없거나 4명임 (불가능한 경우)
          return -1;
        this.showModal('check_player_lose');
      }
      else if (status==='lose'){ // 방총일때
        if (cntWin!==1 && cntLose===0) // 2명 이상 화료했는데 쯔모임 (불가능한 경우)
          return;
        if (!cntLose){ // 쯔모
          this.focusWinner=this.returnIndex(this.isWin, true); // 승자 찾아서 저장
          this.showModal('check_score', 'tsumo');
        }
        else{ // 론
          this.focusLoser=this.returnIndex(this.isLose, true); // 패자 찾아서 저장
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
        this.inputFao=this.inputFan-9;
        if (this.focusFao===-1) // 책임지불할 사람이 없음 (불가능한 경우)
          return;
        if (this.inputFan>=10) // 2배역만 이상이면 점수 선택
          this.showModal('choose_fao_score', this.roundStatus);
        else
          this.calculateWin();
      }
      else if (status==='cheat'){ // 촌보일때
        if (cntCheat===0) // 촌보한 사람이 없음 (불가능한 경우)
          return;
        this.calculateCheat();
      }
    },
    /**화료 점수계산*/
    calculateWin(){
      if (this.roundStatus==='tsumo' || this.roundStatus==='tsumo_fao'){ // 쯔모
        if (this.roundStatus==='tsumo'){
          for (let i=0;i<this.players.length;i++){
            if (i===this.focusWinner) // 승자
              this.scoresDiff[i]+=this.calculateScore(i)+this.panel.riichi*1000+this.panel.renchan*300;
            else // 패자
              this.scoresDiff[i]-=this.calculateScore(i)+this.panel.renchan*100;
          }
        }
        else if (this.roundStatus==='tsumo_fao'){ // 책임지불시
          let tmp=this.inputFan;
          this.inputFan=this.inputFao+9; // 책임지불할 점수
          this.scoresDiff[this.focusWinner]+=this.calculateScore(this.focusWinner)+this.panel.riichi*1000+this.panel.renchan*300;
          this.scoresDiff[this.focusFao]-=this.calculateScore(this.focusWinner)+this.panel.renchan*300;
          this.inputFan=tmp-this.inputFao-1; // 롤백
          if (this.inputFan>=9){ // 다른사람도 여전히 지불해야 하는 경우
            for (let i=0;i<this.players.length;i++){
              if (i===this.focusWinner) // 승자
                this.scoresDiff[i]+=this.calculateScore(i)+this.panel.riichi*1000+this.panel.renchan*300;
              else // 패자
                this.scoresDiff[i]-=this.calculateScore(i)+this.panel.renchan*100;
            }
          }
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
          this.scoresDiff[this.focusWinner]+=this.calculateScore(this.focusWinner)+this.panel.riichi*1000+this.panel.renchan*300;
          this.scoresDiff[this.focusLoser]-=this.calculateScore(this.focusWinner)+this.panel.renchan*300;
        }
        else{ // 나머지 승자
          this.scoresDiff[this.focusWinner]+=this.calculateScore(this.focusWinner);
          this.scoresDiff[this.focusLoser]-=this.calculateScore(this.focusWinner);
        }
        if (this.roundStatus==='ron_fao'){ // 책임지불시 절반 지불
          let tmp=this.inputFan;
          this.inputFan=this.inputFao+9; // 책임지불할 점수
          this.scoresDiff[this.focusLoser]+=Math.floor(this.calculateScore(this.focusWinner)/2);
          this.scoresDiff[this.focusFao]-=Math.floor(this.calculateScore(this.focusWinner)/2);
          this.inputFan=tmp-this.inputFao-1; // 롤백
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
            this.scoresDiff[i]=-3000/(this.players.length-cntTenpai); 
        }
      }
      this.showModal('show_score', 'normal_draw');
    },
    /**촌보 점수계산*/
    calculateCheat(){
      if (this.option.cheatScore===true){ // 3000점씩 지불 
        for (let i=0;i<this.isCheat.length;i++){
          if (this.isCheat[i]===true)
            this.scoresDiff[i]=-9000;
          else
            this.scoresDiff[i]=3000; 
        }
      }
      else{// 만관 지불
        for (let i=0;i<this.isCheat.length;i++){
          if (this.isCheat[i]===true){
            if (this.players[i].wind==='東') // 친일경우
              this.scoresDiff[i]=-12000;
            else
              this.scoresDiff[i]=-8000;
          }
          else{
            if (this.players[i].wind==='東' || this.players[this.returnIndex(this.isCheat, true)].wind==='東') //촌보자가 친이거나 내가 친일때
              this.scoresDiff[i]=4000;
            else
              this.scoresDiff[i]=2000;
          }
        }
      }
      this.showModal('show_score', 'cheat');
    },
    /**국 결과값 처리*/
    saveRound(){
      if (this.roundStatus==='cheat'){ // 촌보의 경우 리치봉 반환
        for (let i=0;i<this.isRiichi.length;i++){
          if (this.isRiichi[i]){
            this.players[i].displayScore+=1000;
            this.isRiichi[i]=false;
            this.panel.riichi--;
          }
        }
      }
      else{
        this.records.riichi.push([...this.isRiichi]); // 리치 기록에 추가
        for (let i=0;i<this.isRiichi.length;i++) // 리치봉 수거
          this.isRiichi[i]=false;
      }
      for (let i=0;i<this.scoresDiff.length;i++) // 점수 배분및 기록
        this.changeScores(i);
      for (let i=0;i<this.scoresDiff.length;i++){ // 점수 기록창에 점수 기록
        this.records.score[i].push(this.scoresDiff[i]);
        this.records.score[i].push(this.players[i].displayScore+this.scoresDiff[i]);
      }
      this.records.time.push(this.panel.wind+this.panel.round+'局 '+this.panel.renchan+'本場'); // 점수 기록창에 국+본장 기록
      this.records.time.push('ㅤ');
      this.records.win.push([...this.isWin]); // 화료 기록에 추가
      this.records.lose.push([...this.isLose]); // 방총 기록에 추가
      if (this.roundStatus==='tsumo' || this.roundStatus==='ron'){ // 화료로 끝났다면
        let chinWin=this.isWin[this.returnIndex(this.players, 'wind', '東')]; // 친이 화료했는지 체크
        if (chinWin===false){ // 친이 화료를 못했다면
          this.changeWindsAndRounds(); // 바람 및 라운드 변경
          this.panel.renchan=0; // 연장봉 초기화
        }
        else // 연장에 성공했다면
          this.panel.renchan++; // 연장봉 추가
        this.panel.riichi=0; // 리치봉 초기화
      }
      else if (this.roundStatus==='normal_draw'){ // 일반유국이라면
        let chinTenpai=this.isTenpai[this.returnIndex(this.players, 'wind', '東')]; // 친이 노텐인지 체크
        if (chinTenpai===false) // 친이 노텐이라면
          this.changeWindsAndRounds(); // 바람 및 라운드 변경
        this.panel.renchan++; // 연장봉 추가
      }
      else if (this.roundStatus==='special_draw'){ // 특수유국이라면
        this.panel.renchan++; // 연장봉 추가
      }
      this.hideModal(); // 모달 창 끄기
    },
    /**주사위 굴리기*/
    rollDice(){
      let timecnt=0;
      this.dice.wallDirection=[false, false, false, false]; // 패산 떼는 방향 초기화
      let repeat=setInterval(() => { // 시간에 따라 반복
        this.dice.value[0]=Math.floor(Math.random()*6)+1;
        this.dice.value[1]=Math.floor(Math.random()*6)+1;
        timecnt++;
        if (timecnt>=10){
            clearInterval(repeat);
            for (let i=0;i<this.dice.wallDirection.length;i++){ // 패산 떼는 방향 표시
              if (i===(this.dice.value[0]+this.dice.value[1]-1)%4)
                this.dice.wallDirection[i]=true;
              else
                this.dice.wallDirection[i]=false;
            }
        }
      }, 50); // 0.05초 * 10번 = 0.5초동안 실행
    },
    /**점수 기록 복사*/
    copyRecord(){
      let str='이름\t';
      for (let i=0;i<this.players.length;i++)
        str+=this.players[i].name+'\t'; // 이름 복사
      str+='\n';
      for (let i=0;i<this.records.time.length;i++){
        if (this.records.time[i]!=="ㅤ") // 공백 제거
          str+=this.records.time[i]; // 라운드 복사
        str+='\t';
        for (let j=0;j<this.records.score.length;j++){
          if (this.records.score[j][i]!==0 || i%2===0) // 0점 이동 제거
            str+=String(this.records.score[j][i]); // 점수 복사
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
      let idx=this.returnIndex(this.records.time, this.roundStatus); // 기록 인덱스
      let cnt=0;
      while (idx<this.records.time.length){ // 점수기록 지우기
        this.records.time.pop();
        for (let i=0;i<this.records.score.length;i++)
          this.records.score[i].pop();
      }
      while (Math.floor(idx/2)+1<this.records.riichi.length){ // 리치, 화료, 방총기록 지우기
        this.records.riichi.pop();
        this.records.win.pop();
        this.records.lose.pop();
      }
      for (let i=0;i<this.isRiichi.length;i++) // 리치봉 제거
        this.isRiichi[i]=false;
      this.panel.wind=arr[0]; // 장풍 설정
      this.panel.round=Number(arr[1]); // 국 설정
      for (let i=0;i<this.records.score.length;i++){
        this.players[i].displayScore=Number(this.records.score[i][this.records.score[i].length-1]); // 점수 설정
        cnt+=this.players[i].displayScore;
      }
      this.panel.renchan=Number(arr[3]); // 연장 설정
      this.panel.riichi=Math.floor((this.option.startingScore*4-cnt)/1000); // 리치봉 설정
      for (let i=1;i<this.panel.round;i++)
        allWinds.unshift(allWinds.pop()); // 현재 바람 세기
      for (let i=0;i<this.players.length;i++)
        this.players[i].wind=allWinds[i]; // 개인 바람 설정
      this.hideModal(); // 모달 창 끄기
    },
  }
};
</script>

<template>
<div class="background" @dblclick.self="toggleFullScreen()">
  <!-- 각 방향별 player 컴포넌트 생성 -->
  <player v-for="(_, i) in players"
    :key="i"
    :player="players[i]"
    :isRiichi="isRiichi[i]"
    :isGap="isGap[i]"
    :option
    @toggle-active-riichi="toggleActiveRiichi"
    @toggle-show-gap="toggleShowGap"
  />
  <!-- 중앙 panel 컴포넌트 생성 -->
  <panel
    :panel
    @show-modal="showModal"
    @roll-dice="rollDice"
  />
  <!-- modal 컴포넌트 생성 -->
  <modal
    v-if="modal.isOpen"
    :players
    :scoresDiff
    :focusWinner
    :isFao
    :focusFao
    :inputFao
    :inputFan
    :inputBu
    :isRiichi
    :isWin
    :isLose
    :isTenpai
    :isCheat
    :panel
    :roundStatus
    :dice
    :seatTile
    :records
    :option
    :modal
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
