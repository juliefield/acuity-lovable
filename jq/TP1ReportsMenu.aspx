<%@ Page Language="VB" AutoEventWireup="false" CodeFile="TP1ReportsMenu.aspx.vb" ValidateRequest="false" Inherits="jq_TP1ReportsMenu" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
		<title>Acuity&trade; Reports</title>
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
      	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />	

        <link rel="stylesheet" href="../lib/jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />

        <link rel="stylesheet" type="text/css" media="screen" href="../lib/jquery/jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css"  />
    	<link rel="stylesheet" type="text/css" media="screen" href="../lib/jquery/jqgrid40/css/ui.jqgrid.css"  />

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
  <!--#include file="inc_tp1head3.aspx"-->
   <script type="text/javascript" language="javascript">
       $("#reportsnav").css("background-color", "#9966FF"); //hack!
   </script>
  <!--#include file="inc_tp1side.aspx"-->
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
    <div style="float: right; margin-right: 100px;" id="TP1OtherLinks" runat="server"></div>
   </div>
   </div>
<script type="text/javascript">
    $(document).ready(function () {
        //$("#treemenu").treeview();        
    });

</script>
<script type="text/javascript" src="Touchpoint/js/TouchpointInterface-2.4.js"></script>    
<script type="text/javascript">
    $(window).resize(function () {
        if (uiInterface) uiInterface.sizebars();
    });
</script>
<div id="NavConfig" style="display:none;" runat="server"></div>
  </form>
</body>
</html>
