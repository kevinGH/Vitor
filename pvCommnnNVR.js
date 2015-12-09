function NewXmlHttpRequest() {
     var httpRequest = null;
	if( window.XMLHttpRequest ) httpRequest = new XMLHttpRequest(); // for IE7+,safari,chrome,ff,ect.
	else httpRequest = new ActiveXObject("Microsoft.XMLHTTP"); //for IE6- ;
    return httpRequest;
}

function getURLParam()
{
	var param = document.URL.split("?");
	if( param.length<=1 ) return new Object();
	param = param[1].split("&");
	var g=new Object();
	for(var i in param)
	{
		g[param[i].split("=")[0]] = param[i].split("=")[1];
	}
	return g;
}

function isMobile()
{
	if( navigator.userAgent.match(/(iPhone)|(android)|(iPod)|(webOS)|(blackberry)/i) )
		return true;
	else return false;
}

function addSp(obj,text)
{
	var sp=document.createElement("span");
	sp.innerHTML=text;
	obj.appendChild(sp);
	return sp;
}

function clearChildNode(pnode)
{
	var next_node = pnode.firstChild;
	while(next_node)
	{
		var node=next_node;
		next_node=node.nextSibling;
		clearChildNode(node);//exhausively remove.
		pnode.removeChild(node);
		delete node;
	}
}

function objJoin(obj1,obj2)
{
	for(var i in obj2)
		obj1[i]=obj2[i];
	return obj1;
}

function setCookieExp(key,val,exp)
{
	var d=new Date();
	if(exp)d.setTime(d.getTime()+exp);
	document.cookie=key+"="+val+";expires="+d.toGMTString();

}

function getCookies()
{
	var ck=document.cookie.split(";");
	var ckv=new Object();
	for(var i in ck)
		ckv[ ck[i].split("=")[0].replace(" ","") ] = ck[i].split("=")[1];
	return ckv;
}

function saveCookies(ckv,exp)
{
	var d=new Date();
	for(var i in ckv){
		var cook=i+"="+ckv[i]+";";
		if(exp){d.setTime(d.getTime()+exp);cook+="expires="+d.toGMTString()};
		document.cookie=cook;
	}
}

//¼Æ¦r«e¸É¹s.
function paddingLeft(str,len,s){
	if(!s)s="0";
	if(str.length >= len)
	return str;
	else
	return paddingLeft(s+str,len);
}

var dc=document;

function Table(container)
{
	this.domNode = dc.createElement("table");
	this.tb=dc.createElement("tbody");
	if(container)container.appendChild(this.domNode);
	this.domNode.appendChild(this.tb);
}

Table.prototype.setHeader=function()
{
	if(arguments.length == 0)return;
	this.newRow();
	for(var i=0;i<arguments.length;i++)
	{
		var th=dc.createElement("th");
		this.tr.appendChild(th);
		th.innerHTML = arguments[i];
	}
	return this.tr;
}

Table.prototype.newRow=function()
{
	this.tr=dc.createElement("tr");
	this.tb.appendChild(this.tr);
	return this.tr;
}

Table.prototype.addData=function(data,tr)
{
	if(!this.tr)this.newRow();
	if(!tr)tr=this.tr;
	var td=dc.createElement("td");
	tr.appendChild(td);
	if(data)td.innerHTML=data;
	return td;
}

function sleep(ms)
{
	var dt = new Date();
	dt.setTime(dt.getTime() + ms);
	while (new Date().getTime() < dt.getTime());
}

function wait(b,timeout)
{
	var dt=new Date();
	dt.setTime(dt.getTime() + timeout);
	while (new Date().getTime() < dt.getTime())
		if(b)break;	
}

function slideShow(b,dir,time,reso,w,orgw)
{
	if(!dir)dir="L";
	if(!time)time=1000;
	if(!reso)reso=100;
	if(!orgw)orgw = this.domNode.style.width;
	
	var intev=time/reso;
	var iw=orgw/reso;
	
	if(b||b==undefined)
	{
		var nextWidth = w+iw;
		this.domNode.style.display="inline-block";
		this.domNode.style.width = nextWidth;
		setTimeout(this.slideShow(b,dir,time,reso,nextWidth,orgw),intev);
	}else
	{
		var nextWidth = orgw-iw;
		this.domNode.style.width = nextWidth;
		setTimeout(this.slideShow(b,dir,time,reso,nextWidth,orgw),intev);
	}
}

var g_cookies=getCookies();

var g_isMobile=isMobile();

var g_httpReq=NewXmlHttpRequest();
var g_urlParam=getURLParam();

var lang;
if(navigator.appName=="Microsoft Internet Explorer")
	lang=navigator.browserLanguage;
else
	lang=navigator.language;
		  
lang=lang.toLowerCase();

var supportLang={"en":1,"zh-tw":1};
if(lang=="en-us")lang="en";

if(!supportLang[lang])lang="en";

var g_langStr = new Object();