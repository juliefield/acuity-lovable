<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DashboardAsync.aspx.cs" ValidateRequest="false" Inherits="jq_DashboardAsync" %>

	<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

	<html xmlns="http://www.w3.org/1999/xhtml">

	<head id="Head1" runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

		<title id="Title1">Acuity&trade; 2.0</title>
		<!--[if gt IE 9]>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <![endif]-->
		<!--[if lte IE 9]>
        <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <![endif]-->

		<asp:PlaceHolder runat="server">
		<!-- FAVICON-->
			<link rel="apple-touch-icon" sizes="57x57" href="../images/favicon/apple-icon-57x57.png">
			<link rel="apple-touch-icon" sizes="60x60" href="../images/favicon/apple-icon-60x60.png">
			<link rel="apple-touch-icon" sizes="72x72" href="../images/favicon/apple-icon-72x72.png">
			<link rel="apple-touch-icon" sizes="76x76" href="../images/favicon/apple-icon-76x76.png">
			<link rel="apple-touch-icon" sizes="114x114" href="../images/favicon/apple-icon-114x114.png">
			<link rel="apple-touch-icon" sizes="120x120" href="../images/favicon/apple-icon-120x120.png">
			<link rel="apple-touch-icon" sizes="144x144" href="../images/favicon/apple-icon-144x144.png">
			<link rel="apple-touch-icon" sizes="152x152" href="../images/favicon/apple-icon-152x152.png">
			<link rel="apple-touch-icon" sizes="180x180" href="../images/favicon/apple-icon-180x180.png">
			<link rel="icon" type="image/png" sizes="192x192"  href="../images/favicon/android-icon-192x192.png">
			<link rel="icon" type="image/png" sizes="32x32" href="../images/favicon/favicon-32x32.png">
			<link rel="icon" type="image/png" sizes="96x96" href="../images/favicon/favicon-96x96.png">
			<link rel="icon" type="image/png" sizes="16x16" href="../images/favicon/favicon-16x16.png">
			<link rel="manifest" href="../images/favicon/manifest.json">
			<meta name="msapplication-TileColor" content="#ffffff">
			<meta name="msapplication-TileImage" content="../images/favicon/ms-icon-144x144.png">
			<meta name="theme-color" content="#ffffff">
		<!-- END FAVICON-->

			<link href="appApmClient/themes/default/theme-1.2.css" type="text/css" rel="stylesheet" />
			<link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />

			<link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css" />
			<link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/css/ui.jqgrid.css" />
			<link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.css" />

			<link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/qtip2dev/dist/jquery.qtip.css" />

			<!-- 1. Add these JavaScript inclusions in the head of your page -->
			<!-- jquery -->
			<!--<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/js/jquery-1.6.2.min.js"></script>-->
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/jquery-1.7.2.min.js"></script>
			<!--<script type="text/javascript" src="../applib/BootstrapModalPopover/lib/jquery-1.11.3.min.js"></script> -->

			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/js/spinner.js"></script>

			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/knockout-3.3.0.js"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko.mapping.js"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko-postbox.js"></script>

			<!-- plugins -->

			<script src="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jQueryRotate.js" type="text/javascript"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.spin.js"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery-treeview/jquery.treeview.js" type="text/javascript"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/highcharts.src.js"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/highcharts-more.js"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>raphael/raphael-2.1.0.js"></script>

             <!-- Debugging Tools -->
             <script type="text/javascript" src="../lib/break-on-access/break-on-access.js"></script>

			<!-- Common Library -->

			<script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>

			<!-- App-Dependent plugins -->

			<script type="text/javascript" src="plugins/bellGraph-1.0.0.js"></script>

			<!-- App Modules -->
			<script type="text/javascript" src="appApmClient/js/appApmSupTools-1.0.1.js"></script>
			<script type="text/javascript" src="appApmClient/js/appApmDashboard-2.15.17.js?r=3"></script>
			<script type="text/javascript" src="appApmClient/js/appApmContentTriggers-1.0.js?r=5"></script>
			<script type="text/javascript" src="appApmClient/js/appApmReport-1.1.0.js?r=8"></script>
			<script type="text/javascript" src="appApmClient/js/appClientDV/clientDVProcessing-1.0.js"></script>
			<script type="text/javascript" src="appApmClient/js/appApmScoreEditing-1.1.0.js"></script>
			<script type="text/javascript" src="appApmClient/js/appApmMessaging-1.4.11.js"></script>
			<script type="text/javascript" src="appApmClient/js/appApmNavMenus-2.0.2.js"></script>
			<script type="text/javascript" src="appApmClient/js/appApmSettings-1.1.0.js"></script>
			<script type="text/javascript" src="appApmClient/js/appApmAdmin-1.3.6.js"></script>
			<script type="text/javascript" src="appApmClient/js/appApmAttrition-1.0.4.js"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.tabs.js"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>

			<!-- <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.qtip-1.0.0-rc3.min.js" type="text/javascript"></script> -->
			<script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>

			<!-- 1a) Optional: add a theme file -->
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/themes/touchpointasync4.js"></script>

			<!-- 1b) Optional: the exporting module -->
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/modules/exporting.js"></script>

            <script type="text/javascript" src="../appLib/js/appChartDefinitions.js"></script>
            <script type="text/javascript" src="../appLib/js/appEasycom-0.2.js"></script> <!-- MADELIVE -->

			<!-- 2. Add the JavaScript to initialize the chart on document ready -->

			<script type="text/javascript" src="../applib/css/highcharts-theme-julie.js"></script>

			<script type="text/javascript" src="../applib/anothercolorpicker/src/jquery.simple-color.js"></script>
			<script type="text/javascript" src="../appLib/js/viewmodels/rankpoints-0.8.js"></script>
			<script type="text/javascript" src="../appLib/js/viewmodels/filterattributes.js"></script>
			<!--
        <script type="text/javascript" src="../appLib/js/viewmodels/filterset.js"></script>
        -->
			<script type="text/javascript" src="../appLib/js/FilterAction-1.0.0.js"></script>
			<script type="text/javascript" src="../appLib/js/qa-1.0.3.js"></script>

			<!-- Date Range Picker Suite -->
			<link rel="stylesheet" href="../applib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
			<script type="text/javascript" src="../applib/moment/moment.min.js"></script>
			<script type="text/javascript" src="../applib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>

			<script type="text/javascript" src="../applib/jquery-tablesorter/jquery.tablesorter.js"></script>

			<script type="text/javascript" src="../appLib/js/viewmodels/fan-2.5.js?r=24"></script>

			<!-- Files with separate JulieDev replacements  -->
			<link rel="stylesheet" type="text/css" media="all" href="../applib/css/base.css" />
			<link rel="stylesheet" type="text/css" media="all" href="../applib/css/fan-2.5.css?r=2" />
			<link rel="stylesheet" type="text/css" media="screen" href="../applib/css/rankpoints-2.1.css" />
			<link rel="stylesheet" type="text/css" media="all" href="../applib/css/rpt.css" />
			<link rel="stylesheet" type="text/css" media="screen" href="../applib/css/easycom-0.2.css" /> <!-- MADELIVE -->
			<link rel="stylesheet" type="text/css" media="screen" href="../applib/css/grid.css" /> <!-- RESPONSIVE GRID -->
			<link rel="stylesheet" type="text/css" media="screen" href="../applib/css/all.css" /> <!-- FONT AWESOME ICONS -->


			<script type="text/javascript" src="dev_ayokay/js/viewmodels/treasurehunt.js"></script>
			<link rel="stylesheet" type="text/css" media="screen" href="dev_ayokay/css/treasurehunt.css" />

			<script type="text/javascript" src="dev_HelloWorld/js/viewmodels/helloworld.js"></script>
			<link rel="stylesheet" type="text/css" media="screen" href="dev_HelloWorld/css/helloworld.css" />

		</asp:PlaceHolder>

		<!-- see purecss.io for docs -->
		<link rel="stylesheet" href="../pure/pure-min.css" />
		<link rel="stylesheet" href="../pure/grids-responsive-min.css">

		<style>
			/*
        #myreportcontainer td
        {
            width: 90px;
            padding-top: 5px;
            font-size: 12px;
            line-height: 17px;
        }
        #myreportcontainer th
        {
            color: White;
            background-color: Black;
        }
        #myreportcontainer tbody
        {
            margin-top: 8px;
        }
        */
		</style>

		<!--[if IE 7]>
        <style>
            .messages-box-unread { margin-top: -18px; }
            .messages-box-incomplete  { margin-top: -18px; }
        </style>
    <![endif]-->

		<!--[if lt IE 9]>
      <script type="text/javascript">
      (function(){
        var html5elements = "address|article|aside|audio|canvas|command|datalist|details|dialog|figure|figcaption|footer|header|hgroup|keygen|mark|meter|menu|nav|progress|ruby|section|time|video".split('|');
        for(var i = 0; i < html5elements.length; i++){
          document.createElement(html5elements[i]);
        }

      })();
      </script>
    <![endif]-->

	</head>

	<body id="Dashboard" style="position:relative;" runat="server">
        <div class="splash" style="z-index: 1000000;height:100%;width:100%;position:fixed;background-color:White;">
            <div style="width: 20%;height:25%;margin: 25% auto 0 auto;vertical-align:middle;">
                <img alt="Acuity Loading..." style="height:100%;width:100%;" src="../applib/css/images/acuity-loading.gif" />
            </div>
        </div>
		<embed src="phonebeep.mp3" autostart="false" width="0" height="0" id="beep" enablejavascript="true">

        <div id="AgameOverlay" style="display:none;position:absolute; top:0px;left:0px;width:100%;height:100%;z-index:2000">
        </div>
		<!--[if IE 8]> <div id="browserversion" style="display:none;">ie8</div> <![endif]-->
		<!--[if gt IE 8]> <div id="browserversion" style="display:none;">isgtie8</div> <![endif]-->
		<!--[if IE 9]>
        <script type="text/javascript">
            window.location = "DashboardAsyncV8L.aspx";
        </script>
    <![endif]-->
            <h3 style="display:none;z-index:1000;position:absolute;top:-10px;left:310px;color:white;background-color:red;padding:5px;">Attention: Acuity will be unavailable this evening after 7PM PST for important software maintenance.</h3>

        <!-- MADELIVE -->
        <div class="easycom ec-loc-notification">
            <div class="ec-dismiss">x</div>
                <div class="ec-message">
                </div>
            </div>
        </div>
		<div id="AcuityApp">

			<form id="form1" runat="server">
				<div id="loading">Loading Dashboard V2...</div>
				<div class="nav3-icon"></div>
				<div class="nav3-shadow">&nbsp;</div>
				<div class="nav3-linkhelp">The Menu is now in the upper right corner.
					<div class="nav3-close2">X</div>
				</div>
				<div class="err-container">
					<div class="err-hide">Done with this error</div>
					<div class="err-text">Acuity Error:</div>
					<div class="err-content">&nbsp;</div>
					<div class="err-text">This notice has already been submitted to technical services. If you would like to add more information, please enter it below and submit.</div>
					<div><input id="errinput" type="text" style="width: 500px;" value="" /><input id="errsubmit" type="button" value="Submit" /></div>
					<div class="err-text">We will work diligently to correct this problem. You will be notified when we have a solution or work-around for you.</div>
				</div>

				<div class="nav3-wrapper">
                    <!-- <div class="nav3-close"></div> -->
					<div class="nav3">
						<ul>
							<li id="classicdashboard_li"><a id="header_active" href="#Classic"><span class="nav3-caption">Classic Dashboard</span><span class="nav3-desc">Combines messages, filters, and settings.</span></a></li>
							<!-- <li><a id="A2" href="#GraphsReports">Graphs/Reports</a></li> -->
							<li id="admin_li"><a target="_blank" href="//acuityapm.com/admin/admin.aspx" onclick="return appLib.prefixhref(this);"><span class="nav3-caption">Admin</span><span class="nav3-desc">Opens window for administrative functions.</span></a></li>
							<li id="monitor_li"><a id="monitorlink" target="_blank" href="//acuityapm.com/monitor/monitor.aspx" onclick="return appLib.prefixhref(this);"><span class="nav3-caption">Monitor</span><span class="nav3-desc">Opens window for monitoring.</span></a></li>
							<li id="reports_normal_li"><a target="_blank" href="//acuityapm.com/report/quiz_review.aspx" onclick="return appLib.prefixhref(this);"><span class="nav3-caption">Reports</span><span class="nav3-desc">Opens window for reports.</span></a></li>
							<li id="reports_restricted_li" style="display:none;"><a target="_blank" href="//acuityapmr.com/jq/TP1ReportsMenu.aspx" onclick="return appLib.prefixhref(this);"><span class="nav3-caption">Reports</span><span class="nav3-desc">Opens window for reports.</span></a></li>
							<li id="import_li"><a target="_blank" href="//acuityapm.com/admin/import.aspx" onclick="return appLib.prefixhref(this);"><span class="nav3-caption">Import (V1)</span><span class="nav3-desc">Opens V1 window for importing data.</span></a></li>
							<li id="scoreeditor_li"><a id="A3" href="#ScoreEditor"><span class="nav3-caption">Score Editor</span><span class="nav3-desc">Editing of scores.</span></a></li>
							<li id="attendancetracker_li"><a id="A4" href="#AttendanceTracker"><span class="nav3-caption">Attendance</span><span class="nav3-desc">Attendance tracking module for supervisors.</span></a></li>
							<li><a href="#GraphAppearance"><span class="nav3-caption">Graph Settings</span><span class="nav3-desc">Series, and filter options for dashboard display.</span></a></li>
							<li><a href="#UserPreferences"><span class="nav3-caption">User Preferences</span><span class="nav3-desc">&nbsp;</span></a></li>
							<li id="scoring_li" style="display:none;"><a href="#Scoring"><span class="nav3-caption"><span class="scaname">Project</span>s &amp; Scoring</span><span class="nav3-desc">Project &amp; KPI setup.  Weights and ranges.</span></a></a>
							</li>
							<li><a href="#Advanced"><span class="nav3-caption">Advanced Settings</span><span class="nav3-desc">&nbsp;</span></a></li>
							<li id="changepassword_li">Change Password</li>
                            <li class="easycom-editor" style="display:none;">
                                <a  href="#" target="_blank">Easycom</a>
                            </li>
                            <li class="compliance-system" style="display:none;">
                                <a  href="#" target="_blank">Compliance System</a>
                            </li>
							<li id="resetpassword_li" style="display:none;">Reset Consultant Password</li>
						</ul>
					</div>
				</div>
				<div class="app-header gradient-lightest">
					<div class="logo" style="margin-left:0px;">
						<a href="#" class="logo-reload">
							<img src="../App_Themes/Acuity2/images/acuity-white-logo.png" alt="Acuity" />
						</a>
					</div>
					<div class="heading" style="margin-left:0px;"></div>
					<div class="header-tile" style="width:50px;">&nbsp;</div>
					<div class="header-tile" id="loadingprompt" style="color:White;background-color:#EF4521;padding-top:4px;padding-bottom:2px;padding-left:20px;font-weight:bold;display:none;font-size:16px;padding-right: 20px;float:right;">Loading...</div>
					<div class="header-tile" style="margin-top: 25px;" id="logout"><a href='//acuityapm.com/login.aspx' onclick="return appLib.prefixhref(this);" title='Log Out'>Log Out</a><a id="logsomething" style="display:none;" href='#'
						    title='Log Out'>Log Out</a></div>
					<div class="header-tile" style="margin-top: 25px;position:relative;" id="userid"><span id="welcomelabel">Welcome</span> <span id="header_userID_lbl"></span></div>
					<!--
        <div class="header-tile">
            <div class="nav">
                <div class="navheader"><div class="navlabel" style="width:120px;">Settings</div><div class="navarrow"><img style="margin-top: 2px;" src="appApmClient/themes/default/images/arrow-down2-16.png" /></div></div>
                <ul>
                </ul>
            </div>
        </div>
        -->
					<div class="header-tile">
						<div class="headericon-reload" style="display:none;"></div>
					</div>
					<div class="header-tile">
						<div class="headericon-import" style="display:none;"></div>
					</div>
					<!--
        <div class="header-tile nav3linkhelp" style="padding-top:2px;">
            <a id="nav3linkhelp" href="#" style="font-size:12px;text-decoration:underline;color:Blue;">Where is<br />the menu?</a>
        </div>
        -->
					<div class="header-tile">
						<div class="err-icon">
						</div>
						<div class="headericon-points">
							<div class="headericon-points-youhave">You&nbsp;have</div>
							<div class="headericon-points-balance">0</div>
							<div class="headericon-points-points">Points</div>
						</div>
						<div class="headericon-agame-xtreme">
							Queue<br />Player
						</div>
						<div class="headericon-agame" style="display:none;">
							<div class="headericon-agame-backdrop"></div>
							<div class="headericon-agame-gamestatus"></div>
							<div class="headericon-agame-gamescore"></div>
						</div>
						<div class="headericon-wand" style="display:none;">
						</div>
						<div class="headericon-chat" style="display:none;">
							<div class="chat-beep-icon">New&nbsp;Chat&nbsp;Message!</div>
						</div>
						<div class="headericon-message">
							<div class="messages-badge-unread">0</div>
							<div class="messages-badge-incomplete"></div>
						</div>
						<div class="headericon-graph"></div>
					</div>
					<!-- TODO: <div class="header-tile">Envelope</div> -->
					<div style="width:500px;word-wrap: break-word;font-size:10px;float:right;">
						<!--<select class="chosen" id="Select1"><option value="">Menu</option></select>
            <select id="gradient"><option>I got me a gradient</option></select>-->
						<div id="debugwindow"></div>
					</div>
				</div>
				<div id="appdiv" class="content">
					<!-- 3. Add the container -->
					<div class="leftpanel">
						<div style="font-size:20px; font-weight:bold;margin: 10px;" class="attrition-show" style="display:none;">Attrition/Retention Log</div>
						<div class="gaugesdiv-wrapper">
							<div id="gaugesdiv" class="attrition-hide">
								<div id="gaugediv" style="clear: left;background-color:Black;height:200px;width:280px;overflow: hidden;position:relative;">
									<div id="gaugescore" style="position:absolute;top:10px;left:0px;z-index:1;width:270px;display:block;text-align: center;background-color:Black;color:White;font-size:16px;font-weight:bold;">0</div>
									<div style="position:relative; margin-top:5px;z-index:501;">
										<a id="gaugecollapse" class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='22px',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','200px'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
										    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
										<a class="help" target="_blank" href="../help.aspx?cid=BalancedScore">&nbsp;&nbsp;&nbsp;</a>
									</div>
									<div id="gaugelabel" style="position:absolute;top: 175px;z-index:1;left:0px;width:270px;display:block;text-align: center;background-color:Black;color:White;font-size:12px;font-weight:bold;">
									<span class="balancedname">Balanced</span> Score</div>
                                    <img style="position:absolute;top:20px;left:-4px;" src="appApmClient/themes/default/images/gaugeGENFixed.jpg" id="imageback" />
									<div id="gaugeover" style="position:absolute;top:0px;left:0px;display:none;"></div>
									<div class="needlediv" style="z-index:10;"><img class="needle" src="appApmClient/themes/default/images/nc0.png" id="needle0" /></div>
									<div class="needlediv" style="z-index:20;"><img class="needle" src="appApmClient/themes/default/images/nc1.png" id="needle1" /></div>
									<div class="needlediv" style="z-index:30;"><img class="needle" src="appApmClient/themes/default/images/nc2.png" id="needle2" /></div>
									<div class="needlediv" style="z-index:40;"><img class="needle" src="appApmClient/themes/default/images/nc3.png" id="needle3" /></div>
									<div class="needlediv" style="z-index:50;"><img class="needle" src="appApmClient/themes/default/images/nc4.png" id="needle4" /></div>
									<div class="needlediv" style="z-index:60;"><img class="needle" src="appApmClient/themes/default/images/nc5.png" id="needle5" /></div>
									<div class="needlediv" style="z-index:70;"><img class="needle" src="appApmClient/themes/default/images/nc6.png" id="needle6" /></div>
									<div class="needlediv" style="z-index:80;"><img class="needle" src="appApmClient/themes/default/images/nc7.png" id="needle7" /></div>
									<div class="needlediv" style="z-index:90;"><img class="needle" src="appApmClient/themes/default/images/nc8.png" id="needle8" /></div>
									<div class="needlediv" style="z-index:100;"><img class="needle" src="appApmClient/themes/default/images/nc9.png" id="needle9" /></div>
									<div class="needlediv" style="z-index:110;"><img class="needle" src="appApmClient/themes/default/images/nc10.png" id="needle10" /></div>
									<div class="needlediv" style="z-index:120;"><img class="needle" src="appApmClient/themes/default/images/nc11.png" id="needle11" /></div>
									<div class="needlediv" style="z-index:130;"><img class="needle" src="appApmClient/themes/default/images/nc12.png" id="needle12" /></div>
									<div class="needlediv" style="z-index:140;"><img class="needle" src="appApmClient/themes/default/images/nc13.png" id="needle13" /></div>
									<div class="needlediv" style="z-index:150;"><img class="needle" src="appApmClient/themes/default/images/nc14.png" id="needle14" /></div>
									<div class="needlediv" style="z-index:160;"><img class="needle" src="appApmClient/themes/default/images/nc15.png" id="needle15" /></div>
									<div id="gaugeprogress" style="z-index:500; position:absolute; top: 120px; left:140px;"></div>
								</div>
								<div id="rankdiv" style="clear: left;background-color:Black;height:70px;width:270px;overflow: hidden;position:relative;border-top: 1px solid white;display:none;">
									<div id="rankover" style="position:absolute;top:0px;left:0px;display:none;"></div>
									<div id="rankover2" style="position:absolute;top:50px;left:0px;display:none;"></div>
									<div class="rankpindiv" id="rankpin1" style="z-index:10;"><img class="rankpin" src="appApmClient/themes/default/images/mappin1.png" /></div>
									<div class="rankpindiv" id="rankpin2" style="top:77px;z-index:10;"><img class="rankpin" src="appApmClient/themes/default/images/mappin1.png" /></div>
									<div id="needlerank" style="position:absolute;bottom:0px;clear:left; width:270px; background-color: Black; color: White; font-size: 12px; padding-bottom: 3px; font-weight:bold; text-align: center;">
									</div>
								</div>
							</div>
						</div>
						<div id="messagediv" class="filters panelbox" style="clear:left; width: 265px; position:relative; /* background:none; background-color:#A0A0A0; */">
							<div style="margin-top: -5px">
								<div class="messages-alert-messagereceived"><span>&nbsp;</span><a onclick="$(this).parent().hide();return false;" href="#">X</a></div>
								<div class="messages-alert-newmessages"><span>&nbsp;</span></div>
								<div class="messages-alert-messagesent"><span>&nbsp;</span></div>
							</div>
							<div>
								<span style="font-size:18px; font-weight:bold;">Messages</span>
								<span class="messages-compose"><input type="button" value="Compose" /></span>
								<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='22px',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','auto'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
								    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
								<a class="help" target="_blank" href="../help.aspx?cid=DashboardMessages"><i class="fa fa-question"></i></a>
							</div>
							<div class="message-wrapper" id="messages"><br />Loading Messages...<br />&nbsp;</div>
							<div id="messageprogress" style="z-index:2; position:absolute; top: 50px; left:140px;"></div>
							<div class="message-notifier-wrapper-km2" style="display:none;">
								<a href="Acuity Notifier KM2.msi">Acuity Notifier (KM2)</a>
							</div>
							<div class="message-notifier-wrapper-ers" style="display:none;">
								<a href="Acuity Notifier ERS.msi">Acuity Notifier (ERS)</a>
							</div>
							<div class="message-notifier-wrapper-ces" style="display:none;">
								<a href="Acuity Notifier CES.msi">Acuity Notifier (CES)</a>
							</div>
							<div class="message-notifier-wrapper-chime" style="display:none;">
								<a href="Chime Notifier.msi">Chime Notifier</a>
							</div>
							<div class="message-notifier-wrapper-all" style="display:none;">
								<a href="Acuity Notifier ALL.msi">Acuity Notifier (All Clients)</a>
							</div>
						</div>
						<div id="scoringdiv" class="filters" style="clear:left; width: 270px; position:relative; /* background:none; background-color:#A0A0A0; */">
							<div>
								<span style="font-size:18px; font-weight:bold;"><span class="scaname">Project</span> Admin</span>
								<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='22px',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','auto'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
								    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
								<a class="help" target="_blank" href="../help.aspx?cid=AdminScoring">&nbsp;&nbsp;&nbsp;</a>
							</div>
							<div class="projectadmin-wrapper" id="projectadmin"><br />Loading <span class="scaname">Project</span> &amp; Scoring Information...<br />&nbsp;</div>
							<div id="projectadminprogress" style="z-index:2; position:absolute; top: 50px; left:140px;"></div>
						</div>
						<div id="datasourcediv" class="filters panelbox" style="clear:left; width: 270px; position:relative; /* background:none; background-color:#A0A0A0; */">
							<div style="font-size:18px; font-weight:bold;margin-top: -5px;">Data Source
								<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='22px',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; p.css('overflow','hidden'); } else { p.css('height','auto').css('overflow','visible'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
								    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
								<a class="help" target="_blank" href="../help.aspx?cid=DashboardDatasources">&nbsp;&nbsp;&nbsp;</a>
							</div>
							<dl style="margin:0;padding:0;margin-top:5px;">
								<!-- <dt>Debug Monitor:</dt><dd id="debmon">...</dd> -->
								<dt><span class="scaname">Name</span></dt>
								<dd><select class="chosen" id="selDataSources"><option value="">..loading</option></select></dd>
							</dl>
							<div id="datasourceprogress" style="z-index:2; position:absolute; top: 25px; left:140px;"></div>
						</div>
						<div id="filterdiv" class="filters panelbox" style="clear: left; z-index:100; width: 270px; height:auto; position:relative; overflow:visible;">
                            <div id="teamrank" style="display:none;position:relative;text-align: center; font-size: 13px; /*color:Black;*/color:White;font-weight: bold;padding: 0 10px 20px 0;">
                                Place team rank here.
                            </div>
                            <div id="shiftbid" style="display:none;position:relative;text-align: center; font-size: 13px; /*color:Black;*/color:White;font-weight: bold;padding: 0 10px 20px 0;">
                                Place shift bid here.
                            </div>
                            <div id="mqfrank" style="display:none;position:relative;text-align: center; font-size: 13px; /*color:Black;*/color:White;font-weight: bold;padding: 0 10px 20px 0;">
                                Place mqfrank here.
                            </div>

							<div style="font-size:18px; font-weight:bold;margin-top: -5px;">Filter
								<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='22px',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; p.css('overflow','hidden'); } else { p.css('height','auto').css('overflow','visible'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
								    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
								<a class="help" target="_blank" href="../help.aspx?cid=DashboardFilters">&nbsp;&nbsp;&nbsp;</a>
							</div>
							<!-- <div id="simple-calendar"></div> -->
                            <div class="stgdashboard-override-hide">
							    <div id="StgDashboard" class="stg attrition-hide">
								    <div style="margin: 5px 0px 10px 0px">
									    <select style="display:none;">
                                            <option value="Agent" selected="selected">Agent Operations Data</option>
                                            <option value="Supervisor">Supervisor Operations Data</option>
                                            <option value="Source">HR-Centric KPIs</option>
                                            <option value="Program">Program</option>
                                            <!--
                                                <option value="Program">Client/SLA Data</option>
                                                <option value="Financial">Financial Data</option>
                                            -->
                                        </select>
								    </div>
							    </div>
                            </div>
							<div id="StgAttritionSearch" class="stg attrition-show">
								<div style="margin: 5px 10px 10px 10px" class="attrition-show-hr">
									<select style="display:none;">
                        <option value="Hierarchy" selected="selected">Use Hierarchy</option>
                        <option value="Location">By Location</option>
                    </select>
								</div>
							</div>
							<!-- Employee  SLA   Enterprise -->
							<dl style="margin:0;padding:0;margin-top:5px;" class="attrition-show-hi">
								<!-- <dt>Debug Monitor:</dt><dd id="debmon">...</dd> -->
								<dt id="agencylabel" style="display:none;">Agency</dt>
								<dd id="agencyfilter" style="display:none;"><select class="chosen" id="selAgencys"><option value="">..loading</option></select></dd>
								<dt id="agencyofficelabel" style="display:none;">Office</dt>
								<dd id="agencyofficefilter" style="display:none;"><select class="chosen" id="selAgencyoffices"><option value="">..loading</option></select></dd>
								<dt id="projectlabel"><span class="scaname">Project</span></dt>
								<dd id="projectfilter"><select class="chosen" id="selProjects"><option value="">..loading</option></select></dd>
								<dt id="locationlabel"><span class="locname">Location</span></dt>
								<dd id="locationfilter"><select class="chosen" id="selLocations"><option value="">..loading</option></select></dd>
								<dt id="grouplabel"><span class="grpname">Group</span></dt>
								<dd id="groupfilter"><select class="chosen" id="selGroups"><option value="">..loading</option></select></dd>
								<dt id="teamlabel"><span class="teamname">Team</span></dt>
								<dd id="teamfilter"><select class="chosen" id="selTeams"><option value="">..loading</option></select></dd>
								<dt id="csrlabel">CSR</dt>
								<dd id="csrfilter" style="position:relative;">
									<select class="chosen" id="selCSRs"><option value="">..loading</option></select>
									<div class="filters-attributes-link">&nbsp;</div>
								</dd>
							</dl>
							<dl style="margin:0;padding:0;margin-top:0px;display:none;" id="filtersdiv">
								<dt id="filterlabel">Attributes</dt>
								<dd id="filtergroup">&nbsp;</dd>
							</dl>
							<!--
            <dl style="margin:0;padding:0;margin-top:0px;" id="filtersdivTEST"  class="attrition-show-hi">
                <dt id="filterlabelTEST">Comp TEST</dt>
                <dd id="filtergroupTEST" class="filterSet-wrapper" data-bind='component: "filterSet"' ></dd>
            </dl>
            -->
							<dl style="margin:0;padding:0;margin-top:0px;" class="attrition-show-hi">
								<dt id="hiredatelabel" style="display:none;">Hire Date:</dt>
								<dd id="hiredatefilter" style="display:none;">
									<div id="hiredate">
										<div class="hd-slider"></div>
										<div class='hd-label'></div>
									</div>
								</dd>
							</dl>
							<dl style="margin:0;padding:0;margin-top:5px;" class="attrition-show-loc">
								<dt><span class="locname">Location</span></dt>
								<dd><select class="chosen" id="selAttritionLocations"><option value="">..loading</option></select></dd>
							</dl>
							<dl id="kpidl" style="position:relative; margin:0;padding:0;" class="attrition-hide">
								<dt class="kpi-display">KPI</dt>
									<dd class="kpi-display"><select class="chosen" id="selKPIs" onchange=""><option value="">..loading</option></select></dd>
									<dt class="subkpi-display">SubKPI</dt>
									<dd class="subkpi-display"><select class="chosen" id="selSubKPIs" onchange=""><option value="">..loading</option></select></dd>
									<dt style="display:none;">X Axis:</dt>
									<dd style="display:none;"><select class="chosen" id="selXaxiss" onchange=""><option value="">..loading</option></select></dd>
							</dl>
							<dl id="datedl" style="position:relative; margin:0;padding:0;" class="attrition-hide">
								<dt class="date-display">Score View:</dt>
								<dd class="date-display"><select class="chosen" id="selPayperiods"><option value="">..loading</option></select></dd>
								<dt class="date-display">Date Interval:</dt>
								<dd class="date-display" style="display:block;text-align:center;margin-right:20px;"><span id="spanDatefrom"></span> - <span id="spanDateto"></span></dd>
							</dl>
						</div>
						<div id="dashboardcontroldiv" class="filters panelbox" style="clear: left; z-index:100; width: 270px; height:auto; z-index: 50; position:relative; overflow:visible;">
							<dl id="trenddl" style="position:relative;">
								<dt>Trend By:</dt>
								<dd><select class="chosen" id="selTrendbys"><option value="">..loading</option></select></dd>
								<!-- <dd style="display:block;text-align:center;margin-right:10px;"><input type="radio" id="rdoPayperiod" name="trendtype" checked="checked" value="base" />Pay Period <input type="radio" id="rdoMonth" name="trendtype" value="base" />Month</dd> -->
								<dt>Date Range:</dt>
								<dd>
									<div id="daterange">
										<div class="dr-slider"></div>
										<div class='dr-label'></div>
									</div>
								</dd>
							</dl>
							<div style="position:relative;margin-left: 80px; padding-bottom: 5px; display:block; text-align: center;" class="attrition-hide">
								<div class="dashboard-legacy-view-buttons">
									<input type="radio" id="rdoGrid" name="plottype" value="grid" style="position:relative;" /><label id="rdoGridLabel" for="rdoGrid">Grid&nbsp;&nbsp;</label>
									<input type="radio" id="rdoBase" name="plottype" checked="checked" value="base" style="position:relative;" /><label id="rdoBaseLabel" for="rdoBase">Bar</label>
									<input type="radio" id="rdoTrend" name="plottype" value="trend" style="position:relative;" /><label id="rdoTrendLabel" for="rdoTrend">Trend</label>
									<span id="showpay"><input type="radio" id="rdoPay" name="plottype" value="pay" style="position:relative;" /><label id="rdoPayLabel" for="rdoPay">Pay</label></span>
								</div>
								<div class="dashboard-views-v2">
									<div id="StgView" class="stg">
										<div style="margin: 5px 10px 10px 10px" class="attrition-show-hr">
											<select style="display:none;">
                                <option value="Grid" selected="selected">Grid</option>
                                <option value="Chart">Chart</option>
                            </select>
										</div>
									</div>
									<div id="StgViewDateType" class="stg">
										<div style="margin: 5px 10px 10px 10px" class="attrition-show-hr">
											<select style="display:none;">
                                <option value="Period" selected="selected">Period</option>
                                <option value="Multiple">Multiple</option>
                            </select>
										</div>
									</div>
								</div>
								<br /><input id="btnPlot" style="width:56px;" type="button" value="Plot" />
								<input id="btnAdd" style="width:56px;" type="button" value="Add" />
								<input id="btnClear" style="width:56px;" type="button" value="Clear" />
								<!-- <input id="debug" type="button" value="debug" onclick="alert('debug1');var i; for (i=0;i<100000000;i++) { var j = 0; j = j+i; }; alert('debug2');" /> -->
                                <div id="StgScoreModel_Filter" class="stg" style="margin-top: 25px;"> <!-- MAKEDEV -->
								    <div style="font-size:14px; font-weight:bold; margin-left: 10px;">Score Basis</div>
							    </div>

							</div>
							<div style="position:relative;margin-left: 50px; padding-bottom: 5px; display:block; text-align: center;" class="attrition-show">
								<input type="button" onclick="appApmAttrition.showagents();" value="Show Agents" />
							</div>
							<div id="StgAttritionTest" class="stg attrition-show attrition-show-testing">
								<h1 style="margin-top: 40px;">View by Role:</h1>
								<div style="margin: 5px 10px 10px 10px">
									<select style="display:none;">
                        <option value="Supervisor" selected="selected">Supervisor View</option>
                        <option value="HR">Human Resources View</option>
                    </select>
								</div>
							</div>
							<dl id="presetsdl" style="position:relative;display:none;">
								<dt>Presets:</dt>
								<dd><select class="chosen" id="selPresets" data-placeholder="..select a preset"><option value="">(not selected)</option><option value="Preset1">Preset1</option><option value="Preset2">Preset2</option></select>
									<div class="filters-presets-link presets-command-add">&nbsp;</div>
								</dd>
								<!-- <dd style="display:block;text-align:center;margin-right:10px;"><input type="radio" id="rdoPayperiod" name="trendtype" checked="checked" value="base" />Pay Period <input type="radio" id="rdoMonth" name="trendtype" value="base" />Month</dd> -->
							</dl>


							<div id="comboprogress" style="z-index:2; position:absolute; top: 90px; left:90px;"></div>
							<!--<input id="btnTable" type="button" value="table" />-->
						</div>
						<div id="scoreeditorcontroldiv" class="filters panelbox" style="clear: left; z-index:0; width: 270px; height:auto; position:relative; overflow:visible;">
							<div style="text-align: center;">
								<input id="btnSEView" style="width:56px;" type="button" value="View" />
								<input id="btnSESave" style="width:106px;" type="button" disabled="disabled" value="Save Changes" />
								<input id="btnSECancel" style="width: 56px;" type="button" disabled="disabled" value="Cancel" />
							</div>
						</div>
                        <div class="settingsdiv-wrapper">
						<div id="settingsdiv" class="filters panelbox attrition-hide" style="clear:left; width: 270px; position:relative;">
							<!-- <div class="slidemenu" style="position:absolute;top:10px;right:0px;"><a href="#">-</a><a href="#">+</a><a href="#" onclick="if (settingstoggle) { $('#gaugesdiv,#filterdiv,#messagediv').animate({ height: '22px' }, 1000); }  else { $('#gaugesdiv,#filterdiv,#messagediv').animate({ height: '200px' }, 1000); } settingstoggle=!settingstoggle; return false;">^</a></div> -->
							<div style="font-size:18px; font-weight:bold;margin-top: -5px;">Settings
								<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='22px',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','auto'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
								    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
								<a class="help" target="_blank" href="../help.aspx?cid=DashboardSettings">&nbsp;&nbsp;&nbsp;</a>
							</div>
							<div id="StgSupervisorFilters_label" style="font-size:14px; font-weight:bold; margin-left: 10px; margin-top: 5px;display:none;">Supervisor Filters</div>
							<div id="StgSupervisorFilters" class="stg" style="display:none;">
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="Default" selected="selected">Show my default level.</option>
                                        <option value="Team">Show only my Team.</option>
                                        <option value="Location">Show <span class="locname">Location</span>.</option>
                                        <option value="Entire Project">Show Entire <span class="scaname">Project</span>.</option>
                                    </select>
								</div>
							</div>
							<div class="stg-reportgrouping-show">
								<div style="font-size:14px; font-weight:bold; margin-left: 10px; margin-top: 5px;">Report Grouping</div>
								<div id="StgReportGrouping" class="stg">
									<div style="margin: 5px 20px 10px 20px">
										<select style="display:none;">
                                            <option value="Separate">Separate</option>
                                            <option value="Combined" selected="selected">Combined</option>
                                        </select>
									</div>
								</div>
							</div>
							<div style="font-size:14px; font-weight:bold; margin-left: 10px; margin-top: 5px;">Graph Appearance</div>
							<div id="Div1" class="stg">
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="On" selected="selected">Labels On</option>
                                        <option value="Off">Labels Off</option>
                                    </select>
								</div>
							</div>
							<div id="StgBarView" class="stg">
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="Performance Colors" selected="selected">Display Red/Yellow/Green for all bars.</option>
                                        <option value="Series Colors">Display a unique color for each series.</option>
                                    </select>
								</div>
							</div>
							<div id="StgShowSeries" class="stg">
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="Every Series" selected="selected">Show every series.</option>
                                        <option value="Non-Zero Series">Show only non-zero series.</option>
                                    </select>
								</div>
							</div>
							<div id="StgScoreModel" class="stg" style="margin-top: 5px;">
								<div style="font-size:14px; font-weight:bold; margin-left: 10px;">Score Basis</div>
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="Balanced" selected="selected">Show Balanced Score</option>
                                        <option value="Raw">Show Raw Score (where applicable)</option>
                                        <!-- <option value="Overlay">Show Raw/Balanced Scores in Overlay (where applicable)</option> -->
                                    </select>
								</div>
							</div>
							<div id="StgInTraining" class="stg" style="margin-top: 5px;">
								<div style="font-size:14px; font-weight:bold; margin-left: 10px;">In-Training Scores</div>
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="Only">Only</option>
                                        <option value="Include">Include</option>
                                        <option value="Exclude" selected="selected">Exclude</option>
                                    </select>
								</div>
							</div>
							<div id="StgHireDatesFilter" class="stg" style="margin-top: 5px;">
								<div style="font-size:14px; font-weight:bold; margin-left: 10px;">Hire Dates</div>
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="Filter On">Filter by Hire Date Range</option>
                                        <option value="Filter Off" selected="selected">All Hire Dates Included in Results</option>
                                    </select>
								</div>
							</div>
							<div id="StgReportScoreModel" class="stg" style="margin-top: 5px;">
								<div style="font-size:14px; font-weight:bold; margin-left: 10px;">Report Score Model</div>
								<div style="margin: 5px 20px 10px 20px">
									<select style="display:none;">
                                        <option value="Balanced" >Balanced Score</option>
                                        <option value="Raw" selected="selected">Raw Score</option>
                                        <!-- <option value="Overlay">Show Raw/Balanced Scores in Overlay (where applicable)</option> -->
                                    </select>
								</div>
							</div>

							<div style="font-size:20px; font-weight:bold;margin: 10px;" class="attrition-show">Attrition/Retention Log</div>

							<div id="StgDeveloper" style="display:none;" class="stg">
								<input type="button" onclick="appApmMessaging.killactionscraper();" value="Kill Action Scraper" />
								<br /><input type="button" onclick="appApmMessaging.issuepollingsuspension(60 * 3);" value="Suspend Polling" />
								<br /><input type="button" onclick="appApmMessaging.testerror();" value="Throw Test Error" />
							</div>
						</div>
                        </div>
					</div>

					<div class="tabs" id="tabs">
						<ul>
							<li id="graphtab"><a id="graphlabel" class="tablabel" href="#tabs-1">Home</a>
								<!-- <a class="help help-in-tab" onclick="alert('debug:help!');" >&nbsp;&nbsp;&nbsp;</a> -->
							</li>
							<li id="graphsubtab"><a id="graphsublabel" class="tablabel graphsublabel" href="#tabs-1sub">Split</a></li>
							<li id="tabletab"><a id="tablelabel" class="tablabel" href="#tabs-2">Table</a></li>
							<li id="messagetab"><a id="messageslabel" class="tablabel" href="#tabs-3">Message Center</a></li>
							<li id="reporttab"><a id="reportlabel" class="tablabel" href="#tabs-report">Reports</a></li>
							<li id="advancedsettingstab"><a id="advancedsettingslabel" class="tablabel" href="#tabs-4">Advanced Settings</a></li>
							<li id="companytab"><a id="companyadminlabel" class="tablabel" href="#tabs-5">Company</a></li>
							<li id="modeltab"><a id="modeladminlabel" class="tablabel" href="#tabs-6">Model</a></li>
							<li id="projecttab"><a id="projectadminlabel" class="tablabel" href="#tabs-7"><span class="scaname">Project</span></a></li>
							<li id="kpitab"><a id="kpiadminlabel" class="tablabel" href="#tabs-8">KPI</a></li>
							<li id="subkpitab"><a id="subkpiadminlabel" class="tablabel" href="#tabs-9">SubKPI</a></li>
							<li id="userpreferencestab"><a id="userpreferenceslabel" class="tablabel" href="#tabs-10">User Preferences</a></li>
							<li id="scoreeditortab"><a id="scoreeditorlabel" class="tablabel" href="#tabs-11">Score Editor</a></li>
							<li id="manualimporttab"><a id="manualimportlabel" class="tablabel" href="#tabs-12">Manual Import</a></li>
							<li id="cepointstab"><a id="cepointslabel" class="tablabel" href="#tabs-13"><span class="RankPointsLabel"></span></a></li>
							<li id="cepointsmgrtab"><a id="cepointsmgrlabel" class="tablabel" href="#tabs-14"><span class="RankPointsLabel"></span> Mgr</a></li>
							<li id="attritiontab"><a id="attritionlabel" class="tablabel" href="#tabs-15">Attrition</a></li>
							<li id="suptoolstab"><a id="suptoolslabel" class="tablabel" href="#tabs-16">Tools</a></li>
							<li id="fantab"><a id="fanlabel" class="tablabel" href="#tabs-17">A-GAME</a></li>
							<li id="attendanceformtab" style="display:none;"><a id="attendanceformlabel" class="tablabel" href="#tabs-attendanceform">Attendance</a></li> <!-- MADELIVE -->
							<li id="journalformtab" style="display:none;"><a id="journalformlabel" class="tablabel" href="#tabs-journalform">Journal</a></li> <!-- MADELIVE -->
							<li id="reviewformtab" style="display:none;"><a id="reviewformlabel" class="tablabel" href="#tabs-reviewform">Review</a></li> <!-- MAKEDEV -->
							<li id="complianceformtab" style="display:none;"><a id="complianceformlabel" class="tablabel" href="#tabs-complianceform">Compliance</a></li> <!-- MAKEDEV -->
							<li id="journaltab" style="display:none;"><a id="journallabel" class="tablabel" href="#tabs-journals">Journals</a></li> <!-- MADELIVE -->
                            <li id="guidetab" style="display:none;"><a id="guidelabel", class="tablabel" href="#tabs-guide">Guide</a></li>
                            <li id="treasurehunttab" style="display:none;"><a id="treasurehuntlabel" class="tablabel" href="#tabs-18">Treasure Hunt (dev)</a></li>
                            <li id="helloworldtab" style="display:none;"><a id="helloworldlabel" class="tablabel" href="#tabs-helloworld">Hello World (dev)</a></li>
						</ul>
						<div id="tabs-1" style="background-color: #fff;">
							<div class="tabarea">
                                <div class="home-print-wrapper stg-field">
                                    <div class="report-print stg-field">
                                        <span class="acuity-print-grid" style="cursor:pointer;text-decoration:underline;">Print</span>
                                    </div>
                                </div>
							    <div class="home-show-wrapper stg-field" style="z-index:1;"><label style="/*REVERTED 2020-01-15: display:none;*/" id="ReportGroupingLabel">Show:</label><span style="/*REVERTED 2020-01-15: display:none;*/" id="HomeReportList" class="stg"></span></div>
							    <div class="home-grouping-wrapper stg-field" style="z-index:1;">
                                    <label id="Label1">Grouping:</label><span id="ReportGrouping" class="stg"></span>
                                </div>
								<div id="myreportcontainer" style="display:none;width: 300px;height:auto;float:left;background-color:White;padding: 10px;overflow-x:scroll;">Report View</div>
								<div id="mycontainer" style="position:relative;float:left;z-index:2;"></div>
								<div id="mycontainerprompt" style="display:none;text-align:center;z-index:100000;font-weight:bold;">Set Report Filter then click '<span class="plotname">Plot</span>'.</div>
							</div>
						</div>
						<div id="tabs-1sub" style="background-color: #fff;">
							<div class="tabarea">
								<div id="mycontainersub" style="position:relative;"></div>
								<div id="mycontainerpromptsub" style="display:none;text-align:center;z-index:100000;font-weight:bold;">Set Report Filter with SubKPI then click '<span class="plotname">Plot</span>'.</div>
							</div>
						</div>
						<div id="tabs-2">
							<div class="tabarea">
								<div class="table-label">History</div>
								<div id="mytable1">
									<table id="list1"></table>
									<div id="pager1"></div>
									<div id="tablemessage" style="margin-top: 20px;">Select a bar or point from the graph, and the results will display here.</div>
									<div class="table-sourcedivider" id="rowdv_show" style="display:none;">&nbsp;</div>
									<div id="serverside_rowdv" class="data-validation"></div>
									<div id="datasourcetables_row"></div>
									<div class="table-sourcedivider" id="tabledv_show" style="display:none;">&nbsp;</div>
									<div id="clientside_tabledv" class="data-validation"></div>
									<div id="serverside_tabledv" class="data-validation"></div>
									<div id="datasourcetables_table"></div>
								</div>
							</div>
						</div>
						<div id="tabs-3">
							<div class="tabarea" id="messagearea">
								<p>Messages are loading, please wait...</p>
							</div>
						</div>
						<div id="tabs-report">

							<div class="tabarea" style="background-color:White;">
								<div class="report-search-top">
									<div class="row">
										<div class="col-3">
											<label id="Label4">Search:</label>
											<input class="report-filter-global" type="text"  value="" placeholder="Search Report" />
										</div>
										<div class="col-3">
											<label id="Label3">Select Report:</label>
											<span id="ReportReportList" class="stg">
												<select data-placeholder="Select Report">
													<option value=""></option>
												</select>
											</span>
										</div>
										<div class="col-2">
											<label class="report-label-intraining">In-Training:</label>
											<span id="ReportShowInTraining" class="stg"></span>
										</div>
										<div class="col-2">
											<label class="report-label-grouping">Grouping:</label>
											<span id="ReportReportGrouping" class="stg"></span>
										</div>
										<div class="col-2 report-acuity-print" style="padding-top: 22px;">
											<span class="acuity-print" title="Print Page"><i class="fas fa-print"></i> Print</span>
										</div>

									</div>
								</div>

								<div class="clearfix"></div>

								<!--<div class="report-menu-wrapper">
									<div class="report-filter-wrapper stg-field">
										<label id="Label4">Search Report:</label>
										<input class="report-filter-global" type="text" style="width: 350px;" value="" />
									</div>
									<div class="report-show-wrapper stg-field">
										<label id="Label3">Show:</label>
										<span id="ReportReportList" class="stg">
											<select data-placeholder="Select Report" style="max-width: 250px;">
												<option value=""></option>
											</select>
										</span>
									</div>
									<div class="report-intraining-wrapper stg-field">
										<label class="report-label-intraining">In-Training:</label><span id="ReportShowInTraining" class="stg"></span>
									</div>
									<div class="report-grouping-wrapper stg-field">
										<label class="report-label-grouping">&nbsp;&nbsp;Grouping:</label><span id="ReportReportGrouping" class="stg"></span>
									</div>
									<div class="report-print stg-field">
										<span class="acuity-print" style="cursor:pointer;text-decoration:underline;">Print</span>
									</div>
								</div>-->

								<div class="ReportReports reports_instructions">
									<p>Select Report to Show and Set Filters.</p>
								</div>
							</div>
						</div>
						<div id="tabs-4">
							<div class="tabarea" id="advancedsettingsarea" style="height:100%;">
								<div style="font-size:14px; font-weight:bold; margin-left: 10px; margin-top: 5px;">Refresh Frequency</div>
								<div id="StgFilterRefreshFrequency" class="stg">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;">Filters</div>
									<div style="margin: 5px 20px 10px 20px">
										<select style="display:none;">
                        <option value="Minimum">Hold results as long as possible.</option>
                        <option value="Express">Refresh daily.</option>
                        <option value="Normal" selected="selected">Refresh every half hour.</option> <!-- CTHIX: -->
                        <option value="Always">Refresh every time - NOT RECOMMENDED.</option>
                    </select>
									</div>
								</div>
								<div id="StgGraphRefreshFrequency" class="stg">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;">Graphs/Tables</div>
									<div style="margin: 5px 20px 10px 20px">
										<select style="display:none;">
                        <option value="Minimum">Hold results as long as possible.</option>
                        <option value="Express">Refresh daily.</option>
                        <option value="Normal" selected="selected">Refresh every half hour.</option>
                        <option value="Always">Refresh every time - NOT RECOMMENDED.</option>
                    </select>
									</div>
								</div>
								<div id="StgEditingDiv" style="position:relative; margin-top: 15px; height: 50px;width:250px;display:inline-block;">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;position:absolute;top:0px;left:0px;">Editing of Forms</div>
									<div id="StgEditing" class="stg" style="position:absolute;top:0px;left:140px;">
										<select style="display:none;">
                        <option value="On" selected="selected">On</option>
                        <option value="Off">Off</option>
                    </select>
									</div>
								</div>
								<div id="StgRankingDiv" style="position:relative; margin-top: 15px; height: 50px;width:250px;display:inline-block;">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;position:absolute;top:0px;left:0px;">Compute Rankings</div>
									<div id="StgRanking" class="stg" style="position:absolute;top:0px;left:150px;">
										<select style="display:none;">
                        <option value="On">On</option>
                        <option value="Off" selected="selected">Off</option>
                    </select>
									</div>
								</div>
								<div id="StgBellDiv" style="position:relative; margin-top: 15px; height: 50px;width:250px;display:inline-block;">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;position:absolute;top:0px;left:0px;">Show Score Dist</div>
									<div id="StgBell" class="stg" style="position:absolute;top:0px;left:150px;">
										<select style="display:none;">
                        <option value="On">On</option>
                        <option value="Off" selected="selected">Off</option>
                    </select>
									</div>
								</div>
								<div id="StgSupToolsDiv" style="position:relative; margin-top: 15px; height: 50px;width:250px;display:inline-block;">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;position:absolute;top:0px;left:0px;">Supervisor Tools</div>
									<div id="StgSupTools" class="stg" style="position:absolute;top:0px;left:150px;">
										<select style="display:none;">
                        <option value="On">On</option>
                        <option value="Off" selected="selected">Off</option>
                    </select>
									</div>
								</div>
								<div id="StgInjDevDiv" style="position:relative; margin-top: 15px; height: 50px;width:250px;display:inline-block;">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;position:absolute;top:0px;left:0px;">Injection Dev Mode</div>
									<div id="StgInjDev" class="stg" style="position:absolute;top:0px;left:160px;">
										<select style="display:none;">
                        <option value="On">On</option>
                        <option value="Off" selected="selected">Off</option>
                    </select>
									</div>
								</div>
								<div id="StgRankCSRsBy" class="stg">
									<div style="font-size:14px; margin-left: 16px; margin-top:5px;">Rank CSRs By</div>
									<div style="margin: 5px 20px 10px 20px">
										<select style="display:none;">
                        <option value="Team">Show rank among active teammates.</option>
                        <option value="Group">Show rank among active group members.</option>
                        <option value="Location">Show rank at location.  NOTE: Balanced score ranking is not project-specific.</option>
                        <option value="PartnerTier">Show rank among active agents at the PartnerTier.</option>
                        <option value="Project">Show rank among active agents on the project (all locations included).</option>
                        <option value="ProjectLocation" selected="selected">Show rank among active agents on the project/location.</option>
                    </select>
									</div>
								</div>

								<div id="experimental1" style="display:none;">
									<h1>EXPERIMENTAL</h1>
									<div id="StgAdvancedTest" class="stg">
										<select style="display:none;">
                    <option value="1" selected="selected">Setting 1</option>
                    <option value="2">Setting 2</option>
                    <option value="3">Setting 3</option>
                </select>
									</div>
									<div id="AdvancedNotifications" class="stg">
										<p>HERE ARE THE NOTIFICATION SETTINGS</p>
									</div>

									<div id="AdvancedNotifications2" class="stg">
										<p>HERE ARE THE NOTIFICATION SETTINGS also</p>
									</div>

									<div id="AdvancedNotificationsCombo" class="stg">
										<p>HERE ARE THE NOTIFICATION SETTINGS also combo</p>
									</div>

									<div id="AdvancedGraphLabels" class="stg">
										<p>Label Settings</p>
									</div>
								</div>
							</div>
						</div>
						<div id="tabs-5">
							<div class="tabarea" id="companyadminarea">..Loading</div>
						</div>
						<div id="tabs-6">
							<div class="tabarea" id="modeladminarea">Select Model from menu..</div>
						</div>
						<div id="tabs-7">
							<div class="tabarea" id="projectadminarea">Select <span class="scaname">Project</span> from menu..</div>
						</div>
						<div id="tabs-8">
							<div class="tabarea" id="kpiadminarea">Select KPI from menu..</div>
						</div>
						<div id="tabs-9">
							<div class="tabarea" id="subkpiadminarea">Select SubKPI from menu..</div>
						</div>
						<div id="tabs-10">
							<div class="tabarea" id="userpreferencesarea">
								<div style="font-size:14px; font-weight:bold; margin-left: 10px; margin-top: 5px;">Notifications</div>
								<div id="StgNotifications" class="stg">
									<div style="margin: 5px 20px 10px 20px">
										<select style="display:none;">
                        <option value="None">Don't Show Notifications</option>
                        <option value="Banner" selected="selected">Show a Colored Banner in Messages Section</option>
                        <option value="Alert">Display an Alert Box</option>
                    </select>
									</div>
								</div>
								<div style="margin-top: 5px;">
									<label style="float:left;font-weight:bold;">Tool Tips:&nbsp;</label>
									<span id="StgTooltips" class="stg">
                    <select style="display:none;">
                        <option value="On" selected="selected">On</option>
                        <option value="Off">Off</option>
                    </select>
                </span>
								</div>

							</div>
						</div>
						<div id="tabs-11">
							<div class="tabarea" id="scoreeditorarea">Set Data Source, Filter, then click View.</div>
						</div>
						<div id="tabs-13">
							<!-- #Include virtual="../applib/html/views/rankpoints.htm" -->
						</div>
						<div id="tabs-14">
							<div class="tabarea" id="cepointsmgrarea">
								<h1><span class="RankPointsLabel"></span> Redemption Ledger</h1>
								<div class="CEPointsMgrLedger-wrapper">
									<div class="CEPointsMgrLedger">
										<table>
											<tr>
												<td></td>
												<td>Requested</td>
												<td>Fulfilled</td>
												<td>Name</td>
												<td>Request</td>
												<td>Points</td>
												<td>$ Value</td>
												<td>Total</td>
											</tr>
										</table>
									</div>
								</div>
								<h1>Cash/Prize Table</h1>
								<div class="CEPointsPrizes" id="CEPointsPrizesMgrCopy">
								</div>
							</div>
						</div>
						<div id="tabs-15">
							<div class="subtabs" id="tabsattrition">
								<ul>
									<li><a class="tablabel attrition-management-link" href=".AttritionLedger-wrapper">Management</a>
									</li>
									<li style="display:none;"><a class="tablabel attrition-reports-link" href=".AttritionLedger-wrapper">Reports</a></li>
								</ul>
							</div>
							<div class="tabarea" id="attritionarea">
								<div class="AttritionLedger-wrapper" style="margin-top: 30px;">
									<div class="AttritionLedger">
										<p>Loading...</p>
									</div>
								</div>
								<div class="AttritionReports-wrapper" style="display:none;">
                                    <div class="report-grouping-wrapper stg-field">
                                        <label class="report-label-intraining">In-Training:</label><span id="AttritionShowInTraining" class="stg"></span>
                                        <label id="Label2">&nbsp;&nbsp;Grouping:</label><span id="AttritionReportGrouping" class="stg"></span>
                                    </div>
									<div class="AttritionReports" style="margin-top: 0px;" >
										<p>Attrition Grid</p>
									</div>
								</div>
							</div>
						</div>
						<div id="tabs-16">
							<div class="tabarea" id="suptoolsarea">
								<div class="SupTools-wrapper">
									<div class="SupTools">
										<div class="sup-controlpanel">
											<div class="sup-Heading" data-bind="text: heading()">Click Slider on Right to Load</div>
											<div id="StgToolsLevel" class="stg">
												<div class="sup-stgtoolslevel">
													<select style="display:none;">
                                        <option value="CSR" selected="selected">CSR Level</option>
                                        <option value="Team">Team Level</option>
                                        <option value="Group" disabled="disabled">Group Level</option>
                                        <option value="Location">Location Level</option>
                                    </select>
												</div>
											</div>
										</div>

										<div class="sup-MissingKPI" style="display:none;">
											<h1>Missing KPIs</h1>
											<div class="sup-MissingKPITable">
												<table></table>
												<div class="sup-MissingKPIAgents"></div>
											</div>
										</div>

										<div class="sup-KPICards" data-bind="foreach: cards().kpis">
											<table>
												<thead>
													<tr>
														<th class="sup-KPICardHeader" colspan="2" data-bind="text: text"></th>
													</tr>
													<tbody data-bind="foreach: srt">
														<tr class="sup-KPICardMember">
															<td class="sup-KPICardName">
																<span class="sup-memberuid" data-bind="text:member.uid"></span>
																<span class="sup-colorblock" data-bind="style: { backgroundColor: displaycolor }">&nbsp;&nbsp;&nbsp;&nbsp;</span>
																<b data-bind="text:displaystatus"></b>
																<span data-bind="text: displayname"></span>
															</td>
															<td class="sup-KPICardScore" data-bind="text: displayscore"></td>
														</tr>
													</tbody>
											</table>
										</div>
									</div>
									<div class="SupTools-bottompadding">&nbsp;</div>
								</div>
							</div>

						</div>
						<div id="tabs-17">
                          <div id="AllAgame">
							<!-- #Include virtual="../applib/html/views/fan-2.5.htm" -->
                          </div>
						</div>
                        <div id="tabs-18">
							<!-- #Include virtual="dev_ayokay/html/views/treasurehunt.htm" -->
                        </div>
                        <div id="tabs-helloworld">
							<!-- #Include virtual="dev_helloworld/html/views/helloworld.htm" -->
                        </div>
                        <div id="tabs-guide">
                            <div class="tabarea">
                                <iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts" src="../applib/html/guides/chime-start-guide/index.html?a6" id="GuideIframe" name="myguideframe" style="border:0px; width: 1200px;  height: 100%" ></iframe>
                            </div>
                        </div>

                        <!-- MADELIVE -->
                        <div id="tabs-attendanceform">
                            <div class="tabarea">
                                <p class="attendanceform-message">Please select a Team and CSR (use the filters on the left).</p>
                                <iframe src="" id="AttendanceformIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
                                <!-- sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation" -->
                            </div>
                        </div>

                        <!-- MADELIVE -->
                        <div id="tabs-journalform" style="width: 100%; height: 100%;">
                            <div class="tabarea tabarea-journal" style="width: 100%; height: 100%;">
                                <div class="journalform-dev" style="position:absolute; right: 10px; color: gray; font-size: 8px;"></div>
                                <p class="journalform-message">Please select a Team and CSR (use the filters on the left).</p>
                                <iframe src="" id="JournalformIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
                            </div>
                        </div>

                        <!-- MAKEDEV -->
                        <div id="tabs-reviewform">
                            <div class="tabarea" style="position:relative;">
                                <div class="reviewform-dev" style="position:absolute; right: 10px; color: gray; font-size: 8px;"></div>
                                <p class="reviewform-message">Please select a Team and CSR (use the filters on the left).</p>
                                <iframe src="" id="ReviewformIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
                            </div>
                        </div>

                        <!-- MAKEDEV -->
                        <div id="tabs-complianceform">
                            <div class="tabarea">
                                <iframe src="" id="ComplianceformIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
                            </div>
                        </div>

						<div id="plotprogress" class="progressindicator" style="z-index:10; position:absolute; top: 50px; left:280px;display:none;"></div>

						<div id="set">
							<div id="mytable2" style="position:absolute;top: 375px; left:85px; z-index:1;">
								<table id="list2"></table>
							</div>
							<div id="mytable3" style="position:absolute;top: 410px; left:140px; z-index:1;">
								<table id="list3"></table>
							</div>
							<div id="mytable4" style="position:absolute;top: 445px; left:195px; z-index:1;">
								<table id="list4"></table>
							</div>
							<div id="mytable5" style="position:absolute;top: 480px; left:250px; z-index:1;">
								<table id="list5"></table>
							</div>
						</div>
					</div>
					<div class="content" id="manualimportdiv">
						<iframe id="importframe" src="" scrolling="no" frameborder="0"></iframe>
					</div>

					<script type="text/javascript">
					    //SETTINGS
					    var mytestsetting;
					    var controlopts;
					</script>
					<div id="mytestsetting" style="display:none;" runat="server"></div>

					<script type="text/javascript">
                        var FIRSTPASS = true;
						function chartclick0(event) {
							appApmDashboard.chartclick(event, 0, this);
						};

						var op = {
							apmClickFunction: chartclick0,
							apmShowInLegend: true,
							apmQid: 'KPIChart',
							apmTouchpointDashboardFormatting: true,
							report: {
								display: true,
								renderTo: "myreportcontainer",
								cid: "SpreadsheetDashboard", //"ScoreBrief" for companion view, can be changed.
								layout: "full", //companion to sit to left of graph (width of width), full if it replaces the graph and it gets hidden.
								width: 325 //If 0 (or not companion), then full width and hide dashboard
							},
							chart: {
								renderTo: 'mycontainer',
								defaultSeriesType: 'column',
								spacingTop: 30
							},
							title: {
								text: ''
							},
							xAxis: {
								/*
								labels: {
								rotation: 270,
								align: 'right'
								},
								*/
								categories: ["Select Criteria and 'plot'"]
							},
							yAxis: [{
									//min: 0, //By removing, it allows it to go negative.
									max: 10,
									//tickInterval: 2,
									//categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
									title: {
										text: 'KPI Score'
									},
									labels: {
										step: 1
									}
								} /* FIDDLE: */ //,{ title: { text: 'Raw Score' } }
							],
							tooltip: {
                                useHTML: true,
								formatter: function() {
									return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */ this.point.name + '</div>';
								}
							},
							plotOptions: {
								column: {
									stacking: null,
									borderRadius: 8,
									borderWidth: 0
									/*,
									animation: {
									duration: 1000,
									easing: 'swing'
									}
									*/
								},
								series: {
									dataLabels: {
										enabled: true,
										/* color: 'white',
										style: {
											fontWeight: 'bold',
											backgroundColor: '#FFA500',
											padding: '2px'
										},
										borderColor: '#AAA', */
                                        useHTML: true,
										formatter: function() {
											return (Math.round(this.y * 100.0) / 100.0);
										}
									}
								}
							},
							/* colors: ['blue'], */
							credits: {
								enabled: false
							},
							lang: {
								/* helpBtnTitle: 'Graph System Overview', */
								tableBtnTitle: 'Show Graph as a Table'
							},
							exporting: {
								buttons: {
                                    /*
									helpBtn: {
										symbol: 'url(appApmClient/themes/default/images/help.gif)',
										tooltip: 'here',
										_titleKey: 'helpBtnTitle',
										x: -88,
										symbolFill: '#B5C9DF',
										symbolX: 10,
										symbolY: 8,
										hoverSymbolFill: '#779ABF',
										onclick: function() {
											window.open("../help.aspx?cid=GraphOverview");
										}
									},
                                    */
									tableBtn: {
										symbol: 'url(appApmClient/themes/default/images/table.gif)',
										tooltip: 'here',
										_titleKey: 'tableBtnTitle',
										x: -62,
										symbolFill: '#B5C9DF',
										symbolX: 10,
										symbolY: 10,
										hoverSymbolFill: '#779ABF',
										onclick: function() {
											appApmDashboard.graphtotable(0);
										}
									}
									/*,

									printButton: {
									enabled: false
									}*/
								}
							},
							series: [{
								type: 'column',
								name: '(selection)',
								yAxis: 0,
								data: [0],
								showInLegend: false
							}]
						};


						var opsub = {
							apmClickFunction: chartclick0,
							apmShowInLegend: true,
							apmQid: 'KPIChart',
							apmTouchpointDashboardFormatting: true,
							report: {
								display: true,
								renderTo: "myreportcontainer",
								cid: "SpreadsheetDashboard", //"ScoreBrief" for companion view, can be changed.
								layout: "full", //companion to sit to left of graph (width of width), full if it replaces the graph and it gets hidden.
								width: 325 //If 0 (or not companion), then full width and hide dashboard
							},
							chart: {
								renderTo: 'mycontainersub',
								defaultSeriesType: 'column',
								spacingTop: 30
							},
							title: {
								text: ''
							},
							xAxis: {
								/*
								labels: {
								rotation: 270,
								align: 'right'
								},
								*/
								categories: ["Select Criteria and 'plot'"]
							},
							yAxis: [{
									//min: 0, //By removing, it allows it to go negative.
									max: 10,
									//tickInterval: 2,
									//categories: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
									title: {
										text: 'SubKPI Score'
									},
									labels: {
										step: 1
									}
								} /* FIDDLE: */ //,{ title: { text: 'Raw Score' } }
							],
							tooltip: {
                                useHTML: true,
								formatter: function() {
									return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + /* 'Score: ' + (Math.round(this.point.y * 100.0) / 100.0) + '<br/>' +  'Raw Score: ' + */ this.point.name + '</div>';
								}
							},
							plotOptions: {
								column: {
									stacking: null,
									borderRadius: 8,
									borderWidth: 0
									/*,
									animation: {
									duration: 1000,
									easing: 'swing'
									}
									*/
								},
								series: {
									dataLabels: {
										enabled: true,
										/*color: 'white',
										style: {
											fontWeight: 'bold',
											backgroundColor: '#FFA500',
											padding: '2px'
										},
										borderColor: '#AAA', */
                                        useHTML: true,
										formatter: function() {
											return (Math.round(this.y * 100.0) / 100.0);
										}
									}
								}
							},
							/* colors: ['blue'], */
							credits: {
								enabled: false
							},
							lang: {
								/*helpBtnTitle: 'Graph System Overview',*/
							},
							exporting: {
							    buttons: {
                                    /*
									helpBtn: {
										symbol: 'url(appApmClient/themes/default/images/help.gif)',
										tooltip: 'here',
										_titleKey: 'helpBtnTitle',
										x: -62,
										symbolFill: '#B5C9DF',
										symbolX: 10,
										symbolY: 8,
										hoverSymbolFill: '#779ABF',
										onclick: function() {
											window.open("../help.aspx?cid=GraphOverview");
										}
									}
                                    */
									/*,

									printButton: {
									enabled: false
									}*/
								}
							},
							series: [{
								type: 'column',
								name: '(selection)',
								yAxis: 0,
								data: [0],
								showInLegend: false
							}]
						};

						var opt = {
							apmTableType: 'single', //Valid types are 'cascade', 'single'
							apmTableMax: 5,
							apmTableId: 'list1', //if tabletype is 'cascade', this is a prefix.
							apmPagerId: 'pager1',
							apmAcuityHeaderOffset: true,
							apmTouchpointDashboardFormatting: true,
							apmQid: 'KPITable',
							datatype: "local",
							height: 'auto',
							/* rowList: [10, 20, 30], */
							/*colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
							colModel: [{ name: 'id', index: 'id', width: 60, sorttype: "int" },
							{ name: 'invdate', index: 'invdate', width: 90, sorttype: "date", formatter: "date" },
							{ name: 'name', index: 'name', width: 100, editable: true },
							{ name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", formatter: "number", editable: true },
							{ name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float", editable: true },
							{ name: 'total', index: 'total', width: 80, align: "right", sorttype: "float" },
							{ name: 'note', index: 'note', width: 150, sortable: false }
							],*/
							pager: "#plist48",
							viewrecords: true,
							//sortname: 'Name',
							//grouping: true,
							//groupingView: {
							//    groupField: ['Name'],
							//    groupCollapse: true
							//},
							caption: "Grouping Array Data",
							onSelectRow: function(id) {
								appApmDashboard.rowselected(id);
							}
						};

						$(':input').focus(function() {
							appApmDashboard.setPrev(this.value);
						}).change(function() {
							appApmDashboard.change(this);
							appApmDashboard.setPrev(this.value);
						});

						$.cookie("ApmGuatModuleLoc", "9");
						var global_attritionvisible = false;
						var global_attritiontestingvisible = false;
						var global_oldprojecttext = $.cookie("PROJECTTEXT");
						var global_currentfilter = "";
						controlopts = {
						    Athreshold: 8.0,
						    Bthreshold: 4.0,
						    /* performanceRanges is now brought in via CDS.  Not sure we'll go this route for everything, but this does work. */
						    /* performanceRanges: [
						    { letter: "A", threshold: 8.0, pie: { low: 8.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] },
						    { letter: "B", threshold: 4.0, pie: { low: 4.0, high: 8.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] },
						    { letter: "C", threshold: -99999.0, pie: { low: 0.0, high: 4.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']] }
						    ],*/
						    initfunction: function () {
						        appApmDashboard.movefilters(0); //Debug: I added Location to this on 7/22/2016 to account for the case where we're doing a location check by xaxis.
						        appApmDashboard.refreshboxes({
						            which: 'Agency,Project,Xaxis',
						            success: function () {
						                var projectchanged = false;
						                //alert("debug:localstorage(" + appApmDashboard.getCookiePrefix() + "-Project" + ")=" + window.localStorage.getItem(appApmDashboard.getCookiePrefix() + "-Project"));
						                //$.cookie("AB-Project", "TEST");
						                //alert("debug:cookietest=" + $.cookie("AB-Project"));
						                if (global_oldprojecttext != "") {
						                    $("#selProjects option").each(function () {
						                        if ($(this).html() == global_oldprojecttext) {
						                            var val = $(this).val();
						                            if (val != $.cookie(appApmDashboard.getCookiePrefix() + "-Project")) {
						                                $('#selProjects').val(val).trigger("liszt:updated");
						                                //alert("debug: projectfiltersready");
						                                projectchanged = true;
						                            }
						                        }
						                    });
						                }
						                appApmDashboard.refreshboxes({
						                    which: 'Agencyoffice,Location,Group,Team,CSR,KPI,SubKPI,Payperiod,DataSource,Trendby' + mpar,
						                    success: function () {
						                        appApmDashboard.finishinit({
						                            exclude: 'Payperiod',
						                            projectchanged: projectchanged
						                        });

						                        if ((a$.urlprefix() == "nex.") || (a$.urlprefix().indexOf("make") >= 0)) {
						                            $('#selKPIs').val('eachlabel').trigger("liszt:updated");
						                        } else {
						                            $('#selKPIs').val('each').trigger("liszt:updated");
						                        }

						                        if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-mnt") >= 0)) {
						                            if (true) { //(FIRSTPASS) {
						                                FIRSTPASS = false;
						                                $("#selProjects").val("each").trigger("liszt:updated");
						                                $("#selLocations").val("each").trigger("liszt:updated");
						                                if ($.cookie("TP1Role") == "Team Leader") {
						                                    $("#selCSRs").val("each").trigger("liszt:updated");
						                                    $("#filtersdiv").show();
						                                    $("#selKPIs").val("").trigger("liszt:updated");
						                                }
						                            }
						                            if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
						                                //$.cookie("CoxSkipWhen2","0");
						                                //alert("debug: skip 2c");
						                            }
						                        }

						                        if (document.getElementById("rdoGrid").checked) {
						                            $("#rdoGrid").trigger("click");
						                        } else {
						                            $("#rdoBase").trigger('click');
						                        }

						                        appApmDashboard.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto'));
						                        if ($("#selProjects").val() != null) {
						                            if (appApmReport.currentFilter() == ($("#StgDashboard select").val())) {
						                                appApmReport.plotIntercept(0, true, false);
						                            }
						                            //ko.applyBindings(FanViewModel(), $(".fan-wrapper")[0]);
						                            ko.postbox.publish("Role", $.cookie("TP1Role"));
						                        }
						                        ko.postbox.publish("JournalCSR", $("#selCSRs").val());
						                        ko.postbox.publish("JournalTeam", $("#selTeams").val());
						                        if ($("#selCSRs").val() != "") {
						                            ko.postbox.publish("CSR", $("#selCSRs").val());
						                        } else if ($("#selTeams").val() != "") {
						                            ko.postbox.publish("Team", $("#selTeams").val());
						                        }
						                        if ($("#selLocations").val() != "") {
						                            ko.postbox.publish("Location", $("#selLocations").val());
						                        }
						                        if ((a$.urlprefix() == "chime.") || (a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime-mnt.")) { //Set location to 1 (Morrow)
						                            if (false) {
						                                $("#selLocations").val("1").trigger("liszt:updated");
						                                $("#locationlabel,#locationfilter").hide();
						                            }
						                        }
						                        //alert("debug: filtersready");
						                        window.CoxFiltersReady = true; // "cox."
						                    }
						                });
						            }
						        }); //This will set the project to the first project.
						        //appApmDashboard.refreshboxes('Project,Xaxis', appApmDashboard.refreshboxes('Location,Group,Team,CSR,KPI,SubKPI,Payperiod')); //This will set the project to the first project.
						        //appApmDashboard.refreshboxes('Location,Group,Team,CSR,KPI,SubKPI,Payperiod');
						    },
						    pagecontrols: [{
						        type: 'select',
						        idtemplate: 'Agency',
						        onchange: function () {
						            appApmDashboard.refreshboxes({
						                which: 'Agencyoffice,Location,Group,Team,CSR,KPI,SubKPI',
						                param: function () {
						                    return appApmDashboard.boxval('Agency')
						                }
						            });
						        },
						        param: function () {
						            return appApmDashboard.boxval('Agency')
						        }
						    },
								{
								    type: 'select',
								    idtemplate: 'Agencyoffice',
								    onchange: function () {
								        appApmDashboard.refreshboxes({
								            which: 'Location,Group,Team,CSR,KPI,SubKPI',
								            param: function () {
								                return appApmDashboard.boxval('Agencyoffice')
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Agencyoffice')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Project',
								    onchange: function () {
								        if (document.getElementById("rdoGrid").checked) {
								            multiChanged("selProjects");
								        }
								        global_oldprojecttext = $("#selProjects option:selected").text();
								        $.cookie("PROJECTTEXT", global_oldprojecttext);
								        appApmDashboard.refreshboxes({
								            which: 'Location,Group,Team,CSR,KPI,SubKPI,Payperiod,Trendby,DataSource',
								            success: function () {
								                appApmDashboard.setdaterangeslider($("#selTrendbys").val());
								                appApmMessaging.composecontacts();
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Project')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Location',
								    onchange: function () {
								        if (document.getElementById("rdoGrid").checked) {
								            multiChanged("selLocations");
								        }
								        appApmDashboard.refreshboxes({
								            which: ((a$.urlprefix().indexOf("bgr") >= 0) ? 'Group,Team,CSR,DataSource,Payperiod'
                                            : (($.cookie("ApmGuatModuleLoc") != "") && ((appApmDashboard.getPrev() == $.cookie("ApmGuatModuleLoc")) || ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc"))))
                                            ? 'Group,Team,CSR,DataSource,Payperiod' : 'Group,Team,CSR,DataSource'),
								            success: function () {
								                appApmMessaging.composecontacts();
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Location')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Group',
								    onchange: function () {
								        if (document.getElementById("rdoGrid").checked) {
								            multiChanged("selGroups");
								        }
								        $("#selTeams option").remove();  //Empty this box to play better with FilterContext (otherwise I need to call Team and CSR separately).
								        ko.postbox.publish("Team", "");
								        appApmDashboard.refreshboxes({
								            which: 'Team,CSR',
								            success: function () {
								                appApmMessaging.composecontacts();
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Group')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Team',
								    onchange: function () {
								        if (document.getElementById("rdoGrid").checked) {
								            multiChanged("selTeams");
								        }
								        //alert("debug: teams value = " + $("#selTeams").val());
								        ko.postbox.publish("JournalTeam", $("#selTeams").val());
								        ko.postbox.publish("Team", $("#selTeams").val());
								        appApmDashboard.refreshboxes({
								            which: 'CSR',
								            success: function () {
								                appApmMessaging.composecontacts();
								            }
								        });
								    },
								    param: function () {
								        return appApmDashboard.boxval('Team')
								    },
								    onrefresh: function () {
								        ko.postbox.publish("JournalTeam", $("#selTeams").val());
								        ko.postbox.publish("Team", $("#selTeams").val());
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'CSR',
								    onchange: function () {
								        if (document.getElementById("rdoGrid").checked) {
								            multiChanged("selCSRs");
								        }
								        if ($("#selCSRs").val() == "each") {
								            $("#filtersdiv").show();
								        }
								        else if (($("#selCSRs").val() == "") && ((a$.urlprefix() == "ers-mnt.") || (a$.urlprefix() == "ers."))) {
								            $("#filtersdiv").show();
								        }
								        else {
								            //No more hiding: $("#filtersdiv").hide();
								        }
								        ko.postbox.publish("JournalCSR", $("#selCSRs").val());
								        ko.postbox.publish("CSR", $("#selCSRs").val());
								    },
								    onrefresh: function () {
								        ko.postbox.publish("JournalCSR", $("#selCSRs").val());
								        ko.postbox.publish("CSR", $("#selCSRs").val());
								        switch ($("#StgDashboard select").val()) {
								            case "Program":
								            case "Financial":
								                if ($("#selCSRs").val() == "") {
								                    $("#selCSRs option").each(function () {
								                        if ($(this).val().toLowerCase().indexOf("plate") >= 0) {
								                            $("#selCSRs").val($(this).val()).trigger("liszt:updated");
								                        }
								                    });
								                }
								        }
								    },
								    param: function () {
								        return appApmDashboard.boxval('CSR')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Payperiod',
								    onchange: function (sp) {
								        appApmDashboard.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto'));
								        if (sp) {
								            if (sp != 2) {
								                $("#drpPayperiods").data('dateRangePicker').setDateRange($("#spanDatefrom").html(), $("#spanDateto").html());
								            }
								        } else {
								            $("#drpPayperiods").data('dateRangePicker').setDateRange($("#spanDatefrom").html(), $("#spanDateto").html());
								        }
								    },
								    param: function () {
								        return appApmDashboard.splitdateval('Payperiod')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'KPI',
								    onchange: function () {
								        appApmDashboard.refreshboxes({
								            which: 'SubKPI',
								            success: function () { }
								        });
								    },
								    onrefresh: function () {
								        /*
								        var sb = document.getElementById('selKPIs');
								        for (var i = 0; i < sb.options.length; i++) {
								        if (sb.options[i].text.indexOf('Quality') >= 0) {
								        sb.options[i].selected = true; break;
								        }
								        }
								        */
								    },
								    param: function () {
								        return appApmDashboard.boxval('KPI')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'SubKPI',
								    onrefresh: function () {
								        var ln = $("#selSubKPIs > option").length;
								        if (ln <= 2) { //2 is (All) and (Each)
								            $(".subkpi-display").hide();
								            $("#selSubKPIs").html("");
								        } else {
								            $(".subkpi-display").show();
								        }
								    },
								    param: function () {
								        return appApmDashboard.boxval('SubKPI')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Xaxis',
								    param: function () {
								        return appApmDashboard.boxval('Xaxis')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'Trendby',
								    onchange: function () { },
								    param: function () {
								        return appApmDashboard.boxval('Trendby')
								    }
								},
								{
								    type: 'select',
								    idtemplate: 'DataSource',
								    param: function () {
								        return appApmDashboard.boxval('DataSource')
								    }
								},
							],
						    views: [{
						        chartoptions: op,
						        chartoptionssub: opsub,
						        tableoptions: opt,
						        filters: [{
						            pcid: 'Agency'
						        },
									{
									    pcid: 'Agencyoffice'
									},
									{
									    pcid: 'Project'
									},
									{
									    pcid: 'Location'
									},
									{
									    pcid: 'Group'
									},
									{
									    pcid: 'Team'
									},
									{
									    pcid: 'CSR'
									},
									{
									    pcid: 'Payperiod',
									    customdate: true,
									    dashboardformatting: true,
									    customdatewarning: true
									},
									{
									    pcid: 'KPI'
									},
									{
									    pcid: 'SubKPI'
									},
									{
									    pcid: 'Xaxis'
									},
									{
									    pcid: 'DataSource'
									},
									{
									    pcid: 'Trendby'
									}
								]
						    }],
						    rank_gpaper: null,
						    rank_gpaper2: null,
						    varirankgauge: function (o) {
						        $("#rankover").html("").show();
						        if (o.paper == null) {
						            o.paper = Raphael("rankover", 280, 50);
						        }
						        if (a$.exists(o.paper2)) {
						            $("#rankover2").html("").show();
						            if (o.paper2 == null) {
						                o.paper2 = Raphael("rankover2", 280, 50);
						            }
						            o.paper2.clear();
						            $("#gaugediv").css("height", "250px");
						            $("#rankdiv").css("height", "120px");
						        }
						        else {
						            $("#rankover2").html("").hide();
						            $("#gaugediv").css("height", "200px");
						            $("#rankdiv").css("height", "70px");
						        }
						        o.paper.clear();
						        var LX = controlopts.rankopts.xoffset,
									LY = 17,
									WIDTH = controlopts.rankopts.barwidth,
									HEIGHT = 20,
									TY = 7;

						        function rect(ro) {
						            var rectangle = o.paper.rect(LX + (ro.segment.low * WIDTH), LY, (ro.segment.high - ro.segment.low) * WIDTH, HEIGHT);
						            //rectangle.attr({ fill: "30-" + ro.color + "-" + ro.color + ":40-" + ro.color, stroke: "white", "stroke-width": 2, "stroke-opacity": 0, "fill-opacity": 1.0 });
						            //With gradient:
						            rectangle.attr({
						                fill: "30-" + ro.stops[0][1] + "-" + ro.color + ":40-" + ro.color,
						                stroke: "white",
						                "stroke-width": 2,
						                "stroke-opacity": 0,
						                "fill-opacity": 1.0
						            });
						            var letter = o.paper.text(LX + (ro.segment.low * WIDTH) + (0.5 * (ro.segment.high - ro.segment.low) * WIDTH), TY, ro.letter);
						            letter.attr({
						                fill: "white",
						                "font-size": "12"
						            });
						        }
						        for (var i = o.ranges.length - 1; i >= 0; i--) {
						            rect(o.ranges[i]);
						        }

						        if (a$.exists(o.paper2)) {
						            var LX = controlopts.rankopts.xoffset,
									    LY = 17,
									    WIDTH = controlopts.rankopts.barwidth,
									    HEIGHT = 20,
									    TY = 7;

						            function rect2(ro) {
						                var rectangle = o.paper2.rect(LX + (ro.segment.low * WIDTH), LY, (ro.segment.high - ro.segment.low) * WIDTH, HEIGHT);
						                //rectangle.attr({ fill: "30-" + ro.color + "-" + ro.color + ":40-" + ro.color, stroke: "white", "stroke-width": 2, "stroke-opacity": 0, "fill-opacity": 1.0 });
						                //With gradient:
						                rectangle.attr({
						                    fill: "30-" + ro.stops[0][1] + "-" + ro.color + ":40-" + ro.color,
						                    stroke: "white",
						                    "stroke-width": 2,
						                    "stroke-opacity": 0,
						                    "fill-opacity": 1.0
						                });
						                var letter = o.paper2.text(LX + (ro.segment.low * WIDTH) + (0.5 * (ro.segment.high - ro.segment.low) * WIDTH), TY, ro.letter);
						                letter.attr({
						                    fill: "white",
						                    "font-size": "12"
						                });
						            }
						            for (var i = o.ranges2.length - 1; i >= 0; i--) {
						                rect2(o.ranges2[i]);
						            }
						        }
						        //var triangle = gpaper.path("M 25 25 l 10 10 l -20 0 l 10 -10");
						        //triangle.attr("fill", "white");
						    }
						};
						var mpar = "";
						var settingstoggle = true;
						var debug_makingsprintgame = false; //DEBUG: Make sure this is false if pushing live.

						//TODO: Put this somewhere.
						var m_was = {
							selProjects: {
								all: true,
								each: false,
								other: false
							},
							selLocations: {
								all: true,
								each: false,
								other: false
							},
							selGroups: {
								all: true,
								each: false,
								other: false
							},
							selTeams: {
								all: true,
								each: false,
								other: false
							},
							selCSRs: {
								all: true,
								each: false,
								other: false
							}
						};

						function multiChanged(t) {
							if (!$("#" + t)[0].hasAttribute("multiple")) return;

							var v = $("#" + t).val();
							var changed = false;
							if (v == null) {
								v = [""];
							} else if (v[0] == "") {
								if (m_was[t].other || m_was[t].each) {
									v = [""]; //Changing to all
									m_was[t].all = true;
									m_was[t].each = false;
									m_was[t].other = false;
								} else { //Was "all" before
									if (v[1] == "each") {
										//changing to each
										v = ["each"];
										m_was[t].each = true;
										m_was[t].all = false;
									} else if (v.length > 1) {
										//changing to other
										v.splice(0, 1);
										m_was[t].other = true;
										m_was[t].all = false;
									} else {
										m_was[t].all = true;
										m_was[t].each = false;
										m_was[t].other = false;
									}
								}
							} else if (v[0] == "each") { //All is not selected, but each is.
								if (m_was[t].other || m_was[t].all) {
									v = ["each"]; //Changing to each
									m_was[t].all = false;
									m_was[t].each = true;
									m_was[t].other = false;
								} else if (v.length > 1) {
									//changing to other
									v.splice(0, 1);
									m_was[t].other = true;
									m_was[t].each = false;
								} else {
									m_was[t].all = false;
									m_was[t].each = true;
									m_was[t].other = false;
								}
							} else { //Stuff in there, but it's not all or each (so other)
								m_was[t].all = false;
								m_was[t].each = false;
								m_was[t].other = true;
							}
							if (m_was[t].each || m_was[t].other) {
								if ((v.length > 1) && (v[0] == "")) {
									v.splice(0, 1);
								}
							}
							changed = true;
							if (changed) {
								$("#" + t).val(v);
								$("#" + t).trigger("liszt:updated");
							}
						}

						function multiSetMultiple(t) {
							if (!$("#" + t)[0].hasAttribute("multiple")) {
								if ($("#" + t + " option").length <= 1) return;
								//alert("debug: converting to multiple2");
								//alert("debug: box length = " + $("#" + t + " option").length);
								$("#" + t).attr("multiple", "multiple");
								var v = $("#" + t).val();
								//alert("debug: v=" + v);
								m_was[t].all = false;
								m_was[t].each = false;
								m_was[t].other = false;
								if (v[0] == "") {
									m_was[t].all = true;
								} else if (v[0] == "each") {
									m_was[t].each = true;
								} else {
									m_was[t].other = true;
								}
								$("#" + t).removeClass("chzn-done");
								$("#" + t).next().remove();
								$("#" + t).data("Placeholder", "Select...").chosen();
								$("#" + t).trigger("liszt:updated");
								$("#" + t).val(v);
								//$("#" + t).chosen({ disable_search_threshold: 5 });
							}
						}

						function multiSetSingle(t) {
							if ($("#" + t)[0].hasAttribute("multiple")) {
								//alert("debug: converting back to single");
								var v = $("#" + t).val();
								v = v[0];
								$("#" + t).removeAttr("multiple");
								$("#" + t).removeClass("chzn-done");
								$("#" + t).next().remove();
								$("#" + t).data("Placeholder", "Select...").chosen();
								$("#" + t).trigger("liszt:updated");
								$("#" + t).val(v);
							}
						}

                        window.CoxFiltersReady = false;
                        window.CoxReportlistReady = false;
                        $(document).ready(function () {
                            appEasycom.init(); //MADELIVE
                            if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-mnt.")) {
                                if ((a$.urlprefix() == "performant.") || ($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) {
                                    //if (($.cookie("TP1Role") == "Admin")) {
                                    if (a$.urlprefix() == "performant.") {
                                        setTimeout(switchtabs, 6000);
                                    }
                                    else {
                                        $(".qa-coxexecutive").show();
                                        setTimeout(switchtabs, 10000);
                                    }
                                    function switchtabs() {
                                        if (window.CoxFiltersReady && window.CoxReportlistReady) {
                                            window.CoxFiltersReady = false;
                                            $('#reportlabel').trigger('click');
                                            setTimeout(coxclickplot, 100);
                                            function coxclickplot() {
                                                if (window.CoxFiltersReady) {
                                                    $("#btnPlot").trigger('click');
                                                    if ($.cookie("TP1Username").toLowerCase() == "jocrXXXaven") {
                                                        alert("debug: A-Game Test - please dismiss and ignore this message.");
                                                    }
                                                    function coxfinalnavigate() {
                                                        ko.postbox.publish("CoxEmergencyNavigation", true);
                                                        $(".qa-coxexecutive").hide();
                                                    }
                                                    setTimeout(coxfinalnavigate, 1000);
                                                }
                                                else {
                                                    setTimeout(coxclickplot, 100);
                                                }
                                            }
                                        }
                                        else {
                                            setTimeout(switchtabs, 100);
                                        }
                                    }
                                }
                            }

                            switch (a$.urlprefix()) {
                                case "ers.":
                                    document.title = "CEScore 2.0";
                                    break;
                                case "chime.":
                                    document.title = "ChimeScore 2.0";
                                    break;
                                default:
                                    document.title = "Acuity 2.0 - " + a$.urlprefix().split(".")[0].toUpperCase();
                            }

                            //Don't allow an "-import" login to access the dashboard.
                            if (a$.urlprefix().indexOf("-import.") >= 0) {
                                var wd = window.location.href;
                                window.location = wd.replace("-import", "");
                                return;
                            }

                            if (a$.gup("dev") == "1") {
                                /* //Whichever one is listed first isn't getting the subscribes (or something).
                                */
                                $("#helloworldtab").show();
                                ko.applyBindings(HelloWorldViewModel({ config: "Dashboard" }), $(".helloworld-wrapper")[0]);

                                $("#treasurehunttab").show();
                                ko.applyBindings(TreasureHuntViewModel({ config: "Dashboard" }), $(".treasurehunt-wrapper")[0]);
                            }

                            appApmReport.init({});

                            $(".acuity-print").bind("click", function () {
                                //alert("debug:printing reports section..");
                                appApmReport.printReport($(".ReportReports").eq(0));
                            });
                            $(".acuity-print-grid").bind("click", function () {
                                alert("debug:printing reports from grid section..");
                                appApmReport.printReport($("#myreportcontainer"));
                            });


                            //Note: there are other binds on these buttons.
                            $("#rdoGrid").bind("click", function () {
                                $(".home-print-wrapper").show();
                                if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
                                    $("#kpidl").hide();
                                }
                                $("#btnAdd").hide();
                                $(".stg-reportgrouping-show").show();
                                $(".gaugesdiv-wrapper").hide();
                                //multiSetMultiple("selProjects");
                                multiSetMultiple("selLocations");
                                multiSetMultiple("selGroups");
                                multiSetMultiple("selTeams");
                                multiSetMultiple("selCSRs");
                            });

                            $("#rdoBase,#rdoTrend,#rdoPay").bind("click", function () {
                                $(".home-print-wrapper").hide();
                                if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
                                    $("#kpidl").show();
                                }
                                $("#btnAdd").show();
                                $(".stg-reportgrouping-show").hide();
                                $(".gaugesdiv-wrapper").show();
                                //multiSetSingle("selProjects");
                                multiSetSingle("selLocations");
                                multiSetSingle("selGroups");
                                multiSetSingle("selTeams");
                                multiSetSingle("selCSRs");
                            });

                            if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                                if ($.cookie("TP1ChangePassword") == "Y") {
                                    qa_changepassword({
                                        showsprintgamestart: true
                                    });
                                } else {
                                    qa_sprintgamestart({});
                                }
                            } else {
                                if ($.cookie("TP1ChangePassword") == "Y") {
                                    qa_changepassword({});
                                }
                            }

                            $("#changepassword_li").unbind().bind("click", function () {
                                $(".qa-changepassword h1").html("Change Password");
                                $(".qa-changepassword-extra").html("");
                                $(".qa-changepassword-submiterror").hide();
                                $(".qa-changepassword-text-current").val("").trigger("keyup");
                                qa_changepassword({});
                                window.appApmNavMenus.closeSide();
                            });

                            $("#qa_div").qa({
                                action: "loginInit"
                            });

                            /*
                            qa_1();
                            $(".qa-bubble").bind("click", function () {
                            $(this).hide();
                            qa_2();
                            });
                            */


                            document.CONFIG = "Dashboard";

                            if ((a$.urlprefix() == "km2.") && ($.cookie("TP1Role") == "Admin")) {
                                $(".message-notifier-wrapper-km2").show();
                            }
                            else if (((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) && (($.cookie("TP1Role") == "CorpXXXXXXAdmin") || ($.cookie("TP1Role") == "Admin")
                             || ($.cookie("TP1Username").toLowerCase() == "jangulo")
                            )) {
                                $(".message-notifier-wrapper-ces").show();
                            }
                            else if ((a$.urlprefix() == "ers.") && (($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Admin"))) {
                                $(".message-notifier-wrapper-ers").show();
                            }
                            else if ((a$.urlprefix() == "chime.") && (($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Admin")
                             || ($.cookie("TP1Username").toLowerCase() == "shammon")
                             || ($.cookie("TP1Username").toLowerCase() == "tvalentine")
                             || ($.cookie("TP1Username").toLowerCase() == "nwalford")
                             || ($.cookie("TP1Username").toLowerCase() == "byoung")
                             || ($.cookie("TP1Username").toLowerCase() == "msalasrios")
                            )) {
                                $(".message-notifier-wrapper-chime").show();
                            }
                            else if (($.cookie("TP1Role") == "Admin")) {
                                $(".message-notifier-wrapper-all").show();
                            }

                            //MAKEDEV
                            if (true) { //((a$.urlprefix() == "ers.") || ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) || (a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.") || (a$.urlprefix() == "cox.") || (a$.urlprefix() == "performant.") || (a$.urlprefix() == "frost-arnett.")) {
                                if ($.cookie("TP1Role") != "CSR") {
                                    var csrword = "Consultant";
                                    if (!((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt."))) {
                                        csrword = "CSR";
                                        $("#resetpassword_li").html("Reset " + csrword + " Password");
                                    }
                                    if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) {
                                        csrword = "Case Worker";
                                    }
                                    $("#resetpassword_li").show().unbind().bind("click", function () {
                                        if (($("#selCSRs").val() == "") || ($("#selCSRs").val() == "each")) {
                                            alert("Please select a " + csrword + " using the filters (on the left), then select 'Reset " + csrword + " Password' again.");
                                            window.appApmNavMenus.closeSide();
                                        }
                                        else {
                                            var csr = $("#selCSRs").val();
                                            var prompt = "Are you sure you want to reset the password for '" + $("#selCSRs option:selected").text() + "'?\n\n";
                                            if (!((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt."))) {
                                                prompt += "Password will be reset to: P@ssw0rd\n\n";
                                            }
                                            prompt += "Press Ok to continue.";
                                            var r = confirm(prompt);
                                            if (r == true) {
                                                a$.ajax({
                                                    type: "GET",
                                                    service: "JScript",
                                                    async: true,
                                                    data: {
                                                        lib: "login",
                                                        product: "Acuity",
                                                        CSR: csr,
                                                        cmd: "resetpassword"
                                                    },
                                                    dataType: "json",
                                                    cache: false,
                                                    error: a$.ajaxerror,
                                                    success: attemptreset
                                                });
                                                function attemptreset(json) {
                                                    if (a$.jsonerror(json)) {
                                                    }
                                                    else {
                                                        alert("Password Reset Successful!");
                                                    }
                                                }
                                                window.appApmNavMenus.closeSide();
                                            }
                                        }
                                    });
                                }
                            }
                            $(".report-filter-wrapper").qtip({
                                content: "New Feature!<br /><br />Filters will find all matches in all tables below.<br />Filters are case-sensitive.<br />Multiple filters are allowed,<br />separated by spaces.<br /><br />Filters persist when you change or refresh the report (delete the text to clear)."
                            });
                            //Experimental "report panel" in main dashboard.
                            if ((a$.urlprefix() == "km2.") || (a$.urlprefix().indexOf("km2-make40.") >= 0)) {
                                $("#myreportcontainer").show();
                                //Don't hide this now.  RAY: $(".gaugesdiv-wrapper").hide();
                                if ($.cookie("TP1Role") != "CSR") {
                                    //TODO: Disable for now: $("#presetsdl").show();
                                   

                                    $("#selPresets").val("").qtip({
                                        content: 'Select a saved setup to view.'
                                    }).bind("change", function () {
                                        if ($(this).val() == "") {
                                            $(".filters-presets-link").removeClass("presets-command-delete").addClass("presets-command-add");
                                        } else {
                                            $(".filters-presets-link").removeClass("presets-command-add").addClass("presets-command-delete");
                                        }
                                        $(".presets-command-add").qtip({
                                            content: 'Add a new preset view.'
                                        })
                                        $(".presets-command-delete").qtip({
                                            content: 'Delete preset view.'
                                        })
                                    });
                                    $(".filters-presets-link").bind("click", function () {
                                        if ($(this).hasClass("presets-command-add")) {
                                            var v = "StgDashboard=" + $("#StgDashboard select").val();
                                            v += "&View=";
                                            if (document.getElementById("rdoBase").checked) {
                                                v += "Base";
                                            } else if (document.getElementById("rdoGrid").checked) {
                                                v += "Base"; //TODO: Grid view operates the same as base view for now.
                                            } else if (document.getElementById("rdoTrend").checked) {
                                                v += "Trend";
                                            } else if (document.getElementById("rdoPay").checked) {
                                                v += "Pay";
                                            }
                                            v += "&" + appApmDashboard.viewparams(0, false)
                                            alert("debug: Add Preset with viewparams: " + v);
                                            $("#selPresets").append('<option value="test add">test add</option>');
                                            $("#selPresets").val("test add");
                                        } else {
                                            if (confirm("Do you wish to permanently delete the preset named '" + $("#selPresets").val() + "'?")) {
                                                //alert("debug: Delete Preset: " + $("#selPresets").val());
                                                /*
                                                $("#selPresets option [value='" + $("#selPresets").val() + "']").each(function() {
                                                $(this).remove();
                                                });
                                                */
                                                //$("#selPresets option").find('value="' + $("#selPresets").val() + '"]').remove();
                                                //$("#selPresets").find("option").find('value="' + $("#selPresets").val() + '"]').remove();
                                                //$("#selPresets").find("option").remove();
                                                $("#selPresets option").each(function () {
                                                    if ($(this).val() == $("#selPresets").val()) {
                                                        $(this).remove();
                                                    }
                                                });
                                                $("#selPresets").val("");
                                            }
                                        }
                                        $("#selPresets").trigger("liszt:updated");
                                        $("#selPresets").trigger("change");
                                    });
                                }
                            }

                            appApmSettings.init({
                                id: "StgReportGrouping",
                                ui: "slider"
                            });
                            $("#StgReportGrouping select").bind("change", function () {
                                appApmReport.plotIntercept(0, true, false);
                            });

                            appApmSettings.init({
                                id: "StgView",
                                ui: "slider"
                            });
                            appApmSettings.init({
                                id: "StgViewDateType",
                                ui: "slider"
                            });
                            $("#StgView select").bind("change", function () {
                                switch ($(this).val()) {
                                    case "Grid":
                                        if ($("#StgViewDateType select").val() == "Period") {
                                            document.getElementById("rdoGrid").checked = true; //TODO:  Will be rdoGrid as soon as that's installed.
                                            document.getElementById("rdoBase").checked = false; //TODO:  Will be rdoGrid as soon as that's installed.
                                            document.getElementById("rdoTrend").checked = false;
                                            document.getElementById("rdoPay").checked = false;
                                        } else {
                                            alert("debug: Grid view not supported in multi-date mode yet, setting to single (rdoBase)");
                                            document.getElementById("rdoGrid").checked = false;
                                            document.getElementById("rdoBase").checked = true;
                                            document.getElementById("rdoTrend").checked = false;
                                            document.getElementById("rdoPay").checked = false;
                                        }
                                        break;
                                    case "Chart":
                                        if ($("#StgViewDateType select").val() == "Period") {
                                            document.getElementById("rdoGrid").checked = false;
                                            document.getElementById("rdoBase").checked = true;
                                            document.getElementById("rdoTrend").checked = false;
                                            document.getElementById("rdoPay").checked = false;
                                        } else {
                                            document.getElementById("rdoGrid").checked = false;
                                            document.getElementById("rdoBase").checked = false;
                                            document.getElementById("rdoTrend").checked = true;
                                            document.getElementById("rdoPay").checked = false;
                                        }
                                        break;
                                    default:
                                        alert("debug: invalid view binding");
                                        break;
                                }
                            });
                            $("#StgViewDateType select").bind("change", function () {
                                switch ($(this).val()) {
                                    case "Period":
                                        if ($("#StgView select").val() == "Grid") {
                                            document.getElementById("rdoGrid").checked = true;
                                            document.getElementById("rdoBase").checked = false; //TODO:  Will be rdoGrid as soon as that's installed.
                                            document.getElementById("rdoTrend").checked = false;
                                            document.getElementById("rdoPay").checked = false;
                                        } else {
                                            document.getElementById("rdoGrid").checked = false;
                                            document.getElementById("rdoBase").checked = true;
                                            document.getElementById("rdoTrend").checked = false;
                                            document.getElementById("rdoPay").checked = false;
                                        }
                                        break;
                                    case "Multiple":
                                        if ($("#StgViewDateType select").val() == "Grid") {
                                            alert("debug: Grid view not supported in multi-date mode yet, setting to single (rdoBase)");
                                            document.getElementById("rdoGrid").checked = true;
                                            document.getElementById("rdoBase").checked = false;
                                            document.getElementById("rdoTrend").checked = false;
                                            document.getElementById("rdoPay").checked = false;
                                        } else {
                                            document.getElementById("rdoGrid").checked = false;
                                            document.getElementById("rdoBase").checked = false;
                                            document.getElementById("rdoTrend").checked = true;
                                            document.getElementById("rdoPay").checked = false;
                                        }
                                        break;
                                    default:
                                        alert("debug: invalid view binding");
                                        break;
                                }
                            });


                            //Apply bindings to ALL viewe models.
                            //Filter Actions Plugin (can be used in Dashboard or other contexts)

                            if (true) { //($.cookie("TP1Role") != "CSR") {
                                ko.applyBindings(FilterAttributesViewModel({
                                    config: "Dashboard",
                                    readonly: ($.cookie("TP1Role") == "CSR")
                                }), $(".filters-attributes-wrapper")[0]);
                                $("#filtersdiv").show(); //ALWAYS show now
                            } else {
                                $("#filterlabel").hide();
                                $("#filtergroup").hide();
                                $(".filters-attributes-link").hide();
                            }

                            var showagame = true;
                            if ($.cookie("ApmProjectFilter") != null) {
                                if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "")) {
                                    showagame = false;
                                }
                            }
                            /*
                            if (a$.urlprefix().indexOf("km2") >= 0) {
                            showagame = false; //Just to buy some time.
                            }
                            */

                            if (a$.gup("wand") != "") {
                                $(".headericon-wand").show().bind("click", function () {
                                    window.open('agent/default.aspx', 'Agent', 'width=600,height=400')
                                });
                            }

                            if (showagame) {
                                var dateoffset = 0;
                                if (a$.gup("dateoffset") != "") {
                                    dateoffset = parseInt(a$.gup("dateoffset"));
                                }

                                var gametheme = "";
                                var gametest = false;

                                if ((a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make.") >= 0)) {
                                    //Returning to football for gridiron development
                                    gametheme = "football";
                                    gametest = false;
                                } else if (((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) || (a$.urlprefix() == "ers.")) {
                                    gametheme = "football";
                                    gametest = false;
                                } else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                                    gametheme = "summer olympics";
                                    gametest = false;
                                } else if ((a$.urlprefix() == "vec.")) {
                                    gametheme = "football";
                                    gametest = false;
                                }

                                var lid = 0;

                                if ((!debug_makingsprintgame) && (a$.urlprefix().indexOf("make40.") >= 0)) { //TEST: Quick switch for theme in Make40
                                    gametheme = "basketball";
                                    gametest = false;
                                    //lid = 2;
                                }


                                if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-mnt.")) {
                                    if ($.cookie("TP1Role") != "CSR") {
                                        gametheme = "basketball";
                                        gametest = false;
                                    }
                                    else {
                                        gametheme = "basketball";
                                        gametest = false;
                                    }
                                }

                                if ((a$.urlprefix().indexOf("km2-make40.") >= 0) || (a$.urlprefix() == "km2.")) {
                                    gametheme = "soccer";
                                    gametest = false;
                                }

                                if (gametheme == "summer olympics") {
                                    if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                                        lid = 62;
                                    }
                                }
                                gametest = false;
                                if (a$.gup("gametest") != "") {
                                    gametest = true;
                                }
                                var draftonly = true;
                                if (gametest) {
                                    draftonly = false;
                                }

                                //For testing and building of xtreme.
                                if (a$.urlprefix() == "bgr-make40.") {
                                    //dateoffset = 210;
                                    gametheme = "tiki";
                                    gametest = false;
                                }
                                if ((a$.urlprefix() == "make40.") || (a$.urlprefix() == "ers.")) {
                                    //dateoffset = 210;
                                    gametheme = "football";
                                    gametest = false;
                                }

                                //Ok, everything's football unless cox or bgr.
                                gametheme = "football";

                                if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-mnt.") || (a$.urlprefix() == "cox-mnt-julie.")) {
                                    if (true) { //(($.cookie("TP1Role") == "Admin")||($.cookie("TP1Role") == "CorpAdmin")||($.cookie("TP1Role") == "Management")) {
                                        gametheme = "basketball";
                                    }
                                }


                                if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-mnt.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) {
                                    gametheme = "tiki";
                                    gametest = false;
                                }
                                if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.") || (a$.urlprefix() == "ers-mnt-julie.")) {
                                    gametheme = "tiki";
                                    gametest = false;
                                }
                                if ((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "veyo-mnt.")) {
                                    gametheme = "basketball";
                                    //dateoffset = -52;
                                    gametest = false;
                                }

                                if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united2.")) {
                                    gametheme = "football";
                                    //dateoffset = -52;
                                    gametest = false;
                                }


                                //..unless overridden
                                if (a$.gup("gametheme") != "") {
                                    gametheme = a$.gup("gametheme");
                                    if ((gametheme == "tiki") || (gametheme == "dragons")) {
                                        gametest = true;
                                    }
                                }

                                //gametheme = "tiki";

                                //gametest=true; //TEST TEST TEST
                                $("#fantab").hide();
                                if (gametheme != "") {
                                    ko.applyBindings(FanViewModel({
                                        test: gametest,
                                        testdateoffset: dateoffset,
                                        draftonly: draftonly,
                                        theme: gametheme,
                                        leagueid: lid,
                                        inplayoffs: false
                                    }), $(".fan-wrapper")[0]);
                                    $("#fantab").show();
                                }

                                if (gametheme == "basketball") {
                                    $(".headericon-agame").addClass("headericon-agame-basketball");
                                } else if (gametheme == "summer olympics") {
                                    $(".headericon-agame").addClass("headericon-agame-medalist").css("width", "110px");
                                    $(".headericon-agame-gamescore").hide();
                                    $(".headericon-agame-gamestatus").css("color", "black").css("position", "absolute").css("top", "10px").css("left", "8px");
                                    $('#fantab').show();
                                    $('#fanlabel').trigger('click');
                                } else if (gametheme == "football") {
                                    $(".headericon-agame").addClass("headericon-agame-football");
                                } else if (gametheme == "soccer") {
                                    $(".headericon-agame").addClass("headericon-agame-soccerball");
                                }

                                $(".headericon-agame").qtip({
                                    content: 'A-GAME!'
                                }).bind("click", function () {
                                    $("#fantab").show();
                                    $("#fanlabel").trigger("click");
                                });

                                $(".headericon-xtreme").qtip({
                                    content: 'Add Player to Xtreme Queue'
                                }).bind("click", function () {
                                    $("#fantab").show();
                                    $("#fanlabel").trigger("click");
                                });
                            } else {
                                $("#fantab").hide();
                            }



                            //This looks old, but is new 11/20/2015.
                            $(".table-download").attr("title", "Download Table").attr("onclick", "$(this).downloadContents();return false;").html("&nbsp;&nbsp;&nbsp;");

                            //TODO: Figure out how to replace the explicit bindings above with a single binding as below (I think I HAVE to if I want to employ components).
                            //ko.applyBindings();

                            $("#filtergroup").FilterAction({
                                action: "init"
                            });

                            //alert("debug:HELLO!  My test setting in the dashboard = " + mytestsetting);

                            /* TRAPPING - NOTE: REMOVE THIS SECTION COMPLETELY FROM THE V8/V8L versions */
                            /*
                            try {
                            var overrideAlert = alert;
                            alert = function (a) {
                            if (a == "") {
                            //overrideAlert("Connection Error - Please check your Internet connection\n\nand/or security appliances if on a managed network.");
                            $(".err-content").html("Connection Error - Please check your Internet connection and/or security appliances if on a managed network.<br/><br/>This message may automatically disappear when your connection is restored.");
                            $(".err-container").show();
                            }
                            else if (a.toLowerCase().indexOf(">service unavailable<") >= 0) {
                            $(".err-content").html("Connection Error - Acuity cannot currently be reached.  Please do not log out, you will be re-connected automatically.<br/><br/>This message may automatically disappear when your connection is restored.");
                            $(".err-container").show();
                            }
                            else if (a.toLowerCase().indexOf("an unhandled exception occurred") >= 0) {
                            try {
                            var ts = a.split("<title>");
                            var m = ts[1].split("</title>");
                            overrideAlert("Exception: " + m[0]);
                            }
                            catch (e) {
                            overrideAlert("STACK DUMP: " + a);
                            }
                            }
                            else {
                            overrideAlert(a);
                            }
                            }
                            }
                            catch (e) {
                            }
                            */
                            /* END TRAPPING */

                            if ((a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.")) {
                                stgRankPointsLabel = "Treasure Hunt"; //debug: for development.
                            }

                            $(".RankPointsLabel").html(stgRankPointsLabel);

                            if ($("#ie9test").html() == "YES") {
                                //alert("IE9 Detected (There are known compatibility issues).");
                                //window.location = "DashboardAsyncV8L.aspx";
                            }

                            if ((a$.urlprefix().indexOf("make") >= 0) && ($.cookie("TP1Role") == "CSR")) {
                                //window.location = "//ers.acuityapm.com";
                            }

                            //$.cookie("ApmInDallas","YES"); //Debug
                            //$.cookie("ApmProjectFilter", "TXU EOP"); //Debug
                            //$.cookie("ApmProjectFilter", ""); //Debug

                            $(".chat-beep-icon").hide();
                            $.fn.qtip.defaults.position.my = 'middle left';
                            $.fn.qtip.defaults.position.at = 'middle right';
                            $.fn.qtip.defaults.style.classes = 'ui-tooltip-rounded';

                            appApmDashboard.setClientLabels();
                            appApmNavMenus.init();
                            //alert("debug:enter ready");
                            //appApmDashboard.showprogress("comboprogress");
                            //$("#nav").css("width",($(window).width() - parseInt($("#nav").css('left'))) + 'px');
                            $("#loading").hide();

                            $("#container").show();

                            appApmDashboard.setCookiePrefix("ED"); //Operations CSR Dashboard

                            //Cheat for the debugging side.
                            if ($.cookie("TP1Username") == "mgranberry") {
                                $.cookie("ApmInDallas", "YES");
                            }

                            if ($.cookie("ApmInDallas") != null)
                                if ($.cookie("ApmInDallas") != "") {
                                    mpar = "/month";
                                    $("#showpay").css("display", "none");
                                }
                                else {
                                    mpar = "/payperiod";
                                }

                            //TODO:Disabling tooltips doesn't always work - it fails in this case for sure if you've already displayed the tooltip:
                            /*
                            $('#daterange').qtip({
                            content: 'Slide left/right<br />to select a range of dates for the trend report.'
                            });
                            */

                            $('#rankdiv').qtip({
                                content: 'Ranking is calculated NIGHTLY.  Scores imported today may not be included in the calculation.'
                            });

                            if (true) { //($.cookie("TP1Username") == "jeffgack") {
                                var sBrowser, sUsrAg = navigator.userAgent;

                                // The order matters here, and this may report false positives for unlisted browsers.

                                if (sUsrAg.indexOf("Firefox") > -1) {
                                    sBrowser = "Mozilla Firefox";
                                    // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
                                } else if (sUsrAg.indexOf("SamsungBrowser") > -1) {
                                    sBrowser = "Samsung Internet";
                                    // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
                                } else if (sUsrAg.indexOf("Opera") > -1 || sUsrAg.indexOf("OPR") > -1) {
                                    sBrowser = "Opera";
                                    // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
                                } else if (sUsrAg.indexOf("Trident") > -1) {
                                    sBrowser = "Microsoft Internet Explorer";
                                    // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
                                } else if (sUsrAg.indexOf("Edge") > -1) {
                                    sBrowser = "Microsoft Edge";
                                    // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
                                } else if (sUsrAg.indexOf("Chrome") > -1) {
                                    sBrowser = "Google Chrome or Chromium";
                                    // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
                                } else if (sUsrAg.indexOf("Safari") > -1) {
                                    sBrowser = "Apple Safari";
                                    // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
                                } else {
                                    sBrowser = "unknown";
                                }
                                a$.ajax({
                                    type: "GET",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "admin",
                                        cmd: "browser",
                                        browser: sBrowser
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    success: browsersaved
                                });
                                function browsersaved(json) {
                                    if (a$.jsonerror(json)) {
                                    }
                                    else {
                                        //alert("debug: saved");
                                    }
                                };
                            }

                            $("#cepointstab").hide();
                            $("#cepointsmgrtab").hide();
                            $("#attritiontab").hide();
                            $("#guidetab").hide();
                            if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                $("#guidetab").show();
                                if (($.cookie("TP1Role") != "CSR")) {
                                    //$("#attritiontab").show();
                                    global_attritionvisible = true;
                                    global_attritiontestingvisible = true;
                                }
                                global_attritionvisible = true;
                                global_attritiontestingvisible = true;
                            } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && (($.cookie("ApmInDallas") == "") || ($.cookie("ApmInDallas") == null)) && (($.cookie("TP1Username") ==
									"jeffgack") || ($.cookie("TP1Username") == "syanez") || ($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
                                $("#cepointsmgrtab").show();
                                appApmRankPoints.mgrinit();
                                $("#attritiontab").show();
                                global_attritionvisible = true;
                                global_attritiontestingvisible = true;
                            } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && ($.cookie("TP1Role") == "Management")) {
                                $("#attritiontab").show();
                                global_attritionvisible = true;
                                global_attritiontestingvisible = true;
                            } else if (((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) && (($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") == "Team Leader"))) {
                                $("#attritiontab").show();
                                global_attritionvisible = true;
                            } else {
                                $(".attrition-show").hide();
                                $(".attrition-show-loc").hide();
                            }
                            if ((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) { //Role-based guides for performant
                                if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Quality Assurance")) {
                                    $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-guideQA.html?test=81");
                                }
                                else {
                                    $("#GuideIframe").attr("src", "../applib/html/guides/start-guide/performant-guide-supervisorQA.html?test=81");
                                }
                                $("#guidetab").show();
                            }
                            else { //General start guide
                                if ($.cookie("TP1Role") == "CSR") {
                                    $("#GuideIframe").attr("src", "https://" + a$.urlprefix() + "acuityapmr.com/applib/html/guides/start-guide/index.html?atest=2&prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                                }
                                else {
                                    $("#GuideIframe").attr("src", "https://" + a$.urlprefix() + "acuityapmr.com/applib/html/guides/start-guide/index-supervisor.html?atest=2&prefix=" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")));
                                }
                                $("#guidetab").show();
                            }
                            /* old way (replaced by general).
                            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-mnt.")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/cox-start-guide/index.htmlatest=80-");
                            $("#guidetab").show();
                            }
                            if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-mnt.")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/chime-start-guide/index.htmlatest=80-");
                            $("#guidetab").show();
                            }
                            if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/frost-arnett-start-guide/index.html?a8");
                            $("#guidetab").show();
                            }
                            if ((a$.urlprefix() == "veyo.") || (a$.urlprefix() == "veyo-test.") || (a$.urlprefix() == "veyo-mnt.")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/veyo-start-guide/index.html?a6");
                            $("#guidetab").show();
                            }
                            if ((a$.urlprefix() == "NOTbgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-mnt.")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/bgr-start-guide/index.html?a6");
                            $("#guidetab").show();
                            }
                            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ers-mnt.")) {
                            $("#GuideIframe").attr("src", "../applib/html/guides/ers-start-guide/index.htmlatest=80-");
                            $("#guidetab").show();
                            }
                            */
                            if ($.cookie("TP1Role") == "CSR") {
                                $("#guidetab").hide();
                            }

                            //if (((a$.urlprefix() == "cox.") || (a$.urlprefix() == "ers.")) && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
                            if ((($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) ||
                                ((a$.urlprefix() == "cox.") && (($.cookie("TP1Username").toLowerCase() == "bcrane") || ($.cookie("TP1Username").toLowerCase() == "tebrooks") || ($.cookie("TP1Username").toLowerCase() == "mlangloi"))
                                )) {
                                $(".easycom-editor a").attr("href", "https://" + a$.urlprefix().split(".")[0] + "-v3-dev.acuityapm.com/applib/dev/LOGIN1/LOGIN1-view/loginNew.aspx?url=/3/Easycom.aspx");
                                $(".easycom-editor").show();
                            }

                            //MAKEDEV
                            if ((((a$.urlprefix() == "ces.")
                                || (a$.urlprefix() == "ces-demo.")
                                || (a$.urlprefix() == "act.")
                                ) || (a$.urlprefix() == "ces-v3-shell."))) {
                                // && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Username").toLowerCase() == "cisaacson"))) {
                                a$.ajax({
                                    type: "GET",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "qa",
                                        cmd: "complianceShowIframe"
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    success: checkcomplianceiframe
                                });
                                function checkcomplianceiframe(json) {
                                    if (false) { //(a$.jsonerror(json)) {
                                    }
                                    else {
                                        if (json.iframeAllowed) {
                                            //Old way (with tab and iframe)
                                            //$("#complianceformtab").show();
                                            //$("#ComplianceformIframe").attr("src", "https://ces-v3" + ((a$.urlprefix() == "ces-v3-shell.") ? "-dev" : "") + ".acuityapm.com/3/Touchpointauthentication.aspx?url=../3/ComplianceFormCES.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=").show();
                                            //New way (with list)
                                            $(".compliance-system a").attr("href", "https://" + a$.urlprefix().split(".")[0] + "-v3.acuityapm.com/applib/dev/LOGIN1/LOGIN1-view/loginNew.aspx?url=/3/ComplianceFormCES.aspx?origin=v2");
                                            $(".compliance-system").show();
                                        }
                                    }
                                }
                            }

                            if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-v3-shell."))/* && (($.cookie("TP1Role") != "CSR")) */) {
                                $("#attendanceformtab").show();
                                var mycsr = "";
                                ko.postbox.subscribe("CSR", function (newValue) {
                                    if (newValue != mycsr) {
                                        if ((newValue == "") || (newValue == "each")) {
                                            $("#AttendanceformIframe").hide();
                                            $(".attendanceform-message").show();
                                        }
                                        else {
                                            $(".attendanceform-message").hide();
                                            mycsr = newValue;
                                            if (true) { //($.cookie("TP1Username").toLowerCase() == "jeffgack") {
                                                $("#AttendanceformIframe").removeAttr("sandbox").attr("src", "https://bgr-v3-frozen" + ((a$.urlprefix() == "bgr-v3-shell.") ? "-dev" : "") + ".acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/AttendanceFormBGR.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr).show();
                                            }
                                            else {
                                                $("#AttendanceformIframe").removeAttr("sandbox").attr("src", "https://bgr-v3" + ((a$.urlprefix() == "bgr-v3-shell.") ? "-dev" : "") + ".acuityapm.com/3/Touchpointauthentication.aspx?url=../3/AttendanceFormBGR.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr).show();
                                            }

                                        }
                                    }
                                });
                            }

                            if (a$.urlprefix() != "bgr.") {
                                $("#journalformlabel").html("Sidekick");
                            }
                            if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-v3-shell.") || (a$.urlprefix() == "NOTbgr-mnt.") || (a$.urlprefix() == "bgr-make40.")) && (($.cookie("TP1Role") != "CSR")) /* && (($.cookie("TP1Role") == "Admin")||($.cookie("TP1Role") == "CorpAdmin"))  */) {
                                $("#journalformtab").show();
                                var mycsr2 = "badval";
                                ko.postbox.subscribe("CSR", function (newValue) {
                                    if (newValue != mycsr2) {
                                        if ((newValue == "") || (newValue == "each")) {
                                            $("#JournalformIframe").hide();
                                            $(".journalform-message").show();
                                        }
                                        else {
                                            $(".journalform-message").hide();
                                            mycsr2 = newValue;
                                            $("#JournalformIframe").removeAttr("sandbox").attr("src", "https://bgr-v3-frozen" + ((a$.urlprefix() == "bgr-v3-shell.") ? "-dev" : "") + ".acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/JournalFormBGR.aspx&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2).show();
                                        }
                                    }
                                });
                            }
                            else if (false) { //(a$.urlprefix().indexOf("chime-mnt") >= 0) {
                                $("#journalformtab").show();
                                $(".journalform-message").hide();
                                var mycsr2 = "badval";
                                var myteam2 = "badval";
                                ko.postbox.subscribe("JournalCSR", function (newValue) {
                                    //alert("debug: changed CSR");
                                    if (newValue == "each") newValue = "";
                                    if (newValue != mycsr2) {
                                        mycsr2 = newValue;
                                        callJournalFrame();
                                    }
                                });
                                ko.postbox.subscribe("JournalTeam", function (newValue) {
                                    //alert("debug: changed CSR");
                                    if (newValue == "each") newValue = "";
                                    if (newValue != myteam2) {
                                        myteam2 = newValue;
                                        callJournalFrame();
                                    }
                                });
                                function callJournalFrame() {
                                    //LIVE MODE
                                    //$("#JournalformIframe").attr("src", "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf("-")) + "-v3-dev.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx|dev=1&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val()).show();
                                    //Chris dev mode
                                    var dev = "https://chime-v3-dev-chris.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx|dev=1&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + myteam2;
                                    $(".journalform-dev").html(dev);
                                    $("#JournalformIframe").attr("src", dev).show();
                                }
                            }
                            else if ((a$.urlprefix().indexOf("-mnt") > 0) && (a$.urlprefix() != "veyo-mnt-clint.")) {
                                $("#journalformtab").show();
                                var mycsr2 = "";
                                ko.postbox.subscribe("CSR", function (newValue) {
                                    if (newValue != mycsr2) {
                                        if ((newValue == "") || (newValue == "each")) {
                                            $("#JournalformIframe").hide();
                                            $(".journalform-message").show();
                                        }
                                        else {
                                            $(".journalform-message").hide();
                                            mycsr2 = newValue;
                                            var dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf("-mnt")) + "-v3-dev-chris.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx" + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "|dev=1" : "|nodev=0") + "~demo=1&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val();
                                            if (a$.urlprefix().indexOf("-julie") > 0) {
                                                dev = dev.replace(a$.urlprefix().substring(0, a$.urlprefix().indexOf("-mnt")) + "-v3-dev-chris.acuityapm", a$.urlprefix() + "acuityapmr");
                                            }
                                            $(".journalform-dev").html(dev);
                                            $("#JournalformIframe").attr("src", dev).show();
                                        }
                                    }
                                });
                            }
                            else if ((a$.urlprefix() != "united2.") && ($.cookie("TP1Role") != "CSR")) { //Live site.
                                /* Save the restriction definition
                                else if ((((a$.urlprefix() == "ers.") || (a$.urlprefix() == "veyo.")) && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "NOTCorpAdmin")
                                || ($.cookie("TP1Username").toLowerCase() == "jgardner") || ($.cookie("TP1Username").toLowerCase() == "mvoss")
                                || ($.cookie("TP1Username").toLowerCase() == "410741")
                                || ($.cookie("TP1Username").toLowerCase() == "cscaife")
                                || ($.cookie("TP1Username").toLowerCase() == "rcrowley")
                                || ($.cookie("TP1Username").toLowerCase() == "kecosby")
                                || ($.cookie("TP1Username").toLowerCase() == "krobinson")
                                || ($.cookie("TP1Username").toLowerCase() == "johjones")
                                || ($.cookie("TP1Username").toLowerCase() == "tilemons")
                                || ($.cookie("TP1Username").toLowerCase() == "erloyd")
                                || ($.cookie("TP1Username").toLowerCase() == "erloyd3")
                                || ($.cookie("TP1Username").toLowerCase() == "sharris")
                                || ($.cookie("TP1Username").toLowerCase() == "sharris2")
                                //Entergy (by GL/TL user ID)
                                || ($.cookie("TP1Username").toLowerCase() == "lmullin")
                                || ($.cookie("TP1Username").toLowerCase() == "gwearn")
                                || ($.cookie("TP1Username").toLowerCase() == "lmullin")
                                || ($.cookie("TP1Username").toLowerCase() == "cwilliams")
                                || ($.cookie("TP1Username").toLowerCase() == "psammons")
                                || ($.cookie("TP1Username").toLowerCase() == "mgreenwalt")
                                || ($.cookie("TP1Username").toLowerCase() == "mathewsd")
                                || ($.cookie("TP1Username").toLowerCase() == "leyoung")
                                || ($.cookie("TP1Username").toLowerCase() == "tnestfield")
                                || ($.cookie("TP1Username").toLowerCase() == "sbryant")
                                || ($.cookie("TP1Username").toLowerCase() == "eenglish")
                                || ($.cookie("TP1Username").toLowerCase() == "tcrandall")
                                || ($.cookie("TP1Username").toLowerCase() == "schase")
                                || ($.cookie("TP1Username").toLowerCase() == "robailey")
                                || ($.cookie("TP1Username").toLowerCase() == "gyliburd")
                                || ($.cookie("TP1Username").toLowerCase() == "jkgreen")
                                ))
                                || ((a$.urlprefix() == "frost-arnett.") && ($.cookie("TP1Role") != "CSR"))
                                || (((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-mnt.")) && ($.cookie("TP1Role") != "CSR"))
                                || (((a$.urlprefix() == "performant.") || (a$.urlprefix() == "performant-mnt.")) && ($.cookie("TP1Role") != "CSR"))
                                || ((a$.urlprefix() == "veyo.") && ($.cookie("TP1Role") != "CSR"))
                                ) {
                                */
                                $("#journalformtab").show();
                                var mycsr2 = "";
                                ko.postbox.subscribe("CSR", function (newValue) {
                                    if (newValue != mycsr2) {
                                        if ((newValue == "") || (newValue == "each")) {
                                            $("#JournalformIframe").hide();
                                            $(".journalform-message").show();
                                        }
                                        else {
                                            $(".journalform-message").hide();
                                            mycsr2 = newValue;
                                            /*
                                            var portback = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")) + "-v3-dev.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx" + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "|dev=1" : "|nodev=0") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val();
                                            if (a$.urlprefix() == "ces.") {
                                            portback = portback.replace("ces-v3-dev.acuityapm", "ces.acuityapmr"); //V2 Test
                                            }
                                            if (a$.urlprefix() == "ers.") {
                                            portback = portback.replace("ers-v3-dev.acuityapm", "ers.acuityapmr"); //V2 Test
                                            }
                                            if (a$.urlprefix() == "veyo.") {
                                            portback = portback.replace("veyo-v3-dev.acuityapm", "veyo.acuityapmr"); //V2 Test
                                            }
                                            if (a$.urlprefix() == "veyo-mnt-clint.") {
                                            portback = portback.replace("veyo-mnt-clint-v3-dev.acuityapm", "veyo-mnt-clint.acuityapmr"); //V2 Test
                                            }
                                            */
                                            var portback = "https://" + a$.urlprefix() + "acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx" + ((($.cookie("TP1Username").toLowerCase() == "jeffgack") || ($.cookie("TP1Username").toLowerCase() == "dweather") || ($.cookie("TP1Username").toLowerCase() == "ckraft") || ($.cookie("TP1Username").toLowerCase() == "cjarboe")) ? "|dev=1" : "|nodev=0") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1&CSR=" + mycsr2 + "&Team=" + $("#selTeams").val();
                                            $("#JournalformIframe").attr("src", portback).show();
                                        }
                                    }
                                });
                            }

                            if ((a$.urlprefix() == "chime-mnt.") || (a$.urlprefix() == "cox-mnt.")) {
                                $("#reviewformtab").show();
                                var myteam = "";
                                var mycsr3 = "";
                                var myhash = "";

                                /*
                                if ($.cookie("TP1Role") == "CSR") {
                                myhash = "^self-evaluation";
                                }
                                else {
                                myhash = "^performance-review";
                                }
                                */
                                myhash = "^performance-review";

                                function callSupPerf() {
                                    if ((myteam == "") || (myteam == "each") /* || (mycsr == "each") */) {
                                        $(".reviewform-message").show();
                                        $("#ReviewformIframe").hide();
                                    }
                                    else {
                                        if (mycsr3 == "each") mycsr3 = "";
                                        $(".reviewform-message").hide();
                                        /*chris:*/dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf("-mnt")) + "-v3-dev-chris" + ".acuityapm.com/3/Touchpointauthentication.aspx?url=../3/Supperfmgt.aspx|CSR=" + mycsr3 + "~Team=" + myteam + myhash + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
                                        $(".reviewform-dev").html(dev);
                                        $("#ReviewformIframe").attr("src", dev).show();
                                    }
                                }
                                ko.postbox.subscribe("JournalCSR", function (newValue) {
                                    //alert("debug: CSR changed to: " + newValue);
                                    if (newValue != mycsr3) {
                                        mycsr3 = newValue;
                                        callSupPerf();
                                    }
                                });
                                ko.postbox.subscribe("Team", function (newValue) {
                                    if (newValue != myteam) {
                                        myteam = newValue;
                                        callSupPerf();
                                    }
                                });
                            }

                            if ((a$.urlprefix() == "cox.")) { //Live Review
                                $("#reviewformtab").show();
                                var myteam = "";
                                var mycsr = "";
                                var myhash = "";

                                if ($.cookie("TP1Role") == "CSR") {
                                    myhash = "^self-evaluation";
                                }
                                else {
                                    myhash = "^performance-review";
                                }

                                function callSupPerf() {
                                    if ((myteam == "") || (myteam == "each") /* || (mycsr == "each") */) {
                                        $(".reviewform-message").show();
                                        $("#ReviewformIframe").hide();
                                    }
                                    else {
                                        if (mycsr == "each") mycsr = "";
                                        $(".reviewform-message").hide();
                                        /*chris:*/dev = "https://" + a$.urlprefix().substring(0, a$.urlprefix().indexOf(".")) + "-v3-dev-chris" + ".acuityapmr.com/3/Touchpointauthentication.aspx?url=../3/Supperfmgt.aspx|CSR=" + mycsr + "~Team=" + myteam + myhash + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
                                        //$(".reviewform-dev").html(dev);
                                        $("#ReviewformIframe").removeAttr("sandbox").attr("src", dev).show();
                                    }
                                }
                                ko.postbox.subscribe("CSR", function (newValue) {
                                    if (newValue != mycsr) {
                                        mycsr = newValue;
                                        callSupPerf();
                                    }
                                });
                                ko.postbox.subscribe("Team", function (newValue) {
                                    if (newValue != myteam) {
                                        myteam = newValue;
                                        callSupPerf();
                                    }
                                });
                            }

                            if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) && (($.cookie("TP1Username") == "amccord") || ($.cookie("TP1Username") == "jeffgack"))) {
                                $("#cepointsmgrtab").show();
                                appApmRankPoints.mgrinit();
                            }

                            $('.headericon-points').qtip({
                                content: stgRankPointsLabel + ' Rewards! Click to open.'
                            }).bind("click", function () {
                                $("#cepointstab").show();
                                $("#cepointslabel").trigger("click");
                            });

                            $('.headericon-message').qtip({
                                content: 'Messages'
                            }).bind("click", function () {
                                window.location = "#Messaging";
                            });

                            $('.headericon-chat').qtip({
                                content: 'Chat/Meet'
                            }).bind("click", function () {
                                appApmMessaging.clickedchatbubble(this);
                            });

                            $('.headericon-graph').qtip({
                                content: 'Graphs and Reports'
                            }).bind("click", function () {
                                /*
                                if ($("#graphsublabel").eq(0).is(":visible")) {
                                $('#graphsublabel').trigger('click');
                                }
                                else {
                                $("#graphtab").show();
                                $('#graphlabel').trigger('click');
                                }
                                if (window.location == "#GraphsReports") {
                                $("#graphtab").show();
                                $('#graphlabel').trigger('click');
                                }
                                */
                                window.location = "#GraphsReports";
                            });

                            $('.nav3-icon').qtip({
                                content: 'Main Menu',
                                position: {
                                    my: 'right center',
                                    at: 'left center'
                                }
                            });

                            //$('.nav3linkhelp').qtip({ content: 'Click to be shown<br />the new location<br />of the menu.' });

                            //TODO: This is a MESS and needs to be generalized.
                            $('.headericon-import').qtip({
                                content: 'Manual Import'
                            }).bind("click", function () {
                                $("#importframe").attr("src", "");
                                if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ec2.")) {
                                    //$("#importframe").attr("src", "//ers-import.acuityapmr.com/jq/import3.aspx");
                                    window.location = "//ers-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "ces.") {
                                    window.location = "//ces-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "ces-demo.") {
                                    window.location = "//ces-demo-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "chime.") {
                                    window.location = "//chime-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "cox.") {
                                    window.location = "//cox-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "veyo.") {
                                    window.location = "//veyo-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "frost-arnett.") {
                                    window.location = "//frost-arnett-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "act.") {
                                    window.location = "//act-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "united.") {
                                    window.location = "//united-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "performant.") {
                                    window.location = "//performant-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "bgr.") {
                                    window.location = "//bgr-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "bgr-test.") {
                                    window.location = "//bgr-test-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "vec.") {
                                    window.location = "//vec-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix().indexOf("km2") >= 0) {
                                    window.location = "//km2-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "twc.") {
                                    window.location = "//twc-import.acuityapmr.com/jq/import3.aspx";
                                } else if (a$.urlprefix() == "sprintgame.") {
                                    window.location = "//sprintgame-import.acuityapmr.com/jq/import3.aspx";
                                } else {
                                    window.location = "//" + a$.urlprefix() + "acuityapmr.com/jq/import3.aspx";
                                    //$("#importframe").attr("src", "import3.aspx");
                                }
                                //window.location = "#Import";
                            });

                            $('.headericon-reload').qtip({
                                content: 'Reload Dashboard'
                            }).bind("click", function () {
                                location.reload(false);
                            });

                            $('.logo-reload').qtip({

                            }).bind("click", function () {
                                window.location = "#GraphsReports";
                            });



                            $('.err-icon').qtip({
                                content: 'Error (Click for details)'
                            }).bind("click", function () {
                                if ($(".err-container").first().is(":visible")) {
                                    $(".err-container").hide();
                                } else {
                                    $(".err-container").show();
                                }
                            });
                            $('.err-hide').bind("click", function () {
                                $(".err-container").hide();
                                $(".err-icon").hide();
                            });
                            $("#errsubmit").bind("click", function () {
                                a$.submiterror($("#errinput").val());
                                $(".err-container").hide();
                                $(".err-icon").hide();
                            });

                            //Gauge thresholds (now handled with controlopts.performanceRanges setting)
                            //For backward compatibility
                            if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) {
                                //alert("debug: Bluegreen performance ranges test (ignore this)");
                                //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
                                controlopts.performanceRanges = [{
                                    letter: "A",
                                    threshold: 9.0,
                                    pie: {
                                        low: 9.0,
                                        high: 10.0
                                    },
                                    color: "#019F01",
                                    stops: [
											[0, '#005B00'],
											[1, '#00AE00'],
											[2, '#00AE00']
										]
                                },
									{
									    letter: "B+",
									    threshold: 8.0,
									    pie: {
									        low: 8.0,
									        high: 9.0
									    },
									    color: "#ffff99",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#ffff99'],
											[1, '#ffff99'],
											[2, '#ffff99']
										]
									},
									{
									    letter: "B",
									    threshold: 7.0,
									    pie: {
									        low: 7.0,
									        high: 8.0
									    },
									    color: "#ffff00",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#ffff00'],
											[1, '#ffff00'],
											[2, '#ffff00']
										]
									},
									{
									    letter: "C+",
									    threshold: 6.0,
									    pie: {
									        low: 6.0,
									        high: 7.0
									    },
									    color: "#ffcc00",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#ffcc00'],
											[1, '#ffcc00'],
											[2, '#ffcc00']
										]
									},
									{
									    letter: "C",
									    threshold: 5.0,
									    pie: {
									        low: 5.0,
									        high: 6.0
									    },
									    color: "#FF9900",
									    stops: [
											[0, '#ff9900'],
											[1, '#ff9900'],
											[2, '#ff9900']
										]
									},
									{
									    letter: "D",
									    threshold: -99999.0,
									    pie: {
									        low: 0.0,
									        high: 5.0
									    },
									    color: "#990101",
									    stops: [
											[0, '#5B0000'],
											[1, '#AC0000'],
											[2, '#AC0000']
										]
									}
								];
                            } else if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                //alert("debug: Bluegreen performance ranges test (ignore this)");
                                //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
                                controlopts.performanceRanges = [{
                                    letter: "A",
                                    threshold: 3.0,
                                    pie: {
                                        low: 3.0,
                                        high: 4.0
                                    },
                                    color: "#019F01",
                                    stops: [
											[0, '#005B00'],
											[1, '#00AE00'],
											[2, '#00AE00']
										]
                                },
									{
									    letter: "B",
									    threshold: 2.0,
									    pie: {
									        low: 2.0,
									        high: 3.0
									    },
									    color: "#ffff00",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#ffff00'],
											[1, '#ffff00'],
											[2, '#ffff00']
										]
									},
									{
									    letter: "C",
									    threshold: 1.0,
									    pie: {
									        low: 1.0,
									        high: 2.0
									    },
									    color: "#FF9900",
									    stops: [
											[0, '#ff9900'],
											[1, '#ff9900'],
											[2, '#ff9900']
										]
									},
									{
									    letter: "D",
									    threshold: -99999.0,
									    pie: {
									        low: 0.0,
									        high: 1.0
									    },
									    color: "#990101",
									    stops: [
											[0, '#5B0000'],
											[1, '#AC0000'],
											[2, '#AC0000']
										]
									}
								];
                            } else if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-mnt.")) {
                                //alert("debug: Bluegreen performance ranges test (ignore this)");
                                //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
                                controlopts.performanceRanges = [{
                                    letter: "A+",
                                    threshold: 6.0,
                                    pie: {
                                        low: 6.0,
                                        high: 7.0
                                    },
                                    color: "#00b0f0",
                                    stops: [
											[0, '#00b0f0'],
											[1, '#00b0f0'],
											[2, '#00b0f0']
										]
                                },
                                    {
                                        letter: "A",
                                        threshold: 4.5,
                                        pie: {
                                            low: 4.5,
                                            high: 6.0
                                        },
                                        color: "#00b050",
                                        stops: [
											[0, '#00b050'],
											[1, '#00b050'],
											[2, '#00b050']
										]
                                    },
									{
									    letter: "B",
									    threshold: 3.0,
									    pie: {
									        low: 3.0,
									        high: 4.5
									    },
									    color: "#92d050",
									    stops: [
											[0, '#92d050'],
											[1, '#92d050'],
											[2, '#92d050']
										]
									},
									{
									    letter: "C",
									    threshold: 2.0,
									    pie: {
									        low: 2.0,
									        high: 3.0
									    },
									    color: "#eaea04",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#eaea04'],
											[1, '#eaea04'],
											[2, '#eaea04']
										]
									},
									{
									    letter: "D",
									    threshold: -99999.0,
									    pie: {
									        low: 0.0,
									        high: 2.0
									    },
									    color: "#ff0000",
									    stops: [
											[0, '#ff0000'],
											[1, '#ff0000'],
											[2, '#ff0000']
										]
									}
								];
                            } else if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.")) {
                                //alert("debug: Bluegreen performance ranges test (ignore this)");
                                //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
                                controlopts.performanceRanges = [{
                                    letter: "A",
                                    threshold: 4.0,
                                    pie: {
                                        low: 4.0,
                                        high: 5.0
                                    },
                                    color: "#00b0f0",
                                    stops: [
											[0, '#00b0f0'],
											[1, '#00b0f0'],
											[2, '#00b0f0']
										]
                                },
                                    {
                                        letter: "B",
                                        threshold: 3.0,
                                        pie: {
                                            low: 3.0,
                                            high: 4.0
                                        },
                                        color: "#00b050",
                                        stops: [
											[0, '#00b050'],
											[1, '#00b050'],
											[2, '#00b050']
										]
                                    },
									{
									    letter: "C",
									    threshold: 2.0,
									    pie: {
									        low: 2.0,
									        high: 3.0
									    },
									    color: "#eaea04",
									    textColor: "black", //MADELIVE
									    stops: [
											[0, '#eaea04'],
											[1, '#eaea04'],
											[2, '#eaea04']
										]
									},
									{
									    letter: "D",
									    threshold: -99999.0,
									    pie: {
									        low: 0.0,
									        high: 2.0
									    },
									    color: "#ff0000",
									    stops: [
											[0, '#ff0000'],
											[1, '#ff0000'],
											[2, '#ff0000']
										]
									}
								];
                            } else if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
                                //alert("debug: Bluegreen performance ranges test (ignore this)");
                                //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
                                //United before changes: controlopts.performanceRanges = [{ letter: "A", threshold: 4.0, pie: { low: 4.0, high: 5.0 }, color: "#6DB985", textColor: "black", stops: [[0, "#6DB985"], [1, "#6DB985"], [2, "#6DB985"]] }, { letter: "B", threshold: 3.0, pie: { low: 3.0, high: 4.0 }, color: "#B9CBE3", textColor: "black", stops: [[0, "#B9CBE3"], [1, "#B9CBE3"], [2, "#B9CBE3"]] }, { letter: "C", threshold: 2.0, pie: { low: 2.0, high: 3.0 }, color: "#C2C2C2", textColor: "black", stops: [[0, "#C2C2C2"], [1, "#C2C2C2"], [2, "#C2C2C2"]] }, { letter: "D", threshold: 1.0, pie: { low: 1.0, high: 2.0 }, color: "#F6E570", textColor: "black", stops: [[0, "#F6E570"], [1, "#F6E570"], [2, "#F6E570"]] }, { letter: "E", threshold: -99999.0, pie: { low: 0.0, high: 1.0 }, color: "#FF6868", textColor: "black", stops: [[0, "#FF6868"], [1, "#FF6868"], [2, "#FF6868"]]}];
                                controlopts.performanceRanges = [{ letter: "A", threshold: 99.9999, pie: { low: 99.9999, high: 110.0 }, color: "#6DB985", textColor: "black", stops: [[0, "#6DB985"], [1, "#6DB985"], [2, "#6DB985"]] }, { letter: "B", threshold: 90.0, pie: { low: 90.0, high: 99.9999 }, color: "#B9CBE3", textColor: "black", stops: [[0, "#B9CBE3"], [1, "#B9CBE3"], [2, "#B9CBE3"]] }, { letter: "C", threshold: 80.0, pie: { low: 80.0, high: 90.0 }, color: "#C2C2C2", textColor: "black", stops: [[0, "#C2C2C2"], [1, "#C2C2C2"], [2, "#C2C2C2"]] }, { letter: "D", threshold: 70.0, pie: { low: 70.0, high: 80.0 }, color: "#F6E570", textColor: "black", stops: [[0, "#F6E570"], [1, "#F6E570"], [2, "#F6E570"]] }, { letter: "E", threshold: -99999.0, pie: { low: 0.0, high: 70.0 }, color: "#FF6868", textColor: "black", stops: [[0, "#FF6868"], [1, "#FF6868"], [2, "#FF6868"]]}];
                            } else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                                //alert("debug: Bluegreen performance ranges test (ignore this)");
                                //controlopts.performanceRanges = [{ letter: "A", threshold: 9.0, pie: { low: 9.0, high: 10.0 }, color: "#019F01", stops: [[0, '#005B00'], [1, '#00AE00'], [2, '#00AE00']] }, { letter: "B", threshold: 7.0, pie: { low: 7.0, high: 9.0 }, color: "#EBE40C", stops: [[0, '#AF8013'], [1, '#FEFE00'], [2, '#FEFE00']] }, { letter: "C", threshold: 5.0, pie: { low: 5.0, high: 7.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, { letter: "D", threshold: -99999.0, pie: { low: 0.0, high: 5.0 }, color: "#990101", stops: [[0, '#5B0000'], [1, '#AC0000'], [2, '#AC0000']]}];
                                controlopts.performanceRanges = [{
                                    letter: "",
                                    threshold: -99999.0,
                                    pie: {
                                        low: 0.0,
                                        high: 10.0
                                    },
                                    color: "#ffff00",
                                    stops: [
										[0, '#937f0e'],
										[1, '#937f0e'],
										[2, '#937f0e']
									]
                                }];
                            }

                            for (var i in controlopts.performanceRanges) {
                                if (controlopts.performanceRanges[i].letter == "B") {
                                    controlopts.Bthreshold = controlopts.performanceRanges[i].threshold;
                                    break;
                                }
                            }

                            //MADELIVE
                            window.apmPerformanceColors = [];
                            for (var i in controlopts.performanceRanges) {
                                window.apmPerformanceColors.push({
                                    letter: controlopts.performanceRanges[i].letter,
                                    threshold: controlopts.performanceRanges[i].threshold,
                                    color: controlopts.performanceRanges[i].color,
                                    textColor: a$.exists(controlopts.performanceRanges[i].textColor) ? controlopts.performanceRanges[i].textColor : "#FEFEFE"
                                });
                            }

                            $("#imageback").attr('src', 'appApmClient/themes/default/images/gaugeGEN.jpg');
                            varigauge();

                            //Rank thresholds
                            switch (a$.urlprefix()) {
                                case "ers.":
                                case "make.":
                                case "cthix.":
                                    controlopts.rankopts = {
                                        xoffset: 10.0,
                                        barwidth: 260.0
                                    }
                                    controlopts.rankRanges = [ //COLORED Rank Ranges
										{
										letter: "+3",
										threshold: 0.80,
										segment: {
										    low: 0.80,
										    high: 1.0
										},
										color: "#019F01",
										stops: [
												[0, '#005B00'],
												[1, '#00AE00'],
												[2, '#00AE00']
											]
						},
										{
										    letter: "+2",
										    threshold: 0.70,
										    segment: {
										        low: 0.70,
										        high: 0.80
										    },
										    color: "#91f977",
										    stops: [
												[0, '#82d370'],
												[1, '#72b763'],
												[2, '#72b763']
											]
										},
										{
										    letter: "+1",
										    threshold: 0.6,
										    segment: {
										        low: 0.6,
										        high: 0.70
										    },
										    color: "#EBE40C",
										    stops: [
												[0, '#AF8013'],
												[1, '#FEFE00'],
												[2, '#FEFE00']
											]
										},
										{
										    letter: "Base",
										    threshold: -99999.0,
										    segment: {
										        low: 0.0,
										        high: 0.6
										    },
										    color: "#FF6600",
										    stops: [
												[0, '#d85600'],
												[1, '#bc4800'],
												[2, '#bc4800']
											]
										}
									];
                                    controlopts.rankRangesLEGACY = [ //COLORED Rank Ranges, used in ERS prior to 2/1/2016.
										{
										letter: "A+",
										threshold: 0.95,
										segment: {
										    low: 0.95,
										    high: 1.0
										},
										color: "#019F01",
										stops: [
												[0, '#005B00'],
												[1, '#00AE00'],
												[2, '#00AE00']
											]
						},
										{
										    letter: "A",
										    threshold: 0.80,
										    segment: {
										        low: 0.80,
										        high: 0.95
										    },
										    color: "#91f977",
										    stops: [
												[0, '#82d370'],
												[1, '#72b763'],
												[2, '#72b763']
											]
										},
										{
										    letter: "B+",
										    threshold: 0.6,
										    segment: {
										        low: 0.6,
										        high: 0.80
										    },
										    color: "#EBE40C",
										    stops: [
												[0, '#AF8013'],
												[1, '#FEFE00'],
												[2, '#FEFE00']
											]
										},
										{
										    letter: "B",
										    threshold: 0.1,
										    segment: {
										        low: 0.1,
										        high: 0.6
										    },
										    color: "#FF6600",
										    stops: [
												[0, '#d85600'],
												[1, '#bc4800'],
												[2, '#bc4800']
											]
										},
										{
										    letter: "C",
										    threshold: -99999.0,
										    segment: {
										        low: 0.0,
										        high: 0.1
										    },
										    color: "#990101",
										    stops: [
												[0, '#5B0000'],
												[1, '#AC0000'],
												[2, '#AC0000']
											]
										}
									];
                                    controlopts.rankRangesGUATEMALABONUS = [ //COLORED Rank Ranges, used in ERS prior to 2/1/2016.
										{
										letter: "B+2",
										threshold: 0.80,
										segment: {
										    low: 0.80,
										    high: 1.0
										},
										color: "#019F01",
										stops: [
												[0, '#005B00'],
												[1, '#00AE00'],
												[2, '#00AE00']
											]
						},
										{
										    letter: "B+1",
										    threshold: 0.70,
										    segment: {
										        low: 0.70,
										        high: 0.80
										    },
										    color: "#91f977",
										    stops: [
												[0, '#82d370'],
												[1, '#72b763'],
												[2, '#72b763']
											]
										},
										{
										    letter: "B",
										    threshold: 0.6,
										    segment: {
										        low: 0.6,
										        high: 0.70
										    },
										    color: "#EBE40C",
										    stops: [
												[0, '#AF8013'],
												[1, '#FEFE00'],
												[2, '#FEFE00']
											]
										},
										{
										    letter: "Non-Bonus",
										    threshold: -99999.0,
										    segment: {
										        low: 0.0,
										        high: 0.6
										    },
										    color: "#990101",
										    stops: [
												[0, '#5B0000'],
												[1, '#AC0000'],
												[2, '#AC0000']
											]
										}
									];
                                    controlopts.rankRangesNONPERFORMANCETREASUREHUNT = [{
                                        letter: "A+",
                                        threshold: 0.95,
                                        segment: {
                                            low: 0.95,
                                            high: 1.0
                                        },
                                        color: "#221177",
                                        stops: [
												[0, '#221177'],
												[1, '#FF6600'],
												[2, '#FF6600']
											]
                                    }, //TODO: change color
										{
										letter: "A",
										threshold: 0.80,
										segment: {
										    low: 0.80,
										    high: 0.95
										},
										color: "#1100BB",
										stops: [
												[0, '#1100BB'],
												[1, '#00AE00'],
												[2, '#00AE00']
											]
						},
										{
										    letter: "B+",
										    threshold: 0.6,
										    segment: {
										        low: 0.6,
										        high: 0.80
										    },
										    color: "#0033EE",
										    stops: [
												[0, '#0033EE'],
												[1, '#FEFE00'],
												[2, '#FEFE00']
											]
										},
										{
										    letter: "Treasure Hunt: B",
										    threshold: 0.1,
										    segment: {
										        low: 0.1,
										        high: 0.6
										    },
										    color: "#5588EE",
										    stops: [
												[0, '#5588EE'],
												[1, '#FF6600'],
												[2, '#FF6600']
											]
										}, //TODO: change color
										{
										letter: "C",
										threshold: -99999.0,
										segment: {
										    low: 0.0,
										    high: 0.1
										},
										color: "#88AAFF",
										stops: [
												[0, '#88AAFF'],
												[1, '#AC0000'],
												[2, '#AC0000']
											]
						}
									];
                                    controlopts.rankRangesNONPERFORMANCE = [{
                                        letter: "A+",
                                        threshold: 0.95,
                                        segment: {
                                            low: 0.95,
                                            high: 1.0
                                        },
                                        color: "#221177",
                                        stops: [
												[0, '#221177'],
												[1, '#FF6600'],
												[2, '#FF6600']
											]
                                    }, //TODO: change color
										{
										letter: "A",
										threshold: 0.80,
										segment: {
										    low: 0.80,
										    high: 0.95
										},
										color: "#1100BB",
										stops: [
												[0, '#1100BB'],
												[1, '#00AE00'],
												[2, '#00AE00']
											]
						},
										{
										    letter: "B+",
										    threshold: 0.6,
										    segment: {
										        low: 0.6,
										        high: 0.80
										    },
										    color: "#0033EE",
										    stops: [
												[0, '#0033EE'],
												[1, '#FEFE00'],
												[2, '#FEFE00']
											]
										},
										{
										    letter: "B",
										    threshold: 0.1,
										    segment: {
										        low: 0.1,
										        high: 0.6
										    },
										    color: "#5588EE",
										    stops: [
												[0, '#5588EE'],
												[1, '#FF6600'],
												[2, '#FF6600']
											]
										}, //TODO: change color
										{
										letter: "C",
										threshold: -99999.0,
										segment: {
										    low: 0.0,
										    high: 0.1
										},
										color: "#88AAFF",
										stops: [
												[0, '#88AAFF'],
												[1, '#AC0000'],
												[2, '#AC0000']
											]
						}
									];
                                    controlopts.varirankgauge({
                                        ranges: controlopts.rankRanges,
                                        paper: controlopts.rank_gpaper
                                    });
                                    break;
                                case "km2.":
                                case "km2-make40.":
                                case "cox.":
                                case "cox-mnt.":
                                case "cox-test.":
                                    controlopts.rankopts = {
                                        xoffset: 10.0,
                                        barwidth: 260.0
                                    }
                                    controlopts.rankRanges = [{
                                        letter: " ",
                                        threshold: -99999,
                                        segment: {
                                            low: 0.0,
                                            high: 1.0
                                        },
                                        color: "#5588EE",
                                        stops: [
												[0, '#5588EE'],
												[1, '#FF6600'],
												[2, '#FF6600']
											]
                                    }, //TODO: change color
									];
                                    controlopts.varirankgauge({
                                        ranges: controlopts.rankRanges,
                                        paper: controlopts.rank_gpaper
                                    });
                                    break;
                                default:
                                    controlopts.rankopts = {
                                        xoffset: 10.0,
                                        barwidth: 260.0
                                    }
                                    controlopts.rankRanges = [{
                                        letter: "A+",
                                        threshold: 0.95,
                                        segment: {
                                            low: 0.95,
                                            high: 1.0
                                        },
                                        color: "#221177",
                                        stops: [
												[0, '#221177'],
												[1, '#FF6600'],
												[2, '#FF6600']
											]
                                    }, //TODO: change color
										{
										letter: "A",
										threshold: 0.80,
										segment: {
										    low: 0.80,
										    high: 0.95
										},
										color: "#1100BB",
										stops: [
												[0, '#1100BB'],
												[1, '#00AE00'],
												[2, '#00AE00']
											]
						},
										{
										    letter: "B+",
										    threshold: 0.6,
										    segment: {
										        low: 0.6,
										        high: 0.80
										    },
										    color: "#0033EE",
										    stops: [
												[0, '#0033EE'],
												[1, '#FEFE00'],
												[2, '#FEFE00']
											]
										},
										{
										    letter: "B",
										    threshold: 0.1,
										    segment: {
										        low: 0.1,
										        high: 0.6
										    },
										    color: "#5588EE",
										    stops: [
												[0, '#5588EE'],
												[1, '#FF6600'],
												[2, '#FF6600']
											]
										}, //TODO: change color
										{
										letter: "C",
										threshold: -99999.0,
										segment: {
										    low: 0.0,
										    high: 0.1
										},
										color: "#88AAFF",
										stops: [
												[0, '#88AAFF'],
												[1, '#AC0000'],
												[2, '#AC0000']
											]
						}
									];
                                    controlopts.varirankgauge({
                                        ranges: controlopts.rankRanges,
                                        paper: controlopts.rank_gpaper
                                    });
                                    break;
                            };

                            Highcharts.wrap(Highcharts.Chart.prototype, 'redraw', function (proceed, animation) {
                                proceed.call(this, animation);
                                try {
                                    if (this.legend.options.floating) {
                                        var z = this.legend.group.element, zzz = z.parentNode;
                                        zzz.removeChild(z);
                                        zzz.appendChild(z); //zindex in svg is determined by element order
                                    }
                                } catch (e) {

                                }
                            });
                            /*
                            Highcharts.theme.yAxis.plotBands = [{ color: 'white', from: -0.04, to: 0.00}];
                            for (var i in controlopts.performanceRanges) {
                            if (controlopts.performanceRanges[i].threshold > 0.0) {
                            Highcharts.theme.yAxis.plotBands.push({ color: 'white', from: controlopts.performanceRanges[i].threshold - 0.02, to: controlopts.performanceRanges[i].threshold + 0.02 });
                            }
                            }
                            Highcharts.setOptions(Highcharts.theme);


                            //MODAL DIALOG TEST
                            /*
                            $('#daterange').qtip(
                            {
                            content: {
                            title: {
                            text: 'Modal qTip',
                            button: 'Close'
                            },
                            text: 'Heres an example of a rather bizarre use for qTip... a tooltip as a <b>modal dialog</b>! <br /><br />' +
                            'Much like the <a href="//onehackoranother.com/projects/jquery/boxy/">Boxy</a> plugin, ' +
                            'but if you\'re already using tooltips on your page... <i>why not utilise qTip<i> as a modal dailog instead?'
                            },
                            position: {
                            target: $(document.body), // Position it via the document body...
                            corner: 'center' // ...at the center of the viewport
                            },
                            show: {
                            when: 'click', // Show it on click
                            solo: true // And hide all other tooltips
                            },
                            hide: false,
                            style: {
                            width: { max: 350 },
                            padding: '14px',
                            border: {
                            width: 9,
                            radius: 9,
                            color: '#666666'
                            },
                            name: 'light'
                            },
                            api: {
                            beforeShow: function()
                            {
                            // Fade in the modal "blanket" using the defined show speed
                            //$('#qtip-blanket').fadeIn(this.options.show.effect.length);
                            },
                            beforeHide: function()
                            {
                            // Fade out the modal "blanket" using the defined hide speed
                            //$('#qtip-blanket').fadeOut(this.options.hide.effect.length);
                            }
                            }
                            });
                            */
                            /*
                            // Create the modal backdrop on document load so all modal tooltips can use it
                            $('<div id="qtip-blanket">')
                            .css({
                            position: 'absolute',
                            top: $(document).scrollTop(), // Use document scrollTop so it's on-screen even if the window is scrolled
                            left: 0,
                            height: $(document).height(), // Span the full document height...
                            width: '100%', // ...and full width

                            opacity: 0.7, // Make it slightly transparent
                            backgroundColor: 'black',
                            zIndex: 5000  // Make sure the zIndex is below 6000 to keep it below tooltips!
                            })
                            .appendTo(document.body) // Append to the document body
                            .hide(); // Hide it initially
                            });
                            */
                            //END MODAL DIALOG TEST

                            appApmDashboard.getdashboardsettings();
                            appApmDashboard.setcontrolopts(controlopts);
                            appApmReport.setDashboardFilters($("#StgDashboard select").val());

                            /*
                            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Username") == "yjohnso") || ($.cookie("TP1Username") == "shood") || ($.cookie("TP1Username") == "asanders")) {
                            appApmMessaging.getmessages();
                            }
                            else {
                            appApmDashboard.getusersettingsOLD();
                            $(".messages-compose").each(function () { $(this).css("display", "none"); });
                            }
                            */
                            appApmMessaging.getmessages();

                            //document.getElementById('btnAdd').disabled = 'disabled';
                            //document.getElementById('btnClear').disabled = 'disabled';

                            //$("#mycontainer").draggable();
                            //$("#set div").draggable({ stack: "#set div" });

                            var chosenboxes = false;
                            if ($.browser.msie) {
                                if (($('#browserversion').html() == "isie8") || ($('#browserversion').html() == "isgtie8")) chosenboxes = true;
                            } else chosenboxes = true;
                            if (chosenboxes) {
                                $(".chosen").data("Placeholder", "Select...").chosen();
                                //$(".chzn-search").hide();
                                /*
                                $(".chzn-container").bind("mouseover", function () {
                                alert("debug:here");
                                alert($(this).attr("id"));
                                //alert("debug:spanDatefrom changed");
                                });
                                */
                                $(".chzn-select").chosen({
                                    disable_search_threshold: 5
                                });
                            }

                            if ($.browser.msie) {
                                if (($('#browserversion').html() == "isie8") || ($('#browserversion').html() == "isgtie8")) { } else {
                                    //IE7 or below
                                    //alert("debug:IE 7 or below");
                                    /*
                                    $(".leftpanel").css("overflow-x", "scroll");
                                    $(".leftpanel").css("width", "300px");
                                    $("#tabs").css("left", "300px");
                                    */
                                }
                            }

                            for (var i = 0; i < 16; i++) $("#needle" + i).rotate({
                                animateTo: -2
                            });
                            $("#gaugescore").html("");
                            $("#gaugelabel").html("");

                            var settings = {
                                tl: {
                                    radius: 20
                                },
                                tr: {
                                    radius: 20
                                },
                                bl: {
                                    radius: 20
                                },
                                br: {
                                    radius: 20
                                },
                                autoPad: true,
                                validTags: ["div"]
                            }

                            appApmSettings.init({
                                id: "StgAttritionSearch",
                                ui: "slider"
                            });
                            $("#StgAttritionSearch select").bind("change", function () {
                                switch ($(this).val()) {
                                    case "Hierarchy":
                                        $(".attrition-show-hi").show();
                                        $(".attrition-show-loc").hide();
                                        break;
                                    default:
                                        $(".attrition-show-hi").hide();
                                        $(".attrition-show-loc").show();
                                        break;
                                }
                            });
                            appApmSettings.init({
                                id: "StgAttritionTest",
                                ui: "slider"
                            });

                            $("#StgAttritionTest select").bind("change", function () {
                                switch ($(this).val()) {
                                    case "Supervisor":
                                        $(".attrition-show-supervisor").show();
                                        $(".attrition-show-hr").hide();
                                        appApmAttrition.showagents();
                                        break;
                                    default:
                                        $(".attrition-show-supervisor").hide();
                                        $(".attrition-show-hr").show();
                                        appApmAttrition.showagents();
                                        break;
                                }
                            });

                            if (($.cookie("TP1Role") != "CSR")) { //($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Username") == "jclark") || ($.cookie("TP1Username") == "bgill")) { //(($.cookie("TP1Username") == "jeffgack") || ($.cookie("TP1Username") == "dweather") || ($.cookie("TP1Username") == "guygray") || ($.cookie("TP1Username") == "llecomte")) {
                                //$("#header_liActive a").html("Dashboard V2");
                                //$("#header_liActive").after('<li><a target="_blank" href="'//' + a$.urlprefix() + 'acuityapm.com/default.aspx?dashboard=1">Dashboard V1</a></li>');
                                if (((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) && (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
                                    //$("#StgDashboard select option[value='Supervisor']").remove();
                                    $("#StgDashboard select option[value='Source']").remove();
                                    $("#StgDashboard select option[value='Attrition']").remove();
                                    //$(".stgdashboard-override-hide").hide();
                                }
                                else if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                    //$("#StgDashboard select option[value='Supervisor']").remove();
                                    $("#StgDashboard select option[value='Source']").remove();
                                    $("#StgDashboard select option[value='Attrition']").remove();
                                    //$(".stgdashboard-override-hide").hide();
                                }
                                else if ((a$.urlprefix() == "ers.") || (a$.urlprefix().indexOf("make") >= 0)) {
                                }
                                else if (a$.urlprefix() == "cthix.") {
                                    $("#StgDashboard select option[value='Source']").remove();
                                    $("#StgDashboard select option[value='Attrition']").remove();
                                } else {
                                    $("#StgDashboard select option[value='Source']").remove();
                                    $("#StgDashboard select option[value='Attrition']").remove();
                                    $(".stgdashboard-override-hide").hide();
                                    $("#StgDashboard").hide(); //For now just hide the whole dashboard slider if not ers. (Note: attrition-hide might mess this up in certain configurations).
                                }
                                if (a$.urlprefix() == "cthix.") { } else {
                                    if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "jclark") || ($.cookie("TP1Username") == "bgill")) { } else {
                                        //For special access to the Program/Financial Dashboard
                                    }
                                    //Just remove for everyone (except CTHIX) for now.
                                    $("#StgDashboard select option[value='Program']").remove();
                                    $("#StgDashboard select option[value='Financial']").remove();

                                }

                                appApmSettings.init({
                                    id: "StgDashboard",
                                    ui: "slider"
                                });

                                if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                    $("#StgDashboard").hide(); //For now just hide the whole dashboard slider if chime.
                                }

                                $("#spanDatefrom").bind("change", function () {
                                    alert("debug:spanDatefrom changed");
                                });
                                //$("#attritiontab").hide();

                                if (a$.urlprefix() == "cthix-program.") { // CTHIX:
                                    appApmDashboard.setCookiePrefix("PD");
                                    $("#showpay").css("display", "none");
                                    $("#csrlabel").html("View");
                                }

                                $("#StgDashboard select").bind("change", function () {
                                    if (!$("#graphtab").eq(0).hasClass("ui-state-active")) {
                                        $('#graphlabel').trigger('click');
                                    }
                                    appApmReport.setDashboardFilters($(this).val());
                                });
                            }

                            if ($.cookie("TP1Username") == "jeffgack") {
                                $("#StgDeveloper").show();
                                $("#experimental1").show();
                            }

                            appApmSettings.init({
                                id: "StgNotifications",
                                ui: "slider"
                            });

                            appApmSettings.init({
                                id: "StgTooltips",
                                ui: "iphoneswitch"
                            });
                            $("#StgTooltips select").bind("change", function () {
                                if ($("#StgTooltips select").val() == "Off") {
                                    $('*').qtip('disable')
                                } else {
                                    $('*').qtip('enable')
                                }
                            });

                            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("ProjectLocation");
                            }
                            else if (a$.urlprefix() == "cox.") {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("PartnerTier");
                            }

                            $("#suptoolstab").hide();
                            if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                //No tools tab.
                            } else if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.") || ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo."))) {
                                if ($.cookie("TP1Role") != "CSR") {
                                    switch ($.cookie("TP1Role")) {
                                        case "Team Leader":
                                            $("#StgToolsLevel select").val("CSR");
                                            $("#StgToolsLevel").hide();
                                            break;
                                        case "Group Leader":
                                            $("#StgToolsLevel select").val("Team");
                                            $("#StgToolsLevel select option[value='Group']").remove();
                                            $("#StgToolsLevel select option[value='Location']").remove();
                                            break;
                                        default:
                                            $("#StgToolsLevel select").val("Location");
                                            break;
                                    }
                                    $("#StgSupTools select").val("On");
                                    $("#suptoolstab").show();
                                    //appApmSupTools.init();
                                }
                                //alert("debug:role cookie=" + $.cookie("TP1Role"));
                                appApmSettings.init({
                                    id: "StgToolsLevel",
                                    ui: "slider"
                                });
                                $("#StgToolsLevel select").bind("change", function () {
                                    appApmSupTools.init();
                                });
                            }

                            if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) && ($.cookie("TP1Username") == "amccord")) {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("Project");
                            }
                            if (a$.urlprefix() == "vec.") {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("Project");
                            }
                            if (a$.urlprefix() == "nex.") {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("Location");
                            }

                            if ((a$.urlprefix() == "vec.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "nex.")) {
                                $("#StgBell select").val("On");
                            }
                            if ($.cookie("ApmInDallas") != null)
                                if ($.cookie("ApmInDallas") != "") {
                                    $("#StgInTraining select").each(function () {
                                        $(this).val("Include");
                                    });
                                    $("#StgRanking select").val("Off");
                                }
                            appApmSettings.init({
                                id: "StgInTraining",
                                ui: "slider"
                            });
                            appApmSettings.init({
                                id: "AttritionShowInTraining",
                                shadow: "StgInTraining",
                                ui: "combo"
                            });
                            appApmSettings.init({
                                id: "ReportShowInTraining",
                                shadow: "StgInTraining",
                                ui: "combo"
                            });

                            if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                $("#StgInTraining").hide();
                            }
                            if ($.cookie("TP1Role") == "CSR") {
                                $("#StgInTraining").hide();
                            }

                            appApmSettings.init({
                                id: "StgGraphLabels",
                                ui: "slider",
                                textabove: "label",
                                textbelow: "none"
                            });
                            $("#StgGraphLabels select").bind("change", function () {
                                appApmDashboard.StgGraphLabels_update(0);
                            });

                            appApmSettings.init({
                                id: "StgBarView",
                                ui: "slider"
                            });
                            $("#StgBarView select").bind("change", function () {
                                //alert("debug: StgBarView select=" + $("#StgBarView select").val());
                                if ((document.getElementById("rdoBase").checked) || (document.getElementById("rdoPay").checked)) {
                                    appApmDashboard.StgBarView_update(0);
                                }
                            });

                            if (a$.preview()) {
                                appApmSettings.init({
                                    id: "StgShowSeries",
                                    ui: "slider"
                                });
                                $("#StgShowSeries select").bind("change", function () {
                                    if ((document.getElementById("rdoBase").checked) || (document.getElementById("rdoPay").checked)) {
                                        appApmDashboard.StgShowSeries_update(0);
                                    }
                                });
                            }


                            appApmSettings.init({
                                id: "StgFilterRefreshFrequency",
                                ui: "slider"
                            });
                            $("#StgFilterRefreshFrequency select").bind("change", function () {
                                appApmDashboard.setFilterPerfLevel($(this).val());
                            });

                            if (($.cookie("TP1Username") == "gsalvato")) { //Important to do before the init.
                                $("#StgGraphRefreshFrequency select").val("Express");
                                appApmDashboard.setDataPerfLevel("Express");
                            }
                            if (($.cookie("TP1Username") == "jclark") || ($.cookie("TP1Username") == "bgill")) {
                                $("#StgGraphRefreshFrequency select").val("Always");
                                appApmDashboard.setDataPerfLevel("Always");
                            }

                            appApmSettings.init({
                                id: "StgGraphRefreshFrequency",
                                ui: "slider"
                            });
                            $("#StgGraphRefreshFrequency select").bind("change", function () {
                                appApmDashboard.setDataPerfLevel($(this).val());
                            });

                            appApmSettings.init({
                                id: "StgRankCSRsBy",
                                ui: "slider"
                            });
                            $("#StgRankCSRsBy select").bind("change", function () {
                                appApmDashboard.setCSRRankingBy($(this).val());
                            });


                            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix().indexOf("make") >= 0) || (a$.urlprefix() == "ec2.")) {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("ProjectLocation");
                                appApmDashboard.setCSRRankingBy("ProjectLocation");
                            }
                            if (a$.urlprefix() == "nex.") {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("Location");
                                appApmDashboard.setCSRRankingBy("Location");
                            }
                            if (a$.urlprefix() == "vec.") {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("Project");
                                appApmDashboard.setCSRRankingBy("Project");
                            }
                            if (((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.")) && ($.cookie("TP1Username") == "amccord")) {
                                $("#StgRanking select").val("On");
                                $("#StgRankCSRsBy select").val("Project");
                                appApmDashboard.setCSRRankingBy("Project");
                            }



                            $(".leftpanel").height(($(window).height() - 96) + 'px');


                            function pad(number, length) {
                                var str = '' + number;
                                while (str.length < length) {
                                    str = '0' + str;
                                }
                                return str;
                            }

                            appApmSettings.init({
                                id: "StgAdvancedTest",
                                ui: "slider"
                            });
                            appApmSettings.init({
                                id: "AdvancedNotifications",
                                shadow: "StgNotifications",
                                ui: "slider"
                            });
                            appApmSettings.init({
                                id: "AdvancedNotifications2",
                                shadow: "StgNotifications",
                                ui: "slider"
                            });
                            appApmSettings.init({
                                id: "AdvancedNotificationsCombo",
                                shadow: "StgNotifications",
                                ui: "combo"
                            });
                            appApmSettings.init({
                                id: "AdvancedGraphLabels",
                                shadow: "StgGraphLabels",
                                ui: "combo"
                            });

                            $("#add").click(function () {
                                var branches = $("<li><span class='folder'>New Sublist</span><ul>" +
									"<li><span class='file'>Item1</span></li>" +
									"<li><span class='file'>Item2</span></li></ul></li>").appendTo("#projecttree");
                                $("#projecttree").treeview({
                                    add: branches
                                });
                                return false;
                            });

                            //Role-specific modifications
                            switch ($.cookie("TP1Role")) {
                                case "CSR":
                                    $("#monitorlink").attr("href", "//acuityapm.com/monitor/monitor_review.aspx");
                                    $("#import_li").hide();
                                    /* //Good stuff, but not what they wanted.
                                    if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
                                    $("#StgSupervisorFilters").show();
                                    $("#StgSupervisorFilters_label").show();
                                    $("#StgSupervisorFilters select > option").eq(0).html("View Your Statistics");
                                    $("#StgSupervisorFilters select > option").eq(0).attr("value","Self");
                                    appApmSettings.init({
                                    id: "StgSupervisorFilters",
                                    ui: "slider"
                                    });
                                    $("#StgSupervisorFilters select").bind("change", function() {
                                    appApmDashboard.StgSupervisorFilters_update(0);
                                    });
                                    $("#StgSupervisorFilters_label").html("Consultant Filters");
                                    }
                                    */
                                    break;
                                case "Team Leader":
                                case "Group Leader":
                                    if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-mnt") >= 0)) {
                                    }
                                    else {
                                        $("#StgSupervisorFilters").show();
                                        $("#StgSupervisorFilters_label").show();
                                        appApmSettings.init({
                                            id: "StgSupervisorFilters",
                                            ui: "slider"
                                        });
                                        $("#StgSupervisorFilters select").bind("change", function () {
                                            appApmDashboard.StgSupervisorFilters_update(0);
                                        });
                                    }
                                default:
                                    break;
                            }


                            //New Feature Releases
                            switch (a$.urlprefix()) {
                                case "ers.":
                                case "cthix.":
                                case "ers-alpha.":
                                    $("#scoreeditor_li").hide();
                                    $("#attendancetracker_li").hide();
                                    if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Username") == "disloan") || ($.cookie("TP1Username") == "rleal") || ($.cookie("TP1Username") == "pgromley")) {
                                        $(".headericon-import").show();
                                    } else {
                                        //$(".headericon-chat").hide();
                                    }
                                    $(".help").hide();
                                    break;
                                case "chime.":
                                case "chime-test.":
                                case "chime-make40.":
                                case "chime-mnt.":
                                case "cox.":
                                case "ces.":
                                case "ces-demo.":
                                case "bgr.":
                                case "bgr-test.":
                                case "nex.":
                                case "vec.":
                                case "tsd.":
                                case "aldi.":
                                case "rcm.":
                                case "make.":
                                case "ob24.":
                                case "km2.":
                                case "km2-make40.":
                                case "twc.":
                                case "sprintgame.":
                                case "cthix.":
                                case "veyo.":
                                case "frost-arnett.":
                                case "act.":
                                case "performant.":
                                case "united.":
                                case "united2.":
                                    $("#scoreeditor_li").hide();
                                    if ($.cookie("TP1Role") == "CSR") {
                                        $("#attendancetracker_li").hide();
                                    } else {
                                        $("#attendancetracker_li").show();
                                    }
                                    $("#StgFilterRefreshFrequency select").val("Always");
                                    $("#StgGraphRefreshFrequency select").val("Always");
                                    appApmDashboard.setDataPerfLevel("Always"); //Shouldn't need to do this...

                                    if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ((a$.urlprefix() == "chime.") && (($.cookie("TP1Username") == "mjobe") || ($.cookie("TP1Username").toLowerCase() == "tlyle")))) {
                                        $(".headericon-import").show();
                                    }
                                    $(".help").hide();
                                    break;
                                case "devHOLD.":
                                    $(".headericon-import").show();
                                default:
                                    $("#scoreeditor_li").show();
                                    $("#attendancetracker_li").hide();
                            }
                            appApmSettings.init({
                                id: "StgHireDatesFilter",
                                ui: "slider"
                            });

                            if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                $("#StgHireDatesFilter").hide();
                            }

                            if ($.cookie("TP1Role") == "CSR") {
                                $("#StgHireDatesFilter").hide();
                            }

                            $("#StgHireDatesFilter select").bind("change", function () {
                                if ($(this).val() == "Filter On") $("#hiredatelabel,#hiredatefilter").show();
                                else $("#hiredatelabel,#hiredatefilter").hide();
                            });

                            appApmSettings.init({
                                id: "StgEditing",
                                ui: "iphoneswitch"
                            });
                            appApmSettings.init({
                                id: "StgRanking",
                                ui: "iphoneswitch"
                            });
                            appApmSettings.init({
                                id: "StgBell",
                                ui: "iphoneswitch"
                            });
                            appApmSettings.init({
                                id: "StgSupTools",
                                ui: "iphoneswitch"
                            });
                            appApmSettings.init({
                                id: "StgInjDev",
                                ui: "iphoneswitch"
                            });
                            //$("#tabs").css("position", "relative");
                            $("#tabs").append('<div class="admin-editing-wrapper stg-field"><label id="AdminEditingLabel">Editing:</label><span id="AdminEditing" class="stg"></span></div>');
                            appApmSettings.init({
                                id: "AdminEditing",
                                shadow: "StgEditing",
                                ui: "iphoneswitch"
                            });

                            if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "sfletcher")) {
                                $("#scoring_li").show();
                                $("#StgEditing select").val("On");
                            } else if (($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") == "Team Leader")) {
                                $("#scoring_li").show();
                                $("#StgEditing select").val("Off");
                                $("#StgEditingDiv").hide();
                                $("#AdminEditing,#AdminEditingLabel").hide();
                            }

                            if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
                                if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin"))) {
                                    $("#scoring_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    $("#admin_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    $("#monitor_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    $("#reports_normal_li,#reports_restricted_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    $("#import_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");

                                    if (a$.urlprefix().indexOf("km2") >= 0) {
                                        $("#changepassword_li").hide();
                                    }
                                }
                            } else if (a$.urlprefix().indexOf("km2") >= 0) {
                                if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Quality Assurance"))) {
                                    if (!(($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Group Leader"))) {
                                        $("#scoring_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    }
                                    $("#admin_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    $("#monitor_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    $("#reports_normal_li,#reports_restricted_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    $("#import_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                    if (a$.urlprefix().indexOf("km2") >= 0) {
                                        $("#changepassword_li").hide();
                                    }
                                }
                            }
                            else if (a$.urlprefix().indexOf("chime") >= 0) {
                                //if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Quality Assurance"))) {
                                if (!(($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Role") == "Group Leader"))) {
                                    //$("#scoring_li").find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                }
                                $("#classicdashboard_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                //$("#admin_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#").hide();
                                //$("#monitor_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                $("#reports_normal_li,#reports_restricted_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                $("#import_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                $("#attendancetracker_li").hide().find("*").css("color", "lightgray").css("cursor", "wait").attr("href", "#");
                                /*
                                if (a$.urlprefix().indexOf("chime") >= 0) {
                                $("#changepassword_li").hide();
                                }
                                */
                                //}
                            }
                            if (a$.urlprefix() == "sprintgame.") {
                                $("#StgBarView select").val("Series Colors");
                                $("#StgBarView").hide();
                                if (!($.cookie("TP1Role") == "Admin")) {
                                    $("#StgEditing select").val("Off");
                                }
                            }

                            var filteredproject = false;
                            if ($.cookie("ApmProjectFilter") != null) {
                                if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "") && ($.cookie("ApmProjectFilter") != "ALL-READONLY")) {
                                    filteredproject = true;
                                    $("#showpay").hide();
                                }
                                if (($.cookie("ApmProjectFilter") != "none") && ($.cookie("ApmProjectFilter") != "")) {
                                    filteredproject = true;
                                    $("#header_ul li").each(function () {
                                        switch ($(this).children().first().html()) {
                                            case "Dashboard":
                                                break;
                                            case "Reports":
                                                //$(this).children().first().attr("href", '//' + a$.urlprefix() + 'acuityapmr.com/jq/TP1ReportsMenu.aspx?roleset=&project=' + $.cookie("ApmProjectFilter") + '&projectfilter=' + $.cookie("ApmProjectFilter"));
                                                //break;
                                            default:
                                                $(this).hide();
                                        }
                                    });
                                    //Added 8/13/2014
                                    $("#admin_li,#reports_normal_li,#import_li,#scoreeditor_li,#attendancetracker_li,#scoring_li").hide();
                                    $("#reports_restricted_li").show();
                                }
                            }
                            if (!filteredproject) {
                                $('.headericon-chat').show();
                            }

                            if (a$.urlprefix() == "performant.") {
                                $("#reports_normal_li").hide();
                                $("#reports_restricted_li").hide();
                                $(".easycom-editor").hide();
                                $("#scoring_li").hide();

                                if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin")) {
                                    $("#scoring_li").show();
                                }
                                if (!(($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Quality Assurance"))) {
                                    $("#monitor_li").hide();
                                }
                            }

                            if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) {
                                $(".headericon-chat").hide();
                            }

                            $("#StgEditing select").bind("change", function () {
                                var setting = $(this).val();
                                $(".edit-span").each(function () {
                                    var hold;
                                    if (setting == "On") {
                                        hold = $(this).html();
                                        $(this).html('<input type="text" value="' + hold + '"/>');
                                    } else {
                                        hold = $(" input", this).val();
                                        $(this).html(hold);
                                    }
                                });
                                $(".stg-span").each(function () {
                                    if (setting == "On") {
                                        $(this).children().each(function () {
                                            $(this).show();
                                        });
                                        $(" > span > span", this).hide();
                                        $(" > label > span", this).remove();
                                    } else {
                                        $(this).children().each(function () {
                                            $(this).hide();
                                        });
                                        //$(" > label", this).html($(" > label", this).html() & "<span>HELLO!</span>");
                                        $(" > label", this).append("<span>" + $(" > span > span", this).html() + "</span>");
                                        $(" > label", this).show();

                                        //$(" > span > span", this).show();
                                    }
                                });
                            });

                            $("#btnSEView").bind("click", function () {
                                appApmScoreEditing.btnView("scoreeditorarea");
                            });

                            appApmDashboard.setClientLabels(); //Doing this again.


                            // Creates canvas 320 × 200 at 10, 50

                            /*
                            gaugesdiv
                            messagediv
                            filterdiv
                            settingsdiv
                            */
                            usehash();
                            try {
                                resizedivs();
                            } catch (err) { };

                            $(window).bind("hashchange", function () {
                                usehash();
                            });

                            if (true) { //MAKEDEV (this is now NOT defeated).
                                if ((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-mnt") >= 0)) {
                                    if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
                                        setTimeout(setsupfilter, 5000);
                                        function setsupfilter() {
                                            if ($.cookie("TP1Role") == "Team Leader") {
                                                $("#StgSupervisorFilters select").val("Location"); //TODO: change to "Entire Project"
                                                $.cookie("DefaultTeam", $("#selTeams").val());

                                            }
                                            else if ($.cookie("TP1Role") == "CSR") {
                                                $("#StgSupervisorFilters select").val("Team");
                                            }
                                            appApmDashboard.StgSupervisorFilters_update(0);
                                            if ($.cookie("TP1Role") == "CSR") {
                                                if (a$.gup("test") == "1") {
                                                    setTimeout(fantabover, 3000);
                                                    function fantabover() {
                                                        $('#fanlabel').trigger('click');
                                                        ko.postbox.publish("FanSetGamelessPlayerHome", true);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            //To force iFrame refresh, publish yourself if you're a CSR (problem with the Review tab)
                            if ($.cookie("TP1Role") == "CSR") {
                                ko.postbox.publish("JournalCSR", $.cookie("TP1Username"));
                                ko.postbox.publish("CSR", $.cookie("TP1Username"));
                            }

                            var interval = setInterval(function () {
                                if (document.readyState === 'complete') {
                                    clearInterval(interval);
                                    $(".splash").hide();
                                }
                            }, 100);

                            //End of ready .ready?

                        });

						var paper = Raphael(0, 0, 500, 70);

						function animatelogo() {
							if (true || a$.preview()) {
								paper.clear();
								if ((pageTheme == "Acuity3") || (pageTheme == "Shutterfly")) {
									var lof; //logo offset
									var red_start_rad, red_final_rad;
									var blue_rad;
									var lofnb;
									var loft;
									var yellow_start_rad, yellow_final_rad;
									if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "NOTers-mnt.") || (a$.urlprefix() == "rcm.") || (a$.gup("theme") == "CEScore") /* || ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-demo.")) */)) {
									    $(".logo").css("top", "9px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
									    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/CESCORE_AcuityD.png")');
									    $(".heading").css("top", "25px").css("left", "350px");
									    $(".logo-reload").hide(); //Sorry Julie :?
									    return;
									} else if ((a$.gup("theme").toLowerCase() == "sprint") || debug_makingsprintgame || (a$.urlprefix().indexOf("sprintgame.") >= 0)) {
									    $(".logo").css("top", "0px").css("height", "70px").css("width", "502px"); //.css("background-size", "91%");
									    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/Sprint_LOC_logo_jeffsMod2.png")');
									    $(".app-header").removeClass("gradient-lightest");
									    $(".heading").css("top", "45px").css("left", "320px").hide();
									    $(".logo-reload").hide(); //Sorry Julie :?
									    return;
									}
									else if ((a$.gup("notheme") == "") && (a$.urlprefix() == "ces-demo.")) {
									    $(".logo").css("top", "0px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
									    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/CES/CURRENTDEMO.png")');
									    $(".logo").css("background-size", "contain");
									    $(".logo-reload").hide(); //Sorry Julie :?
									    $(".heading").css("top", "45px").css("left", "320px");
									    return;
									}
									else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united2."))) {
									    $(".logo").css("top", "0px").css("height", "70px").css("width", "450px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
									    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/united-logo-white.png")');
									    $(".logo").css("background-size", "contain");
									    $(".logo-reload").hide(); //Sorry Julie :?
									    $(".heading").css("top", "45px").css("left", "320px");
									    return;
									}
									else if ((a$.gup("notheme") == "") && ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt."))) {
									    $(".logo").css("top", "-3px").css("left", "82px").css("height", "70px").css("width", "150px").css("background-repeat", "no-repeat").css("background-height", "no-repeat");
									    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/chime-header-logo.svg")');
									    $(".logo").css("background-position", 'left');
									    $(".logo").css("top", '-3px');
									    $(".heading").css("top", "25px").css("left", "230px");
									    $(".logo-reload").hide(); //Sorry Julie :?
									    //$(".logo").prepend('<div style="font-size: 30px;position:absolute;top:32px;left:145px;">Score</div>');
									    return;
									}
									else if (false) { //Animated Acuity Logo with CEScore
									    $(".logo").css("top", "0px").css("height", "70px").css("width", "387px").css("background-repeat", "no-repeat");
									    //Weirdest thing ever!!
									    $(".logo").css("background-image", 'url("../App_Themes/Acuity3/images/CESCORE_AcuityC.png")');
									    $(".heading").css("top", "45px").css("left", "320px");
									    lof = [195, -35];
									    red_start_rad = [43, 9];
									    red_final_rad = [23, 9];
									    blue_rad = [33, 12];
									    lofnb = [10, 5];
									    yellow_start_rad = [123, 93];
									    yellow_final_rad = [28, 10];
									    loft = [-20, 7];
									} else {
									    $(".logo").css("width", "175px");
									    lof = [4, -4];
									    red_start_rad = [83, 18];
									    red_final_rad = [43, 18];
									    blue_rad = [61, 23];
									    lofnb = [0, 0];
									    yellow_start_rad = [153, 123];
									    yellow_final_rad = [53, 23];
									    loft = [0, 0];
									}

								}
							}

						}

						//{ letter: "A+", threshold: 0.95, segment: { low: 0.95, high: 1.0 }, color: "#FF6600", stops: [[0, '#BB5500'], [1, '#FF6600'], [2, '#FF6600']] }, //TODO: change color


						function varigauge() {
							$("#gaugeover").show();
                            var SCOREBASIS = 10.0;
                            if ((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
                                SCOREBASIS = 4.0;
                            }
                            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-test.") || (a$.urlprefix() == "cox-mnt.")) {
                                SCOREBASIS = 7.0;
                            }
                            if ((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.")) {
                                SCOREBASIS = 5.0;
                            }
                            if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
                                SCOREBASIS = 110.0;
                            }
                            var gpaper = Raphael("gaugeover", 280, 200);
							var lof;
							var rad;

							lof = [141, 160];
							rad = [103, 26];

							function radialpoint(o) {
								var rad = o.angle * (Math.PI / 180.0);
								return [o.origin[0] + (o.radius * Math.cos(rad)), o.origin[1] + (o.radius * Math.sin(rad))];
							}

							function bandpath(o) {
								var so = radialpoint({
									origin: o.origin,
									radius: o.radii[0],
									angle: o.sweep[0]
								});
								var eo = radialpoint({
									origin: o.origin,
									radius: o.radii[0],
									angle: o.sweep[1]
								});
								var si = radialpoint({
									origin: o.origin,
									radius: o.radii[1],
									angle: o.sweep[0]
								});
								var ei = radialpoint({
									origin: o.origin,
									radius: o.radii[1],
									angle: o.sweep[1]
								});
                                var laf = "0"; //large arc flag.
                                if (a$.exists(o.largearc)) laf = "1";
								return "M " + si[0] + "," + si[1] + "L" + so[0] + "," + so[1] + " A" + o.radii[0] + "," + o.radii[0] + " 0 " + laf + " 0 " + eo[0] + "," + eo[1] + " L" + ei[0] + "," + ei[1] + " A" + o.radii[1] + "," + o.radii[1] + " 0 0 1 " + si[0] + "," + si[1] +
									"z";
							}

							function logoslice(o) {
								var slice = gpaper.path(bandpath(o)); //just passing the input object.
								slice.attr({
									fill: "30-" + o.dim + "-" + o.color + ":40-" + o.color,
									stroke: "white",
									"stroke-width": 2,
									"stroke-opacity": 0,
									"fill-opacity": o.opacity
								});
								return slice;
							}

                            //TEST

                            if (true) { //((a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.")) {
                                var radnums	= [120, 104];
                                for (var i = 1;i<=1;i++) {
		    						var color = logoslice({
			    						origin: lof,
				    					radii: radnums,
                                        largearc: true,
						    			dim: '#000000',
							    		color: '#000000',
								    	//sweep: [180.0 + ((10.0 / SCOREBASIS) * 180.0), 180.0 + ((0.0 / SCOREBASIS) * 180.0)],
									    sweep: [5.0, 175.0],
									    opacity: 1.0
								    });
									var HighNumber = SCOREBASIS;
									if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
									    //Some #s
									    var nset = [0, 70, 80, 90, 100];
									    for (var n = 0; n < nset.length; n++) {
									        var letter = gpaper.text(
                                            lof[0] + (radnums[1] + 9) * Math.cos((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                            lof[1] + (radnums[1] + 9) * Math.sin((180.0 + ((nset[n] / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                                "" + nset[n]);
									        //alert("debug:lgetter=" + n);
									        letter.attr({
									            fill: "white",
									            "font-size": "11"
									        });
									    }
									}
									else {  //Every #
									    for (var n = 0; n <= HighNumber; n++) {
									        var letter = gpaper.text(
                                            lof[0] + (radnums[1] + 9) * Math.cos((180.0 + ((n / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                            lof[1] + (radnums[1] + 9) * Math.sin((180.0 + ((n / HighNumber) * 180.0)) * (Math.PI / 180.0)),
                                                "" + n);
									        //alert("debug:lgetter=" + n);
									        letter.attr({
									            fill: "white",
									            "font-size": "11"
									        });
									    }
									}

                                    /*
								    var final = bandpath({
									    origin: lof,
									    radii: radnums,
									    color: '#0000FF',
									    //sweep: [180.0 + ((10.0 / SCOREBASIS) * 180.0), 180.0 + ((0.0 / SCOREBASIS) * 180.0)],
									    sweep: [10.0, 180.0],
									    opacity: 1.0
								    });
								    color.animate({
									    path: final
								    }, 0, ">");
                                    */
                                }
                            }

							for (var i = controlopts.performanceRanges.length - 1; i >= 0; i--) {
								var color = logoslice({
									origin: lof,
									radii: rad,
									dim: controlopts.performanceRanges[i].stops[0][1],
									color: controlopts.performanceRanges[i].color,
									sweep: [180.0 + ((controlopts.performanceRanges[i].pie.high / SCOREBASIS) * 180.0), 180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0)],
									opacity: 1.0
								});
								var final = bandpath({
									origin: lof,
									radii: rad,
									color: controlopts.performanceRanges[i].color,
									sweep: [180.0 + ((controlopts.performanceRanges[i].pie.high / SCOREBASIS) * 180.0), 180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0)],
									opacity: 1.0
								});
								color.animate({
									path: final
								}, 0, ">");
								var letter = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0) + ((((controlopts.performanceRanges[i].pie.high - controlopts.performanceRanges[i].pie.low) / SCOREBASIS) * 180.0) /
										2.0)) * (Math.PI / 180.0))),
									lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + ((controlopts.performanceRanges[i].pie.low / SCOREBASIS) * 180.0) + ((((controlopts.performanceRanges[i].pie.high - controlopts.performanceRanges[i].pie.low) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI /
										180.0))), controlopts.performanceRanges[i].letter);
								if ((a$.urlprefix() == "bgr.") || (a$.urlprefix() == "bgr-test.") || (a$.urlprefix() == "bgr-make40.") || (a$.urlprefix() == "chime.") || (a$.urlprefix() == "chime-test.") || (a$.urlprefix() == "chime-make40.") || (a$.urlprefix() == "chime-mnt.")) {
									letter.attr({
										fill: "black",
										"font-size": "18"
						            });
		                        } else if ((a$.urlprefix() == "united.") || (a$.urlprefix() == "united-mnt.") || (a$.urlprefix() == "united2.")) {
                        		    letter.attr({
		                            fill: "black",
		                                "font-size": "18"
		                            });
		                        } else {
									letter.attr({
										fill: "white",
										"font-size": "22"
									});
								}
							}
							/*
							var red = logoslice({ origin: lof, radii: rad, color: "#990101", sweep: [180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0), 180], opacity: 1.0 }); //red
							var redfinal = bandpath({ origin: lof, radii: rad, color: "#990101", sweep: [180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0), 180], opacity: 1.0 });
							red.animate({ path: redfinal }, 0, ">");
							var letterC = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + (((controlopts.Bthreshold / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))),
							        lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + (((controlopts.Bthreshold / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))), "C");
							letterC.attr({ fill: "white", "font-size": "22"});

							var yellow = logoslice({ origin: lof, radii: rad, color: "#EBE40C", sweep: [180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0), 180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0)], opacity: 1.0 }); //red
							var yellowfinal = bandpath({ origin: lof, radii: rad, color: "#EBE40C", sweep: [180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0), 180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0)], opacity: 1.0 });
							yellow.animate({ path: yellowfinal }, 0, ">");
							var letterB = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0) + ((((controlopts.Athreshold - controlopts.Bthreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))),
							        lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + ((controlopts.Bthreshold / SCOREBASIS) * 180.0) + ((((controlopts.Athreshold - controlopts.Bthreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))), "B");
							letterB.attr({ fill: "white", "font-size": "22" });
							var green = logoslice({ origin: lof, radii: rad, color: "#019F01", sweep: [0, 180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0)], opacity: 1.0 }); //red
							var greenfinal = bandpath({ origin: lof, radii: rad, color: "#019F01", sweep: [0, 180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0)], opacity: 1.0 });
							green.animate({ path: greenfinal }, 0, ">");
							var letterA = gpaper.text(lof[0] + ((rad[0] / 1.5) * Math.cos((180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0) + ((((10.0 - controlopts.Athreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))),
							        lof[1] + ((rad[0] / 1.5) * Math.sin((180.0 + ((controlopts.Athreshold / SCOREBASIS) * 180.0) + ((((10.0 - controlopts.Athreshold) / SCOREBASIS) * 180.0) / 2.0)) * (Math.PI / 180.0))), "A");
							letterA.attr({ fill: "white", "font-size": "22" });
							*/
						}
                        //END SCOREBASIS 10.0

						function usehash() {
						    if ($.cookie("TP1Username") == "jeffNOTNOWgack") {
                                if (!a$.exists(window.graphtab)) {
                                    alert("debug: window.graphtab does not exist");
                                }
                                else {
                                    alert("debug: window.graphtab = " + window.graphtab);
                                }
                                /*
						        if ($("#graphsublabel").eq(0).is(":visible")) {
						            alert("debug: split tab is visible");
						        }
						        else {
						            alert("debug: split tab is NOT visible");
						        }
                                */
						    }

						    $("#gaugesdiv,#messagediv,#datasourcediv,#filterdiv,#dashboardcontroldiv,#scoreeditorcontroldiv,#settingsdiv,#scoringdiv,#companydiv,#modeldiv,#projectdiv,#kpidiv,#subkpidiv,#manualimportdiv").hide();
						    $("#graphtab,#graphsubtab,#tabletab,#messagetab,#advancedsettingstab,#companytab,#modeltab,#projecttab,#kpitab,#subkpitab,#userpreferencestab,#scoreeditortab,#manualimporttab").hide();
							$(".admin-editing-wrapper").hide();
                            if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-mnt.")) {
                                $(".settingsdiv-wrapper").hide();
                            }

							switch (location.hash) {
							    case "#Messaging":
							        if ((a$.urlprefix().indexOf("chime-make40.") >= 0) || (a$.urlprefix() == "chime.") /* || (a$.urlprefix() == "chime-mnt.") */) {
							            if ($.cookie("TP1Role") == "CSR") {
							                location.hash = "";
							                return;
							            }
							        }
                                    /*
							        //MADELIVE: split view is the master.
							        if ($("#graphsublabel").eq(0).is(":visible")) {
							            if ($.cookie("TP1Username") == "jeffgack") {
							                alert("debug: split is registering as visible");
							            }
							            $('#graphsublabel').trigger('click');
							        }
							        else {
							            if ($.cookie("TP1Username") == "jeffgack") {
							                alert("debug: showing graphtab");
							            }
							            $("#graphtab").show();
							            $('#graphlabel').trigger('click');
							        }
                                    */
							        $("#messagediv").show();
							        $(".heading").html("Messaging");
							        $('#messagetab').show();
							        $('#messageslabel').trigger('click');
							        break;
								case "#GraphAppearance":
									$("#settingsdiv").show();
									$(".heading").html("Settings - Graphic Appearance");

									//MADELIVE: split view is the master.
									if ($("#graphsublabel").eq(0).is(":visible")) {
									    $('#graphsublabel').trigger('click');
									}
									else {
									    $("#graphtab").show();
									    $('#graphlabel').trigger('click');
									}

                                    if ((a$.urlprefix() == "cox.") || (a$.urlprefix() == "cox-mnt.")) {
                                        $(".settingsdiv-wrapper").show();
                                    }
									break;
								case "#Scoring":
									appApmScoreEditing.initDataSources();
									if (($.cookie("TP1Role") == "Admin") || ($.cookie("TP1Role") == "CorpAdmin") || ($.cookie("TP1Role") == "Management") || ($.cookie("TP1Username") == "sfletcher") || ($.cookie("TP1Role") == "Group Leader") || ($.cookie("TP1Role") ==
											"Team Leader")) {
										$("#scoringdiv").show();
										$(".heading").html('Settings - <span class="scaname">Project</span>s &amp; Scoring');
										appApmDashboard.setClientLabels();
										$("#companytab,#modeltab,#projecttab,#kpitab,#subkpitab").show();
										$('#companyadminlabel').trigger('click');
										appApmAdmin.initProjectAdmin();
									} else {
										location.hash = '#GraphsReports';
										return;
									}
									$(".admin-editing-wrapper").show();
									break;
								case "#ScoreEditor":
									appApmScoreEditing.initDataSources();
									$("#datasourcediv,#filterdiv,#scoreeditorcontroldiv").show();
									$("#kpidl").hide();
									$("#datedl,#trenddl").show();
									$(".heading").html("Score Editor");
									$("#scoreeditortab").show();
									$("#scoreeditorlabel").html("Score Editor");
									$("#scoreeditorlabel").trigger("click");
									//$("#scoreeditorarea").html("Set data source,
									break;
								case "#Import":
									if ($("#importframe").attr("src") == "") {
										if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "ec2.")) {
											$("#importframe").attr("src", "//ers-import.acuityapmr.com/jq/import3.aspx");
										} else {
											$("#importframe").attr("src", "import3.aspx");
										}
									}
									//$("#manualimporttab").show();
									$("#manualimportdiv").show();
									//$("#manualimportlabel").trigger("click");
									break;
								case "#AttendanceTracker":
									appApmScoreEditing.initDataSources();
									$("#datasourcediv,#filterdiv,#scoreeditorcontroldiv").show();
									$("#selDataSources").val("Attendance");
									$("#kpidl").hide();
									$("#datedl,#trenddl").show();
									$(".heading").html("Attendance Tracker");
									$("#scoreeditortab").show();
									$("#scoreeditorlabel").html("Attendance Tracker");
									$("#scoreeditorlabel").trigger("click");
									//$("#scoreeditorarea").html("Set data source,
									appApmScoreEditing.btnView("scoreeditorarea");
									break;
								case "#Advanced":
									$("#settingsdiv").show();
									$(".heading").html("Settings - Advanced");
									$("#advancedsettingstab").show();
									$('#advancedsettingslabel').trigger('click');
									break;
								case "#UserPreferences":
									$("#settingsdiv").show();
									$(".heading").html("Settings - User Preferences");
									$("#userpreferencestab").show();
									$('#userpreferenceslabel').trigger('click');
									break;
								case "#Classic":
									$("#gaugesdiv,#messagediv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
									if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
									if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
									if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
									if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
									$(".heading").html("Classic Dashboard");
									if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
									if ($("#tablelabel").html() != "Table") $('#tabletab').show();

									//MADELIVE: split view is the master.
									if ($("#graphsublabel").eq(0).is(":visible")) {
									    $('#graphsublabel').trigger('click');
									}
									else {
									    $("#graphtab").show();
									    $('#graphlabel').trigger('click');
									}
									break;
								case "#GraphsReports":
									$("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
									if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
									if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
									if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
									if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
									
									if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
									if ($("#tablelabel").html() != "Table") $('#tabletab').show();

									//MADELIVE: split view is the master.
									if ($("#graphsublabel").eq(0).is(":visible")) {
									    $('#graphsublabel').trigger('click');
									}
									else {
									    $("#graphtab").show();
									    $('#graphlabel').trigger('click');
									}

									break;
								default:
									if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix() == "ers-alpha.")) {
										//default is Classic for ERS for now.
										$("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
										if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
										if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
										if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
										if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
										$(".heading").html("Classic Dashboard");
										if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
										if ($("#tablelabel").html() != "Table") $('#tabletab').show();
										//MADELIVE: split view is the master.
										if ($("#graphsublabel").eq(0).is(":visible")) {
										    $('#graphsublabel').trigger('click');
										}
										else {
										    $("#graphtab").show();
										    $('#graphlabel').trigger('click');
										}
									} else if (debug_makingsprintgame || (a$.urlprefix() == "sprintgame.")) {
										$("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
										if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
										if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
										if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
										if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
										$(".heading").html("Graphs and Reports");
										if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
										if ($("#tablelabel").html() != "Table") $('#tabletab').show();

										//MADELIVE: split view is the master.
										if ($("#graphsublabel").eq(0).is(":visible")) {
										    $('#graphsublabel').trigger('click');
										}
										else {
										    $("#graphtab").show();
										    $('#graphlabel').trigger('click');
										}

										$("#graphlabel").html("Dashboard");
										$("#fanlabel").html("Game");
										$('#fantab').show();
										$('#fanlabel').trigger('click');
									} else {
										$("#gaugesdiv,#filterdiv,#dashboardcontroldiv,#settingsdiv").show();
										if (document.getElementById("rdoPay").checked) $("#rdoPay").trigger("click");
										if (document.getElementById("rdoGrid").checked) $("#rdoGrid").trigger("click");
										if (document.getElementById("rdoBase").checked) $("#rdoBase").trigger("click");
										if (document.getElementById("rdoTrend").checked) $("#rdoTrend").trigger("click");
										$(".heading").html("Graphs and Reports");
										if ($("#graphsublabel").html() != "Split") $('#graphsubtab').show();
										if ($("#tablelabel").html() != "Table") $('#tabletab').show();

										//MADELIVE: split view is the master.
										if ($("#graphsublabel").eq(0).is(":visible")) {
										    $('#graphsublabel').trigger('click');
										}
										else {
										    $("#graphtab").show();
										    $('#graphlabel').trigger('click');
										}


									}
									break;
							}

							animatelogo();
						}

						/*
						$("#slider").bind("slidechange", function (event, ui) {
						    alert("debug:slider changed");
						});
						*/

						$('#btnPlot').click(function() {
							if (appApmReport.currentFilter() == $("#StgDashboard select").val()) {
								if (!$("#graphtab").eq(0).hasClass("ui-state-active")) {
									$('#graphlabel').trigger('click');
								}
							}
							var plottingok = true;
							if (document.getElementById("rdoTrend").checked) {
								//if (document.getElementById("rdoPayperiod").checked) a$.setOption(document.getElementById("selXaxiss"), "Payperiod");
								//else a$.setOption(document.getElementById("selXaxiss"), "Month");
								var sb = document.getElementById('selKPIs');
								for (var i = 0; i < sb.options.length; i++) {
									if (sb.options[i].selected) {
										/*
										if ((sb.options[i].text.indexOf('(Each)') >= 0)) {
										    alert("KPI can't be (Each) for a Trend report.");
										    plottingok = false;
										    break;
										}
										*/
									}
								}
							}
							if (plottingok) {
								$("#" + controlopts.views[0].chartoptions.chart.renderTo + "prompt").css("display", "none");
								$("#" + controlopts.views[0].chartoptionssub.chart.renderTo + "prompt").css("display", "none");
								appApmReport.plotIntercept(0, true, false);
								document.getElementById('btnAdd').disabled = '';
								document.getElementById('btnClear').disabled = '';
							}
						});

						$('#btnAdd').click(function() {
							$('#graphlabel').trigger('click');
							appApmDashboard.plotme(0, false, false);
						});

						$('#btnClear').click(function() {
							//Note: This was broken before I added the subchart.
							clearme(controlopts.views[0].chartoptions);
							clearme(controlopts.views[0].chartoptionssub);
							if (a$.exists(op.report)) {
								$("#" + op.report.renderTo).html("");
							}

							function clearme(op) {
								$('#graphlabel').trigger('click');
								op.plotcnt = 0;
								try {
									op.series.length = 0;
								} catch (err) {
									op.series = new Array();
								};
								op.xAxis.categories.length = 0;
								op.mychart = new Highcharts.Chart(op);
								$("#" + op.chart.renderTo + "prompt").css("display", "block");
							}

							document.getElementById('btnAdd').disabled = 'disabled';
							document.getElementById('btnClear').disabled = 'disabled';
						});


						appApmSettings.init({
    						id: "ReportGrouping",
							shadow: "StgReportGrouping",
							ui: "combo"
						});
						appApmSettings.init({
    						id: "AttritionReportGrouping",
							shadow: "StgReportGrouping",
							ui: "combo"
						});
						appApmSettings.init({
    						id: "ReportReportGrouping",
							shadow: "StgReportGrouping",
							ui: "combo"
						});

						var XaxisHOLD = "";
						var PayPeriodHOLD = "";
						$('#rdoBase').click(function() {
                            $(".report-grouping-wrapper").hide();
                            $("#settingsdiv").show();

							document.getElementById('btnAdd').disabled = 'disabled';
							$("#selXaxiss").val("KPI").trigger("liszt:updated");
							if (PayPeriodHOLD != "") $("#selPayperiods").val(PayPeriodHOLD).trigger("liszt:updated");
							appApmDashboard.setSeriesType('column');
							appApmDashboard.setDataSet('KPI');
							if ((location.hash != "#ScoreEditor") && (location.hash != "#AttendanceTracker")) { //So I can keep this trigger upon filter init
								document.getElementById("kpidl").style.display = 'inline';
							}
							document.getElementById("datedl").style.display = 'inline';
							document.getElementById("trenddl").style.display = 'none';

							var sb = document.getElementById('selKPIs');
							if (sb.selectedIndex >= 0) {
								if (sb.options[sb.selectedIndex].value == "") {
  									$('#selKPIs').val('each').trigger("liszt:updated");
								}
							}
                            if (((a$.urlprefix() == "cox.") || (a$.urlprefix().indexOf("cox-mnt") >= 0)) && ($.cookie("TP1Role") == "Team Leader")) {
                                $("#selKPIs").val("").trigger("liszt:updated");
                            }
						});

						$('#rdoGrid').click(function() {
							//TODO: For now, this is an exact duplicate of rdoBase click above.  It may be beneficial to make this different'.
                            //$(".report-grouping-wrapper").show();
                            $("#settingsdiv").hide();

							document.getElementById('btnAdd').disabled = 'disabled';
							$("#selXaxiss").val("KPI").trigger("liszt:updated");
							if (PayPeriodHOLD != "") $("#selPayperiods").val(PayPeriodHOLD).trigger("liszt:updated");
							appApmDashboard.setSeriesType('column');
							appApmDashboard.setDataSet('KPI');
							if ((location.hash != "#ScoreEditor") && (location.hash != "#AttendanceTracker")) { //So I can keep this trigger upon filter init
								document.getElementById("kpidl").style.display = 'inline';
							}
							document.getElementById("datedl").style.display = 'inline';
							document.getElementById("trenddl").style.display = 'none';
							var sb = document.getElementById('selKPIs');
							if (sb.selectedIndex >= 0) {
								if (sb.options[sb.selectedIndex].value == "") {
									$('#selKPIs').val('each').trigger("liszt:updated");
								}
							}
						});

						$("#selTrendbys").bind("change", function() {
							if ($("#selTrendbys").val() == "0") {
								$(".subkpi-display").hide();
								$("#selSubKPIs").html("");
							}
							$("#selXaxiss").val("each_" + $("#selTrendbys").val()).trigger("liszt:updated");
							//Added 3/28/2015 (clugueing in Day logging) (each_0)
							//if ($("#selXaxiss").val() != ("each_" + $("#selTrendbys").val())) {
							//    $("#selXaxiss").append('<option value="each_' + $("#selTrendbys").val() + '" selected="selected">' + $("#selTrendbys option:selected").text() + '</option>').trigger("liszt:updated");
							//}
							$("#selXaxiss").val("each_" + $("#selTrendbys").val()).trigger("liszt:updated");

							$("#selPayperiods").val("each_" + $("#selTrendbys").val()).trigger("liszt:updated");
							appApmDashboard.setdaterangeslider($("#selTrendbys").val());
						});

						$('#rdoTrend').click(function() {
                            $(".home-grouping-wrapper").hide();
                            $("#settingsdiv").show();
							var sb = document.getElementById('selPayperiods');
							if (sb.selectedIndex >= 0) {
								if (PayPeriodHOLD == "") PayPeriodHOLD = sb.options[sb.selectedIndex].value;
							}
							document.getElementById('btnAdd').disabled = 'disabled';
							$("#selTrendbys").trigger("change");

							document.getElementById("trenddl").style.display = 'inline';
							/*
							var myperset = "each";
							if (mpar == "/month") {
							myperset = "eachmonth";
							$('#rdoMonth').click();
							//document.getElementById("trenddl").style.display = 'none';
							}
							else if (mpar == "/payperiod") {
							mperset = "each";
							$("#rdoPayperiod").click();
							//document.getElementById("trenddl").style.display = 'none';
							}
							a$.setOption(document.getElementById("selPayperiods"), myperset);
							*/


							appApmDashboard.setSeriesType('line');
							appApmDashboard.setDataSet('KPI');
							document.getElementById("kpidl").style.display = 'inline';
							document.getElementById("datedl").style.display = 'none';
							/*
							if ($('#rdoMonth').attr('checked')) {
							a$.setOption(document.getElementById("selXaxiss"), "Month");
							}
							else if ($('#rdoMonth').attr('checked')) {
							a$.setOption(document.getElementById("selXaxiss"), "Payperiod");
							}
							*/

							sb = document.getElementById('selKPIs');
							if (sb.selectedIndex >= 0) {
								if (sb.options[sb.selectedIndex].value == "each") {
									$('#selKPIs').val('').trigger("liszt:updated");
								}
							}
						});

						$('#rdoPay').click(function() {
                            $(".home-grouping-wrapper").hide();
                            $("#settingsdiv").hide();
							$(".subkpi-display").hide();
							$("#selSubKPIs").html("");
							var sb = document.getElementById('selPayperiods');
							document.getElementById("kpidl").style.display = 'none';
							document.getElementById("datedl").style.display = 'none';
							document.getElementById("trenddl").style.display = 'none';
							appApmDashboard.setSeriesType('column');
							appApmDashboard.setDataSet('Pay');
							if (PayPeriodHOLD == "") PayPeriodHOLD = sb.options[sb.selectedIndex].value;
							a$.setOption(document.getElementById("selPayperiods"), 'each');
						});


						$('#rdoPayperiod').click(function() {
							a$.setOption(document.getElementById("selXaxiss"), "Payperiod");
							appApmDashboard.setdaterangeslider("Pay Period");
						});
						$('#rdoMonth').click(function() {
							a$.setOption(document.getElementById("selXaxiss"), "Month");
							appApmDashboard.setdaterangeslider("Month");
						});
					</script>
					<script type="text/javascript" src="TOUCHPOINT/js/TouchpointInterface-2.2.js"></script>
					<script type="text/javascript">
					    $(window).resize(function () {
					        resizedivs();
					    });

					    function resizedivs() {
					        $(".leftpanel").height(($(window).height() - 70) + 'px'); //was 96
					        //$(".tabarea").height(($(window).height() - 122) + 'px').width(($(window).width() - 310) + 'px');
					        $(".tabarea").height(($(window).height() - 137) + 'px').width(($(window).width() - 310) + 'px'); //Height was 172, changed to 137.
					        $(".ReportReports").height(($(window).height() - 181) + 'px').width(($(window).width() - 330) + 'px'); //Height was 172, changed to 137.
					        $("#importframe").height(($(window).height()) + 'px').width(($(window).width() - 3) + 'px');
					        $("#tabs").width(($(window).width() - 285) + 'px');
					        if (uiInterface) uiInterface.sizebars();
					        ko.postbox.publish("ResizeWindow", true);
					        $(".chat-window").css("max-height", ($(window).height() - (20)) + 'px');
					        $(".chat-sessions").css("max-height", ($(window).height() - (20 + 60)) + 'px');
					    }
					</script>
					<script type="text/javascript">
					    $(function () {
					        $("#tabs").tabs();
					        $("#tabsattrition").tabs();
					    });
					    var tabsdiv = document.getElementById("tabs");
					    if (tabsdiv) {
					        tabsdiv.style.width = ($(window).width() - 300) + 'px';
					    }
					    var chartdiv = document.getElementById(op.chart.renderTo);
					    if (chartdiv) {
					        chartdiv.style.width = ($(window).width() - 340) + 'px';
					        chartdiv.style.height = ($(window).height() - 200) + 'px';
					    }
					    chartdiv = document.getElementById(opsub.chart.renderTo);
					    if (chartdiv) {
					        chartdiv.style.width = ($(window).width() - 340) + 'px';
					        chartdiv.style.height = ($(window).height() - 200) + 'px';
					    }
					    var pgdiv = document.getElementById('mytable1');
					    if (pgdiv) {
					        pgdiv.style.width = ($(window).width() - 300) + 'px';
					        pgdiv.style.height = ($(window).height() - 200) + 'px';
					    }

					    /*
					    var opts = {
					    lines: 12, // The number of lines to draw
					    length: 7, // The length of each line
					    width: 4, // The line thickness
					    radius: 10, // The radius of the inner circle
					    color: '#000', // #rgb or #rrggbb
					    speed: 1, // Rounds per second
					    trail: 60, // Afterglow percentage
					    shadow: false, // Whether to render a shadow
					    hwaccel: false // Whether to use hardware acceleration
					    };
					    var target = document.getElementById('comboprogress2');
					    var spinner = new Spinner(opts).spin(target);
					    alert("debug:reached the bottom");
					    */
					</script>

					<ul class='sup-custom-menu'>
						<li data-action="first">First thing</li>
						<li data-action="second">Second thing</li>
						<li data-action="third">Third thing</li>
					</ul>


					<div id="performanceranges" style="display:none;" runat="server"></div>
					<!-- controlopts.performanceRanges -->

					<script language="javascript">
					    var stgRankPointsLabel;
					    var stgRawScoreRollups;
					</script>
					<div id="clientsidesettings" style="display:none;" runat="server"></div>
					<!-- javascript settings, defined above and set within -->

			</form>
			</div>

            <!-- #Include virtual="../applib/html/views/qa.htm" -->

			<!-- #Include virtual="../applib/html/views/filterattributes.htm" -->

	</body>
