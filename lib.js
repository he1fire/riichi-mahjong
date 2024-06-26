const winds=['#DownPerson_Wind', '#RightPerson_Wind', '#UpPerson_Wind', '#LeftPerson_Wind'];
const names=['#DownPerson_Name', '#RightPerson_Name', '#UpPerson_Name', '#LeftPerson_Name'];
const scores=['#DownPerson_Score','#RightPerson_Score','#UpPerson_Score','#LeftPerson_Score'];
const scorestmp=['#DownPerson_ScoreTmp','#RightPerson_ScoreTmp','#UpPerson_ScoreTmp','#LeftPerson_ScoreTmp'];
const riichis=['#DownPerson_Riichi', '#RightPerson_Riichi', '#UpPerson_Riichi', '#LeftPerson_Riichi'];
const checks_ron1=['#downcheck_ron1','#rightcheck_ron1','#upcheck_ron1','#leftcheck_ron1'];
const checks_ron2=['#downcheck_ron2','#rightcheck_ron2','#upcheck_ron2','#leftcheck_ron2'];
const checks_tsumo=['#downcheck_tsumo','#rightcheck_tsumo','#upcheck_tsumo','#leftcheck_tsumo'];
const checks_ryuukyoku=['#downcheck_ryuukyoku','#rightcheck_ryuukyoku','#upcheck_ryuukyoku','#leftcheck_ryuukyoku'];
const winds_char=['東', '南', '西', '北'];
let gap_mode=0;


function Name(str){
    return document.getElementsByName(str);
}

function Query(str){
    return document.querySelector(str);
}

function Query_Text(str, ...x){
    if (x.length===1){
        if (x[0]=='++')
            document.querySelector(str).innerText++;
        else if (x[0]=='--')
            document.querySelector(str).innerText--;
        else
            document.querySelector(str).innerText=x[0];
    }
    return document.querySelector(str).innerText;
}

function Query_HTML(str, ...x){
    if (x.length===1)
        document.querySelector(str).innerHTML=x[0];
    else if (x.length===2 && x[1]==='+')
        document.querySelector(str).innerHTML+=x[0];
    return document.querySelector(str).innerHTML;
}

function Query_Style(str, ...x){
    if (x.length===1)
        document.querySelector(str).style=x[0];
    return document.querySelector(str).style;
}

function Query_Color(str, ...x){
    if (x.length===1)
        document.querySelector(str).style.color=x[0];
    return document.querySelector(str).style.color;
}

function Query_Visibility(str, ...x){
    if (x.length===1)
        document.querySelector(str).style.visibility=x[0];
    return document.querySelector(str).style.visibility;
}

function Query_Checked(str, ...x){
    if (x.length===1)
        document.querySelector(str).checked=x[0];
    if (document.querySelector(str)===null)
        return null;
    return document.querySelector(str).checked;
}

function Change_Sign(str){
    if (Number(Query_Text(str))>0)
        Query_Text(str, '+'+Query_Text(str));
    else if (Number(Query_Text(str))===0)
        Query_Text(str, 0);
}

function Change_Color(str){
    if (Query_Text(str)==='東')
        Query_Color(str, 'red');
    else if (winds_char.indexOf(Query_Text(str))!==-1)
        Query_Color(str, '');
    else if (Number(Query_Text(str))>0)
        Query_Color(str, 'lawngreen');
    else if (Number(Query_Text(str))<0)
        Query_Color(str, 'red');
    else
        Query_Color(str, '');
}

function Reset_Choose(type, ...x){
    if (type!==null){
        if (Query('input[type=radio][name=fan_'+type+']:checked')!==null)
            Query_Checked('input[type=radio][name=fan_'+type+']:checked', false);
        if (Query('input[type=radio][name=bu_'+type+']:checked')!==null)
            Query_Checked('input[type=radio][name=bu_'+type+']:checked', false);
        makeundisable(type);
        Name('fan_'+type)[0].checked=true;
        Name('bu_'+type)[0].disabled=true;
        Name('bu_'+type)[1].disabled=true;
        yakumancnt(type, 0);
    }
    for (let i=0;i<x.length;i++){
        makeunchk(['down', 'right', 'up', 'left'], x[i]);
    }
}

function Reset_Fao(type){
    document.querySelector('#fao_'+type).parentNode.style.display='none';
    document.querySelector('#fao_'+type).disabled=true;
    document.querySelector('#fao_'+type).checked=false;
    document.querySelector('#fao_'+type).nextSibling.innerText='X';
}