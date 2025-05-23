<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ReportsMenu.aspx.vb" ValidateRequest="false" Inherits="jq_ReportsMenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Reports Menu</title>
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
      	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />	

        <link rel="stylesheet" href="../lib/jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />

        <link rel="stylesheet" type="text/css" media="screen" href="../lib/jquery/jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css"  />
    	<link rel="stylesheet" type="text/css" media="screen" href="../lib/jquery/jqgrid40/css/ui.jqgrid.css"  />

       	<link href="../lib/jquery-treeview/jquery.treeview.css" rel="stylesheet" />

		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <script type="text/javascript" src="../lib/jquery/jquery-1.7.2.min.js"></script>
   	    <!--  <script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script> -->
       	<script src="../lib/jquery/plugins/jquery.cookie.js" type="text/javascript"></script>

		<script type="text/javascript" src="../lib/highcharts/js/highcharts.src.js"></script>

        <script type="text/javascript" src="../appLib/js/appLib-1.1.15.js"></script>

        <link href='ACUITY/css/styles.css' rel='stylesheet' />
        <link href='ACUITY/css/sectionboxes.css' rel='stylesheet' />

</head>
<body id="ReportsMenu" runat="server" style="position: relative;">
    <form id="form1" runat="server">
  <div id="container">
   <div id="header"><div id="brandingLogo"><h1><span>ERS</span></h1></div></div><div id="nav"><ul id="header_ul"><li><a href="http://acuityapm.com/default.aspx" onclick="return appLib.prefixhref(this);">Dashboard</a></li><li><a href="http://acuityapm.com/admin/admin.aspx" onclick="return appLib.prefixhref(this);">Admin</a></li><li><a href="http://acuityapm.com/monitor/monitor.aspx" onclick="return appLib.prefixhref(this);">Monitor</a></li><li id="header_liActive"><a id="header_active" href="http://acuityapm.com/report/quiz_review.aspx" onclick="return appLib.prefixhref(this);">Reports</a></li><li><a href="http://acuityapm.com/admin/import.aspx" onclick="return appLib.prefixhref(this);">Import</a></li><li><a href="http://acuityapm.com/admin/payroll.aspx" onclick="return appLib.prefixhref(this);">Payroll Admin</a></li></ul></div><div id="header_logout"><span>Welcome</span> <span id="header_userID_lbl"></span><span>&nbsp;| <a href='http://acuityapm.com/logout.aspx' onclick="return appLib.prefixhref(this);" title='Logout'>Logout</a></span><span style="color:gray;">&nbsp;&nbsp;v2</span></div><div id="sidebar"><div class="sidebarNav" id="ReportSidebar" runat = "server"></div></div></div>
    <div id="reportarea" style="position: absolute; top: 96px; left: 152px; display: block; width: 100%;">    
    <div id="MenuTree" runat="server" style="float: left;">
    	<ul id="treemenu" class="filetree">
		<li><span class="folder">Folder 1</span>
			<ul>
				<li><span class="file">Item 1.1</span></li>
			</ul>
		</li>
		<li><span class="folder">Folder 2</span>
			<ul>
				<li><span class="folder">Subfolder 2.1</span>
					<ul id="folder21">

						<li><span class="file">File 2.1.1</span></li>
						<li><span class="file">File 2.1.2</span></li>
					</ul>
				</li>
				<li><span class="file">File 2.2</span></li>
			</ul>
		</li>

		<li class="closed"><span class="folder">Folder 3 (closed at start)</span>
			<ul>
				<li><span class="file">File 3.1</span></li>
			</ul>
		</li>
		<li><span class="file">File 4</span></li>
	</ul>    
    </div>
    <div style="float: right; margin-right: 100px;" id="OtherLinks" runat="server"></div>
   </div>

<div id="mytestsetting" style="display:none;" runat="server"></div>
<script type="text/javascript">
    var mytestsetting;
    $(document).ready(function () {
        //alert("debug:HELLO!  My test setting = " + mytestsetting);
        $("#treemenu").treeview();        
    });
</script>


<script type="text/javascript" src="ACUITY/js/AcuityInterface-3.1.js"></script>    
<script type="text/javascript">
    $(window).resize(function () {
        if (uiInterface) uiInterface.sizebars();
    });
</script>
<div id="NavConfig" style="display:none;" runat="server"></div>


  </form>
</body>
</html>
