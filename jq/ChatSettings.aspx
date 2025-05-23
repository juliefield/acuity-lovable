<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ChatSettings.aspx.vb" ValidateRequest="false" Inherits="jq_ChatSettings" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="chrome=1" />
    <title>Acuity Notifier - LEAVE OPEN!</title>
    <asp:PlaceHolder runat="server">
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jquery-1.7.2.min.js"></script>
    </asp:PlaceHolder>
</head>
<body>
  <form id="form1" runat="server"></form>
  <p><img src="appApmClient/themes/default/images/Acuity.png" /></p>
  <p style="font-size:24px">Chat &amp; Message Notifier</p>
  <p>You can minimize this window, but <b>please leave it open!</b></p>

<script type="text/javascript">
    $(document).ready(function () {
        notify();
    });

    function notify() {
        var havePermission = window.webkitNotifications.checkPermission();
        if (havePermission == 0) {
            // 0 is PERMISSION_ALLOWED
            var notification = window.webkitNotifications.createNotification(
                'appApmClient/themes/default/images/AcuityEmblem.png',
                'Acuity Message & Chat',
                'Notificatons are active!'
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
</body>
</html>
