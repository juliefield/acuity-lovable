<%@ Page Language="VB" AutoEventWireup="false" CodeFile="login.aspx.vb" ValidateRequest="false" Inherits="three_Dashboard" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>Acuity&trade; Login</title>
		
    <asp:PlaceHolder runat="server">
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery-ui/js/jquery-1.6.2.min.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
        <script type="text/javascript" src="../appLib/js/appLib.js"></script>
	</asp:PlaceHolder>			
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
        <link href='ACUITY/css/styles.css' rel='stylesheet' />

	</head>
<body id="Dashboard" style="position:relative;" runat="server">
<form id="form1" runat="server">
 <div id="container">
    <div id="loginboxes" style="margin-left: 15px;">
        <div id="divServerSideError" runat="server" style="display:none;color:Red;">Invalid Login, Please Try Again.</div>
        <div id="loginform" runat="server">
            <label>Username: </label>
            <input type="text" name="username" style="width:150px;" />
            <br />
            <label>Password: </label>
            <input type="password" name="password" style="width:150px;" />
            <br />
            <input type="submit" id="login" name="login" value="log in" />
        </div>
    </div>
</div>
<div id="NavConfig" style="display:none;" runat="server"></div>
</form>

<script type="text/javascript" src="TOUCHPOINT/js/TouchpointInterface-2.2.js"></script>
<script type="text/javascript">
    $(window).resize(function () {
        //if (uiInterface) uiInterface.sizebars();
    });
    $(document).ready(function () {
        if (a$.gup("drone") != "") {
            $("#login").click();
        }
        if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.")) {
            $("#brandingLogo h1").css('background-image', 'url("ACUITY/data/chime-header-logo.svg")');
            $("#header_ul li a").css("background-color", "green");
        }
    });

</script>
	</body>
</html>
