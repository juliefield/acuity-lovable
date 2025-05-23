<%@ Page Language="VB" AutoEventWireup="true" CodeFile="KillCred.aspx.vb" ValidateRequest="false" Inherits="KillCred" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head id="Head1" runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1" />
    <title>apmr Kill</title>

    <!--[if IE 8]>    <html lang="en-us" class="isie8"> <![endif]-->
    <!--[if gt IE 8]>    <html lang="en-us" class="isgtie8"> <![endif]-->

    <asp:PlaceHolder runat="server">
    	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>raphael/raphael-2.1.0.js"></script>
       <script type="text/javascript" src="../appLib/js/applib-1.1.15.js?r=2"></script>

</asp:PlaceHolder>

	</head>
<body id="Body1" style="overflow:visible;" runat="server">

<form id="form2" runat="server">
</form>

<script type="text/javascript">

    $(document).ready(function () {
        alert("Credentials are: uid: " + $.cookie("uid") + ", username: " + $.cookie("TP1Username"));
        a$.ajax({ type: 'POST', service: 'JScript', async: true, data: { lib: 'public', cmd: 'killCred', token: $.cookie("uid") }, dataType: 'json', cache: false, error: a$.ajaxerror,
          success: function (json) {
            if (json.killed) {
                $.cookie("uid", "");
                $.cookie("TP1Username", "");
                $.cookie("username", "");
                alert("Kill Successful");
            }
            else {
                alert("Kill Failed");
            }
          } 
        });
    });
</script>
	</body>
</html>
