<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ChatAlert.aspx.cs" ValidateRequest="false" Inherits="_ChatAlert" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>
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
        <div class="heading" style="margin-left:0px;"></div>
        <div id="loginform" style="position:absolute;top:5px;right:20px; text-align:right;"  runat="server">
          <form id="login" style="font-size: 10px;" action="#">
            <!-- <span style="padding-right: 30px;font-size:12px;"><b>Log in here (most commands require it) :</b></span> -->
            <div id="logindiv">
                <div style="float:left;">
                    <label>Username:&nbsp;</label><input class="loginfield" type="text" id="usernameID" name="F:username/R:nonblank:0" /><br />
                    <label>Password:&nbsp;</label><input class="loginfield" type="password" id="passwordID" name="F:password/R:nonblank:1" />
                </div>
                <span id="loginfv" class="validation"></span><input type="button" onclick="$('#loginfv').css('display','none');if (appLib.validateform({formid:'loginform',errdiv:'loginfv'})) appLib.login({redirect: false,errdiv:'loginfv',uid:'usernameID',pid:'passwordID',product:'Acuity', service: $('input[name=Service]:checked', '#serviceselect').val() });" value="log in" />
            </div>
            <div id="welcomelabel" style="margin-top:20px;">Welcome</span> <span id="header_userID_lbl"></div>
          </form>
        </div>
    </div>
    <div id="appdiv" class="content">
        Chat Notification
    </div>
  <script type="text/javascript" language="javascript">

      $(document).ready(function () {
          if ($.cookie("username") != '') {
              $("#logindiv").hide();
              $("#header_userID_lbl").html($.cookie("username"));
          }
          alert("Acuity: Incoming Chat Message\n\nFrom: " + a$.gup("from") + '\nMessage: "' + a$.gup("msg") + '"');
          window.close();
          //a$.ajax({ type: 'GET', async: true, data: { lib: "cleanup", cmd: "getstats" }, service: "JScript", dataType: "json", cache: false, error: a$.ajaxerror, success: showstats });
      });

    var st;
    var curindex = 0;
    function showstats(json) {
        if (a$.jsonerror(json)) {
        }
        else {
            st = json;
        }
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }
  </script>
</body>
</html>