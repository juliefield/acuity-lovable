<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ProductManagement.aspx.vb" ValidateRequest="false" Inherits="jq_ProductManagement" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>TP1 Product Management</title>
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">

    	<link href="appTask/themes/default/theme.css" type="text/css" rel="stylesheet" />	

        <link rel="stylesheet" href="jquery-ui/development-bundle/themes/base/jquery.ui.all.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css"  />

        <link rel="stylesheet" href="jwysiwyg/jquery.wysiwyg.css" type="text/css"/>
        <style type="text/css">
             div.wysiwyg { position: relative;  margin-left:0px; padding: 0px; }
             div.wysiwyg ul.toolbar { border-width: 0px; float: left; width: 100%; padding: 0; margin: 0 }
             div.wysiwyg iframe { border: 0px solid lightgray; clear: left;
                background-color:white; padding:0px; margin:0; display:block; width: 100%; }

        </style>
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <!-- !!!!!!! DON'T DO THIS <script type="text/javascript" src="jquery-ui/js/jquery-1.5.1.min.js"></script> -->
        <script type="text/javascript" src="jwysiwyg/lib/jquery1.5.js"></script>
   	    <script src="jquery/plugins/jquery.cookie.js" type="text/javascript"></script>

        <script type="text/javascript" src="appLib/js/appLib.js"></script>
        <script type="text/javascript" src="appTask/js/appTask.js"></script>

      	<script src="jquery-ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
    	<script src="jquery-ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
    	<script type="text/javascript" src="jquery-ui/development-bundle/ui/jquery.ui.tabs.js"></script>
	    <script src="jquery-ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
	    <script src="jquery-ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>

        <script type="text/javascript" src="jwysiwyg/jquery.wysiwyg.js"></script>
        <script type="text/javascript" src="jwysiwyg/controls/wysiwyg.image.js"></script>
        <script type="text/javascript" src="jwysiwyg/controls/wysiwyg.link.js"></script>
        <script type="text/javascript" src="jwysiwyg/controls/wysiwyg.table.js"></script>
				
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
        <link href='TOUCHPOINT/css/styles.css' rel='stylesheet' />
        <link href='TOUCHPOINT/css/sectionboxes.css' rel='stylesheet' />

	</head>

<body id="ProductMgt" style="position:relative;" runat="server">
<form id="form1" runat="server">
 <div id="container">
   <!--#include file="inc_tp1head.aspx"-->
    <div id="contentnosidebar" style="position:relative;width: auto;">
        <div class="tasklist">
        </div>
		<!-- 3. Add the container -->
        <div class="hangingicons" style="display:none;">
            <a class="hicon" title="delete this line" style="right:0px;" href="#"><span class="ui-icon ui-icon-circle-close"></span></a>
            <a class="hicon" title="unsubordinate (unindent) line" style="right:16px;" href="#"><span class="ui-icon ui-icon-arrow-1-w"></span></a>
            <a class="hicon" title="subordinate (indent) line" style="right:32px;" href="#"><span class="ui-icon ui-icon-arrow-1-e"></span></a>
            <a class="hicon" title="move line down" style="right:48px;" href="#"><span class="ui-icon ui-icon-arrow-1-s"></span></a>
            <a class="hicon" title="move line up" style="right:64px;" href="#"><span class="ui-icon ui-icon-arrow-1-n"></span></a>
            <a class="hicon" title="add subordinate (indented) line" style="right:80px;" href="#"><span class="ui-icon ui-icon-arrowreturnthick-1-e"></span></a>
            <a class="hicon" title="add line" style="right:96px;" href="#"><span class="ui-icon ui-icon-plus"></span></a>
            <a class="hicon" title="edit this line" style="right:120px;" href="#"><span class="ui-icon ui-icon-gear"></span></a>    
        </div>
    </div>
    <div id="wyspark">
        <div id="wysdiv">
	        <textarea id="wysiwyg">Initial Text Area</textarea>
        </div>
    </div>
	<label style="display:none;"><input type="checkbox" value="1" id="click-inform" checked="checked" /> Inform about clicks.</label>
</div>
<div id="NavConfig" style="display:none;" runat="server"></div>
<noscript>This page requires JavaScript.</noscript>
</form>

<script type="text/javascript">
    $(document).ready(function () {
        appTask.init();
    });
</script>
<script type="text/javascript" src="TOUCHPOINT/js/TouchpointInterface-2.2.js"></script>
<script type="text/javascript">
    $(window).resize(function () {
        if (uiInterface) uiInterface.sizebars();
    });
</script>

</body>
</html>
