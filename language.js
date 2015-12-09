// JavaScript Document
var g_languageUrl;
var g_curLanguage;

function IncludeJavaScript(jsFile)
{                
	document.write("<script type=\"text/javascript\" src=\""+jsFile+"\"></script>");
}
	
//init 語言
function InitLanguage(lang)
{       
	//var lang;
	language = lang;

	//language=GetIpCameraLanguage();
	if(language==0)
		IncludeJavaScript('js/english.js');
	else if(language==1)
		IncludeJavaScript('js/taiwan.js');
	else if(language==2)
		IncludeJavaScript('js/china.js');
	else if(language==3)
		IncludeJavaScript('js/french.js');
	else if(language==4)
		IncludeJavaScript('js/germany.js');
	else if(language==5)
		IncludeJavaScript('js/italy.js');
	else if(language==6)
		IncludeJavaScript('js/japan.js');
	else if(language==7)
		IncludeJavaScript('js/spanish.js');
	else if(language==8)
		IncludeJavaScript('js/russia.js');	
}

//InitLanguage(1);

function LoadString(id)
{
	return g_langStr[id]?g_langStr[id]:"No String";
}

function LoadTextOut(id) 
{ 
  document.write(LoadString(id));
}

function LoadTextOut2(id) 
{
  return LoadString(id);  
}

function  LoadTextOut3(id)
{ 
   var tagText = {"1":"IDC_VERSION",
                  "2":"IDC_SERVER_CH",
                  "3":"IDC_SERVER_IP",
                  "4":"IDC_SERVER_USER",
                  "5":"IDC_SERVER_VIDEO",
                  "6":"IDC_SERVER_WIDTH",
                  "7":"IDC_SERVER_HEIGHT",
                  "8":"IDC_CONNECT_STATUS",
                  "9":"IDC_CONNECT_TYPE",
                  "10":"IDC_ALARM_EVENT",
                  "11":"IDC_ALARM_MOTION",
                  "12":"IDC_ALARM_IO",
                  "13":"IDC_ALARM_VIDEOLOSE",
                  "14":"IDC_NO_ALARM"};
   var retStr="";          
   var endID=id.indexOf("!",0);    
   try{
    	for(var i in tagText)
    	{
        var startID=id.indexOf(tagText[i],0);
        var stopID=id.indexOf("&",startID);
        
        if(stopID == -1)
            break;
            
        var Out1=id.substring(startID,stopID);
        
        if(tagText[i]=="IDC_SERVER_WIDTH" || tagText[i]=="IDC_SERVER_HEIGHT")
		          retStr+=LoadString(Out1);
        else
		          retStr+="<br>"+LoadString(Out1);
	      id=id.substring(stopID+1,endID);
	      stopID=id.indexOf(";",0);
	      retStr+=id.substring(0,stopID);
	      id=id.substring(stopID+1,endID);
      }

   }
   catch(e)
   {
      /*CGI*/
   }
	 return retStr;
}

function checklogin()
{
	if( !document.webclient.RemoteConnect(document.URL.split("?")[0],document.getElementById("user").value,document.getElementById("pwd").value,document.getElementById("port").value,0,1,2,0,0) )
		alert("Invalid user/password/port!");
	else
		fm1.submit();
}
function setCookie(c_name,value,expiredays)   // c_name: cookie name, value: cookie value, expiredays: cookie 有效天數 
{
  var exdate=new Date()                        // 宣告 exdate
  exdate.setDate(exdate.getDate()+expiredays)  // 將 exdate 設成今天加上過期天數
  document.cookie=c_name+ "=" +escape(value)+  // 產生 cookie 內容  c_name=escape(value);expires=exdate
  ((!expiredays) ? "" : ";expires="+exdate)
}

function getCookie(c_name)
{
   if (document.cookie.length>0)
  {
     var c_list = document.cookie.split("\;");
	   for ( i in c_list )
	   {
	      var cook = c_list[i].split("=");
		    if ( cook[0] == c_name )
		    {
		       return unescape(cook[1]);
		    }
	   } 
  }
  return null
}

function checkCookie()
{   
    g_curLanguage = getCookie("g_curLanguage");
	
	if(!g_curLanguage)
	{
		var langCode={"en":0,"zh-tw":1,"cn":2,"fr":3,"ge":4,"it":5,"jp":6,"sp":7,"ra":8,undefined:0};
			
		if(navigator.appName=="Microsoft Internet Explorer")
			g_curLanguage=langCode[navigator.browserLanguage.toLowerCase()];
		else
			g_curLanguage=langCode[navigator.language.toLowerCase()];
		if(!g_curLanguage)g_curLanguage=0;

		setCookie("g_curLanguage",g_curLanguage);
	}
	
  InitLanguage(g_curLanguage); 
}

function SelectLanguage(language)
{
    g_curLanguage =  language;
    setCookie("g_curLanguage",language);
}

function reloadHTML()
{ 
  document.location.reload();
}