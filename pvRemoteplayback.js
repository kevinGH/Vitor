
//帳密.
var g_user=g_cookies["loginusername"]||g_urlParam["loginusername"]||"1111";
var g_pwd=g_cookies["loginpassword"]||g_urlParam["loginpassword"]||"1111";
var g_port=g_cookies["pbocxport"]||g_urlParam["pbocxport"]||7000;
var g_mod=g_cookies["modul"]||g_urlParam["modul"];

var g_auth="&loginusername="+g_user+"&loginpassword="+g_pwd;
//選擇時間.
var g_datePicker = new DatePicker(document.getElementById("datepick"));
//選擇頻道.
var g_selCam = new CameraSelect(document.getElementById("datepick"));
g_selCam.domNode.className="selch";
document.getElementById("datepick").appendChild(document.createElement("br"));
document.getElementById("datepick").appendChild(document.createElement("br"));
//搜尋按鈕.
var searchBtn=document.createElement("input");
searchBtn.id="searchBtn";
searchBtn.type="button";
searchBtn.value=g_langStr["IDS_SENDQ"];
document.getElementById("datepick").appendChild(searchBtn);
//上一時段.
var prevSearchBtn=document.createElement("input");
prevSearchBtn.id="prevSearchBtn";
prevSearchBtn.type="button";
prevSearchBtn.value=g_langStr["IDS_PREVINV"];
document.getElementById("datepick").appendChild(prevSearchBtn);
//下一時段.
var nextSearchBtn=document.createElement("input");
nextSearchBtn.id="nextSearchBtn";
nextSearchBtn.type="button";
nextSearchBtn.value=g_langStr["IDS_NEXTINV"];
document.getElementById("datepick").appendChild(nextSearchBtn);

//檔案列表.
var g_fileList = new FileList(document.getElementById("filelist"),document.getElementById("filelistheader"));
setScrollSync(g_fileList.imglist.domNode,g_fileList.domNode);

//ocx
var g_ocx=document.getElementById("pbocx");

//設定頁
var g_setting=new Setting(document.body,document.body.clientWidth-360,
						  document.body.clientHeight-210,350,200);
//playctrl跟底bar.
var g_btmbar=document.getElementById("btmbar");
var g_playctrl=document.getElementById("playctrl");

//狀態變數.預設值.
var g_st_cannotConnect=false;
var b_ie=(navigator.appName=="Microsoft Internet Explorer");
var g_showctrl=true;
var g_CTRL_HEIGHT=270;
var g_ctrlHeigth=g_CTRL_HEIGHT;
findNestestRatio(document.getElementById("selvr"));
var g_vdoratio=selvr.options[selvr.selectedIndex].value;
var g_bmpsavepath="",g_vdosavepath="",g_mode=0,g_rep=0,g_bPlayend=false,g_bPlayForRep=false;
var g_bSeqPlay=true,g_click=false;

//找最接近的螢幕寬高比.
function findNestestRatio(sel)
{
	var r=screen.height/screen.width;
	var idx=0,min=999;
	for(var i=0;i<sel.childNodes.length;i++)
	{
		if( sel.childNodes[i] && Math.abs(sel.childNodes[i].value - r) < min)
		{
			idx=i;min = Math.abs(sel.childNodes[i].value - r);
		}
	}
	sel.childNodes[idx].selected = true;
}
//設定影像顯示比例(依選擇).
selvr.onchange=function()
{
	g_vdoratio=selvr.options[selvr.selectedIndex].value;
	setVdoSize();
}
//搜尋按鈕動作.
searchBtn.onclick=function()
{
	if(b_ie)
		if(!g_ocx.Login(location.hostname,g_port,g_user,g_pwd))
			alert("not login!");

	g_fileList.setSearchRange(g_datePicker.getDate(),g_selCam.getCamera());
	g_fileList.search();
	g_fileList.showList();
//	g_playBtn.setDisabled( !(g_bSeqPlay && g_fileList.result && g_fileList.result.length) );
}
nextSearchBtn.onclick=function()
{
	g_datePicker.nextHour();
	searchBtn.onclick();
}
prevSearchBtn.onclick=function()
{
	g_datePicker.prevHour();
	searchBtn.onclick();
}

g_datePicker.hours.onchange=searchBtn.onclick;

//設定影像顯示比例.
function setVdoSize()
{
//	var w=document.body.clientWidth-250-50;
	var h=document.body.clientHeight-g_ctrlHeigth;
	pbocx.style.height = h;
	pbocx.style.width =  parseInt(h/g_vdoratio);;
	g_fileList.imglist.domNode.style.width = document.body.clientWidth-350;
}
document.body.onresize=function(){
	setVdoSize();
	g_setting.setPosition(document.body.clientWidth-360,
						  document.body.clientHeight-210);
}
setVdoSize();

//按鈕樣式.
var vnor="viewbtnnor",vdis="viewbtndis",vover="viewbtnover",pnor="playctlnor",pdis="playctldis",pover="playctlover";
var g_hideCtl=new ImageBtn2(vnor,vdis,vnor,vover,"hidectlbtn",hideCtrlPanel,null,null,null,td4L);
	addSp(td4L,"&nbsp&nbsp");
var g_showCtl=new ImageBtn2(vnor,vdis,vnor,vover,"showctlbtn",showCtrlPanel,null,null,null,td4L);
var g_slowBtn=new ImageBtn2(pnor,pdis,pnor,pover,"slowbtn",onSlow,null,null,null,td3L);
var g_stopBtn=new ImageBtn2(pnor,pdis,pnor,pover,"stopbtn",onStop,null,null,null,td2L);
var g_playBtn=new ImageBtn2(pnor,pdis,pnor,pover,"playbtn",onPlay,null,null,null,td1M);
var g_pauseBtn=new ImageBtn2(pnor,pdis,pnor,pover,"pausebtn",onPause,null,null,null,td2R);
var g_quickBtn=new ImageBtn2(pnor,pdis,pnor,pover,"quickbtn",onQPlay,null,null,null,td3R);
var g_snshotBtn=new ImageBtn2(vnor,vdis,vnor,vover,"snapshotbtn",onSnapshot,null,null,null,td4R);
	addSp(td4R,"&nbsp&nbsp");
var g_fullsrBtn=new ImageBtn2(vnor,vdis,vnor,vover,"fullscrbtn",onFullScr,null,null,null,td4R);

//播放控制.
function onPause(){ g_ocx.Pause(); showPlayState(998);g_pauseBtn.setDisable(true);g_playBtn.setDisable(false);g_quickBtn.setDisable(true);g_slowBtn.setDisable(true);}
function onPlay(){ showPlayState( g_ocx.Play() ); g_pauseBtn.setDisable(false);g_playBtn.setDisable(true);g_quickBtn.setDisable(false);g_slowBtn.setDisable(false); }
function onStop(){ g_ocx.Stop();g_bPlayend=false;OnDisConnecting(); }
function onQPlay(){ showPlayState( g_ocx.QuickPlay() );}
function onSlow(){ showPlayState( g_ocx.SlowPlay() );}

//面版show/hide
var g_shPanel=0;//if 1=>第二次按hide可hide控制面版.
function showCtrlPanel(){
	g_hideCtl.setDisable(false);
	g_showCtl.setDisable(true);	
	g_ctrlHeigth = g_CTRL_HEIGHT;
	if(parent)g_ctrlHeigth+=110;//掛在公布欄時稍微縮小.
	leftview.style.display="inline-block";
	btm.style.display="inline-block";
	setVdoSize();
	g_fullsrBtn.setDisable(false);
	g_shPanel=0;
}

function hideCtrlPanel(){
	if(g_shPanel==0)
	{
		g_hideCtl.setDisable(true);//若要啟用showhideplayctrl則mark起來.
		g_showCtl.setDisable(false);	
		g_ctrlHeigth = 120;
		leftview.style.display="none";
		btm.style.display="none";
		setVdoSize();
		g_setting.show(false);
		g_fullsrBtn.setDisable(true);
		g_shPanel=1;
	}
	else{
		g_btmbar.style.display="inline-block";
		g_playctrl.style.display="none";
	}
}

btmbar.onclick=showPanel;
function showPanel(){
	g_btmbar.style.display="none";
	g_playctrl.style.display="inline-block";
}
//顯示設定頁.
function onFullScr(){
	g_setting.show();
}
//快照.
function onSnapshot(){
	if(g_bmpsavepath=="")
		g_bmpsavepath = g_ocx.SnapShot("","");
	else
		g_ocx.SnapShot(g_bmpsavepath,"");
}
enablePlayCtrl(false);
showCtrlPanel();

//播放控制列狀態.
function enablePlayCtrl(bEn){
	g_pauseBtn.setDisable(!bEn);
	g_playBtn.setDisable(!bEn);
	g_stopBtn.setDisable(!bEn);
	g_quickBtn.setDisable(!bEn);
	g_slowBtn.setDisable(!bEn);
	
	g_snshotBtn.setDisable(!bEn);
}

//顯示播放狀態.
function showPlayState(st){
	switch(st)
	{
		case 998:	ps.innerHTML=g_langStr["IDS_PAUSE"]; break;
		case 3: ps.innerHTML=g_langStr["IDS_PLAYEND"];break;		
		case 2: ps.innerHTML=g_langStr["IDS_READY"];break;
		case 1:	ps.innerHTML=g_langStr["IDS_FORWARD"]; break;
		case 0:	ps.innerHTML=g_langStr["IDS_PLAY"]; break;
		default: ps.innerHTML="";
	}
}
//斷線中UI設定.
function OnDisConnecting()
{
	g_st_cannotConnect=true;
	st.innerHTML=g_langStr["IDS_DISCONNECTING"];
	enablePlayCtrl(false);
	showPlayState();
} 

//連線中UI設定.
function OnConnecting()
{
	g_st_cannotConnect=true;
	st.innerHTML=g_langStr["IDS_CONNECTING"];
	enablePlayCtrl(false);g_stopBtn.setDisable(false);
} 

//己連線後UI設定.
function OnConnected()
{
	g_st_cannotConnect=true;
	st.innerHTML=g_langStr["IDS_CONNECTED"];	
	enablePlayCtrl(true);
	showPlayState(2);
	
	if(g_rep&&g_bPlayForRep){ //if重播.
		g_bPlayForRep=false;
		setTimeout(onPlay,1500);
	}
}

//斷線後UI設定.
function OnDisconnected()
{
	if(g_bPlayend){ //回轉到開頭.
		g_bPlayend=false;
		g_ocx.Search(g_fileList.prevTime,g_fileList.ch);
		return;
	}

	g_st_cannotConnect=false;
	st.innerHTML=g_langStr["IDS_DISCONNECTED"];
	enablePlayCtrl(false);
	
	if(g_click) //if點選列表.
		doConnect();
	else{
		g_fileList.clearSelect();
		vdoinfo.innerHTML="";
	}
		
}

function doConnect()
{
	g_click=false;
	OnConnecting(); 
	g_ocx.Search(g_fileList.getTimeRange(),g_fileList.ch); vdoinfo.innerHTML = g_fileList.info;
}

//回傳NOSERVER時
function OnNoServer()
{
	g_st_cannotConnect=false;
	st.innerHTML=g_langStr["IDS_NOSERVER"];
	enablePlayCtrl(false);	
}
//由開始時間及結束時間計算時間長度. Vxx-YYYY-MM-DD-HHMMSS.*
function getSecsFromTimeStr(strBgTime,strEndTime)
{
	try{
		//將字串轉成Date物件.
		var y=strBgTime.split("-")[0];var m=strBgTime.split("-")[1];var d=strBgTime.split("-")[2].split(" ")[0];
		var h=strBgTime.split(" ")[1].split(":")[0];
		var mm=strBgTime.split(" ")[1].split(":")[1];
		var s=strBgTime.split(" ")[1].split(":")[2];
		var ms=0;
		var bgDate=new Date(y,m,d,h,mm,s,ms);
		y=strEndTime.split("-")[0];m=strEndTime.split("-")[1];d=strEndTime.split("-")[2].split(" ")[0];;
		h=strEndTime.split(" ")[1].split(":")[0];
		mm=strEndTime.split(" ")[1].split(":")[1];
		s=strEndTime.split(" ")[1].split(":")[2];	
		var edDate=new Date(y,m,d,h,mm,s,ms);
		//算出時間長度(ms),格式化成HH:MM:SS
		s = Math.floor( Math.abs( edDate.getTime() - bgDate.getTime() )/1000 );
		h=""+Math.floor(s/3600);
		mm=""+Math.floor(s/60) - h*60;
		s=""+s%60;
		return paddingLeft(h,2)+":"+paddingLeft(mm,2)+":"+paddingLeft(s,2);
	}catch(e){
		return -1;
	}
}
//從檔名裡擷取日期. Vxx-YYYY-MM-DD-HHMMSS.*
function getDateFromFileName(strFilename)
{
	var a=strFilename.split("-");
	var b=strFilename.split("-")[4].split(".")[0];
	return new Date(a[1],a[2]-1,a[3],b.substr(0,2),b.substr(2,2),b.substr(4,2),0);
}
//列表與圖片捲軸同步.
function setScrollSync(node1,node2)
{
	node1.onscroll=function(){
		var ratio = node2.scrollHeight/node1.scrollWidth;
		node2.scrollTop = node1.scrollLeft*ratio;
	//	st.innerHTML="left:"+node2.scrollTop+"/Bottom:"+node1.scrollLeft+".r="+ratio;
	}
}

//////////////////////////
//物件.

//圖片列表物件.
function ImageList(container)
{
	this.domNode=container;
	this.tab= new Table(this.domNode);
}
//加入新圖片.
ImageList.prototype.addImg=function(list,imgPath)
{
	var img=document.createElement("img");
//	this.tab.newRow();
	var td=this.tab.addData();
	td.appendChild(img);
	td.appendChild(document.createElement("br"));
	addSp(td,imgPath.split("$")[4].split(".")[0].substr(4)).style.whiteSpace="nowrap";
//	this.tab.newRow();
//	this.tab.addData(imgPath.split("$")[4].split(".")[0].substr(4));	
	var cgi="CGIWebLog.cgi?CMD=GetAlarmImage"+g_auth+"&filter="+imgPath+"&rnd="+Math.random();
	img.width=133;
	img.height=100;
	img.style.border="1px solid white";
	img.title=imgPath.split("$")[4];
	img.src=cgi;
	this.setSync(img,list);
}
//清除列表裡所有圖片.
ImageList.prototype.clear=function()
{
	var td;
	clearChildNode(this.tab.tb);
	this.tab.tr=undefined;
}
//焦點至圖片時同時也焦點列表.
ImageList.prototype.setSync=function(self,target)
{
	self.onmouseover=function(){
		target.onmouseover();
	}
	self.onmouseout=function(){
		target.onmouseout();
	}
	self.onclick=function(){
		target.onclick();
	}
}

//遠端檔案列表物件.
function FileList(container,headercontainer)
{
	this.domNode=container;
	this.imglist=new ImageList(document.getElementById("imglist"));
	if(headercontainer){
		var ntab=new Table(headercontainer);
		ntab.domNode.className="liststyle";
		var tr=ntab.setHeader( g_langStr["IDS_STARTTIME"],g_langStr["IDS_LENGTH"] );
		tr.childNodes[0].style.width="203px";
	}
}

//遠端檔案列表設定搜尋範圍.
FileList.prototype.setSearchRange = function(time,ch)
{
	if(!time){
		alert("please set a timerange");return;
	}
	//parse from DatePicker.
	var a= time.split(",");
	var day=a[0].substr(6).replace(/-/gi,"/");
	var iv=parseInt(a[1],10)-1;
	//format.
	this.timeStr=day+"_"+iv+":00:00_"+iv+":59:59";	
	this.ch=ch? parseInt(ch.split("=")[1],10)-1 :0;
}

//遠端檔案列表執行搜尋動作.
FileList.prototype.search = function()
{	
	var cgi="CGIListFiles.cgi?CMD=ListRemoFiles"+g_auth+"&TimeRange="+this.timeStr+"&CH="+this.ch+"&JSON=true"+"&MODUL="+g_mod+"&RND="+Math.random();
	try{
		g_httpReq.open("GET",cgi,false);
		g_httpReq.send();
		if(this.result){
			clearChildNode(this.result);
			delete this.result;
		}
		this.result = eval("("+g_httpReq.responseText+")");
	}catch(e){
		return false;
	}
}

//遠端檔案列表列出檔案(以時間為索引)
FileList.prototype.showList = function()
{
	clearChildNode(this.domNode);
	this.imglist.clear();
	delete this.imglist;
	this.imglist=new ImageList(document.getElementById("imglist"));
	if(this.newTab)clearChildNode(this.newTab.domNode);
	delete this.newTab;

	var MAX_IMGVIEW=120;
	var imgCount=0;

	
	if(this.result && this.result.length)
	{		
		var newTab=new Table(this.domNode);
		newTab.domNode.className="liststyle";
		this.newTab=newTab;
			
		for(var i in this.result)
		{
			//取得檔名裡的檔案時間.
			var fileDate = getDateFromFileName( this.result[i]["File_Name"] );
			//由BeginTime/EndTime計算影片長度.
			var lenS=getSecsFromTimeStr( this.result[i]["Begin_Time"], this.result[i]["End_Time"] );
			
			//顯示於列表的時間.
			var BgDate = this.formatDate( fileDate );
			//顯示於標題的時間與頻道名.
			var fullDate = fileDate.toLocaleDateString()+" "+fileDate.toLocaleTimeString();
			var chname=this.result[i]["Channel_Name"];

			//將資料加至列表.
			var tr=this.newTab.newRow();
//			this.newTab.addData(parseInt(this.result[i]["CamID"])+1);
//			this.newTab.addData(chname);
			this.newTab.addData(BgDate);
			this.newTab.addData(lenS);
//			this.newTab.addData(this.result[i]["FourCC"]);
			//將索引圖片加至圖片列表.
			if( imgCount++<=MAX_IMGVIEW ) //限制圖片預覽數.
				if(this.imglist)this.imglist.addImg(tr,this.result[i]["IMGPATH"]);
			
			//搜尋的開始時間.
//			/*opt1. Begin-EndTime*/	var sTimestr=this.result[i]["Begin_Time"].replace(/-/g,"/").replace(" ","_")+"_"+this.result[i]["End_Time"].split(" ")[1];
			/*opt2. FileTime->Len*/	var sTimestr=this.toSearchDateString(BgDate,lenS);
			
			//列表動態效果.
			tr.clsState="listitem itemnormal";
			tr.className=tr.clsState;
			tr.selected=false;
			tr.lenS=lenS;
			this.chinfo=chname+"&nbsp"+fileDate.toLocaleDateString();
			var edDate=new Date(fileDate.getFullYear(),fileDate.getMonth()+1,fileDate.getDate(),
								fileDate.getHours()+parseInt(lenS.split(":")[0],10),
								fileDate.getMinutes()+parseInt(lenS.split(":")[1],10),
								fileDate.getSeconds()+parseInt(lenS.split(":")[2],10));
			this.setAnimateList(tr,sTimestr,this.ch,chname+"&nbsp"+fullDate+" ~ "+edDate.toLocaleTimeString());
		}
	}else
		addSp(this.domNode,g_langStr["IDS_NODATA"]);
}

/* st=HH:MM:SS,len=HH:MM:SS
*/
FileList.prototype.getEndTime=function(st,len)
{
	if(!len)len="00:00:00";
	return new Date(0,0,0,parseInt(st.split(":")[0],10)+parseInt(len.split(":")[0],10),
							 parseInt(st.split(":")[1],10)+parseInt(len.split(":")[1],10),
							 parseInt(st.split(":")[2],10)+parseInt(len.split(":")[2],10),0);
}

/* d=YYYY/MM/DD HH:mm:SS  s=HH:mm:SS
*/ 
FileList.prototype.toSearchDateString=function(d,s)
{
	var edTime = this.getEndTime( d.split(" ")[1] , "00:00:03" );
	var ret = d.replace(/ /,"_")+"_"+edTime.getHours()+":"+edTime.getMinutes()+":"+edTime.getSeconds();
	return ret;
}

FileList.prototype.formatDate=function(dt)
{
	return dt.getFullYear()+"/"+paddingLeft(""+(dt.getMonth()+1),2)+"/"+paddingLeft(""+dt.getDate(),2)+" "+
			paddingLeft(""+dt.getHours(),2)+":"+paddingLeft(""+dt.getMinutes(),2)+":"+paddingLeft(""+dt.getSeconds(),2);
}

//遠端檔案列表設定動態效果
FileList.prototype.setAnimateList=function(node,time,ch,info)
{
	var inst=this;
	node.onmouseover = function(){
		node.className="listitem itemover";
	}
	node.onmouseout = function(){
		node.className=node.clsState;
	}
	document.onkeydown=function(e){
		if(event.keyCode =='17' ) inst.ctrl=true;
	}
	document.onkeyup=function(e){
		if(event.keyCode =='17' ) inst.ctrl=false;	
	}

//	this.ctrl=true; //固定使用多選模式.
	
	node.time=time;
	//設定列表項目按下動作.
	node.onclick = function()
	{		
//		if( g_st_cannotConnect){
//			alert(g_langStr["IDS_HINTSTOP"]);
//			return;
//		}
		if(!b_ie)return;//test on non-ie.
		//顯示所選項目.
		this.selected=!this.selected;
		//沒按ctrl時只選click到那一個.
		if(!inst.ctrl){
			inst.clearSelect();
			this.selected=true;
		}else
		{
			if(!inst.checkAnySelected())//若沒任何選中則選這個,因為只可能在按住ctrl時發生.
				this.selected=true;
		}
		inst.ch=ch;
		inst.select(this);			

		//若沒斷線則先斷線再進行已選項目的連線.
		if(g_st_cannotConnect){
			g_click=true;
			onStop();//
		}
		else
			doConnect();
	}
}

/*任一選中就回傳true.
*/
FileList.prototype.checkAnySelected=function()
{
	var tr=this.newTab.domNode.firstChild.firstChild;
	while(tr)
	{
		if(tr.selected)return true;
		tr=tr.nextSibling;
	}	
	return false;
}

//多選時間長度:以選中的最小值為開始,最大值為結束.
FileList.prototype.getTimeRange=function()
{
	var date,bgT,edT,cbgTm,bgDt,edDt,cbgDt,cedDt;
	var tb=this.newTab.domNode.firstChild;
	var tr=tb.firstChild;
	if(tr.time)
		date=tr.time.split("_")[0];
	var isSel=false;

	while(tr)
	{
		if(tr.selected)
		{
			isSel=true;
			//比對每筆欄位.
			cbgTm=tr.time.split("_")[1];
			cbgDt=this.getEndTime(cbgTm);
			cedDt=this.getEndTime(cbgTm,tr.lenS);
			var cedTm=cedDt.getHours()+":"+cedDt.getMinutes()+":"+cedDt.getSeconds();

			if(!bgT)bgT=cbgTm;
			if(!edT)edT=cedTm;
			bgDt=this.getEndTime(bgT);
			edDt=this.getEndTime(edT);
			//如果加入時間比較小就使用這個時間當開始.
			if( bgDt.getTime()>cbgDt.getTime() )
				bgT=cbgTm;
			//比較大就用結束.
			if( edDt.getTime()<cedDt.getTime() )
				edT=cedTm;
		}
		tr=tr.nextSibling;
	}
/*	g_bSeqPlay = !isSel;
	if(!isSel){//若沒任何被選中就是循序播放.
		this.selNode=this.selNode?this.selNode.nexSibling:tb.firstChild;
		if(!this.selNode)this.selNode=tb.firstChild;//已達最後一個,so給第一個.
		bgT=this.selNode.time.split("_")[1];
		edDt=this.getEndTime(bgT,this.selNode.lenS);
		edT=edDt.getHours()+":"+edDt.getMinutes()+":"+edDt.getSeconds();
	}	
*/	
	//將範圍內的全部變成選取.
	bgDt=this.getEndTime(bgT);
	edDt=this.getEndTime(edT);
	this.selectTimeRange(bgDt,edDt);
	
	//若循序播放,清空select讓下次進入.
//	if(!isSel)this.selNode.selected=false;
	
	this.info=this.chinfo+"&nbsp"+bgT+"~"+edT;
	this.prevTime = date+"_"+bgT+"_"+edT;
	return this.prevTime;
}

FileList.prototype.select=function(node,isSel)
{
	this.selNode=node;
	if(!node)return node;
	if(isSel!=undefined)node.selected=isSel;
	node.clsState=(node.selected)?"listitem itemclicked":"listitem itemnormal";
	node.className=node.clsState;
	return node;
}

FileList.prototype.selectTimeRange=function(bgDate,edDate)
{
	var tr=this.newTab.domNode.firstChild.firstChild;
	while(tr)
	{
		var cbgTim=tr.time.split("_")[1];
		var cbgDate=this.getEndTime(cbgTim);
		var cedDate=this.getEndTime(cbgTim,tr.lenS);
		//範圍內設為選取,範圍外則取消選取.
		this.select(tr,( cbgDate.getTime()>=bgDate.getTime() && cedDate.getTime()<=edDate.getTime() ));
		
		tr=tr.nextSibling;	
	}
}

FileList.prototype.clearSelect=function()
{
	var tb=this.newTab.domNode.firstChild;
	var tr=tb.firstChild;
	this.stime=undefined;
	while(tr)
	{
		this.select(tr,false);
		tr=tr.nextSibling;
	}
}

//設定頁.
function Setting(container,x,y,w,h)
 {
	Setting.prototype.setDraggable=settingSetDraggable;
	Setting.prototype.show=settingShow;
	Setting.prototype.setSaveBtnCk=setSaveBtnCk;
	Setting.prototype.setBtnTypeCk=setBtnTypeCk;
	Setting.prototype.setPosition=setPosition;
	
	var inst=this;
	this.x=x;this.y=y;
	this.domNode=dc.createElement("div");
	if(container)container.appendChild(this.domNode);
	this.domNode.className="setting";
	this.domNode.style.display="none";//初始為隱藏.
	if(x)this.domNode.style.left=x; if(y)this.domNode.style.top=y;
	if(w)this.domNode.style.width=w;if(h)this.domNode.style.height=h;

	this.title=dc.createElement("span");
	this.title.style.verticalAlign="middle";	
	this.domNode.appendChild(this.title);
	
	this.btnClose=dc.createElement("input");
	this.btnClose.type="button";
	this.btnClose.className="closeButton";
	this.btnClose.onclick=function(){inst.show(false);}
	this.domNode.appendChild(this.btnClose);
	
	this.bmppath=document.createElement("input");
	this.bmppath.type="text";
//	this.bmppath.readOnly=true;
//	this.bmppath.onclick=function(){
//		if(g_st_cannotConnect)
//			g_bmpsavepath = g_ocx.SnapShot("","");//按下input直接開dialog選path.		
//	}
	this.bmppath.style.width="100%";
	
	this.vdopath=document.createElement("input");
	this.vdopath.type="text";
	
	this.mode=0;
	this.btnType=new Array(3);
	this.btnType[0]=document.createElement("<input type='radio' name='selType' checked ></input>");
	this.btnType[0].value=0;
	this.btnType[1]=document.createElement("<input type='radio' name='selType' ></input>");
	this.btnType[1].value=1;
	this.btnType[2]=document.createElement("<input type='radio' name='selType' ></input>");
	this.btnType[2].value=2;
	this.setBtnTypeCk();
	
	this.tab=new Table(this.domNode);
	this.tab.domNode.className="settingtab";
	this.tab.domNode.border=1;//test
	this.tab.newRow();
	this.tab.addData(g_langStr["IDS_BMPPATH"]).style.width="30%";
	this.tab.addData().appendChild(this.bmppath);//快照路徑.
/*	this.tab.newRow();
	this.tab.addData(g_langStr["IDS_VDOSAVEPATH"]);
	this.tab.addData().appendChild(this.vdopath);//影像路徑.
	this.tab.newRow();
	this.tab.addData(g_langStr["IDS_VDOSAVETYPE"]);//儲存方式.
	var td=this.tab.addData();
	td.appendChild(this.btnType[0]);addSp(td,g_langStr["IDS_ONLYPLAY"]);
	td.appendChild(this.btnType[1]);addSp(td,g_langStr["IDS_ONLYSAVE"]);
	td.appendChild(this.btnType[2]);addSp(td,g_langStr["IDS_PLAYSAVE"]);
*/
	var txsvr=document.getElementById("svdoratio");
	var selvr=document.getElementById("selvr");
	this.tab.newRow();
	this.tab.addData().appendChild(txsvr);
		txsvr.style.display="inline-block";
		txsvr.innerHTML = g_langStr["IDS_RATIO"];
	this.tab.addData().appendChild(selvr);//選擇比例.
		selvr.style.display="inline-block";
		selvr.style.width="100%";
	this.isRep=document.createElement("input");
	this.isRep.type="checkbox";
	this.isRep.checked=false;	
/*	this.tab.newRow();
	var td=this.tab.addData();
	td.colSpan=2;td.appendChild(this.isRep);//重複播放.
	addSp(td,g_langStr["IDS_REPPLAY"]);
*/	
		
	this.saveBtn=document.createElement("input");
	this.saveBtn.type="button";
	this.saveBtn.value=g_langStr["IDS_SAVESETTING"];
	this.domNode.appendChild(this.saveBtn);
	this.setSaveBtnCk();
			
	this.title.style.color="white";
//	this.setDraggable();
}
//設定頁show/hide.
function settingShow(b)
{
	this.bmppath.value=g_bmpsavepath;
	this.vdopath.value=g_vdosavepath;
	this.btnType[g_mode].checked=true;
	
	if(b||b==undefined)
		this.domNode.style.display="inline-block";
	else
		this.domNode.style.display="none";
}
//設定儲存按鈕按下後將緩衝區值設為設定值.
function setSaveBtnCk()
{
	var inst=this;
	this.saveBtn.onclick=function(){
		g_bmpsavepath = inst.bmppath.value;
		g_vdosavepath = inst.vdopath.value;
		g_mode = inst.mode;
		g_rep = inst.isRep.checked?1:0;
//		inst.vdopath.value = g_vdosavepath = g_ocx.VideoRecordSetting(g_vdosavepath,g_mode);
		g_setting.show(false);
	}
}
//設定RadioButton按下後設定儲存類型(mode).
function setBtnTypeCk()
{
	var inst=this;
	var func=function(){
		inst.mode = this.value;
	}
	for(var i in this.btnType)
		this.btnType[i].onclick=func;
}

//設定頁設定位置.
function setPosition(x,y)
{
	if(!x)x=10;if(!y)y=10;
	this.domNode.style.left=x;
	this.domNode.style.top=y;
}
  
//設定頁設定可拖曳.
function settingSetDraggable(b)
{
	var evt;
	var inst=this;
	var yes=b||b==undefined;
	this.domNode.onmousedown=(yes)?function(event){
		inst.mdown=true;
		evt=(window.event)?window.event:event;
		inst.px=evt.clientX-inst.x;
		inst.py=evt.clientY-inst.y;
	}:null;
	
	this.domNode.onmousemove=
	this.domNode.onmouseover=(yes)?function(event){
		if(inst.mdown){
			evt=(window.event)?window.event:event;
			inst.x=inst.domNode.style.left=evt.clientX-inst.px;
			inst.y=inst.domNode.style.top=evt.clientY-inst.py;			
		}
	}:null;
	
	this.domNode.onmouseup=(yes)?function(event){
		evt=(window.event)?window.event:event;
		inst.x=inst.domNode.style.left=evt.clientX-inst.px;
		inst.y=inst.domNode.style.top=evt.clientY-inst.py;			
		inst.mdown=false;
	}:null;
	
	this.domNode.onclick=(yes)?function(event){
		inst.mdown=false;
	}:null;
}