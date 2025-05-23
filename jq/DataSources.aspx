<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DataSources.aspx.cs" ValidateRequest="false" Inherits="_DataSources" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>
</asp:PlaceHolder>
<style type="text/css">
</style>
</head>
<body>
    <div class="header gradient-lightest">
        <div class="logo" style="margin-left:0px;"><h1><span>Acuity &reg;</span></h1></div>
        <div class="heading" style="margin-left:0px;">Data Sources</div>
        <div style="position:absolute;top:5px;right:20px; text-align:right;">
          <form id="loginform" action="#">
            <div id="logindiv">
                <div style="float:left;">
                    <label>Username:&nbsp;</label><input class="loginfield" type="text" id="usernameID" name="F:username/R:nonblank:0" /><br />
                    <label>Password:&nbsp;</label><input class="loginfield" type="password" id="passwordID" name="F:password/R:nonblank:1" />
                </div>
                <div style="clear:left;"><input id="loginbutton" type="button" value="log in" /></div>
                <div><span id="loginfv" class="login-validation"></span></div>
            </div>
            <div class="login-welcome" style="margin-top:20px;display:none;">Welcome <span id="header_userID_lbl"></span> <a href='#' onclick="$.cookie('username','');location.reload();" title='Log Out'>Log Out <img style="border-width: 0px;" src="appApmClient/themes/default/images/lock-16.png" /></a>
            </div>
          </form>
        </div>
    </div>
    <div id="appdiv" class="content">
        Please Log In.
    </div>

<script type="text/javascript" language="javascript">
    $(document).ready(function () {
        function loginfmt() {
            if (($.cookie("username") != null) && ($.cookie("username") != "")) {
                $("#logindiv").hide();
                $(".login-welcome").show();
                $("#header_userID_lbl").html($.cookie("username"));
                launch();
            }
        }
        $("#loginbutton").unbind().bind("click", function () {
            $('#loginfv').css('display', 'none');
            if (appLib.validateform({ formid: 'loginform', errdiv: 'loginfv' })) {
                appLib.login({ redirect: false, errdiv: 'loginfv', uid: 'usernameID', pid: 'passwordID', product: 'Acuity', service: "JScript" });
            }
            loginfmt();
        });
        loginfmt();
    });

    function launch() {
        $("#appdiv").html($.cookie("username") + ", role=" + $.cookie("role"));
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }
  </script>
</body>
</html>