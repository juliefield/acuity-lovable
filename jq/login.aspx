<%@ Page Language="VB" AutoEventWireup="false" CodeFile="login.aspx.vb" ValidateRequest="false" Inherits="jq_Dashboard" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>Acuity&trade; Login</title>

    <asp:PlaceHolder runat="server">
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/js/jquery-1.6.2.min.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
        <script type="text/javascript" src="../appLib/js/appLib-1.1.15.js"></script>
	</asp:PlaceHolder>
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
		<!-- FAVICON-->
			<link rel="apple-touch-icon" sizes="57x57" href="../images/favicon/apple-icon-57x57.png">
			<link rel="apple-touch-icon" sizes="60x60" href="../images/favicon/apple-icon-60x60.png">
			<link rel="apple-touch-icon" sizes="72x72" href="../images/favicon/apple-icon-72x72.png">
			<link rel="apple-touch-icon" sizes="76x76" href="../images/favicon/apple-icon-76x76.png">
			<link rel="apple-touch-icon" sizes="114x114" href="../images/favicon/apple-icon-114x114.png">
			<link rel="apple-touch-icon" sizes="120x120" href="../images/favicon/apple-icon-120x120.png">
			<link rel="apple-touch-icon" sizes="144x144" href="../images/favicon/apple-icon-144x144.png">
			<link rel="apple-touch-icon" sizes="152x152" href="../images/favicon/apple-icon-152x152.png">
			<link rel="apple-touch-icon" sizes="180x180" href="../images/favicon/apple-icon-180x180.png">
			<link rel="icon" type="image/png" sizes="192x192"  href="../images/favicon/android-icon-192x192.png">
			<link rel="icon" type="image/png" sizes="32x32" href="../images/favicon/favicon-32x32.png">
			<link rel="icon" type="image/png" sizes="96x96" href="../images/favicon/favicon-96x96.png">
			<link rel="icon" type="image/png" sizes="16x16" href="../images/favicon/favicon-16x16.png">
			<link rel="manifest" href="../images/favicon/manifest.json">
			<meta name="msapplication-TileColor" content="#ffffff">
			<meta name="msapplication-TileImage" content="../images/favicon/ms-icon-144x144.png">
			<meta name="theme-color" content="#ffffff">
		<!-- END FAVICON-->
        <link href='ACUITY/css/styles.css' rel='stylesheet' />
        <link href='ACUITY/css/sectionboxes.css' rel='stylesheet' />

	</head>
<body id="Dashboard" style="position:relative;" runat="server">
<form id="form1" runat="server">
 <div id="container">
   <!--#include file="inc_tp1loginhead.aspx"-->
    <div id="loginboxes" style="margin-left: 15px;">
        <div id="divServerSideError" runat="server" style="display:none;color:Red;">Invalid Login, Please Try Again.</div>
		<h5>Welcome to the Client Portal - Please log in.</h5>
        <div id="loginform" runat="server">
            <label>Username: </label>
            <input type="text" name="username" style="width:150px;" />
            <br />
            <label>Password: </label>
            <input type="password" name="password" style="width:150px;" />
            <br />
            <input type="submit" id="login" name="login" value="log in" />
     
            <a href="NewUser.aspx">New User</a>
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
        if (a$.gup("inframe") != "") {
            $("#container").addClass("Acuity-Inframe");
        }
        if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.")) {
            $("#brandingLogo h1").css('background-image', 'url("ACUITY/data/chime-header-logo.svg")');
            $("#header_ul li a").css("background-color", "green");
        }
    });

</script>
	</body>
</html>
