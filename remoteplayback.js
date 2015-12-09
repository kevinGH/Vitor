
var g_urlParam = new Object();
var g_playfile = "";
var g_ext = "";

init();

function getURLParam()
{
	var param = document.URL.split("?");
	if( param.length<=1 ) return;
	param = param[1].split("&");
	for(var i in param)
	{
		g_urlParam[param[i].split("=")[0]] = param[i].split("=")[1];
	}
}

function init()
{
	if ( g_urlParam["file"]!=undefined ){ g_playfile = g_urlParam["file"]; alert(g_playfile);}
	pvOcx.HSPlayBackOpenStream(0,0,1);
	pvOcx.HSPlayBackOpenFile(0,g_playfile);
}

function onPlay()
{
	
	var ec = pvOcx.HSPlayBackPlay(0);
	if( ec != 1 )error(ec);
}

function onOpenFile()
{
	pvOcx.HSPlayBackOpenFileDlg(0);
	g_playfile = pvOcx.HSPlayBackGetCurrentFile(0);
	pvOcx.HSPlayBackOpenFile(0,g_playfile);
	filename.innerHTML = g_playfile;
}

//////////////Auxilary functions//////////////

function check() {
  g_ext = document.browsefile.value;
  g_ext = g_ext.substring(g_ext.length-3,g_ext.length);
  g_ext = g_ext.toLowerCase();
  if( g_ext != 'vtk' || g_ext != 'avi' ) {
    alert('Please select VTK/AVI file instead!');
    return false; }
  else
    return true; }
	
function  error(ec)
{
	var eString = {0:"general error",1:"ok",1002:"video must ifram",1003:"version error",
				1004:"stream data error",1005:"port num over",1006:"decode not init",1007:"is init",
				1008:"is not init",1009:"open file failed",1010:"file not open",1011:"avi file not close",
				1012:"avi file not open",1013:"play speed over index"}
	alert(eString[ec]);
}
