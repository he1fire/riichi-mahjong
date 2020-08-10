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

function richii(who){
    var Allstick=document.querySelector('#richii_count');
    var stick=document.querySelector(who+'_Richii');
    var score=document.querySelector(who+'_Score');
    if (stick.style.visibility===''){
        stick.style.visibility='visible';
        if (score.innerText>=10){
            score.innerText=Number(score.innerText)-10;;
            Allstick.innerText++;
        }
        else
            alert("점수가 모자라 리치를 걸수 없습니다.");
    }
    else{
        stick.style.visibility='';
        score.innerText=Number(score.innerText)+10;
        Allstick.innerText--;
    }
}

function ryuukyoku(){
    var modal = document.querySelector('#Modal_ryuukyoku');
    modal.style.display = 'inline';
}

function ryuukyoku_2(){
    var modal = document.querySelector('#Modal_ryuukyoku');
    var Allrenjang = document.querySelector('#renjang_count');
    var sticks=['#DownPerson_Richii', '#RightPerson_Richii', '#UpPerson_Richii', '#LeftPerson_Richii'];
    modal.style.display='';
    Allrenjang.innerText++;
    for (var i=0;i<sticks.length;i++){
        document.querySelector(sticks[i]).style.visibility='';
    }
}
