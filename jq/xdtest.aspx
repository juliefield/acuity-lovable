<%@ Page Language="C#" AutoEventWireup="true" CodeFile="xdtest.aspx.cs" ValidateRequest="false" Inherits="_xdtest" %>

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
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.xdomainajax.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>
</asp:PlaceHolder>
<style type="text/css">
.loginfield { width: 100px; }
.validation { color: Black; }
</style>
</head>
<body id="CC_HOME" runat="server" style="position: relative;margin:0;padding:0;">
    <div id="in1"></div>
    <div><input type="button" onclick="appLib.ajax({type:'GET',async:true,data:{cmd:'chatstats', lib:'chat'},service:'JScript',dataType: 'json',error:appLib.ajaxerror,success:function(json) { dump(json);/*appLib.jsonerror(json)*/ } })" value="Run Test" /></div>
    <div><input type="button" onclick="appLib.ajax({type:'GET',async:true,data:{cmd:'chatstats', lib:'chat'},service:'JScript',dataType: 'json',error:appLib.ajaxerror,success:function(json) { alert('debug:back'); dump(json);/*appLib.jsonerror(json)*/ } }, 'http://ers.acuityapmr.com')" value="Run Test (Cross Domain)" /></div>
    <div><input type="button" onclick="appLib.ajax({type:'GET',async:true,data:{cmd:'chatstats', lib:'chat'},service:'JScript',dataType: 'json',error:appLib.ajaxerror,success:function(json) { alert('debug:back'); dump(json);/*appLib.jsonerror(json)*/ } }, 'http://localhost:55760/dev.acuityapmr.com')" value="Run Test (Localhost Cross Domain)" /></div>
    <div><input type="button" onclick="appLib.ajax({type:'GET',async:true,data:{cmd:'chatstats', lib:'chat'},service:'NodeJS',dataType: 'json',error:appLib.ajaxerror,success:function(json) { alert('debug:back'); dump(json);/*appLib.jsonerror(json)*/ } }, 'http://localhost:64000/dev.acuityapmr.com')" value="Run Test (Cross Domain - NodeJS)" /></div>
</body>
  <script type="text/javascript" language="javascript">
      appLib.ajaxTrace.active = true;
      appLib.ajaxTrace.outdiv = 'out1';
      appLib.ajaxTrace.indiv = 'in1';
      appLib.ajaxTrace.defeatCallback = true;
  </script>
</html>