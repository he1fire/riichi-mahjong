function openFullScreenMode() {
        var docV = document.documentElement;
        if (docV.requestFullscreen)
            docV.requestFullscreen();
        else if (docV.webkitRequestFullscreen)
            docV.webkitRequestFullscreen();
        else if (docV.mozRequestFullScreen)
            docV.mozRequestFullScreen();
        else if (docV.msRequestFullscreen)
            docV.msRequestFullscreen();
    
    // document.querySelector('body').onclick='null';
}
function ChangeSeat(){
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var tmp=document.querySelector(winds[3]).innerText;
    for (var i=3;i>0;i--){
        document.querySelector(winds[i]).innerText=document.querySelector(winds[i-1]).innerText;
    }
    document.querySelector(winds[0]).innerText=tmp;
    for (var i=0;i<winds.length;i++){
        if (document.querySelector(winds[i]).innerText==='東')
            document.querySelector(winds[i]).style.color='red';
        else
            document.querySelector(winds[i]).style.color='';
    }

    if (document.querySelector("#nowcnt").innerText!=='4'){
        document.querySelector("#nowcnt").innerText++;
    }
    else{
        document.querySelector("#nowcnt").innerText=1;
        if (document.querySelector("#nowwind").innerText==='東')
            document.querySelector("#nowwind").innerText='南';
        else if (document.querySelector("#nowwind").innerText==='南')
            document.querySelector("#nowwind").innerText='西';
        else if (document.querySelector("#nowwind").innerText==='西')
            document.querySelector("#nowwind").innerText='北';
        else
            document.querySelector("#nowwind").innerText='東';
    }
}

function CalculateScore(Y, X, win, lose, how, plus){
    var Allstick=document.querySelector('#riichi_count');
    var renjang=document.querySelector('#renjang_count');
    var ret=0, ron=0, tsumo1=0, tsumo2=0;
    var arr=[2000,3000,3000,4000,4000,4000,6000,6000,8000];
    if (5<=Y){
        ron=tsumo1=tsumo2=arr[Y-5];
    }
    else
        ron=tsumo1=tsumo2=X*Math.pow(2,Y+2);
    if (how==='ron'){
        if (win==='東')
            ron*=6;
        else
            ron*=4;
        ron=Math.ceil(ron/100)*100;
        ret=ron;
    }
    else{
        tsumo1*=2;
        tsumo1=Math.ceil(tsumo1/100)*100;
        tsumo2=Math.ceil(tsumo2/100)*100;
        if (win==='東'){
            if (plus===1)
                ret=tsumo1*3;
            else
                ret=tsumo1;
        }
        else{
            if (plus===1)
                ret=tsumo1+tsumo2*2;
            else if (lose==='東')
                ret=tsumo1;
            else
                ret=tsumo2;
        }
    }
    if (plus===1){
        ret+=Allstick.innerText*1000;
        ret+=renjang.innerText*300;
        Allstick.innerText=0;
    }
    else{
        if (how==='ron')
            ret+=renjang.innerText*300;
        else
            ret+=renjang.innerText*100;
    }
    return ret/100;
}
function ChangeScore(who, much){
    var score=document.querySelector(who);
    var score_00=document.querySelector(who+'00');
    var score_change=document.querySelector(who+'change');
    var arr=[];
    var startscore=Number(document.querySelector(who).innerText);
    for (var i=0;i<50;i++){
        arr[i]=startscore*100+((much*100)/50)*(i+1);
    }
    if (much>0){
        score_change.style.color='lawngreen';
        score_change.innerText='+'+much+'00';
    }
    else{
        score_change.style.color='red';
        score_change.innerText=much+'00';
    }
    score_change.style.visibility='visible';

    var timecnt=0;
    var repeat=setInterval(function() {
        score.innerText=Math.floor(arr[timecnt]/100);
        if (arr[timecnt]%100>=10)
            score_00.innerText=arr[timecnt]%100;
        else
            score_00.innerText='0'+arr[timecnt]%100;
        timecnt++;
        if (timecnt>=50){
            clearInterval(repeat);
            score.innerText=startscore+much;
            score_00.innerText='00';
            score_change.style.visibility='hidden';
        }
    }, 20);
}

function makechk(self){
    if (self.style.color==='')
        self.style.color='red';
    else
        self.style.color='';
}
function makeunchk(who, type){
    for (var i=0;i<who.length;i++){
        if (document.querySelector('#'+who[i]+type).style.color==='red')
            document.querySelector('#'+who[i]+type).style.color='';
    }
}

function dice(){
    var dice=document.querySelector('#Modal_dice');
    dice.style.display='inline';
}
function sleep (delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
 }
function roll(){
    var dice1=document.querySelector('#dice1');
    var dice2=document.querySelector('#dice2');
    var dicesum=document.querySelector('#dicesum');
    var ran1=0, ran2=0;
    var timecnt=0;
    dicesum.innerText='?';
    var repeat=setInterval(function() {
        ran1=Math.floor(Math.random()*6)+1;
        ran2=Math.floor(Math.random()*6)+1;
        dice1.innerHTML=makedice(ran1);
        dice2.innerHTML=makedice(ran2);
        timecnt++;
        if (timecnt>=10){
            clearInterval(repeat);
            dicesum.innerText=ran1+ran2;
        }
    }, 50);
}

function makedice(num){
    num=Number(num);
    var dice_value=['_1', '_2', '_3', '_4', '_5', '_6', '_7'];
    var ans=' ';
    for (var i=0;i<7;i++){
    if (num===1 && (i===3))
        ans+=`<div style="grid-area: `+dice_value[i]+`;"><div class="circle_dice" style="background-color: red;"></div></div>`;
    if (num===2 && (i===0 || i===6))
        ans+=`<div style="grid-area: `+dice_value[i]+`;"><div class="circle_dice"></div></div>`;
    if (num===3 && (i===0 || i===3 || i===6))
        ans+=`<div style="grid-area: `+dice_value[i]+`;"><div class="circle_dice"></div></div>`;
    if (num===4 && (i===0 || i===1 || i===5 || i===6))
        ans+=`<div style="grid-area: `+dice_value[i]+`;"><div class="circle_dice"></div></div>`;
    if (num===5 && (i===0 || i===1 || i===3 || i===5 || i===6))
        ans+=`<div style="grid-area: `+dice_value[i]+`;"><div class="circle_dice"></div></div>`;
    if (num===6 && (i===0 || i===1 || i===2 || i===4 || i===5 || i===6))
        ans+=`<div style="grid-area: `+dice_value[i]+`;"><div class="circle_dice"></div></div>`;
    }
    return ans;
  }

function riichi(who){
    var Allstick=document.querySelector('#riichi_count');
    var stick=document.querySelector('#'+who+'_Riichi');
    var score=document.querySelector('#'+who+'_Score');
    if (stick.style.visibility===''){
        if (score.innerText>=10){
            stick.style.visibility='visible';
            score.innerText=Number(score.innerText)-10;;
            Allstick.innerText++;
        }
        else{
            document.querySelector('#Modal_alertText').innerText='점수가 모자라 리치를 걸수 없습니다.';
            document.querySelector('#Modal_alert').style.display='inline';
        }
    } 
    else{
        stick.style.visibility='';
        score.innerText=Number(score.innerText)+10;
        Allstick.innerText--;
    }
}

function ron1(){
    var ron1=document.querySelector('#Modal_ron1');
    ron1.style.display='inline';
}
function ron2(){
    var ron1=document.querySelector('#Modal_ron1');
    var ron2=document.querySelector('#Modal_ron2');
    var checks=['#downcheck_ron1','#rightcheck_ron1','#upcheck_ron1','#leftcheck_ron1'];
    var whowin=-1;
    for (var i=0;i<4;i++){
        if (document.querySelector(checks[i]).style.color==='red')
            whowin=1;
    }
    ron1.style.display='';
    if (whowin===1)
        ron2.style.display='inline';
    else{
        document.querySelector('#Modal_alertText').innerText='론한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
}
function ron3(){
    var ron2=document.querySelector('#Modal_ron2');
    var ron3=document.querySelector('#Modal_ron3');
    var checks1=['#downcheck_ron1','#rightcheck_ron1','#upcheck_ron1','#leftcheck_ron1'];
    var checks2=['#downcheck_ron2','#rightcheck_ron2','#upcheck_ron2','#leftcheck_ron2'];
    var whowin=-1, wholose=-1;
    for (var i=0;i<4;i++){ //화료체크
        if (document.querySelector(checks1[i]).style.color==='red')
            whowin=i;
        if (document.querySelector(checks2[i]).style.color==='red')
            wholose=i;
    }
    ron2.style.display='';
    if (wholose===-1){
        for (var i=0;i<4;i++){ 
            if (document.querySelector(checks1[i]).style.color==='red')
                document.querySelector(checks1[i]).style.color='';
        }
        document.querySelector('#Modal_alertText').innerText='방총당한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else if (whowin===wholose){
        for (var i=0;i<4;i++){ 
            if (document.querySelector(checks1[i]).style.color==='red')
                document.querySelector(checks1[i]).style.color='';
            if (document.querySelector(checks2[i]).style.color==='red')
                document.querySelector(checks2[i]).style.color='';
        }
        document.querySelector('#Modal_alertText').innerText='론한 사람과 방총당한 사람이 같습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        ron3.style.display='inline';
    }
}

function tsumo1(){
    var tsumo1=document.querySelector('#Modal_tsumo1');
    tsumo1.style.display='inline';
}
function tsumo2(){
    var tsumo1=document.querySelector('#Modal_tsumo1');
    var tsumo2=document.querySelector('#Modal_tsumo2');
    var checks=['#downcheck_tsumo','#rightcheck_tsumo','#upcheck_tsumo','#leftcheck_tsumo'];
    var whowin=-1;
    for (var i=0;i<4;i++){
        if (document.querySelector(checks[i]).style.color==='red')
            whowin=1;
    }
    tsumo1.style.display='';
    if (whowin===1)
        tsumo2.style.display='inline';
    else{
        document.querySelector('#Modal_alertText').innerText='쯔모한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
}

function ryuukyoku1(){
    var ryuukyoku1=document.querySelector('#Modal_ryuukyoku1');
    ryuukyoku1.style.display='inline';
}
function ryuukyoku2(){
    var ryuukyoku1=document.querySelector('#Modal_ryuukyoku1');
    var ryuukyoku2=document.querySelector('#Modal_ryuukyoku2');
    ryuukyoku1.style.display='';
    ryuukyoku2.style.display='inline';
}

function ron_General(fan, bu){
    fan=Number(fan);
    bu=Number(bu);
    var ron3=document.querySelector('#Modal_ron3');
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var checks1=['#downcheck_ron1','#rightcheck_ron1','#upcheck_ron1','#leftcheck_ron1'];
    var checks2=['#downcheck_ron2','#rightcheck_ron2','#upcheck_ron2','#leftcheck_ron2'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var whowin=-1, wholose=-1;
    var renjang=document.querySelector('#renjang_count');
    var sticks=['#DownPerson_Riichi', '#RightPerson_Riichi', '#UpPerson_Riichi', '#LeftPerson_Riichi'];
    ron3.style.display='';
    document.querySelector('#fan_ron').selectedIndex=0;
    document.querySelector('#bu_ron').selectedIndex=0;
    if (fan===1 && bu<=25){ //불가능한 점수
        for (var i=0;i<4;i++){ 
            if (document.querySelector(checks1[i]).style.color==='red')
                document.querySelector(checks1[i]).style.color='';
            if (document.querySelector(checks2[i]).style.color==='red')
                document.querySelector(checks2[i]).style.color='';
        }
        document.querySelector('#Modal_alertText').innerText='불가능한 점수입니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        for (var i=0;i<sticks.length;i++){ //리치봉 수거
            document.querySelector(sticks[i]).style.visibility='';
        }
        for (var i=0;i<4;i++){ //화료체크
            if (document.querySelector(checks1[i]).style.color==='red'){
                document.querySelector(checks1[i]).style.color='';
                whowin=i;
            }
            if (document.querySelector(checks2[i]).style.color==='red'){
                document.querySelector(checks2[i]).style.color='';
                wholose=i;
            }
        }
        for (var i=0;i<4;i++){ //점수계산
            if (i===whowin){
                ChangeScore(scores[i],CalculateScore(fan, bu, document.querySelector(winds[whowin]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', 1));
            }
            if (i===wholose){
                ChangeScore(scores[i],-CalculateScore(fan, bu, document.querySelector(winds[whowin]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', 0));
            }
        }
        if (document.querySelector(winds[whowin]).innerText!=='東'){ // 친 체크후 바람바꾸기
            renjang.innerText=0;
            ChangeSeat();
        } 
        else
            renjang.innerText++; //연장봉 증가
    }
}


function tsumo_General(fan, bu){
    fan=Number(fan);
    bu=Number(bu);
    var tsumo2=document.querySelector('#Modal_tsumo2');
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var checks=['#downcheck_tsumo','#rightcheck_tsumo','#upcheck_tsumo','#leftcheck_tsumo'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var whowin=-1;
    var renjang=document.querySelector('#renjang_count');
    var sticks=['#DownPerson_Riichi', '#RightPerson_Riichi', '#UpPerson_Riichi', '#LeftPerson_Riichi'];
    tsumo2.style.display='';
    document.querySelector('#fan_tsumo').selectedIndex=0;
    document.querySelector('#bu_tsumo').selectedIndex=0;
    if (fan===1 && bu<=25){ //불가능한 점수
        for (var i=0;i<4;i++){ 
            if (document.querySelector(checks[i]).style.color==='red')
                document.querySelector(checks[i]).style.color='';
        }
        document.querySelector('#Modal_alertText').innerText='불가능한 점수입니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        for (var i=0;i<sticks.length;i++){ //리치봉 수거
            document.querySelector(sticks[i]).style.visibility='';
        }
        for (var i=0;i<4;i++){ //화료체크
            if (document.querySelector(checks[i]).style.color==='red'){
                document.querySelector(checks[i]).style.color='';
                whowin=i;
            }
        }
        for (var i=0;i<4;i++){ //점수계산
            if (i===whowin){
                ChangeScore(scores[i],CalculateScore(fan, bu, document.querySelector(winds[i]).innerText, document.querySelector(winds[i]).innerText, 'tsumo', 1));
            }
            else{
                ChangeScore(scores[i],-CalculateScore(fan, bu, document.querySelector(winds[whowin]).innerText, document.querySelector(winds[i]).innerText, 'tsumo', 0));
            }
        }
        if (document.querySelector(winds[whowin]).innerText!=='東'){ // 친 체크후 바람바꾸기
            renjang.innerText=0;
            ChangeSeat();
        } 
        else
            renjang.innerText++; //연장봉 증가
    }
}
function ryuukyoku_General(){
    var ryuukyoku2=document.querySelector('#Modal_ryuukyoku2');
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var checks=['#downcheck_ryuukyoku','#rightcheck_ryuukyoku','#upcheck_ryuukyoku','#leftcheck_ryuukyoku'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var tenpai=[0,0,0,0];
    var Alltenpai=0;
    var renjang=document.querySelector('#renjang_count');
    var sticks=['#DownPerson_Riichi', '#RightPerson_Riichi', '#UpPerson_Riichi', '#LeftPerson_Riichi'];
    ryuukyoku2.style.display='';
    for (var i=0;i<sticks.length;i++){ //리치봉 수거
        document.querySelector(sticks[i]).style.visibility='';
    }
    
    for (var i=0;i<4;i++){ //텐파이 체크
        if (document.querySelector(checks[i]).style.color==='red'){
            document.querySelector(checks[i]).style.color='';
            Alltenpai++;
            tenpai[i]=1;
        }
    }
    if (Alltenpai>0 && Alltenpai<4){ //실 점수계산
        for (var i=0;i<4;i++){
            if (tenpai[i]===1)
                ChangeScore(scores[i],30/Alltenpai);
            else
                ChangeScore(scores[i],-30/(4-Alltenpai));
        }
    }
    for (var i=0;i<4;i++){ //친 체크후 바람바꾸기
        if (document.querySelector(winds[i]).innerText==='東' && tenpai[i]!==1){
            ChangeSeat();
            break;
        } 
    }
    renjang.innerText++; //연장봉 증가
}
function ryuukyoku_Special(){
    var ryuukyoku1=document.querySelector('#Modal_ryuukyoku1');
    var renjang=document.querySelector('#renjang_count');
    var sticks=['#DownPerson_Riichi', '#RightPerson_Riichi', '#UpPerson_Riichi', '#LeftPerson_Riichi'];
    ryuukyoku1.style.display='';
    renjang.innerText++;
    for (var i=0;i<sticks.length;i++){
        document.querySelector(sticks[i]).style.visibility='';
    }
}