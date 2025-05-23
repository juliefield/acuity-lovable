<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ServiceSim.aspx.cs" ValidateRequest="false" Inherits="_ServiceSim" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
  	<link rel="stylesheet" href="appAC2/css/styles.css" type="text/css" />
  	<link rel="stylesheet" href="appAC2/css/site.css" type="text/css" />
<asp:PlaceHolder runat="server">
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>
</asp:PlaceHolder>
<style type="text/css">
.loginfield { width: 100px; }
.validation { color: Black; }
</style>
</head>
<body id="CC_HOME" runat="server" style="position: relative;margin:0;padding:0;width:100%;height:100%;overflow:scroll;">
  <div class="fullbrowser" style="position:relative; height: 90px;">
        <div class="logo">
            <div style="position:absolute; top: 27px; left: 280px;text-align:center;">Ajax<br />Interface</div>
            <div id="ulabel" style="position:absolute; top: 20px; left: 380px;text-align:center;font-size:36px;background-color:Blue;color:White;padding:6px;width:500px;"></div>
        </div>
    <div style="position:absolute;top:5px;right:200px; text-align:left;">
        <form id="serviceselect" style="font-size: 10px;" action="#">
            <label style="font-weight:bold;">Service:</label><br />
            <input type="radio" name="Service" value="C#" checked="checked" />C#
            <input type="radio" name="Service" value="JScript" />JScript
            <input type="radio" name="Service" value="VB" />VB
            <div style="margin-top:3px;">
                CORS: <input type="checkbox" id="extensionselect" onchange="if ($(this).is(':checked')) { $('#prefixfv').css('display','inline') } else { $('#prefixfv').css('display','none') }" value="Yes" />
                <span id="prefixfv" style="display:none;">Prefix: <input type="text" id="corsprefix" style="margin-top:3px;width:50px;" value="" /></span>
            </div>

        </form>
    </div>
    <div id="loginform" style="position:absolute;top:5px;right:20px; text-align:right;"  runat="server">
      <form id="login" style="font-size: 10px;" action="#">
        <!-- <span style="padding-right: 30px;font-size:12px;"><b>Log in here (most commands require it) :</b></span> -->
        <label>Username:&nbsp;</label><input class="loginfield" type="text" id="usernameID" name="F:username/R:nonblank:0" /><br />
        <label>Password:&nbsp;</label><input class="loginfield" type="password" id="passwordID" name="F:password/R:nonblank:1" />
        <div><span id="loginfv" class="validation">Enter username/password.</span><input type="button" onclick="$('#loginfv').css('display','none');if (appLib.validateform({formid:'loginform',errdiv:'loginfv'})) appLib.login({redirect: false,errdiv:'loginfv',uid:'usernameID',pid:'passwordID',product:'Acuity', service: $('input[name=Service]:checked', '#serviceselect').val(), CORS: $('#extensionselect').is(':checked') });" value="log in" />
        </div>
      </form>
    </div>
  </div>
  <div class="bordered" style="clear:both;padding-bottom:15px;padding-left:20px;margin-left:3px;margin-right:3px;">
    <h3 style="margin:0;padding-top: 4px;">Enter command here (json format):</h3>
    <input id="datatext" style="width: 80%;" value="{ cmd: 'help' }" />
    <input type="button"
        style="width: 5%"
        onclick="try { jQuery('#out1').html('');jQuery('#in1').html('');appLib.ajax({type: 'GET', async: true, data: eval('(' + jQuery('#datatext').val() + ')'), dataType: 'json', service: $('input[name=Service]:checked', '#serviceselect').val(), cache: false, error: appLib.ajaxerror, success: function(json) { appLib.jsonerror(json) }, TRACE: jQuery('#datatext').val(),service:$('input[name=Service]:checked', '#serviceselect').val(), CORS: $('#extensionselect').is(':checked') }, $('#extensionselect').is(':checked')? 'https://' + $('#corsprefix').val() + '.acuityapmr.com' : '' ) } catch(e) { alert('Invalid Object: ' + jQuery('#datatext').val() ) };"
        value="Send" />
  </div>
  <div style="margin-top: 10px;clear:left;">
    <div style="margin-left:3px; width: 49.5%; float: left; text-align: center;">
        <div class="bordered" style="text-align:left; width:99%;" >
            <h5 style="text-align:center;margin:0;padding:0">Sent</h5>
            <div id="out1"></div>
        </div>
    </div>
    <div style="width: 49.5%; float: left; text-align: center;">
        <div class="bordered" style="text-align:left; width:99%;">
            <h5 style="text-align:center;margin:0;padding:0">Received</h5>
            <div id="in1"></div>
        </div>
    </div>
  </div>
  <script type="text/javascript" language="javascript">
      appLib.ajaxTrace.active = true;
      appLib.ajaxTrace.outdiv = 'out1';
      appLib.ajaxTrace.indiv = 'in1';
      appLib.ajaxTrace.defeatCallback = true;
      //Added: 10/29/2015
      var u = appLib.urlprefix();
      document.title = u.toUpperCase() + "Ajax";
      var ul = document.getElementById("ulabel");
      ul.innerHTML = u.toUpperCase();      
  </script>
</body>
</html>