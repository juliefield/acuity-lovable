<%@ Page Title="Acuity Authentication" Language="VB" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
</head>
<body id="Body1" runat="server">
    <h2>
        Acuity Authentication
    </h2>
    <p>
        <form runat="server">
            <div class="formgroup">
                <label>Domain:</label><asp:TextBox id="txtDomain" Text="KM2Solutions" runat="server" />
            </div>
            <div class="formgroup">
                <label>Username:</label><asp:TextBox id="txtUsername" runat="server" />
            </div>
            <div class="formgroup">
                <label>Password:</label><asp:TextBox TextMode="Password" id="txtPassword" runat="server" />
            </div>
            <input type="submit" value="Submit" />
        </form>
    </p>
    <p>
        <asp:label ID="lblSuccessMessage" runat="server"></asp:label>
        <asp:label ID="lblFailureMessage" style="color:Red;" runat="server"></asp:label>
    </p>
</body>