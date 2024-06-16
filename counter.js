window.onload=function(){
    document.querySelector("#Modal_seat").style.backgroundColor='rgba(0,0,0,0)';
    dice();
    randomseat();
    openFullScreenMode();
}

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
    var option=document.querySelector('#roundmangan').checked;
    X=Number(X);
    Y=Number(Y);
    if ((Y===3 && X>=70) || (Y===4 && X>=40))
        Y=5;
    if ((Y===3 && X>=60) || (Y===4 && X>=30) && option)
        Y=5;
    if (5<=Y)
        ron=tsumo1=tsumo2=arr[Y-5];
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
        score_record.innerHTML+=`<div style="color: lawngreen">+`+much+`00</div><div>`+now+`</div>`;
    }
    else if (much===0){
        score_record.innerHTML+=`<div style="color: white">+`+much+`00</div><div>`+now+`</div>`;
    }
    else{
        score_record.innerHTML+=`<div style="color: red">`+much+`00</div><div>`+now+`</div>`;
    }
}
function RecordTime(){
    var when_record=document.querySelector("#when");
    var renjang=document.querySelector('#renjang_count').innerText;
    var wind=document.querySelector("#nowwind").innerText;
    var cnt=document.querySelector("#nowcnt").innerText;
    when_record.innerHTML+=`<div>`+wind+cnt+`局 `+renjang+`本場</div><div><br></div>`;
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
function OXbutton(self){
    if (self.innerText=='O'){
        self.innerText='X';
        self.style.color='red';
    }
        
    else{
        self.innerText='O';
        self.style.color='blue';
    }
}
function makedisable(type){
    if (document.querySelector('input[type=radio][name=bu_tsumo]:checked')!=null)
        document.querySelector('input[type=radio][name=bu_tsumo]:checked').checked=false;
    if (document.querySelector('input[type=radio][name=bu_ron]:checked')!=null)
        document.querySelector('input[type=radio][name=bu_ron]:checked').checked=false;
    var bu=document.getElementsByName('bu_'+type);
    for (var i=0;i<bu.length;i++) {
        bu[i].disabled = true;
    }
}
function makeundisable(type){
    var bu=document.getElementsByName('bu_'+type);
    for (var i=0;i<bu.length;i++) {
        bu[i].disabled = false;
    }
    bu[2].checked=true;
    if (type=='ron')
        bu[0].disabled = true;
}
function yakumancnt(type, how){
    var yakuman=document.getElementsByName('fan_'+type)[9];
    if (how){
        if (yakuman.value<19)
            yakuman.value++;
        else
            yakuman.value=14;
        yakuman.nextSibling.innerText=(yakuman.value-13)+'배역만';
    }
    else{
        yakuman.value=13;
        yakuman.nextSibling.innerText='1배역만';
    }
    
}

function draw(){
    var draw=document.querySelector('#Modal_draw');
    draw.style.display='inline';
}

function dice(){
    var draw=document.querySelector('#Modal_draw');
    var dice=document.querySelector('#Modal_dice');
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    for (var i=0;i<4;i++){
    if (document.querySelector(winds[i]).innerText==='東')
        seatwind=i;
    }
    document.querySelector('#dicesum').style.transform='rotate('+String(360-seatwind*90)+'deg)';
    draw.style.display='';
    dice.style.display='inline';
}

function randomseat(){
    var draw=document.querySelector('#Modal_draw');
    var seat=document.querySelector('#Modal_seat');
    var tiles=['#tile1', '#tile2', '#tile3', '#tile4'];
    var winds=['東', '南', '西', '北'];
    draw.style.display='';
    seat.style.display='inline';
    for (var i=3;i>0;i--){
        var j = Math.floor(Math.random()*(i+1));
        [winds[i], winds[j]]=[winds[j], winds[i]];
    }
    for (var i=0;i<4;i++){
        document.querySelector(tiles[i]).style.border='3px solid black';
        document.querySelector(tiles[i]).style.borderRadius='5px';
        document.querySelector(tiles[i]).style.backgroundColor='orange';
        document.querySelector(tiles[i]).style.color='orange';
        document.querySelector(tiles[i]).innerText=winds[i];
    }
}

function reverse(self){
    if (self.innerText==='東')
        self.style.color='red';
    else
        self.style.color='black';
    self.style.backgroundColor='white';
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
    var options=['#roundmangan', '#minusriichi'];
    option.style.display='';
    modify.style.display='inline';
    var cnt=0;
    for (var i=0;i<4;i++){
        var tmp1='#name'+String(i);
        var tmp2='#score'+String(i);
        document.querySelector(tmp1).value="";
        document.querySelector(tmp1).placeholder=document.querySelector(names[i]).innerText;
        document.querySelector(tmp2).value="";
        document.querySelector(tmp2).placeholder=document.querySelector(scores[i]).innerText;
        cnt+=Number(document.querySelector(scores[i]).innerText);
    }
    cnt+=Number(document.querySelector('#riichi_count').innerText)*10;
    document.querySelector('#startscore').value="";
    document.querySelector('#startscore').placeholder=cnt/4;
    for (var i=0;i<options.length;i++){
        if (document.querySelector(options[i]).checked){
            document.querySelector(options[i]).nextSibling.innerText='O';
            document.querySelector(options[i]).nextSibling.style.color='blue';
        }
        else{
            document.querySelector(options[i]).nextSibling.innerText='X';
            document.querySelector(options[i]).nextSibling.style.color='red';
        }
    }
}

function save(){
    var modify=document.querySelector('#Modal_modify');
    var names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var sticks=['#DownPerson_Riichi', '#RightPerson_Riichi', '#UpPerson_Riichi', '#LeftPerson_Riichi'];
    var options=['#roundmangan', '#minusriichi'];
    var when_record=document.querySelector("#when");
    var chkscore=0;
    var cntscore=[0,0];
    var startscore=0;
    modify.style.display='';

    if (document.querySelector("#startscore").value!="")
        startscore=Number(document.querySelector("#startscore").value);
    else
        startscore=Number(document.querySelector("#startscore").placeholder);
    for (var i=0;i<4;i++){
        var tmp='#score'+String(i);
        cntscore[0]+=parseInt(document.querySelector(scores[i]).innerText);
        if (document.querySelector(tmp).value!=""){
            cntscore[1]+=parseInt(document.querySelector(tmp).value);
            if (Number(document.querySelector(scores[i]).innerText)!==parseInt(document.querySelector(tmp).value))
                chkscore=1;
        }
        else
            cntscore[1]+=parseInt(document.querySelector(tmp).placeholder);
    }
    cntscore[0]+=Number(document.querySelector('#riichi_count').innerText)*10;
    cntscore[1]+=Number(document.querySelector('#riichi_count').innerText)*10;
    if (chkscore && cntscore[0]!=startscore*4){
        document.querySelector('#Modal_alertText').innerText='점수와 시작 점수를 동시에 변경할 수 없습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
        return;
    }
    if (chkscore && cntscore[1]!=startscore*4){
        document.querySelector('#Modal_alertText').innerText='시작 점수와 현재 점수의 총 합이 다릅니다.';
        document.querySelector('#Modal_alert').style.display='inline';
        return;
    }
    for (var i=0;i<4;i++){
        var tmp='#name'+String(i);
        if (document.querySelector(tmp).value!="")
            document.querySelector(names[i]).innerText=document.querySelector(tmp).value;
        else
        document.querySelector(names[i]).innerText=document.querySelector(tmp).placeholder;
    }
    if (chkscore){
        for (var i=0;i<4;i++){
            var score_record=document.querySelector(scores[i]+'record');
            var tmp='#score'+String(i);
            if (document.querySelector(tmp).value!=""){
                document.querySelector(scores[i]).innerText=parseInt(document.querySelector(tmp).value)
                score_record.innerHTML+=`<div><br></div><div>`+document.querySelector(tmp).value+`00</div>`;
            }
            else{
                document.querySelector(scores[i]).innerText=parseInt(document.querySelector(tmp).placeholder)
                score_record.innerHTML+=`<div><br></div><div>`+document.querySelector(tmp).placeholder+`00</div>`;
            }
        }
        when_record.innerHTML+=`<div>점수 수정<div><br></div></div>`;
    }
    else if (cntscore[0]!=startscore*4){
        document.querySelector("#nowwind").innerText='東'; // 東 1국으로 초기화
        document.querySelector("#nowcnt").innerText=1;
        document.querySelector('#riichi_count').innerText=0;
        document.querySelector('#renjang_count').innerText=0;
        var windrecover=['東','南','西','北'];
        for (var i=0;i<winds.length;i++){
            document.querySelector(winds[i]).innerText=windrecover[i];
            if (document.querySelector(winds[i]).innerText==='東')
                document.querySelector(winds[i]).style.color='red';
            else
                document.querySelector(winds[i]).style.color='';
        }
        for (var i=0;i<4;i++){
            var score_record=document.querySelector(scores[i]+'record');
            document.querySelector(sticks[i]).style.visibility='';
            document.querySelector(scores[i]).innerText=startscore
            score_record.innerHTML=`<div>`+String(startscore)*100+`</div>`;
        }
        when_record.innerHTML=``;
    }

    for (var i=0;i<options.length;i++){
        if (document.querySelector(options[i]).nextSibling.innerText=='O')
            document.querySelector(options[i]).checked=true;
        else
            document.querySelector(options[i]).checked=false;
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
    var rank=[1,1,1,1];
    for (var i=0;i<4;i++){
        var arrs=document.querySelector(scores[i]).innerText.split('-');
        if (arrs.length==4)
            return;
    }
    for (var i=0;i<4;i++){
        document.querySelector(scores[i]+'gap').innerText=document.querySelector(scores[i]).innerText;
    }
    var comparescore=document.querySelector('#'+who+'_Scoregap').innerText;
    for (var i=0;i<4;i++){
        var tmp=document.querySelector(scores[i]).innerText-comparescore;
        if (scores[i]=='#'+who+'_Score'){
            for (var j=0;j<4;j++){
                for (var k=0;k<4;k++){
                    if (document.querySelector(scores[(i+j)%4]+'gap').innerText<document.querySelector(scores[(i+k)%4]+'gap').innerText){
                        rank[j]++;
                    }
                }
            }
            var ranktmp='';
            for (var j=0;j<4;j++){
                ranktmp+=String(rank[j]);
                if (j!=3)
                    ranktmp+='-';
            }
            document.querySelector(scores[i]).style.fontSize='60px';
            document.querySelector(scores[i]+'00').style.color='white';
            document.querySelector(scores[i]).innerText=ranktmp;
        }
        else if (tmp>0){
            document.querySelector(scores[i]).style.color='lawngreen';
            document.querySelector(scores[i]+'00').style.color='lawngreen';
            document.querySelector(scores[i]).innerText='+'+tmp;
        }
        else if (tmp<0){
            document.querySelector(scores[i]).style.color='red';
            document.querySelector(scores[i]+'00').style.color='red';
            document.querySelector(scores[i]).innerText=tmp;
        }
        else{
            document.querySelector(scores[i]).style.color='black';
            document.querySelector(scores[i]+'00').style.color='white';
            document.querySelector(scores[i]).innerText=tmp;
        }
        
    }
    chk.innerText=1;
}
function hidegap(){
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var chk=document.querySelector('#Gap_mode');
    if (chk.innerText==1){
        for (var i=0;i<4;i++){
            document.querySelector(scores[i]).style.fontSize='80px';
            document.querySelector(scores[i]).style.color='black';
            document.querySelector(scores[i]+'00').style.color='black';
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
    dicesum.style.textDecoration='none';
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
            dicesum.style.textDecoration='underline red 3px';
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
    var option=document.querySelector('#minusriichi').checked;
    if (stick.style.visibility===''){
        if (score.innerText>=10 || option){
            stick.style.visibility='visible';
            score.innerText=Number(score.innerText)-10;
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
    fan[now]=document.querySelector('input[type=radio][name=fan_ron]:checked').value;
    if (fan[now]>4)
        bu[now]=0;
    else
        bu[now]=document.querySelector('input[type=radio][name=bu_ron]:checked').value;
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
            if (document.querySelector('input[type=radio][name=fan_ron]:checked')!=null)
                document.querySelector('input[type=radio][name=fan_ron]:checked').checked=false;
            if (document.querySelector('input[type=radio][name=bu_ron]:checked')!=null)
                document.querySelector('input[type=radio][name=bu_ron]:checked').checked=false;
            makeundisable('ron');
            document.getElementsByName('fan_ron')[0].checked=true;
            document.getElementsByName('bu_ron')[0].disabled=true;
            document.getElementsByName('bu_ron')[1].disabled=true;
            yakumancnt('ron',0);
            break;
        }
        else if (document.querySelector(checks2[i%4]).style.color==='red'){
            for (var j=0;j<4;j++){
                fan[i]=Number(fan[i]);
                bu[i]=Number(bu[i]);
            }
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
    var Allwin=0, whowin=[0,0,0,0], firstwin=-1, wholose=-1, losepoint=0;
    ron3.style.display='';
    if (document.querySelector('input[type=radio][name=fan_ron]:checked')!=null)
        document.querySelector('input[type=radio][name=fan_ron]:checked').checked=false;
    if (document.querySelector('input[type=radio][name=bu_ron]:checked')!=null)
        document.querySelector('input[type=radio][name=bu_ron]:checked').checked=false;
    makeundisable('ron');
    document.getElementsByName('fan_ron')[0].checked=true;
    document.getElementsByName('bu_ron')[0].disabled=true;
    document.getElementsByName('bu_ron')[1].disabled=true;
    yakumancnt('ron',0);
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
    
    if (document.querySelector('input[type=radio][name=fan_tsumo]:checked')!=null)
        document.querySelector('input[type=radio][name=fan_tsumo]:checked').checked=false;
    if (document.querySelector('input[type=radio][name=bu_tsumo]:checked')!=null)
        document.querySelector('input[type=radio][name=bu_tsumo]:checked').checked=false;
    makeundisable('tsumo');
    document.getElementsByName('fan_tsumo')[0].checked=true;
    document.getElementsByName('bu_tsumo')[0].disabled=true;
    document.getElementsByName('bu_tsumo')[1].disabled=true;
    yakumancnt('tsumo',0);
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
    if (what.innerText==='rollback'){
        var arrw=document.querySelector("#when").innerHTML.split('<div');
        document.querySelector("#when").innerHTML='';
        for (var i=0;i<arrw.length-2;i++){ // 점수기록 지우기
            document.querySelector("#when").innerHTML+=`<div`+arrw[i];
        }
        var when=(`<div`+arrw[arrw.length-2]).replace(/<[^>]*>?/g, '');
        document.querySelector("#nowwind").innerText=when[0]; // 시간 되돌리기
        document.querySelector("#nowcnt").innerText=when[1];
        document.querySelector('#renjang_count').innerText=when[4];
        var windrecover=['南','西','北','東']
        for (var i=0;i<4;i++){ // 위치 되돌리기
            document.querySelector(winds[i]).innerText=windrecover[(4+i-Number(when[1]))%4];
        }
        for (var i=0;i<winds.length;i++){
            if (document.querySelector(winds[i]).innerText==='東')
                document.querySelector(winds[i]).style.color='red';
            else
                document.querySelector(winds[i]).style.color='';
        }
        var cntscore=0;
        var startscore=0;
        for (var i=0;i<4;i++){ // 점수 기록 지우기 && 점수 되돌리기
            var arrs=document.querySelector(scores[i]+'record').innerHTML.split('<div');
            document.querySelector(scores[i]+'record').innerHTML='';
            for (var j=0;j<arrs.length-2;j++){
                document.querySelector(scores[i]+'record').innerHTML+=`<div`+arrs[j];
            }
            startscore+=Number(document.querySelector(scores[i]).innerText);
            cntscore+=Number(document.querySelector(scores[i]).innerText)+Number(changed[i]);
            if (changed[i])
                ChangeScore(scores[i], changed[i]);
        }
        startscore+=Number(document.querySelector('#riichi_count').innerText)*10;
        document.querySelector('#riichi_count').innerText=(startscore-cntscore)/10; // 리치봉 개수 조정
        return;
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

function rollback(){
    var record=document.querySelector('#Modal_record');
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var scorestmp=['#DownPerson_ScoreTmp','#RightPerson_ScoreTmp','#UpPerson_ScoreTmp','#LeftPerson_ScoreTmp'];
    
    record.style.display='';
    
    var when_record=document.querySelector("#when").innerHTML;
    var arrw=when_record.split('<div');
    var when=(`<div`+arrw[arrw.length-2]).replace(/<[^>]*>?/g, ''); // 태그 제거
    if (when[0]!='東' && when[0]!='南' && when[0]!='西' && when[0]!='北'){ // 기록이 없거나 강제수정한 경우
        document.querySelector('#Modal_alertText').innerText='더이상 되돌릴수 없습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
        return;
    }
    for (var i=0;i<4;i++){
        var score_record=document.querySelector(scores[i]+'record').innerHTML;
        var arrs=score_record.split('<div');
        var much=((`<div`+arrs[arrs.length-3]).replace(/<[^>]*>?/g, ''))/100-document.querySelector(scores[i]).innerText;
        document.querySelector(scorestmp[i]).innerText=much*100;
        if (much>0){
            document.querySelector(scorestmp[i]).style.color='lawngreen';
        }
        else if(much<0){
            document.querySelector(scorestmp[i]).style.color='red';
        }
        else{
            document.querySelector(scorestmp[i]).style.color='black';
        }
    }

    document.querySelector('#what').innerText='rollback';
    document.querySelector('#Modal_showscore').style.display='inline';
    
}

function copyrecord(){
    var record=document.querySelector('#Modal_record');
    var names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var copytxt='\t';
    record.style.display='';

    for (var i=0;i<4;i++){
        copytxt+=document.querySelector(names[i]).innerText+'\t';
    }
    copytxt+='\n\t25000\t25000\t25000\t25000\t\n';
    var arrw=document.querySelector("#when").innerHTML.split('<div');
    for (var i=2;i<arrw.length;i++){
        copytxt+=(`<div`+arrw[i]).replace(/<[^>]*>?/g, '')+'\t';
        for (var j=0;j<4;j++){
            var arrs=document.querySelector(scores[j]+'record').innerHTML.split('<div');
            var much=Number((`<div`+arrs[i]).replace(/<[^>]*>?/g, ''));
            copytxt+=much.toString()+'\t';
        }
        copytxt+='\n';
    }
    window.navigator.clipboard.writeText(copytxt);
    document.querySelector('#Modal_alertText').innerText='점수 기록을 복사했습니다.';
    document.querySelector('#Modal_alert').style.display='inline';
}