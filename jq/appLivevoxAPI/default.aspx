<%@ Page Language="C#"  AutoEventWireup="true" CodeFile="default.aspx.cs" EnableTheming="false" StylesheetTheme="AcuityMV" Theme="" ValidateRequest="false" Inherits="appHelloWorld_default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="head" runat="server">
    <title>Hello World!</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />

<asp:PlaceHolder runat="server">

    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>modal/css/modal.css"  />

    <script type="text/javascript" src="../<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
    <script src="../<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>

    <script type="text/javascript" src="../<%=CONFMGR.AppSettings("jslib").ToString()%>modal/js/modal.js"></script>

    <script type="text/javascript" src="../../appLib/js/applib-1.1.15.js"></script> 

</asp:PlaceHolder>

</head>
<body>
    <h1>Livevox Test</h1>

<script language="javascript">
    $.ajax({
        url: 'https://api.livevox.com/compliance/dnc/session/login',
        type: 'POST',
        dataType: 'json',
        crossDomain: true,
        contentType: "application/json",
        accepts: "application/json",
        cache: false,
        beforeSend: function (request) {
            request.setRequestHeader("LV-Access", "de890b5a9a8ebe343e2967a16115de5e0000");
            //request.setRequestHeader("Content-Type", "application/json");
        },
        data: { clientName: "FROSTARNETT", userName: "Vendor_Login", password: "christmas02" },
        /*
        headers: {
        //WRITE IF THEIR HAVE SOME HEADER REQUEST OR DATA
        },
        */
        success: function (data, textStatus, xhr) {
            alert("SUCCESS: " + data);
            console.log(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("ERROR: " + xhr.status);
            console.log(errorThrown);
        }
    });    
</script>

</body>
</html>