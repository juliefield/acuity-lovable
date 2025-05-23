<%@ Page Language="C#" AutoEventWireup="true" CodeFile="debugqtip.aspx.cs" ValidateRequest="false" Inherits="jq_debugqtip" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>debug qtip</title>

    <!--[if IE 8]>    <html lang="en-us" class="isie8"> <![endif]-->
    <!--[if gt IE 8]>    <html lang="en-us" class="isgtie8"> <![endif]-->

    <asp:PlaceHolder runat="server">
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.3.2.min.js"></script>
 
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.qtip-1.0.0-rc3.min.js" type="text/javascript"></script>
				
</asp:PlaceHolder>
	</head>
<body>
<form id="form1" runat="server">
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    <div  id="daterange">daterange</div>
    <div><span id="StgDashboard">dashboard</span></div>
    
</form>

<script type="text/javascript">

    $(document).ready(function () {
        alert("debug:here");

        var sbqtip = {
            position: {
                corner: {
                    tooltip: 'leftMiddle',
                    target: 'rightMiddle'
                }
            },
            show: 'mouseover',
            hide: 'mouseout',
            style: {
                border: {
                    width: 5,
                    radius: 10
                },
                padding: 10,
                textAlign: 'center',
                tip: true, // Give it a speech bubble tip with automatic corner detection
                name: 'cream' // Style it according to the preset 'cream' style
            }
        };
        $('#daterange').qtip($.extend({},{ content: 'Slide to select a range of dates for the trend report.'}));
        $("#StgDashboard").qtip($.extend({},sbqtip, {
            content: 'Choose Dashboard Filter.',
            position: {
                corner: {
                    tooltip: 'leftMiddle',
                    target: 'rightMiddle'
                }
            }
        }));


    });
    </script>
	</body>
</html>
