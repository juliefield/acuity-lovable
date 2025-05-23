<%@ Page Language="VB" AutoEventWireup="false" CodeFile="PageAuth.aspx.vb" Inherits="three_PageAuth" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <asp:PlaceHolder runat="server">
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib_dev").ToString%>jquery-ui/js/jquery-1.6.2.min.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib_dev").ToString%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib_dev").ToString%>appLib/js/appLib.js"></script>
	</asp:PlaceHolder>			
</head>
<body>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
