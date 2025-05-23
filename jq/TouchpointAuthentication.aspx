<%@ Page Language="VB" AutoEventWireup="false" CodeFile="TouchpointAuthentication.aspx.vb" Inherits="jq_TouchpointAuthentication" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <asp:PlaceHolder runat="server">
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/js/jquery-1.6.2.min.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
	</asp:PlaceHolder>			
</head>
<body>
    <form id="form1" runat="server">
    <div>
    </div>
    </form>
</body>
</html>
