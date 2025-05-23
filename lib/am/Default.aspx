<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" ValidateRequest="false" Inherits="app_m_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1">
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
    <title>TouchPointOne</title>
  	<link rel="stylesheet" href="../appMMP/css/styles.css" type="text/css" />
    <link rel="stylesheet" href="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css" />
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.6.2.min.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js"></script>
	<script src="../jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/appLibOLD.js"></script>
    <script type="text/javascript" src="../appMMP/js/appMMP.js"></script>
</head>
<body id="APP_HOME" runat="server" style="position: relative;">
    <!--<span style="font-size: 8px;">Map My</span><br /><span style="font-size: 10px;">Progress</span>-->
    <div data-role="page" id="page0" data-theme="b" data-add-back-btn="true">
    	<div data-role="header" data-theme="b"><h1>TouchPointOne</h1><a href="#options" data-icon="gear" onclick="appZoo.optionset(0);" class="ui-btn-right">&nbsp;</a></div>
    	<div data-role="content">
            <h3>The Browser App</h3>
		    <h3 id="page0question"></h3>
            <div id="page0ui">
                <ul data-role="listview" id="page0list">
                    <li><a id="page0yes" onclick="" href="">Yes</a></li>
                    <li><a id="page0no" onclick="" href="">No</a></li>
                </ul>
            </div>
	    </div>
    </div>
  <!-- Form is only used for content manager -->
  <form id="form1" runat="server"></form>
  <script type="text/javascript" language="javascript">
      //alert("Useragent=" + navigator.userAgent);
      //alert("width=" + screen.width + ",height=" + screen.height);

  </script>
</body>
</html>