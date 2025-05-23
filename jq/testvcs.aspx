<%@ Page Language="C#" AutoEventWireup="true" CodeFile="testvcs.aspx.cs" Inherits="jq_testvcs" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
        <asp:DropDownList ID="ddlTest" runat="server" 
            onselectedindexchanged="ddlTest_OnSelectedIndexChanged" AutoPostBack="true">
            <asp:ListItem Text="Item 1" Value="item1" />
            <asp:ListItem Text="Item 2" Value="item2" />
        </asp:DropDownList>
    </div>
    <div>
        <div id="divPrompt" runat="server"></div>
    </div>
    </form>
</body>
</html>
