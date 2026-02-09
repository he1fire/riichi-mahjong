export interface Player { // 플레이어
  seat: string, // 위치
  name: string, // 이름
  wind: string, // 자풍
  rank: number, // 순위
  displayScore: number, // 현재 점수
  effectScore: number, // 이펙트용 점수
  gapScore: number, // 점수 차이
  deltaScore: number, // 변하는 점수
  isRiichi: boolean, // 리치
  isWin: boolean, // 화료
  isLose: boolean, // 방총
  isTenpai: boolean, // 텐파이 유무
}

export interface ScoringState { // 점수계산 요소
  whoWin: number, // 현재 점수 입력하는 플레이어
  whoLose: number, // 현재 방총 플레이어
  whoCheat: number, // 현재 촌보 플레이어
  isFao: boolean, // 책임지불 유무
  whoFao: number, // 현재 책임지불하는 플레이어
  inputFan: number, // 현재 점수 (판)
  inputBu: number, // 현재 점수 (부)
  inputFao: number, // 현재 책임지불 점수 (판)
}

export interface PanelInfo { // 패널
  wind: string, // 현재 장풍
  round: number, // 현재 국
  riichi: number, // 현재 누적 리치봉
  renchan: number, // 현재 누적 연장봉
}
export interface Dice { // 주사위
  value: number[], // 값
  wallDirection: boolean[], // 주사위 값에 따른 패산방향
}

export interface SeatTile { // 자리정하기 타일
  value: string[], // 랜덤 타일값
  isOpened: boolean[], // 타일이 공개되었는지
}

export interface Records { // 기록
  time: string[], // 시간
  score: number[][], // 점수
  riichi: boolean[][], // 리치 횟수
  win: boolean[][], // 화료 횟수
  lose: boolean[][], // 방총 횟수
}

export interface Option { // 옵션
  startingScore: number, // 시작 점수
  returnScore: number, // 반환 점수
  rankUma: number[], // 순위 우마
  roundMangan: boolean, // 절상만관
  tobi: boolean, // 들통
  cheatScore: boolean, // 촌보 지불 점수
  riichiPayout: boolean, // 남은 공탁금 처리
}

export interface ModalInfo { // 모달창
  isOpen: boolean, // on/off
  type: string, // 종류
  status: string, // 라운드 형태 - 론 쯔모 일반유국 특수유국
}

export interface SyncInfo { // 점수연동
  SUPABASE_URL: string, // supabase url
  SUPABASE_KEY: string, // supabase key
  myId: string, // 개인 ID
  roomId: string // 방 ID
  isConnected: boolean // 연결 상태
  isReceiving: boolean // 수신 중 플래그 (무한루프 방지)
  isHost: boolean // 방장 여부
}