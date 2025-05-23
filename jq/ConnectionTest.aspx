<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ConnectionTest.aspx.cs" ValidateRequest="false" Inherits="_ConnectionTest" %>

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
<body id="CC_HOME" runat="server">
    <div style="position:relative;height: 120px;">
        <div class="logo"></div>
    </div>
    <form>
        <div style="margin-left: 10px;">
            <p>
                <b>"GET" Test Ping:&nbsp;</b><input type="button" class="gettest" value="Go" />&nbsp;&nbsp;<span class="getoutput"></span>
            </p>
            <p>
                <b>"POST" Test Ping:&nbsp;</b><input type="button" class="posttest" value="Go" />&nbsp;&nbsp;<span class="postoutput"></span>
            </p>
            <div class="alertbox"></div>
        </div>
    </form>

<script language="javascript">
    $(document).ready(function () {
        //alert = function (a) { $(".alertbox").html("Alert Received: " + a); };
        //alert("debug:alerttest");
        $(".gettest").bind("click", function () {
            $(".getoutput").html("Sending...");
            $.ajax({
                type: "GET", url: "../jshandler.ashx", async: false, data: { cmd: 'ping' }, dataType: "json", cache: false,
                error: function () { alert("GET Error") }, success: function (json) { $(".getoutput").html("Received from GET request: <b>" + json.msg + "</b>"); }
            });
        });
        $(".posttest").bind("click", function () {
            $(".postoutput").html("Sending...");
            $.ajax({
                type: "POST", url: "../jshandler.ashx", async: false, data: { cmd: 'ping' }, dataType: "json", cache: false,
                error: function () { alert("POST Error") }, success: function (json) { $(".postoutput").html("Received from POST request: <b>" + json.msg + "</b>"); }
            });
        });
    });
</script>

</body>
</html>