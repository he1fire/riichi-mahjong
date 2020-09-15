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
    var ret=0, ron=0, tsumo1=0, tsumo2=0;
    var arr=[2000,3000,3000,4000,4000,4000,6000,6000,8000,8000,16000,24000,32000,40000,48000];
    if ((Y===3 && X>=70) || (Y===4 && X>=40))
        Y=5;
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
    return ret;
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
        if (Math.abs(arr[timecnt]%100)>=10)
            score_00.innerText=Math.abs(arr[timecnt]%100);
        else
            score_00.innerText='0'+Math.abs(arr[timecnt]%100);
        timecnt++;
        if (timecnt>=50){
            clearInterval(repeat);
            score.innerText=startscore+much;
            score_00.innerText='00';
            score_change.style.visibility='hidden';
        }
    }, 20);
}

function RecordScore(who, much, now){
    var score_record=document.querySelector(who+'record');
    if (much>0){
        score_record.innerHTML+=`<div style="color: lawngreen">+`+much+`00</div>`+now;
    }
    else if (much===0){
        score_record.innerHTML+=`<br><br>`+now;
    }
    else{
        score_record.innerHTML+=`<div style="color: red">`+much+`00</div>`+now;
    }
}
function RecordTime(){
    var when_record=document.querySelector("#when");
    var renjang=document.querySelector('#renjang_count').innerText;
    var wind=document.querySelector("#nowwind").innerText;
    var cnt=document.querySelector("#nowcnt").innerText;
    when_record.innerHTML+=`<br>`+wind+cnt+`局 `+renjang+`本場<br>`;

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

function option(){
    var option=document.querySelector('#Modal_option');
    option.style.display='inline';
}

function modify(){
    var option=document.querySelector('#Modal_option');
    var modify=document.querySelector('#Modal_modify');
    var names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    option.style.display='';
    modify.style.display='inline';
    for (var i=0;i<4;i++){
        var tmp1='#name'+String(i);
        var tmp2='#score'+String(i);
        document.querySelector(tmp1).value=document.querySelector(names[i]).innerText;
        document.querySelector(tmp2).value=(document.querySelector(scores[i]).innerText)*100;
    }
}

function save(){
    var modify=document.querySelector('#Modal_modify');
    var names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var when_record=document.querySelector("#when");
    var chkscore=0;
    modify.style.display='';
    for (var i=0;i<4;i++){
        var tmp1='#name'+String(i);
        var tmp2='#score'+String(i);
        document.querySelector(names[i]).innerText=document.querySelector(tmp1).value;
        if (Number(document.querySelector(scores[i]).innerText)!==parseInt(document.querySelector(tmp2).value/100)){
            document.querySelector(scores[i]).innerText=parseInt(document.querySelector(tmp2).value/100);
            chkscore=1;
        }
    }
    if (chkscore){
        for (var i=0;i<4;i++){
            var score_record=document.querySelector(scores[i]+'record');
            var tmp='#score'+String(i);
            score_record.innerHTML+=`<br>`+document.querySelector(tmp).value;
        }
        
        when_record.innerHTML+=`<br>점수 수정`;
    }
}

function record(){
    var option=document.querySelector('#Modal_option');
    var record=document.querySelector('#Modal_record');
    option.style.display='';
    record.style.display='inline';
}

function showgap(who){
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var chk=document.querySelector('#Gap_mode');
    for (var i=0;i<4;i++){
        document.querySelector(scores[i]+'gap').innerText=document.querySelector(scores[i]).innerText;
    }
    var comparescore=document.querySelector('#'+who+'_Scoregap').innerText;
    for (var i=0;i<4;i++){
        document.querySelector(scores[i]).innerText-=comparescore;
    }
    chk.innerText=1;
}
function hidegap(){
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var chk=document.querySelector('#Gap_mode');
    if (chk.innerText==1){
        for (var i=0;i<4;i++){
            document.querySelector(scores[i]).innerText=document.querySelector(scores[i]+'gap').innerText;
        }
        chk.innerText=0;
    }
}

function roll(){
    var dice1=document.querySelector('#dice1');
    var dice2=document.querySelector('#dice2');
    var dicesum=document.querySelector('#dicesum');
    var light=['#leftlight', '#downlight', '#rightlight', '#uplight'];
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var ran1=0, ran2=0;
    var timecnt=0;
    var seatwind=0;
    dicesum.innerText='?';
    for (var i=0;i<4;i++){
        document.querySelector(light[i]).style.visibility='';
    }
    for (var i=0;i<4;i++){
        if (document.querySelector(winds[i]).innerText==='東')
            seatwind=i;
    }
    var repeat=setInterval(function() {
        ran1=Math.floor(Math.random()*6)+1;
        ran2=Math.floor(Math.random()*6)+1;
        dice1.innerHTML=makedice(ran1);
        dice2.innerHTML=makedice(ran2);
        timecnt++;
        if (timecnt>=10){
            clearInterval(repeat);
            dicesum.innerText=ran1+ran2;
            for (var i=0;i<4;i++){
                if (i===(ran1+ran2+seatwind)%4)
                    document.querySelector(light[i]).style.visibility='visible';
                else
                    document.querySelector(light[i]).style.visibility='';
            }
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
    var whowin=0;
    for (var i=0;i<4;i++){
        if (document.querySelector(checks[i]).style.color==='red')
            whowin++;
    }
    ron1.style.display='';
    if (whowin===0){
        document.querySelector('#Modal_alertText').innerText='론한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else if (whowin===4){
        makeunchk(['down', 'right', 'up', 'left'],'check_ron1');
        document.querySelector('#Modal_alertText').innerText='론한 사람이 4명일 수 없습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        ron2.style.display='inline';
    }
}
function ron3(){
    var ron2=document.querySelector('#Modal_ron2');
    var ron3=document.querySelector('#Modal_ron3');
    var checks1=['#downcheck_ron1','#rightcheck_ron1','#upcheck_ron1','#leftcheck_ron1'];
    var checks2=['#downcheck_ron2','#rightcheck_ron2','#upcheck_ron2','#leftcheck_ron2'];
    var names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
    var whowin=[0,0,0,0], wholose=-1;
    for (var i=0;i<4;i++){ //화료체크
        if (document.querySelector(checks1[i]).style.color==='red')
            whowin[i]=1;
        if (document.querySelector(checks2[i]).style.color==='red')
            wholose=i;
    }
    ron2.style.display='';
    if (wholose===-1){
        makeunchk(['down', 'right', 'up', 'left'],'check_ron1');
        document.querySelector('#Modal_alertText').innerText='방총당한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else if (whowin[wholose]===1){
        makeunchk(['down', 'right', 'up', 'left'],'check_ron1');
        makeunchk(['down', 'right', 'up', 'left'],'check_ron2');
        document.querySelector('#Modal_alertText').innerText='론한 사람과 방총당한 사람이 같습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        for (var i=wholose+1;i<wholose+4;i++){
            if (whowin[i%4]===1){
                document.querySelector('#name_ron').innerText=document.querySelector(names[i%4]).innerText+'의 점수를 입력해주세요.';
                document.querySelector('#who_ron').innerText=i%4;
                break;
            }
        }
        ron3.style.display='inline';
    }
}
function ron4(){
    var arr=[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
    var checks1=['#downcheck_ron1','#rightcheck_ron1','#upcheck_ron1','#leftcheck_ron1'];
    var checks2=['#downcheck_ron2','#rightcheck_ron2','#upcheck_ron2','#leftcheck_ron2'];
    var names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
    var fan=document.querySelector('#fancnt_ron').innerText.split(',');
    var bu=document.querySelector('#bucnt_ron').innerText.split(',');
    var now=Number(document.querySelector('#who_ron').innerText);
    for (var i=0;i<4;i++){
        fan[i]=Number(fan[i]);
        bu[i]=Number(bu[i]);
    }
    fan[now]=document.querySelector('#fan_ron').options[document.querySelector('#fan_ron').selectedIndex].index+1;
    bu[now]=arr[document.querySelector('#bu_ron').options[document.querySelector('#bu_ron').selectedIndex].index];
    document.querySelector('#fancnt_ron').innerText='';
    document.querySelector('#bucnt_ron').innerText='';
    for (var j=0;j<4;j++){
        document.querySelector('#fancnt_ron').innerText+=String(fan[j])+',';
        document.querySelector('#bucnt_ron').innerText+=String(bu[j])+',';
    }
    for (var i=now+1;i<now+4;i++){
        if (document.querySelector(checks1[i%4]).style.color==='red'){
            document.querySelector('#name_ron').innerText=document.querySelector(names[i%4]).innerText+'의 점수를 입력해주세요.';
            document.querySelector('#who_ron').innerText=i%4;
            document.querySelector('#fan_ron').selectedIndex=0;
            document.querySelector('#bu_ron').selectedIndex=0;
            break;
        }
        else if (document.querySelector(checks2[i%4]).style.color==='red'){
            ron_General(fan, bu);
            break;
        }
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
    var names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
    var whowin=-1;
    for (var i=0;i<4;i++){
        if (document.querySelector(checks[i]).style.color==='red')
            whowin=i;
    }
    tsumo1.style.display='';
    if (whowin!==-1){
        document.querySelector('#name_tsumo').innerText=document.querySelector(names[whowin]).innerText+'의 점수를 입력해주세요.';
        tsumo2.style.display='inline';
    }
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
    var ron3=document.querySelector('#Modal_ron3');
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var checks1=['#downcheck_ron1','#rightcheck_ron1','#upcheck_ron1','#leftcheck_ron1'];
    var checks2=['#downcheck_ron2','#rightcheck_ron2','#upcheck_ron2','#leftcheck_ron2'];
    var scorestmp=['#DownPerson_ScoreTmp','#RightPerson_ScoreTmp','#UpPerson_ScoreTmp','#LeftPerson_ScoreTmp'];
    var Allstick=document.querySelector('#riichi_count');
    var renjang=document.querySelector('#renjang_count');
    var Allwin=0, whowin=[0,0,0,0], firstwin=-1, wholose=-1, losepoint=0, impossible=1;
    ron3.style.display='';
    document.querySelector('#fan_ron').selectedIndex=0;
    document.querySelector('#bu_ron').selectedIndex=0;
    for (var i=0;i<4;i++){
        if (fan[i]===1 && bu[i]<=25){ //불가능한 점수
            makeunchk(['down', 'right', 'up', 'left'],'check_ron1');
            makeunchk(['down', 'right', 'up', 'left'],'check_ron2');
            document.querySelector('#Modal_alertText').innerText='불가능한 점수입니다.';
            document.querySelector('#Modal_alert').style.display='inline';
            impossible=0;
            break;
        }
    }
    if (impossible===1){
        for (var i=0;i<4;i++){ //화료체크
            if (document.querySelector(checks2[i]).style.color==='red'){
                document.querySelector(checks2[i]).style.color='';
                wholose=i;
            }
        }
        for (var i=wholose;i<wholose+4;i++){
            if (document.querySelector(checks1[i%4]).style.color==='red'){
                document.querySelector(checks1[i%4]).style.color='';
                whowin[i%4]=1;
                Allwin++;
                if (firstwin===-1)
                    firstwin=i%4;
            }
        }
        for (var i=0;i<4;i++){ //점수계산
            if (whowin[i]===1){
                if (firstwin===i)
                    document.querySelector(scorestmp[i]).innerText='+'+(CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', 1)+Number(Allstick.innerText)*1000+Number(renjang.innerText)*300);
                else
                    document.querySelector(scorestmp[i]).innerText='+'+(CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', 1)+Number(renjang.innerText)*300);
                losepoint-=CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', 1);
                document.querySelector(scorestmp[i]).style.color='lawngreen';
            }
        }
        for (var i=0;i<4;i++){
            if (i===wholose){
                document.querySelector(scorestmp[i]).innerText=losepoint-Number(renjang.innerText)*Allwin*300;
                document.querySelector(scorestmp[i]).style.color='red';
            }
            else if (whowin[i]===0){
                document.querySelector(scorestmp[i]).innerText=0;
                document.querySelector(scorestmp[i]).style.color='black';
            }
        }
        document.querySelector('#what').innerText='ron';
        document.querySelector('#Modal_showscore').style.display='inline';
    }
}

function tsumo_General(fan, bu){
    fan=Number(fan);
    bu=Number(bu);
    var tsumo2=document.querySelector('#Modal_tsumo2');
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var checks=['#downcheck_tsumo','#rightcheck_tsumo','#upcheck_tsumo','#leftcheck_tsumo'];
    var scorestmp=['#DownPerson_ScoreTmp','#RightPerson_ScoreTmp','#UpPerson_ScoreTmp','#LeftPerson_ScoreTmp'];
    var Allstick=document.querySelector('#riichi_count');
    var renjang=document.querySelector('#renjang_count');
    var whowin=-1;
    tsumo2.style.display='';
    document.querySelector('#fan_tsumo').selectedIndex=0;
    document.querySelector('#bu_tsumo').selectedIndex=0;
    if (fan===1 && bu<=25){ //불가능한 점수
        makeunchk(['down', 'right', 'up', 'left'],'check_tsumo');
        document.querySelector('#Modal_alertText').innerText='불가능한 점수입니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        for (var i=0;i<4;i++){ //화료체크
            if (document.querySelector(checks[i]).style.color==='red'){
                document.querySelector(checks[i]).style.color='';
                whowin=i;
            }
        }
        for (var i=0;i<4;i++){ //점수계산
            if (i===whowin){
                document.querySelector(scorestmp[i]).innerText='+'+(CalculateScore(fan, bu, document.querySelector(winds[i]).innerText, document.querySelector(winds[i]).innerText, 'tsumo', 1)+Number(Allstick.innerText)*1000+Number(renjang.innerText)*300);
                document.querySelector(scorestmp[i]).style.color='lawngreen';
            }
            else{
                document.querySelector(scorestmp[i]).innerText=-CalculateScore(fan, bu, document.querySelector(winds[whowin]).innerText, document.querySelector(winds[i]).innerText, 'tsumo', 0)-Number(renjang.innerText)*100;
                document.querySelector(scorestmp[i]).style.color='red';
            }
        }
        document.querySelector('#what').innerText='tsumo';
        document.querySelector('#Modal_showscore').style.display='inline';
    }
}
function ryuukyoku_General(){
    var ryuukyoku2=document.querySelector('#Modal_ryuukyoku2');
    var checks=['#downcheck_ryuukyoku','#rightcheck_ryuukyoku','#upcheck_ryuukyoku','#leftcheck_ryuukyoku'];
    var scorestmp=['#DownPerson_ScoreTmp','#RightPerson_ScoreTmp','#UpPerson_ScoreTmp','#LeftPerson_ScoreTmp'];
    var tenpai=[0,0,0,0];
    var Alltenpai=0;
    ryuukyoku2.style.display='';
    for (var i=0;i<4;i++){ //텐파이 체크
        if (document.querySelector(checks[i]).style.color==='red'){
            document.querySelector(checks[i]).style.color='';
            Alltenpai++;
            tenpai[i]=1;
        }
    }
    if (Alltenpai>0 && Alltenpai<4){ //실 점수계산
        for (var i=0;i<4;i++){
            if (tenpai[i]===1){
                document.querySelector(scorestmp[i]).innerText='+'+3000/Alltenpai;
                document.querySelector(scorestmp[i]).style.color='lawngreen';
            }
            else{
                document.querySelector(scorestmp[i]).innerText=-3000/(4-Alltenpai);
                document.querySelector(scorestmp[i]).style.color='red';
            }
        }
    }
    else{
        for (var i=0;i<4;i++){
            document.querySelector(scorestmp[i]).innerText=0;
            document.querySelector(scorestmp[i]).style.color='black';
        }
    }
    if (Alltenpai===0)
        document.querySelector('#what').innerText='ryuukyoku_NoTenpai';
    else
        document.querySelector('#what').innerText='ryuukyoku_Tenpai';
    document.querySelector('#Modal_showscore').style.display='inline';
}
function ryuukyoku_Special(){
    var ryuukyoku1=document.querySelector('#Modal_ryuukyoku1');
    var scorestmp=['#DownPerson_ScoreTmp','#RightPerson_ScoreTmp','#UpPerson_ScoreTmp','#LeftPerson_ScoreTmp'];
    ryuukyoku1.style.display='';
    for (var i=0;i<4;i++){
        document.querySelector(scorestmp[i]).innerText=0;
        document.querySelector(scorestmp[i]).style.color='black';
    }
    document.querySelector('#what').innerText='ryuukyoku_Special';
    document.querySelector('#Modal_showscore').style.display='inline';
}

function ok_score(changed){
    var showscore=document.querySelector('#Modal_showscore');
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var sticks=['#DownPerson_Riichi', '#RightPerson_Riichi', '#UpPerson_Riichi', '#LeftPerson_Riichi'];
    var what=document.querySelector('#what');
    var Allstick=document.querySelector('#riichi_count');
    var renjang=document.querySelector('#renjang_count');
    showscore.style.display='';
    for (var i=0;i<sticks.length;i++){ //리치봉 수거
        document.querySelector(sticks[i]).style.visibility='';
    }
    for (var i=0;i<4;i++){ // 점수 배분및 기록
        if (changed[i])
            ChangeScore(scores[i], changed[i]);
        RecordScore(scores[i], changed[i], document.querySelector(scores[i]).innerText*100+changed[i]*100);
    }
    RecordTime();
    if (what.innerText==='tsumo' || what.innerText==='ron'){
        var tmp=1;
        for (var i=0;i<4;i++){ //친 체크후 바람바꾸기
            if (document.querySelector(winds[i]).innerText==='東' && changed[i]<=0){
                tmp=0;
                ChangeSeat();
                break;
            } 
        }
        if (tmp)
            renjang.innerText++;
        else
            renjang.innerText=0;
        Allstick.innerText=0;
    }
    else if (what.innerText==='ryuukyoku_Tenpai'){
        for (var i=0;i<4;i++){ //친 체크후 바람바꾸기
            if (document.querySelector(winds[i]).innerText==='東' && changed[i]<0){
                ChangeSeat();
                break;
            } 
        }
        renjang.innerText++;
    }
    else if (what.innerText==='ryuukyoku_NoTenpai'){
        ChangeSeat();
        renjang.innerText++;
    }
    else if (what.innerText==='ryuukyoku_Special'){
        renjang.innerText++;
    }
}