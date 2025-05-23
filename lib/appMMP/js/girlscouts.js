//enter mouse (display a submenu)


var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;

/*
 * Author: Rob Reid
 * CreateDate: 20-Mar-09
 * Description: Little helper function to return details about IE 8 and its various compatibility settings either use as it is
 * or incorporate into a browser object. Remember browser sniffing is not the best way to detect user-settings as spoofing is
 * very common so use with caution.
*/
function IEVersion(){
	var _n=navigator,_w=window,_d=document;
	var version="NA";
	var na=_n.userAgent;
	var ieDocMode="NA";
	var ie8BrowserMode="NA";
	// Look for msie and make sure its not opera in disguise
	if(/msie/i.test(na) && (!_w.opera)){
		// also check for spoofers by checking known IE objects
		if(_w.attachEvent && _w.ActiveXObject){		
			// Get version displayed in UA although if its IE 8 running in 7 or compat mode it will appear as 7
			version = (na.match( /.+ie\s([\d.]+)/i ) || [])[1];
			// Its IE 8 pretending to be IE 7 or in compat mode		
			if(parseInt(version)==7){				
				// documentMode is only supported in IE 8 so we know if its here its really IE 8
				if(_d.documentMode){
					version = 8; //reset? change if you need to
					// IE in Compat mode will mention Trident in the useragent
					if(/trident\/\d/i.test(na)){
						ie8BrowserMode = "Compat Mode";
					// if it doesn't then its running in IE 7 mode
					}else{
						ie8BrowserMode = "IE 7 Mode";
					}
				}
			}else if(parseInt(version)==8){
				// IE 8 will always have documentMode available
				if(_d.documentMode){ ie8BrowserMode = "IE 8 Mode";}
			}
			// If we are in IE 8 (any mode) or previous versions of IE we check for the documentMode or compatMode for pre 8 versions			
			ieDocMode = (_d.documentMode) ? _d.documentMode : (_d.compatMode && _d.compatMode=="CSS1Compat") ? 7 : 5;//default to quirkz mode IE5				   			
		}
	}
				 
	return {
		"UserAgent" : na,
		"Version" : version,
		"BrowserMode" : ie8BrowserMode,
		"DocMode": ieDocMode
	}			
}

function isIE(){  return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);}

function mouseX(evt) {
if (evt.pageX) return evt.pageX;
else if (evt.clientX)
   return evt.clientX + (document.documentElement.scrollLeft ?
   document.documentElement.scrollLeft :
   document.body.scrollLeft);
else return null;
}
function mouseY(evt) {
if (evt.pageY) return evt.pageY;
else if (evt.clientY)
   return evt.clientY + (document.documentElement.scrollTop ?
   document.documentElement.scrollTop :
   document.body.scrollTop);
else return null;
}


String.prototype.trim = function() { return this.replace(/^\s+|\s+$/, ''); };

function em(me)
{
    if (me.id!="")
    {
        var pm = document.getElementById(me.id.replace("m_","s_"));
        if (pm != lastsubmenu)
        {
            pm.style.position = 'absolute';
            pm.style.top = getY(me) + 'px';
            pm.style.left = (getX(me) + 161) + 'px';
            pm.style.display='block';
            if (lastsubmenu != null) lastsubmenu.style.display='none';
            lastsubmenu = pm;
            lastsubmenu.onmouseout = function anonymous() { om(); };
        }
    }
    else
    {
        clrmnu();
    }
}

function om(me)
{
    return;
    if (lastsubmenu != null)
    {
    
        if ( (mouseX(event)<getX(lastsubmenu)) || (mouseX(event)>(getX(lastsubmenu)+lastsubmenu.offsetWidth)) || (mouseY(event)<getY(lastsubmenu)) || (mouseY(event)>(getY(lastsubmenu)+lastsubmenu.offsetHeight)) )
        {
            var killit = true;
            if (isIE())
            {
                if (IE6)
                {
                    var pm = document.getElementById("SideMenu");
                    if ( (mouseX(event)<getX(pm)) || (mouseX(event)>(getX(pm)+pm.offsetWidth)) || (mouseY(event)<getY(pm)) || (mouseY(event)>(getY(pm)+pm.offsetHeight)) )
                    {
                        killit=True;
                    }
                    else
                    {
                        killit=False;
                    }
                }
            }
            if (killit)
            {
                clrmnu();
            }
        }
    }
}

function emtop(me)
{
    if (me.id!="")
    {
        var pm = document.getElementById(me.id.replace("m_","s_"));
        if (pm != lastsubmenu)
        {
            var myp = getY(me) + 22;
            myp = myp + "px";
            pm.style.top = myp;
            
            myp = getX(me);
            myp = myp + "px";
            pm.style.left = myp;
            pm.style.display='block';
            if (lastsubmenu != null) lastsubmenu.style.display='none';
            lastsubmenu = pm;
            lastsubmenu.onmouseout = function anonymous() { omtop(); };
        }
    }
    else
    {
        clrmnu();
    }
}

var popupmenu = null;

function clrmnu()
{
    if (lastsubmenu != null) lastsubmenu.style.display='none';
    lastsubmenu = null;
    popdown();
}


function popup(me,pid,cid)
{
    var pm = document.getElementById(pid);
    if (pm != popupmenu) popdown();
    var cm = document.getElementById(cid);
    pm.innerHTML = cm.innerHTML;
    pm.style.position = 'absolute';
    pm.style.top = getY(me) + 'px';
    pm.style.left = (getX(me) + 161) + 'px';
    pm.style.display='block';
    
    popupmenu = pm;   
}

function popdown()
{
    if (popupmenu!=null)
    {
        popupmenu.style.display='none';        
        //popupmenu = null;
    }
}

function omtop(me)
{
    return;
    if (lastsubmenu != null)
    {    
        if ( (mouseX(event)<getX(lastsubmenu)) || (mouseX(event)>(getX(lastsubmenu)+lastsubmenu.offsetWidth)) || (mouseY(event)<getY(lastsubmenu)) || (mouseY(event)>(getY(lastsubmenu)+lastsubmenu.offsetHeight)) )
        {
            var killit = true;
            if (isIE())
            {
                if (IE6)
                {
                    var pm = document.getElementById("headerbar");
                    if ( (mouseX(event)<getX(pm)) || (mouseX(event)>(getX(pm)+pm.offsetWidth)) || (mouseY(event)<getY(pm)) || (mouseY(event)>(getY(pm)+pm.offsetHeight)) )
                    {
                        killit=True;
                    }
                    else
                    {
                        killit=False;
                    }
                }
            }
            if (killit)
            {
                clrmnu();
            }
        }
    }
}

function getY( oElement )
{
var iReturnValue = 0;
while( oElement != null )
{
    if (isIE())
    {
        iReturnValue += oElement.offsetTop;
        oElement = oElement.offsetParent;
    }
    else
    {
        //alert(oElement.offsetTop);
        iReturnValue += oElement.offsetTop; // + oElement.parentNode.offsetTop;
        oElement = oElement.offsetParent;
    }
    //alert("debug:iReturnValue="+iReturnValue);
}
return iReturnValue;
}

function getX( oElement )
{
var iReturnValue = 0;
while( oElement != null ) {
iReturnValue += oElement.offsetLeft;
oElement = oElement.offsetParent;
}
return iReturnValue;
}

function fixheights()
{
    
    var ie = isIE();
    if (isIE())
    {
        if (IEVersion().Version==8)
        {
            if (IEVersion().BrowserMode=="IE 8 Mode")
            {
                ie = false; //If not in compatability mode, treat like a gecko browser.
            }
        }
    }
    
    if (true) //(!isIE())
    {
        var md = document.getElementById("main");
        var fm = document.getElementById("FooterMenu");
        var myy;
        if (ie)
        {
            myy = fm.offsetTop + 50;
        }
        else
        {
            myy = getY(fm) + 50;
        }
        myy =  myy + "px";
        md.style.height = myy;
        
        if (ie)
        {
           if (IE6)
           {
                md.style.width = "1000px";
           }
        }

    }
}

function opmatch(selid,val)
{
    var sel= document.getElementById(selid);
    for (i=0;i<sel.options.length;i++) sel.options[i].selected = false;
    for (i=0;i<sel.options.length;i++)
    {
        if (sel.options[i].value == val)
        {
            sel.options[i].selected = true;
        }
    }
}

function gup( name )
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )    return "";
    else    return results[1];
}

function eid(x)
{
    return document.getElementById(x);
}

function rfd(me)
{
    var i,j;
    //alert("radcnt="+radcnt);
    //alert("restcnt="+restcnt);

    for (i=0;i<radcnt;i++)
    {
        if (!radsel[i])
        {
            var x=document.getElementsByName(radnm[i]);
            for (j=0;j<x.length;j++)
            {
                x[j].parentNode.style.borderWidth="0px";
            }
        }
    }
    for (i=0;i<restcnt;i++)
    {
        //alert("changing...");
        restnd[i].style.borderWidth="0px";
    }
    
    radcnt=0;
    restcnt=0;
    invalid=false;
    rfdrec(document.forms[0],me);
    for (i=0;i<radcnt;i++)
    {
        if (!radsel[i])
        {
            var x=document.getElementsByName(radnm[i]);
            //alert("bad="+radnm[i]);
            for (j=0;j<x.length;j++)
            {
                x[j].parentNode.style.borderWidth="3px";
                x[j].parentNode.style.borderStyle="solid";
                x[j].parentNode.style.borderColor="red";
                invalid=true;
            }
        }
    }
    if (invalid)
    {
        me.value="Red fields are required.  Fix, then click here to resubmit.";
        return false;
    }
    else
    {
        me.value="Submit";
        return true;
    }

}

var radnm = new Array();
var radsel = new Array();
var radcnt = 0;

var restnd = new Array();
var restcnt = 0;
var invalid=false;

function rfdrec(node,me)
{
    var i,j;
    
    var radfnd;
    
    for (i=0;i<node.childNodes.length;i++)
    {
        if (typeof node.childNodes[i].name != "undefined")
        {
            if ((node.childNodes[i].name.substring(0,2) == "R:")||(node.childNodes[i].name == "S:SPAM"))
            {
                if (node.childNodes[i].tagName == "INPUT")
                {
                    //alert('name='+node.childNodes[i].name+',type='+node.childNodes[i].type);
                    if ((node.childNodes[i].type == "text")||(node.childNodes[i].type == "password"))
                    {
                        if (node.childNodes[i].value.trim()=="")
                        {
                            invalid=true;
                            restnd[restcnt]=node.childNodes[i];
                            restcnt++;
                            node.childNodes[i].style.borderWidth="3px";
                            node.childNodes[i].style.borderStyle="solid";
                            node.childNodes[i].style.borderColor="red";
                        }
                    }
                    else if ((node.childNodes[i].type == "radio")||(node.childNodes[i].type == "checkbox"))
                    {
                        radfnd=false;
                        for (j=0;j<radcnt;j++)
                        {
                            if (radnm[j]==node.childNodes[i].name)
                            {
                                radfnd=true;
                                if (!radsel[j])
                                {
                                    radsel[j]=node.childNodes[i].checked;                                   
                                }
                                break;
                            }
                        }
                        if (!radfnd)
                        {
                            radnm[radcnt]=node.childNodes[i].name;
                            radsel[radcnt]=node.childNodes[i].checked;
                            radcnt++;
                        }                            
                        //alert(node.childNodes[i].checked);
                    }
                }
            }
        }
        rfdrec(node.childNodes[i],me);
    }
}

function startCalc()
{
    //do nothing I guess
}

function stopCalc()
{
    var b1 = document.getElementById('dosidos');
    var b2 = document.getElementById('thinmints');
    var b3 = document.getElementById('trefoils');
    var b4 = document.getElementById('dulcedeleche');
    var b5 = document.getElementById('chaletcreme');
    var b6 = document.getElementById('tagalongs');
    var b7 = document.getElementById('samoas');
    var b8 = document.getElementById('berry');
    var b9 = document.getElementById('operationC');
    var ta = document.getElementById('totalamount');
    var tot=0;
    tot+= parseInt("0"+b1.value);
    tot+= parseInt("0"+b2.value);
    tot+= parseInt("0"+b3.value);
    tot+= parseInt("0"+b4.value);
    tot+= parseInt("0"+b5.value);
    tot+= parseInt("0"+b6.value);
    tot+= parseInt("0"+b7.value);
    tot+= parseInt("0"+b8.value);
    tot+= parseInt("0"+b9.value);
    ta.value = tot;
    var md = document.getElementById('moneydue');
    tot = tot * 3.5;
    md.value=tot.toFixed(2);
    
}

function EnterKey(e)
{
    var key;
    if (window.event) key=window.event.keyCode; //IE
    else key=e.which; //firefox
    
    if (key==13) return true;
    return false;
}

var lastsubmenu = null;

