function f(Y, X, who, how){
    var arr=new Array();
    var ans="", ron=0, tsumo1=0, tsumo2=0;
    var arr=[2000,3000,3000,4000,4000,4000,6000,6000,8000];
    Y=Number(Y);
    X=Number(X);
    if (X!=25 && X%10!=0){
        X-=X%10;
        X+=10;
    }
    if ((Y===3 && X>=70) || (Y===4 && X>=40))
        Y=5;
    if (Y<1 || X<20 || X>110 || (Y===1 && X<=25))
        alert('불가능한 계산입니다.');
    else if (5<=Y){
        if (Y>13)
            Y=13;
        ron=tsumo1=tsumo2=arr[Y-5];
    }
    else
        ron=tsumo1=tsumo2=X*Math.pow(2,Y+2);
    if (how==='ron'){
        if (who==='chin')
            ron*=6;
        else
            ron*=4;
        ron=Math.ceil(ron/100)*100;
        ans=String(ron);
    }
    else{
        tsumo1*=2;
        tsumo1=Math.ceil(tsumo1/100)*100;
        tsumo2=Math.ceil(tsumo2/100)*100;
        if (who==='chin')
            ans=String(tsumo1)+' ALL';
        else
            ans=String(tsumo1)+'/'+String(tsumo2)+' ALL';
    }
    return ans;
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
}

function makechk(self){
    if (self.style.color==='')
        self.style.color='red';
    else
        self.style.color='';
}

function richii(who){
    var Allstick=document.querySelector('#richii_count');
    var stick=document.querySelector('#'+who+'_Richii');
    var score=document.querySelector('#'+who+'_Score');
    if (stick.style.visibility===''){
        if (score.innerText>=10){
            stick.style.visibility='visible';
            score.innerText=Number(score.innerText)-10;;
            Allstick.innerText++;
        }
        else
            document.querySelector('#Modal_richii').style.display='inline';
    } 
    else{
        stick.style.visibility='';
        score.innerText=Number(score.innerText)+10;
        Allstick.innerText--;
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

function ryuukyoku_General(){
    var ryuukyoku2=document.querySelector('#Modal_ryuukyoku2');
    var winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
    var checks=['#downcheck_ryuukyoku','#rightcheck_ryuukyoku','#upcheck_ryuukyoku','#leftcheck_ryuukyoku'];
    var scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
    var tenpai=[0,0,0,0];
    var Alltenpai=0;
    var renjang=document.querySelector('#renjang_count');
    var sticks=['#DownPerson_Richii', '#RightPerson_Richii', '#UpPerson_Richii', '#LeftPerson_Richii'];
    ryuukyoku2.style.display='';
    renjang.innerText++;
    for (var i=0;i<sticks.length;i++){
        document.querySelector(sticks[i]).style.visibility='';
    }
    
    for (var i=0;i<4;i++){
        if (document.querySelector(winds[i]).innerHTML==='東' && document.querySelector(checks[i]).style.color===''){
            ChangeSeat();
            break;
        }
            
    }
    for (var i=0;i<4;i++){
        if (document.querySelector(checks[i]).style.color==='red'){
            document.querySelector(checks[i]).style.color='';
            Alltenpai++;
            tenpai[i]=1;
        }
    }
    if (Alltenpai>0 && Alltenpai<4){
        for (var i=0;i<4;i++){
            if (tenpai[i]===1)
                document.querySelector(scores[i]).innerText=Number(document.querySelector(scores[i]).innerText)+(30/Alltenpai);
            else
                document.querySelector(scores[i]).innerText=Number(document.querySelector(scores[i]).innerText)-(30/(4-Alltenpai));
        }
    }
}
function ryuukyoku_Special(){
    var ryuukyoku1=document.querySelector('#Modal_ryuukyoku1');
    var renjang=document.querySelector('#renjang_count');
    var sticks=['#DownPerson_Richii', '#RightPerson_Richii', '#UpPerson_Richii', '#LeftPerson_Richii'];
    ryuukyoku1.style.display='';
    renjang.innerText++;
    for (var i=0;i<sticks.length;i++){
        document.querySelector(sticks[i]).style.visibility='';
    }
}
