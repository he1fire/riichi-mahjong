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

export interface PanelInfo { // 패널
  wind: string, // 현재 장풍
  round: number, // 현재 국
  riichi: number, // 현재 누적 리치봉
  renchan: number, // 현재 누적 연장봉
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