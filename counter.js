document.write("<script src='lib.js'></script>");

window.onload=function(){ // 웹페이지 시작시 로딩
    document.querySelector("#Modal_seat").style.backgroundColor='rgba(0,0,0,0)';
    dice();
    randomseat();
    //openFullScreenMode();
}

function openFullScreenMode() { // 전체화면 활성화
    let docV=document.documentElement;
    if (document.fullscreenElement)
        return;
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

function ChangeSeat(){ // 화료/유국시 자리 변경
    let tmp=Query_Text(winds[3]);
    for (let i=3;i>0;i--){
        Query_Text(winds[i], Query_Text(winds[i-1])); // 바람 시계방향으로 이동
    }
    Query_Text(winds[0], tmp);
    
    for (let i=0;i<winds.length;i++){ // 東 빨갛게 표시
        Change_Color(winds[i]);
    }

    if (Query_Text('#nowcnt')!=='4'){ // 4국 이전일 경우 국 수치 증가
        Query_Text('#nowcnt', '++');
    }
    else{ // 아니라면 장풍 변경
        Query_Text('#nowcnt', 1); // 1국으로 초기화
        if (Query_Text('#nowwind')==='東') // 왜인지 for문이나 indexOf로 돌리면 안됨,, 왜일까???
            Query_Text('#nowwind', '南');
        else if (Query_Text('#nowwind')==='南')
            Query_Text('#nowwind', '西');
        else if (Query_Text('#nowwind')==='西')
            Query_Text('#nowwind', '北');
        else
            Query_Text('#nowwind', '東');
        //document.querySelector("#nowwind").innerText=winds_char[(winds_char.indexOf(document.querySelector("#nowwind").innerText)+1)%4];
    }
}

function CalculateScore(fan, bu, winner_wind, who, how, win){ // 화료시 점수 계산 (판, 부, 승자, 본인, 론/쯔모, 승/패)
    let ret=0, ron_score=0, tsumo_chin_score=0, tsumo_ja_score=0;
    let arr_score=[2000,3000,3000,4000,4000,4000,6000,6000,8000,8000,16000,24000,32000,40000,48000];
    bu=Number(bu);
    fan=Number(fan);
    if ((fan===3 && bu>=70) || (fan===4 && bu>=40)) // 3판 70부, 4판 40부 이상이면 만관
        fan=5;
    if ((fan===3 && bu>=60) || (fan===4 && bu>=30) && Query_Checked('#roundmangan')) // 절상만관 적용시 3판 60부, 4핀 30부도 인정
        fan=5;
    if (5<=fan)
        ron_score=tsumo_chin_score=tsumo_ja_score=arr_score[fan-5]; // 만관 이상이면 점수배열에서 가져옴
    else
        ron_score=tsumo_chin_score=tsumo_ja_score=bu*Math.pow(2,fan+2); // 아니라면 점수 계산식으로 점수 계산

    if (how==='ron'){ // 론일 때
        if (winner_wind==='東') // 친이라면 6배
            ron_score*=6;
        else // 자라면 4배
            ron_score*=4;
        ron_score=Math.ceil(ron_score/100)*100;
        ret=ron_score;
    }
    else{ // 쯔모일 때
        tsumo_chin_score*=2; // 친이라면 2배
        tsumo_chin_score=Math.ceil(tsumo_chin_score/100)*100;
        tsumo_ja_score=Math.ceil(tsumo_ja_score/100)*100;
        if (winner_wind==='東'){ // 이긴사람이 친이라면
            if (win===true)
                ret=tsumo_chin_score*3; // 이겼다면 점수의 3배
            else
                ret=tsumo_chin_score; // 졌다면 그대로 지불
        }
        else{ // 이긴사람이 자라면
            if (win===true) // 내가 이겼다면
                ret=tsumo_chin_score+tsumo_ja_score*2;
            else if (who==='東') // 내가 친이라면 
                ret=tsumo_chin_score;
            else
                ret=tsumo_ja_score;
        }
    }
    return ret;
}
function ChangeScore(score, much){ // 점수 변동 이펙트
    let score_00=score+'00';
    let score_change=score+'change';
    let startscore=Number(Query_Text(score)); // 원래 점수
    let arr=[];
    for (let i=0;i<50;i++){ // 변경될 점수 사이를 50등분해서 저장
        arr[i]=startscore*100+((much*100)/50)*(i+1);
    }

    Query_Visibility(score_change, 'visible'); // 점수 변동 이펙트 켜기
    Query_Text(score_change, much+'00');
    Change_Sign(score_change);
    Change_Color(score_change);
    
    let timecnt=0;
    let repeat=setInterval(function() { // 시간에 따라 반복
        let x=Math.floor(arr[timecnt]/100), y=Math.abs(arr[timecnt]%100);
        Query_Text(score, x); // 100의 자리 변경
        if (y>=10) // 10의자리 변경
            Query_Text(score_00, y);
        else // 1글자라면 0을 앞에 붙여서 변경
            Query_Text(score_00, '0'+y);
        timecnt++;
        if (timecnt>=50){
            clearInterval(repeat);
            Query_Text(score, startscore+much);
            Query_Text(score_00, '00');
            Query_Visibility(score_change,'hidden');
        }
    }, 20); // 0.02초 * 50번 = 1초동안 실행
}

function RecordScore(who, much, now){ // 점수 기록에 점수 기입 - 나중에 copyrecord, rollback, save랑 묶어 한번에 개선
    let score_record=who+'record';
    if (much>0){
        Query_HTML(score_record, `<div style="color: lawngreen">+`+much+`00</div><div>`+now+`</div>`, '+');
    }
    else if (much===0){
        Query_HTML(score_record, `<div style="color: white">+`+much+`00</div><div>`+now+`</div>`, '+');
    }
    else{
        Query_HTML(score_record, `<div style="color: red">`+much+`00</div><div>`+now+`</div>`, '+');
    }
}
function RecordTime(){ // 점수 기록에 본장 기입 - RecordScore 참조
    let renjang=Query_Text('#renjang_count');
    let wind=Query_Text('#nowwind');
    let cnt=Query_Text('#nowcnt');
    Query_HTML("#when", `<div>`+wind+cnt+`局 `+renjang+`本場</div><div><br></div>`, '+');
}

function makechk(self){ // 화살표 창에서 본인 색칠
    if (self.style.color==='')
        self.style.color='red';
    else
        self.style.color='';
}
function makeunchk(who, type){ // 화살표 창에서 본인 제외 색칠 끄기
    for (let i=0;i<who.length;i++){
        Query_Color('#'+who[i]+type,'');
    }
}
function OXbutton(self){ // 옵션용 OX버튼 색칠
    if (self.previousSibling.disabled==true)
        return;
    if (self.innerText=='O'){
        self.innerText='X';
        self.style.color='red';
    }
    else{
        self.innerText='O';
        self.style.color='blue';
    }
}
function makedisable(type){ // 5판 이상일때 부수 선택 불가
    if (Query('input[type=radio][name=bu_'+type+']:checked')!==null) // 선택된 값이 있다면 해제
        Query_Checked('input[type=radio][name=bu_'+type+']:checked', false);
    let bu=Name('bu_'+type);
    for (let i=0;i<bu.length;i++){ // 부수 선택 막기
        bu[i].disabled=true;
    }
}
function makeundisable(type){ // 5판 이상 부수 선택 불가 해제
    let bu=Name('bu_'+type);
    for (let i=0;i<bu.length;i++){ // 부수 선택 켜기
        bu[i].disabled=false;
    }
    bu[2].checked=true; // 기본 값 30부로 설정
    if (type=='ron') // 론이라면 20부 끄기
        bu[0].disabled=true;
}
function yakumancnt(type, how){ // 역만 옵션 창 선택 및 책임지불 옵션
    let yakuman=Name('fan_'+type)[9];
    if (how){ // 클릭 했을 때
        if (yakuman.value<19) // 6배 역만 이하면 증가
            yakuman.value++;
        else
            yakuman.value=14;
        yakuman.nextSibling.innerText=(yakuman.value-13)+'배역만';
        Query('#fao_'+type).parentNode.style.display='inline'; // 책임지불 보이게 변경
        Query('#fao_'+type).disabled=false;
        if (Query('#fao_'+type).nextSibling.innerText=='O') // 글자 색 변경
            Query('#fao_'+type).nextSibling.style.color='blue';
        else
            Query('#fao_'+type).nextSibling.style.color='red';
    }
    else{ // 다른 판수를 클릭했을 때
        yakuman.value=13; // 값 초기화
        yakuman.nextSibling.innerText='1배역만';
        Query('#fao_'+type).parentNode.style.display='none'; // 책임지불 안보이게 변경
        Query('#fao_'+type).disabled=true;
    }
}

function draw(){ // 주사위/자리 선택 창 키기 (현재 작동 x)
    var draw=document.querySelector('#Modal_draw');
    draw.style.display='inline';
}

function dice(){ // 주사위 창 켜기
    var draw=document.querySelector('#Modal_draw');
    var dice=document.querySelector('#Modal_dice');
    for (var i=0;i<4;i++){
    if (document.querySelector(winds[i]).innerText==='東')
        seatwind=i;
    }
    document.querySelector('#dicesum').style.transform='rotate('+String(360-seatwind*90)+'deg)';
    draw.style.display='';
    dice.style.display='inline';
}

function randomseat(){ // 자리 선택 창 켜기
    var draw=document.querySelector('#Modal_draw');
    var seat=document.querySelector('#Modal_seat');
    var tiles=['#tile1', '#tile2', '#tile3', '#tile4'];
    draw.style.display='';
    seat.style.display='inline';
    for (var i=3;i>0;i--){
        var j = Math.floor(Math.random()*(i+1));
        [winds_char[i], winds_char[j]]=[winds_char[j], winds_char[i]];
    }
    for (var i=0;i<4;i++){
        document.querySelector(tiles[i]).style.border='3px solid black';
        document.querySelector(tiles[i]).style.borderRadius='5px';
        document.querySelector(tiles[i]).style.backgroundColor='orange';
        document.querySelector(tiles[i]).style.color='orange';
        document.querySelector(tiles[i]).innerText=winds_char[i];
    }
}

function reverse(self){ // 자리 선택 타일 뒤집기
    if (self.innerText==='東')
        self.style.color='red';
    else
        self.style.color='black';
    self.style.backgroundColor='white';
}

function option(){ // 옵션/점수기록 창 켜기
    var option=document.querySelector('#Modal_option');
    option.style.display='inline';
}

function modify(){ // 옵션 창 켜기
    var option=document.querySelector('#Modal_option');
    var modify=document.querySelector('#Modal_modify');
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

function save(){ // 옵션 저장
    var modify=document.querySelector('#Modal_modify');
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
        for (var i=0;i<winds.length;i++){
            document.querySelector(winds[i]).innerText=winds_char[i];
            if (document.querySelector(winds[i]).innerText==='東')
                document.querySelector(winds[i]).style.color='red';
            else
                document.querySelector(winds[i]).style.color='';
        }
        for (var i=0;i<4;i++){
            var score_record=document.querySelector(scores[i]+'record');
            document.querySelector(riichis[i]).style.visibility='';
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

function record(){ // 점수기록 창 켜기
    var option=document.querySelector('#Modal_option');
    var record=document.querySelector('#Modal_record');
    option.style.display='';
    record.style.display='inline';
}

function showgap(who){ // 점수 차이 켜기
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
    gap_mode=1;
}
function hidegap(){ // 점수 차이 끄기
    if (gap_mode==1){
        for (var i=0;i<4;i++){
            document.querySelector(scores[i]).style.fontSize='80px';
            document.querySelector(scores[i]).style.color='black';
            document.querySelector(scores[i]+'00').style.color='black';
            document.querySelector(scores[i]).innerText=document.querySelector(scores[i]+'gap').innerText;
        }
        gap_mode=0;
    }
}

function roll(){
    var dice1=document.querySelector('#dice1');
    var dice2=document.querySelector('#dice2');
    var dicesum=document.querySelector('#dicesum');
    var light=['#leftlight', '#downlight', '#rightlight', '#uplight'];
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
    var whowin=0;
    for (var i=0;i<4;i++){
        if (document.querySelector(checks_ron1[i]).style.color==='red')
            whowin++;
    }
    ron1.style.display='';
    if (whowin===0){
        document.querySelector('#Modal_alertText').innerText='론한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else if (whowin===4){
        Reset_Choose(null, 'check_ron1');
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
    var whowin=[0,0,0,0], wholose=-1;
    for (var i=0;i<4;i++){ //화료체크
        if (document.querySelector(checks_ron1[i]).style.color==='red')
            whowin[i]=1;
        if (document.querySelector(checks_ron2[i]).style.color==='red')
            wholose=i;
    }
    ron2.style.display='';
    if (wholose===-1){
        Reset_Choose(null, 'check_ron1');
        document.querySelector('#Modal_alertText').innerText='방총당한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else if (whowin[wholose]===1){
        Reset_Choose(null, 'check_ron1', 'check_ron2');
        document.querySelector('#Modal_alertText').innerText='론한 사람과 방총당한 사람이 같습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        for (var i=wholose+1;i<wholose+4;i++){
            if (whowin[i%4]===1){
                document.querySelector('#name_ron').innerText=document.querySelector(names[i%4]).innerText+'의 점수를 입력해주세요.';
                document.querySelector('#who_ron').innerText=i%4;
                Reset_Fao('ron');
                break;
            }
        }
        ron3.style.display='inline';
    }
}
function ron4(){
    var ron3=document.querySelector('#Modal_ron3');
    var ron4=document.querySelector('#Modal_ron4');
    ron3.style.display='';
    ron4.style.display='inline';
}
function ron5(){
    var faos=['#downfao_ron','#rightfao_ron','#upfao_ron','#leftfao_ron'];
    var ron3=document.querySelector('#Modal_ron3');
    var ron4=document.querySelector('#Modal_ron4');
    var whowin=Number(document.querySelector('#who_ron').innerText), whofao=-1;
    for (var i=0;i<4;i++){
        if (document.querySelector(faos[i]).style.color==='red'){
            whofao=i;
            document.querySelector(faos[i]).style.color='';
        }
    }
    ron4.style.display='';
    if (whofao===-1){
        Reset_Choose('ron', 'check_ron1', 'check_ron2');
        document.querySelector('#Modal_alertText').innerText='책임지불할 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else if (whofao===whowin){
        Reset_Choose('ron', 'check_ron1', 'check_ron2', 'fao_ron');
        document.querySelector('#Modal_alertText').innerText='론한 사람과 책임지불할 사람이 같습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else{
        ron3.style.display='inline';
        ron6(whofao);
    }
}
function ron6(whofao){
    var fan=document.querySelector('#fancnt_ron').innerText.split(',');
    var bu=document.querySelector('#bucnt_ron').innerText.split(',');
    var fao=document.querySelector('#faocnt_ron').innerText.split(',');
    var now=Number(document.querySelector('#who_ron').innerText);
    for (var i=0;i<4;i++){
        fan[i]=Number(fan[i]);
        bu[i]=Number(bu[i]);
        fao[i]=Number(fao[i]);
    }
    fan[now]=document.querySelector('input[type=radio][name=fan_ron]:checked').value;
    if (fan[now]>4)
        bu[now]=0;
    else
        bu[now]=document.querySelector('input[type=radio][name=bu_ron]:checked').value;
    fao[now]=whofao;
    document.querySelector('#fancnt_ron').innerText='';
    document.querySelector('#bucnt_ron').innerText='';
    document.querySelector('#faocnt_ron').innerText='';
    for (var j=0;j<4;j++){
        document.querySelector('#fancnt_ron').innerText+=String(fan[j])+',';
        document.querySelector('#bucnt_ron').innerText+=String(bu[j])+',';
        document.querySelector('#faocnt_ron').innerText+=String(fao[j])+',';
    }
    for (var i=now+1;i<now+4;i++){
        if (document.querySelector(checks_ron1[i%4]).style.color==='red'){
            document.querySelector('#name_ron').innerText=document.querySelector(names[i%4]).innerText+'의 점수를 입력해주세요.';
            document.querySelector('#who_ron').innerText=i%4;
            Reset_Choose('ron');
            Reset_Fao('ron');
            break;
        }
        else if (document.querySelector(checks_ron2[i%4]).style.color==='red'){
            ron_General(fan, bu, fao);
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
    var whowin=-1;
    for (var i=0;i<4;i++){
        if (document.querySelector(checks_tsumo[i]).style.color==='red')
            whowin=i;
    }
    tsumo1.style.display='';
    if (whowin!==-1){
        document.querySelector('#name_tsumo').innerText=document.querySelector(names[whowin]).innerText+'의 점수를 입력해주세요.';
        tsumo2.style.display='inline';
        Reset_Fao('tsumo');
    }
    else{
        document.querySelector('#Modal_alertText').innerText='쯔모한 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
}

function tsumo3(){
    var tsumo2=document.querySelector('#Modal_tsumo2');
    var tsumo3=document.querySelector('#Modal_tsumo3');
    tsumo2.style.display='';
    tsumo3.style.display='inline';
}

function tsumo4(){
    var fan=document.querySelector('input[type=radio][name=fan_tsumo]:checked').value;
    var faos=['#downfao_tsumo','#rightfao_tsumo','#upfao_tsumo','#leftfao_tsumo'];
    var tsumo3=document.querySelector('#Modal_tsumo3');
    var whowin=-1, whofao=-1;
    for (var i=0;i<4;i++){ //화료 및 책임지불 체크
        if (document.querySelector(checks_tsumo[i]).style.color==='red')
            whowin=i;
        if (document.querySelector(faos[i]).style.color==='red'){
            whofao=i;
            document.querySelector(faos[i]).style.color='';
        }
    }
    tsumo3.style.display='';
    if (whofao===-1){
        Reset_Choose('tsumo', 'check_tsumo');
        document.querySelector('#Modal_alertText').innerText='책임지불할 사람이 선택되지 않았습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else if (whofao===whowin){
        Reset_Choose('tsumo', 'check_tsumo', 'fao_tsumo');
        document.querySelector('#Modal_alertText').innerText='쯔모한 사람과 책임지불 할 사람이 같습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
    }
    else
        tsumo_General(fan, 0, whofao);
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

function ron_General(fan, bu, fao){
    var ron3=document.querySelector('#Modal_ron3');
    var Allstick=document.querySelector('#riichi_count');
    var renjang=document.querySelector('#renjang_count');
    var whowin=[0,0,0,0], firstwin=-1, wholose=-1, point=[0,0,0,0];
    ron3.style.display='';

    Reset_Choose('ron');
    for (var i=0;i<4;i++){ //화료체크
        if (document.querySelector(checks_ron2[i]).style.color==='red'){
            document.querySelector(checks_ron2[i]).style.color='';
            wholose=i;
        }
    }
    for (var i=wholose;i<wholose+4;i++){
        if (document.querySelector(checks_ron1[i%4]).style.color==='red'){
            document.querySelector(checks_ron1[i%4]).style.color='';
            whowin[i%4]=1;
            if (firstwin===-1)
                firstwin=i%4;
        }
    }
    for (var i=0;i<4;i++){ //점수계산
        if (whowin[i]===1){
            if (firstwin===i)
                point[i]+=CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', true)+Number(Allstick.innerText)*1000+Number(renjang.innerText)*300;
            else
                point[i]+=CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', true)+Number(renjang.innerText)*300;
            if (fao[i]===-1)
                point[wholose]-=CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', false)+Number(renjang.innerText)*300;
            else{
                point[fao[i]]-=CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[fao[i]]).innerText, 'ron', false)/2+Number(renjang.innerText)*300;
                point[wholose]-=CalculateScore(fan[i], bu[i], document.querySelector(winds[i]).innerText, document.querySelector(winds[wholose]).innerText, 'ron', false)/2;
            }
        }
    }
    for (var i=0;i<4;i++){
        if (point[i]>0){
            document.querySelector(scorestmp[i]).innerText='+'+point[i];
            document.querySelector(scorestmp[i]).style.color='lawngreen';
        }
        else if (point[i]<0){
            document.querySelector(scorestmp[i]).innerText=point[i];
            document.querySelector(scorestmp[i]).style.color='red';
        }
        else{
            document.querySelector(scorestmp[i]).innerText=0;
            document.querySelector(scorestmp[i]).style.color='black';
        }
    }
    document.querySelector('#what').innerText='ron';
    document.querySelector('#Modal_showscore').style.display='inline';
}

function tsumo_General(fan, bu, fao){
    fan=Number(fan);
    bu=Number(bu);
    fao=Number(fao);
    var tsumo2=document.querySelector('#Modal_tsumo2');
    var tsumo3=document.querySelector('#Modal_tsumo3');
    var Allstick=document.querySelector('#riichi_count');
    var renjang=document.querySelector('#renjang_count');
    var whowin=-1;
    tsumo2.style.display='';
    tsumo3.style.display='';
    
    Reset_Choose('tsumo');
    for (var i=0;i<4;i++){ //화료체크
        if (document.querySelector(checks_tsumo[i]).style.color==='red'){
            document.querySelector(checks_tsumo[i]).style.color='';
            whowin=i;
        }
    }
    if (fao===-1){ // 책임지불
        for (var i=0;i<4;i++){ //점수계산
            if (i===whowin){
                document.querySelector(scorestmp[i]).innerText='+'+(CalculateScore(fan, bu, document.querySelector(winds[i]).innerText, document.querySelector(winds[i]).innerText, 'tsumo', true)+Number(Allstick.innerText)*1000+Number(renjang.innerText)*300);
                document.querySelector(scorestmp[i]).style.color='lawngreen';
            }
            else{
                document.querySelector(scorestmp[i]).innerText=-CalculateScore(fan, bu, document.querySelector(winds[whowin]).innerText, document.querySelector(winds[i]).innerText, 'tsumo', false)-Number(renjang.innerText)*100;
                document.querySelector(scorestmp[i]).style.color='red';
            }
        }
    }
    else{
        for (var i=0;i<4;i++){ //점수계산
            if (i===whowin){
                document.querySelector(scorestmp[i]).innerText='+'+(CalculateScore(fan, bu, document.querySelector(winds[i]).innerText, document.querySelector(winds[i]).innerText, 'tsumo', true)+Number(Allstick.innerText)*1000+Number(renjang.innerText)*300);
                document.querySelector(scorestmp[i]).style.color='lawngreen';
            }
            else if (i===fao){
                document.querySelector(scorestmp[i]).innerText=-CalculateScore(fan, bu, document.querySelector(winds[whowin]).innerText, document.querySelector(winds[i]).innerText, 'ron', false)-Number(renjang.innerText)*300;
                document.querySelector(scorestmp[i]).style.color='red';
            }
            else{
                document.querySelector(scorestmp[i]).innerText=0;
                document.querySelector(scorestmp[i]).style.color='black';
            }
        }
    }
    document.querySelector('#what').innerText='tsumo';
    document.querySelector('#Modal_showscore').style.display='inline';
}
function ryuukyoku_General(){
    var ryuukyoku2=document.querySelector('#Modal_ryuukyoku2');
    var tenpai=[0,0,0,0];
    var Alltenpai=0;
    ryuukyoku2.style.display='';
    for (var i=0;i<4;i++){ //텐파이 체크
        if (document.querySelector(checks_ryuukyoku[i]).style.color==='red'){
            document.querySelector(checks_ryuukyoku[i]).style.color='';
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
    var what=document.querySelector('#what');
    var Allstick=document.querySelector('#riichi_count');
    var renjang=document.querySelector('#renjang_count');
    showscore.style.display='';
    for (var i=0;i<riichis.length;i++){ //리치봉 수거
        document.querySelector(riichis[i]).style.visibility='';
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
    record.style.display='';
    var when_record=document.querySelector("#when").innerHTML;
    var arrw=when_record.split('<div');
    var when=(`<div`+arrw[arrw.length-2]).replace(/<[^>]*>?/g, ''); // 태그 제거
    if (winds_char.indexOf(when[0])===-1){ // 기록이 없거나 강제수정한 경우
        document.querySelector('#Modal_alertText').innerText='더이상 되돌릴수 없습니다.';
        document.querySelector('#Modal_alert').style.display='inline';
        return;
    }
    for (var i=0;i<4;i++){
        var score_record=document.querySelector(scores[i]+'record').innerHTML;
        var arrs=score_record.split('<div');
        var much=((`<div`+arrs[arrs.length-3]).replace(/<[^>]*>?/g, ''))/100-document.querySelector(scores[i]).innerText;
        if (much>0){
            document.querySelector(scorestmp[i]).innerText='+'+(much*100);
            document.querySelector(scorestmp[i]).style.color='lawngreen';
        }
        else if(much<0){
            document.querySelector(scorestmp[i]).innerText=much*100;
            document.querySelector(scorestmp[i]).style.color='red';
        }
        else{
            document.querySelector(scorestmp[i]).innerText=0;
            document.querySelector(scorestmp[i]).style.color='black';
        }
    }

    document.querySelector('#what').innerText='rollback';
    document.querySelector('#Modal_showscore').style.display='inline';
    
}

function copyrecord(){
    var record=document.querySelector('#Modal_record');
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