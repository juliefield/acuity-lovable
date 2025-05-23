<%@ Page Language="C#" AutoEventWireup="true" CodeFile="cfnotifier.aspx.cs" ValidateRequest="false" Inherits="jq_cfnotifier" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <title>Acuity&trade; 2.0 Notifier Frame</title>

    <!--[if IE 8]>    <html lang="en-us" class="isie8"> <![endif]-->
    <!--[if gt IE 8]>    <html lang="en-us" class="isgtie8"> <![endif]-->

    <asp:PlaceHolder runat="server">
    	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <!--<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>-->
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
 
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>raphael/raphael-2.1.0.js"></script>        
        <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>
</asp:PlaceHolder>
	</head>
<body id="cfnotifier" style="position:relative;" runat="server">
<script language="javascript">
    function notify() {
        var havePermission = window.webkitNotifications.checkPermission();
        if (havePermission == 0) {
            // 0 is PERMISSION_ALLOWED
            var notification = window.webkitNotifications.createNotification(
      'http://i.stack.imgur.com/dmHl0.png',
      'Chrome notification!',
      'Here is the notification text'
    );

            notification.onclick = function () {
                window.open("http://stackoverflow.com/a/13328397/1269037");
                notification.close();
            }
            notification.show();
        } else {
            window.webkitNotifications.requestPermission();
        }
    }  
</script>

<div style="width: 100px; height: 100px; background: green" onclick="notify()">
Cick here to notify
</div>

	</body>
</html>
