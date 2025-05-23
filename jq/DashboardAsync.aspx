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
      <script type="text/javascript" src="../appLib/js/applib-1.1.15.js?r=3"></script>
        <script type="text/javascript" language="javascript">
            //alert("debug:inframe 4 dashboardasync.aspx, inframe=" + a$.gup("inframe"));
            document.AcuityMainFrame = true; //For searching for top.
            if (a$.gup("inframe") != "") {
                //debugger;
                //Leave if you're at top.
                if (window.top == window.self) {
                    alert("Top window not allowed");
                    window.location="https://www.touchpointone.com";
                }
                //Cookie Replacer
                document.noncookies = {};
                $.cookie = function (setme, getme) {
                    if (!setme) {
                        return document.noncookies;
                    }
                    else if (!getme) {
                        return a$.exists(document.noncookies[setme]) ? document.noncookies[setme] : "";
                    }
                    else {
                        document.noncookies[setme] = getme;
                    }
                }
                $.cookie("TP1Username", a$.gup("username"));
                $.cookie("username", a$.gup("username"));
                $.cookie("uid", a$.gup("uid"));
                $.cookie("TP1Role", a$.gup("role"));
                $.cookie("TP1ChangePassword", "");
                $.cookie("TP1Boxfilter", "off");
                $.cookie("TP1Roleset", "");
                $.cookie("ApmProject", "");
                $.cookie("ApmInDallas", "");
            }
        </script>
        


      <!-- App-Dependent plugins -->
      <script type="text/javascript" src="<%=CONFMGR.minified("plugins/bellGraph-1.0.0.js")%>"></script>
      <!-- App Modules -->
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmSupTools-1.0.1.js")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmDashboard-2.15.17.js?r=54")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmContentTriggers-1.0.js?r=9e")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmReport-1.1.0.js?r=24")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appClientDV/clientDVProcessing-1.0.js")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmScoreEditing-1.1.0.js")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmSignal.js?r=5")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmMessaging-1.4.11.js?r=21B")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmNavMenus-2.0.2.js")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("../jq/appApmClient/js/appApmSettings-1.1.0.js")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmAdmin-1.3.6.js")%>"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmAttrition-1.0.4.js")%>"></script>
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

      <!-- <script type="text/javascript" src="../appLib/js/appEasycom-0.2.js?r=4"></script> -->
      <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appEasycom-0.3.js?r=1")%>"></script>

      <!-- 2. Add the JavaScript to initialize the chart on document ready -->
      <script type="text/javascript" src="../applib/css/highcharts-theme-julie.js"></script>
      <script type="text/javascript" src="../applib/anothercolorpicker/src/jquery.simple-color.js"></script>
      <script type="text/javascript" src="../appLib/js/viewmodels/rankpoints-0.8.js"></script>
      <script type="text/javascript" src="../appLib/js/viewmodels/filterattributes.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("../appLib/js/FilterAction-1.0.0.js")%>"></script>
      <script type="text/javascript" src="../appLib/js/qa-1.0.3.js"></script>
      <!-- Date Range Picker Suite -->
      <link rel="stylesheet" href="../applib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
      <script type="text/javascript" src="../applib/moment/moment.min.js"></script>
      <script type="text/javascript" src="../applib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>
      <script type="text/javascript" src="../applib/jquery-tablesorter/jquery.tablesorter.js"></script>
      <script type="text/javascript" src="../appLib/js/viewmodels/fan-2.5.js?r=47"></script>
      <!-- Files with separate JulieDev replacements  -->
      <link rel="stylesheet" type="text/css" media="all" href="../applib/css/base.css?r=2" />
      <link rel="stylesheet" type="text/css" media="all" href="../applib/css/fan-2.5.css?r=4" />
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/rankpoints-2.1.css" />
      <link rel="stylesheet" type="text/css" media="all" href="../applib/css/rpt.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/easycom-0.2.css?r=2" />
      <!-- MADELIVE -->
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/grid.css" />
      <!-- RESPONSIVE GRID -->
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/all.css" />
      <!-- FONT AWESOME ICONS -->
      <script src="https://kit.fontawesome.com/550f4bc1b1.js" crossorigin="anonymous"></script>
      <script type="text/javascript" src="<%=CONFMGR.minified("dev_ayokay/js/viewmodels/treasurehunt.js")%>"></script>
      <link rel="stylesheet" type="text/css" media="screen" href="dev_ayokay/css/treasurehunt.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/united-treasurehunt.css" />
      <script type="text/javascript" src="<%=CONFMGR.minified("dev_HelloWorld/js/viewmodels/helloworld.js")%>"></script>
      <link rel="stylesheet" type="text/css" media="screen" href="dev_HelloWorld/css/helloworld.css" />
      <script>
          function preventBack() {
              window.history.forward();
          }

          setTimeout("preventBack()", 0);
          window.onunload = function () {
              null
          };
      </script>

    </asp:PlaceHolder>
    <!-- see purecss.io for docs -->
    <link rel="stylesheet" href="../pure/pure-min.css" />
    <link rel="stylesheet" href="../pure/grids-responsive-min.css">
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

    <style>
        
.leftpanel {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
}
.leftpanel::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
}        

.dropbtn {
  background-color: #009ad9;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  -webkit-border-radius: 5px;
-moz-border-radius: 5px;
	border-radius: 5px;
  display: inline-block;
}

.dropbtn:hover, .dropbtn:focus {
  background-color: #2980B9;
}

.dropdown 
{
  margin-left:20px;
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  font-family: arial;
  background-color: #f1f1f1;
  min-width: 160px;
  overflow: auto;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1000;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown a:hover {background-color: #ddd;}

.show {display: block;}

    </style>

  </head>
  <body id="Dashboard" style="position:relative;" runat="server">
    <script>
        //document.domain = "acuityapmr.com";
    </script>
    <div class="poller-debug" style="display:none;z-index:10000;position:fixed;right:0px;top:200px;height:200px;width:200px;background-color:yellow;text-align:center;"><h5>Poller Debug</h5><div>Status: <span class="poller-status">Startup..</span></div><br />
      <div>poller_client: <span id="poller_client">Startup...</span></div>
      <div>poller_userid: <span id="poller_userid">Startup...</span></div>
      <div>poller_idusr: <span id="poller_idusr">Startup...</span></div>
      <div>poller_idlastmsg: <span id="poller_idlastmsg">Startup...</span></div>
      <div>poller_idlastmsgread: <span id="poller_idlastmsgread">Startup...</span></div>
      <div>poller_activetab: <span id="poller_activetab">Startup...</span></div>
      <div>poller_quickpublish: <span id="poller_quickpublish"></span></div>
      <br /><div>poller_nav_com: <span id="poller_nav_com">Startup...</span></div>
      <br /><div>poller_message_com: <span id="poller_message_com">Startup...</span></div>
      <br /><div>poller_chat_com: <span id="poller_chat_com">Startup...</span></div>
      <br /><div><input type="checkbox" id="poller_message_com_alert" />Alert on true</div>
      <br /><div>loader_filters: <span id="loader_filters"></span></div>
      <br /><div>dashboard_filterbuild: <span id="dashboard_filterbuild"></span></div>
    </div>
    <iframe src="/3/poller/default.htm?r=8" style="display:none;"></iframe>

    <div class="wsc-debug" style="display:none;z-index:10000;position:fixed;opacity:50%;right:250px;top:200px;height:200px;width:200px;background-color:yellow;text-align:center;"><h5>WSC Debug</h5>
      <div>Status: <span class="poller-status" id="wsc_status">Startup..</span></div><br />
      <div>wsc_client: <span id="wsc_client">Startup...</span></div>
      <div>wsc_userid: <span id="wsc_userid">Startup...</span></div>
      <div>wsc_idusr: <span id="wsc_idusr">Startup...</span></div>
      <div>wsc_idlastmsg: <span id="wsc_idlastmsg">Startup...</span></div>
      <div>wsc_route: <span id="wsc_route"></span></div>
      <div>wsc_info: <span id="wsc_info"></span></div>
      <br /><div>wsc_message_com: <span id="wsc_message_com">Startup...</span></div>
    </div>

    <iframe src="/3/wsc/default.htm?r=10" style="display:none;"></iframe>

    <div class="splash" style="z-index: 10000000;height:100%;width:100%;position:fixed;background-color:White;">
      <div style="width: 20%;height:25%;margin: 25% auto 0 auto;vertical-align:middle;">
        <img alt="Acuity Loading..." style="height:100%;width:auto;" src="../applib/css/images/acuity-loading.gif" />
      </div>
    </div>

    <!--LAUNCHER--> 

    
<div class="launcher-menu" id="launcher-tab" >
    <input type="checkbox" class="off-screen menu-overlay-trigger" id="menu-overlay-trigger" /> 
    <label class="floating-btn" id="menu-overlay-btn" for="menu-overlay-trigger">
      <span class="menu-icon">
        <img width="50px" src="/applib/css/images/agame-countdown-icon.png">  
        <span style="color: White;">MENU</span>
      </span>
    </label>
    <div class="menu-overlay"></div>
    <nav class="navigation">
      <h2 style="
    color: white;
    border-bottom: 1px solid white;
    padding: 20px 30px;
    margin-bottom: 0;
    display: flex;
    gap: 20px;
    align-items: center;
"><img width="50px" src="/applib/css/images/agame-countdown-icon.png">   A-GAME MENU
    </h2>
      <ul>
        <li><a href="">Change your Team Name</a></li>
        <li><a href="">Setup Your Roster</a></li>
        <li><a href="">A-GAME Matchup</a></li>
        <li><a href="">Schedule</a></li>
        <li><a href="">Standings</a></li>
        <li><a href="">Power Ranking Leaderboard</a></li>
      </ul>
    </nav>
</div>
<!--RIGHT SUPPOR PANEL-->
<div class="rightpanel"  style="display:none;">
  <div class="rightpanel-close" id="rightpanelclose">
    <i class="fa fa-times"></i>
  </div>
  <div class="rightpanel-content">
    <h2><img src="../applib/css/images/support-panel-icon.png" />Acuity Support</h2>
    <hr>
    
    <script src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer></script>
    <div class="elfsight-app-624fb50e-553a-47a8-a3df-aaf2d0459c32" data-elfsight-app-lazy></div>
  </div>
</div>
    <div class="filters-tab" id="filterstab">
      <i class="fas fa-chevron-up"></i> FILTERS
    </div>
    <div class="stats-tab" id="statstab">
      <i class="fas fa-chevron-up"></i> Stats
    </div>
    <script>
      $(function() { 
        $("#rightpanelclose").click(function() {
          $(".rightpanel").removeClass('active');
        });
        $(".rightpanel button").click(function() {
          $(".rightpanel").removeClass('active');
        });
        
        $("#filterstab").click(function() {
          $(".leftpanel").addClass('active');
          $("#AcuityApp").addClass('active');
      		$(".filters-tab").addClass('closed');
          $(".stats-tab").addClass('closed');
      		$(".leftpanelOverlay").addClass('active');
          $(".heading").css({'display': 'none'});
          $(".header-welcome").css({'display': 'none'});
        });
        $("#statstab").click(function() {
          $(".leftpanel-stats").addClass('active');
          $(".AcuityApp").addClass('active');
      		$(".filters-tab").addClass('closed');
          $(".stats-tab").addClass('closed');
      		$(".leftpanelOverlay").addClass('active');
          $(".heading").css({'display': 'none'});
          $(".header-welcome").css({'display': 'none'});
        });
      	$("#leftpanelclose").click(function() {
          $(".leftpanel").removeClass('active');
          $(".leftpanel-stats").removeClass('active');
          $("#AcuityApp").removeClass('active');
      		$(".filters-tab").removeClass('closed');
          $(".stats-tab").removeClass('closed');
      		$(".leftpanelOverlay").removeClass('active');
          $(".heading").css({'display': 'block'});
          $(".header-welcome").css({'display': 'block'});
        });
        $("#leftpanelclose-stats").click(function() {
          $(".leftpanel-stats").removeClass('active');
          $("#AcuityApp").removeClass('active');
          $(".stats-tab").removeClass('closed');
          $(".filters-tab").removeClass('closed');
      		$(".leftpanelOverlay").removeClass('active');
          $(".heading").css({'display': 'block'});
          $(".header-welcome").css({'display': 'block'});
        });
      	$("#leftpanelOverlay").click(function() {
          $(".leftpanel").removeClass('active');
          $(".leftpanel-stats").removeClass('active');
      		$(".filters-tab").removeClass('closed');
          $(".stats-tab").removeClass('closed');
      		$(".leftpanelOverlay").removeClass('active');
        });
      	$(".nav3-icon").click(function() {
          $(".leftpanel").removeClass('active');
          $(".leftpanel-stats").removeClass('active');
      		$(".filters-tab").removeClass('closed');
          $(".stats-tab").removeClass('closed');
      		$(".leftpanelOverlay").removeClass('active');
        });
        $("#tabfilter-filters").click(function() {
          $("#Stats").removeClass('active');
      		$("#Filters").addClass('active');
        });
        $("#tabfilter-stats").click(function() {
          $("#Filters").removeClass('active');
      		$("#Stats").addClass('active');
        });
        $("#tabfilter-stats").click(function() {
          $("#tabfilter-filters").removeClass('active');
      		$("#tabfilter-stats").addClass('active');
        });
        $("#tabfilter-filters").click(function() {
          $("#tabfilter-stats").removeClass('active');
      		$("#tabfilter-filters").addClass('active');
        });
      });
    </script>
    <div id="AgameOverlay" style="display:none;position:absolute; top:0px;left:0px;width:100%;height:100%;z-index:2000"></div>
    <!--[if IE 8]> 
    <div id="browserversion" style="display:none;">ie8</div>
    <![endif]-->
    <!--[if gt IE 8]> 
    <div id="browserversion" style="display:none;">isgtie8</div>
    <![endif]-->
    <!--[if IE 9]>
    <script type="text/javascript">
      window.location = "DashboardAsyncV8L.aspx";
    </script>
    <![endif]-->
    <h3 style="display:none;z-index:1000;position:absolute;top:-10px;left:310px;color:white;background-color:red;padding:5px;">
      Attention: Acuity will be unavailable this evening after 7PM PST for important software maintenance.
    </h3>
    <!-- MADELIVE -->
    <div class="easycom ec-loc-notification">
      <div class="ec-dismiss"><i class="fas fa-times"></i></div>
      <div class="ec-message">
      </div>
    </div>

    <div id="ecr-preview" style="display:none;"></div>
    <div id="ecr-to" style="display:none;"></div>
    <div id="ecr-phrase" style="display:none;"></div>
    <div id="ecr-from" style="display:none;"></div>
    <div id="ecr-signature" style="display:none;"></div>
    <div id="ecr-deliverytype" style="display:none;"></div>
    <div id="ecr-theme" style="display:none;"></div>
    <div id="Plotstamp" style="display:none;"></div>

    <div class="easycom-recognition" style="display:none;">
      <div class="ec-dismiss"><i class="fas fa-times"></i></div>
      <div class="ec-message">
        <div class="easycom-recognition_avatar-box">
          <div class="easycom-recognition_avatar fan-avatar">
            <img src="../applib/css/images/avatars/avatar105.png">
          </div>
          <p class="easycom-recognition_to"></p>
        </div>
        <div class="easycom-recognition_message">
          <h2>
            <span class="easycom-recognition_phrase"></span>
          </h2>
          <p>
            <span class="easycom-recognition_from"></span>
          </p>
        </div>  
      </div>
    </div>

    </div>
    <div id="AcuityApp" class="AcuityApp">
      <form id="form1" runat="server">
        <div id="loading">Loading Dashboard V2...</div>
        <div class="nav3-icon"></div>
        <div class="nav3-shadow">&nbsp;</div>
        <div class="nav3-linkhelp">
          The Menu is now in the upper right corner.
          <div class="nav3-close2">X</div>
        </div>
        <div class="err-container">
          <div class="err-hide">Done with this error</div>
          <div class="err-text">Acuity Error:</div>
          <div class="err-content">&nbsp;</div>
          <div class="err-text">
            This notice has already been submitted to technical services. If
            you would like to add more information, please enter it below and
            submit.
          </div>
          <div>
            <input id="errinput" type="text" style="width: 500px;" value="" />
            <input id="errsubmit" type="button" value="Submit" />
          </div>
          <div class="err-text">
            We will work diligently to correct this problem. You will be
            notified when we have a solution or work-around for you.
          </div>
        </div>
        <div class="nav3-wrapper">
          <!-- <div class="nav3-close"></div> -->
          <div class="nav3">
            <ul>
              <li id="classicdashboard_li">
                <a id="header_active" href="#Classic">
                <span class="nav3-caption">Classic Dashboard</span>
                <span class="nav3-desc">Combines messages, filters, and settings.</span>
                </a>
              </li>
              <!-- <li><a id="A2" href="#GraphsReports">Graphs/Reports</a></li> -->
              <li id="monitor_li">
                <a id="monitorlink" target="_blank" href="//acuityapm.com/monitor/monitor.aspx" onclick="return appLib.prefixhref(this);">
                <span class="nav3-caption">Monitor</span>
                <span class="nav3-desc">Opens window for monitoring.</span>
                </a>
              </li>
              <li id="reports_normal_li">
                <a target="_blank" href="//acuityapm.com/report/quiz_review.aspx" onclick="return appLib.prefixhref(this);">
                <span class="nav3-caption">Reports</span>
                <span class="nav3-desc">Opens window for reports.</span>
                </a>
              </li>
              <li id="reports_restricted_li" style="display:none;">
                <a target="_blank" href="//acuityapmr.com/jq/TP1ReportsMenu.aspx" onclick="return appLib.prefixhref(this);">
                <span class="nav3-caption">Reports</span>
                <span class="nav3-desc">Opens window for reports.</span>
                </a>
              </li>
              <li id="admin_li">
                <a target="_blank" href="//acuityapm.com/admin/admin.aspx" onclick="return appLib.prefixhref(this);">
                <span class="nav3-caption">Admin</span>
                <span class="nav3-desc">Opens window for administrative functions.</span>
                </a>
              </li>
              <li id="import_li">
                <a target="_blank" href="//acuityapm.com/admin/import.aspx" onclick="return appLib.prefixhref(this);">
                <span class="nav3-caption">Import (V1)</span>
                <span class="nav3-desc">Opens V1 window for importing data.</span>
                </a>
              </li>
              <li id="scoreeditor_li">
                <a id="A3" href="#ScoreEditor">
                <span class="nav3-caption">Score Editor</span>
                <span class="nav3-desc">Editing of scores.</span>
                </a>
              </li>
              <li id="newadmin_li">Admin (Beta)</li>
              <li id="performance_li" style="display:none;">Performance</li>
              <li id="qmdashboard_li" style="display:none;">QM Dashboard</li>
              <li id="autoqa_li" style="display:none;">Auto QA</li>
              <li id="attendancetracker_li">
                <a id="A4" href="#AttendanceTracker">
                <span class="nav3-caption">Attendance</span>
                <span class="nav3-desc">Attendance tracking module for supervisors.</span>
                </a>
              </li>
              <li id="clintwerx_li" style="display:none;">CDJ Skunkwerx</li>
              <li id="graphappearance_li">
                <a href="#GraphAppearance">
                <span class="nav3-caption">Graph Settings</span>
                <span class="nav3-desc">Series, and filter options for dashboard display.</span>
                </a>
              </li>
              <li id="userpreferences_li">
                <a href="#UserPreferences">
                <span class="nav3-caption">User Preferences</span>
                <span class="nav3-desc">&nbsp;</span>
                </a>
              </li>
              <li id="scoring_li" style="display:none;">
                <a href="#Scoring">
                  <span class="nav3-caption">
                    <!--<span class="scaname">Project</span> -->Projects &amp; Scoring
                  </span>
                  <span class="nav3-desc">Project &amp; KPI setup.  Weights and ranges.</span>
                </a>
              </li>
              <li id="advancedsettings_li">
                <a href="#Advanced">
                <span class="nav3-caption">Advanced Settings</span>
                <span class="nav3-desc">&nbsp;</span>
                </a>
              </li>
              <li id="changepassword_li">Change Password</li>
              <li class="easycom-editor" style="display:none;">
                <a  href="#" target="_blank">Easycom</a>
              </li>
              <li class="compliance-system" style="display:none;">
                <a  href="#" target="_blank">Compliance System</a>
              </li>
              <li id="resetpassword_li" style="display:none;">
                Reset Consultant Password
              </li>
              <li id="profile_li" style="display:none;">
                Profile
              </li>
              <li id="manualimport_li" class="headericon-import">
                Manual Import 
              </li>
              <li id="chatbox_li" class="headericon-chat">
                Chat Box
              </li>
              <div class="clearfix"></div>
              <li class="">
                <a href='//acuityapm.com/login.aspx' onclick="return appLib.prefixhref(this);" title='Log Out'>
                  Log Out
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="app-header gradient-lightest">
          <div class="auth-display" style="display:none;font-size:12px;width:500px;position:absolute;top:10px;left:530px;height: 4px;z-index:999;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;">AUTH: <span class="auth-token-show">..not stored</span></div>
          <div class="longpoller-active" style="display:none;position:absolute;top:10px;left:10px;width: 4px;height: 4px;background: green;z-index:999;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;"></div>
          <div id="longpollerOnline" style="display:none;position:absolute;top:10px;left:20px;width: 4px;height: 4px;background: green;z-index:999;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;"></div>
          <div class="wsc-active" style="display:none;position:absolute;top:10px;left:30px;width: 4px;height: 4px;background: orange;z-index:999;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;"></div>
          <div id="wscOnline" style="display:none;position:absolute;top:10px;left:40px;width: 4px;height: 4px;background: orange;z-index:999;-webkit-border-radius: 2px;-moz-border-radius: 2px;border-radius: 2px;"></div>
          <div class="logo" style="margin-left:0px;">
            <a href="#" class="logo-reload">
            <img src="../App_Themes/Acuity2/images/acuity-white-logo.png" alt="Acuity" />
            </a>
          </div>
          <div class="heading header-tile_responsive-xsmall" style="margin-left:0px;"></div>
          <div class="header-tile" style="width:50px;">&nbsp;</div>
          <div class="header-tile" id="loadingprompt" style="color:White;background-color:#EF4521;padding-top:4px;padding-bottom:2px;padding-left:20px;font-weight:bold;display:none;font-size:16px;padding-right: 20px;float:right;">
            Loading...
          </div>
          <div class="header-tile header-tile_responsive-xsmall" style="margin-top: 25px;" id="logout">
            <a href='//acuityapm.com/logout.aspx' onclick="return appLib.prefixhref(this);" title='Log Out'>
            Log Out
            </a>
            <a id="logsomething" style="display:none;" href='#' title='Log Out'>
            Log Out
            </a>
          </div>
          <div class="header-tile header-tile_responsive-xsmall header-welcome" style="margin-top: 25px;position:relative;" id="userid">
            <span id="welcomelabel">Welcome</span>
            <span id="header_userID_lbl"></span>
            <div class="quiz-open-link" style="text-decoration:underline;color:Yellow;font-size:9px;cursor:pointer;padding:10px;"></div>
          </div>
          <div class="header-tile header-tile_responsive">
            <div class="headericon-import" style="display:none;"></div>
          </div>
         
          <div class="header-tile header-tile_responsive">
            <div class="err-icon"></div>
            <div class="headericon-points">
              <div class="headericon-points-youhave">You&nbsp;have</div>
              <div class="headericon-points-balance">0</div>
              <div class="headericon-points-points">Points</div>
            </div>
            <div class="headericon-agame-xtreme">
              Queue<br />Player
            </div>
            <!-- HEADER RANK BOXES-->
            <a href="" class="chime-game header-tile_responsive" style="display:none;cursor:text;">
              <div class="header-rank-box header-rank-box_sea">
                <div class="header-rank-box_title">
                  <div class="header-rank-label">
                    Bill to Pay
                  </div>
                  <span class="chime-game-rank-label-found">
                  Your<br />Game Rank:
                  </span>
                  <div style="margin-top:4px;font-weight:bold;" class="chime-game-daterange">
                    4/6 - 4-10
                  </div>
                </div>
                <div class="header-rank-box_item">
                  <div class="header-rank-box_circle chime-game-team">
                    <span>x</span> of y
                  </div>
                  <div class="header-rank-box_item-label chime-game-team-label">
                    Team
                  </div>
                </div>
                <div class="header-rank-box_item">
                  <div class="header-rank-box_circle chime-game-location">
                    <span>x</span> of y
                  </div>
                  <div class="header-rank-box_item-label  chime-game-location-label">
                    Location
                  </div>
                </div>
                <div class="header-rank-box_item">
                  <div class="header-rank-box_circle chime-game-project">
                    <span>x</span> of y
                  </div>
                  <div class="header-rank-box_item-label chime-game-project-label">
                    Global
                  </div>
                </div>
              </div>
            </a>
            <!-- END HEADER RANK BOXES-->
            <div class="headericon-united-th" style="display:none;">
              <div class="headericon-united-th_star"></div>
              <div class="headericon-united-th-gamescore">325</div>
            </div>
            <div class="headericon-agame" style="display:none;">
              <div class="headericon-agame-backdrop"></div>
              <div class="headericon-agame-gamestatus"></div>
              <div class="headericon-agame-gamescore"></div>
            </div>
            <div class="headericon-wand" style="display:none;"></div>
           
            
            <style>
              [class*="FloatingButton__FloatingButtonContainer"] {
                 display: none;
              }
              </style>
            <div id="chat_div" class="headericon-chat" style="display:none;">
              <div class="chat-beep-icon">New&nbsp;Chat&nbsp;Message!</div>
              <div class="chat-badge-unread" style="display:none;">0</div>
            </div>
            <div class="headericon-message">
              <div class="messages-badge-unread" style="display:none;">0</div>
              <div class="messages-badge-incomplete"></div>
            </div>
            <div class="headericon-graph"></div>
            <div class="support-icon" data-elfsight-show-form="624fb50e-553a-47a8-a3df-aaf2d0459c32">
              <div class="chat-beep-icon">Acuity&nbsp;Support</div>
              <div class="chat-badge-unread" style="display:none;">0</div>
            </div>
          </div>
          <div style="width:500px;word-wrap: break-word;font-size:10px;float:right;">
            <div id="debugwindow"></div>
          </div>
        </div>
        <div id="appdiv" class="content" style="width: 100% !important;">
          <!-- STATS LEFT PANEL -->
          <div class="leftpanel-stats">
            <div class="leftpanel-close" id="leftpanelclose-stats">
              <i class="fa fa-times"></i>
            </div>
            <div class="gaugesdiv-wrapper">
              <div id="gaugesdiv1" class="attrition-hide">
                <div id="gaugediv1" style="clear: left;background-color:Black;height:200px;width:100%;overflow: hidden;position:relative;">
                  <div id="gaugescore1" style="position:absolute;top:10px;left:0px;z-index:1;width:100%;display:block;text-align: center;background-color:Black;color:White;font-size:16px;font-weight:bold;">
                    0
                  </div>
                  <!--<div style="position:relative; margin-top:5px;z-index:501;">
                    <a id="gaugecollapse1" class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='0',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','200px'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
                        href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                    <a class="help" target="_blank" href="../help.aspx?cid=BalancedScore">&nbsp;&nbsp;&nbsp;</a>
                    </div>-->
                  <div id="gaugelabel1" style="position:absolute;top: 175px;z-index:1;left:0px;width:100%;display:block;text-align: center;background-color:Black;color:White;font-size:12px;font-weight:bold;">
                    <span class="balancedname">Balanced</span>
                    Score
                  </div>
                  <img style="position:absolute;top:20px;left:-4px;" src="appApmClient/themes/default/images/gaugeGENFixed.jpg" id="imageback" />
                  <div id="gaugeover1" style="position:absolute;top:0px;left:0px;display:none;"></div>
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
                  <div id="gaugeprogress1" style="z-index:500; position:absolute; top: 120px; left:140px;"></div>
                </div>
                <div id="rankdiv1" style="clear: left;background-color:Black;height:70px;width:270px;overflow: hidden;position:relative;border-top: 1px solid white;display:none;">
                  <div id="rank1over" style="position:absolute;top:0px;left:0px;display:none;"></div>
                  <div id="rank1over2" style="position:absolute;top:50px;left:0px;display:none;"></div>
                  <div class="rankpindiv" id="rank1pin1" style="z-index:10;"><img class="rankpin" src="appApmClient/themes/default/images/mappin1.png" /></div>
                  <div class="rankpindiv" id="rank1pin2" style="top:77px;z-index:10;"><img class="rankpin" src="appApmClient/themes/default/images/mappin1.png" /></div>
                  <div id="needlerank1" style="position:absolute;bottom:0px;clear:left; width:270px; background-color: Black; color: White; font-size: 12px; padding-bottom: 3px; font-weight:bold; text-align: center;">
                  </div>
                </div>
              </div>
            </div>
            
            <div class="stats-filter-contentarea">
              <div class="stats-bubbles">
                <div class="teamrank" style="display:none;position:relative;text-align: center; font-size: 13px;color:White;font-weight: bold;padding: 0 10px 20px 0;">
                    Place team rank here.
                </div>
                <div class="shiftbid" style="display:none;position:relative;text-align: center; font-size: 13px;color:White;font-weight: bold;padding: 0 10px 20px 0;">
                    Place shift bid here.
                  </div>
                  <div class="mqfrank" style="display:none;position:relative;text-align: center; font-size: 13px;color:White;font-weight: bold;padding: 0 0 20px 0;">
                    Place mqfrank here.
                </div>
                <div class="chime-attendance-challenge" style="display:none;line-height:18px;font-style:italic;position:relative;text-align: center; font-size: 14px;color:White;padding: 0 10px 20px 0;">
                    Place Attendance Challenge Here
                  </div>
              </div>

              <div class="stats-blocks" style="display:none;">

                <p>Conversion Stats</p>
                <div class="conversion-stats-block">
                  <div class="conversion-stat conversion-stat_total">
                    27
                  </div>
                  <div class="conversion-stat conversion-stat_streak">
                    6
                  </div>
                  <div class="conversion-stat conversion-stat_goal">
                    16%
                  </div>
                </div>

                <div class="wins-stats-block" style="margin-right: 5px;">
                  <div class="wins-rank">
                    <div class="wins-rank-item wins-rank-item_wins">
                      22
                    </div>
                    <div class="wins-rank-item wins-rank-item_rank">
                      13
                      <span>OF 85</span>
                    </div>
                  </div>
                </div>

                <div class="wins-stats-block">
                  <div class="wins-rank">
                    <div class="wins-rank-item wins-rank-item_winrate">
                      9%
                    </div>
                    <div class="wins-rank-item wins-second-rank wins-rank-item_rank">
                      25
                      <span>OF 85</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>  
          <!-- END STATS LEFT PANEL -->

          <!-- FILTERS LEFT PANEL container -->
          <div class="leftpanel">
            <div class="leftpanel-close" id="leftpanelclose">
              <i class="fa fa-times"></i>
            </div>
            <div style="font-size:20px; font-weight:bold;margin: 10px;" class="attrition-show" style="display:none;">
              Attrition/Retention Log
            </div>
            <div class="gaugesdiv-wrapper">
              <div id="gaugesdiv2" class="attrition-hide">
                <div id="gaugediv2" style="clear: left;background-color:Black;height:200px;width:100%;overflow: hidden;position:relative;">
                  <div id="gaugescore2" style="position:absolute;top:10px;left:0px;z-index:1;width:100%;display:block;text-align: center;background-color:Black;color:White;font-size:16px;font-weight:bold;">
                    0
                  </div>
                  <!--<div style="position:relative; margin-top:5px;z-index:501;">
                    <a id="gaugecollapse2" class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='0',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','200px'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
                        href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                    <a class="help" target="_blank" href="../help.aspx?cid=BalancedScore">&nbsp;&nbsp;&nbsp;</a>
                    </div>-->
                  <div id="gaugelabel2" style="position:absolute;top: 175px;z-index:1;left:0px;width:100%;display:block;text-align: center;background-color:Black;color:White;font-size:12px;font-weight:bold;">
                    <span class="balancedname">Balanced</span>
                    Score
                  </div>
                  <img style="position:absolute;top:20px;left:-4px;" src="appApmClient/themes/default/images/gaugeGENFixed.jpg" id="imageback" />
                  <div id="gaugeover2" style="position:absolute;top:0px;left:0px;display:none;"></div>
                  <div class="needlediv" style="z-index:10;"><img class="needle" src="appApmClient/themes/default/images/nc0.png" id="n2eedle0" /></div>
                  <div class="needlediv" style="z-index:20;"><img class="needle" src="appApmClient/themes/default/images/nc1.png" id="n2eedle1" /></div>
                  <div class="needlediv" style="z-index:30;"><img class="needle" src="appApmClient/themes/default/images/nc2.png" id="n2eedle2" /></div>
                  <div class="needlediv" style="z-index:40;"><img class="needle" src="appApmClient/themes/default/images/nc3.png" id="n2eedle3" /></div>
                  <div class="needlediv" style="z-index:50;"><img class="needle" src="appApmClient/themes/default/images/nc4.png" id="n2eedle4" /></div>
                  <div class="needlediv" style="z-index:60;"><img class="needle" src="appApmClient/themes/default/images/nc5.png" id="n2eedle5" /></div>
                  <div class="needlediv" style="z-index:70;"><img class="needle" src="appApmClient/themes/default/images/nc6.png" id="n2eedle6" /></div>
                  <div class="needlediv" style="z-index:80;"><img class="needle" src="appApmClient/themes/default/images/nc7.png" id="n2eedle7" /></div>
                  <div class="needlediv" style="z-index:90;"><img class="needle" src="appApmClient/themes/default/images/nc8.png" id="n2eedle8" /></div>
                  <div class="needlediv" style="z-index:100;"><img class="needle" src="appApmClient/themes/default/images/nc9.png" id="n2eedle9" /></div>
                  <div class="needlediv" style="z-index:110;"><img class="needle" src="appApmClient/themes/default/images/nc10.png" id="n2eedle10" /></div>
                  <div class="needlediv" style="z-index:120;"><img class="needle" src="appApmClient/themes/default/images/nc11.png" id="n2eedle11" /></div>
                  <div class="needlediv" style="z-index:130;"><img class="needle" src="appApmClient/themes/default/images/nc12.png" id="n2eedle12" /></div>
                  <div class="needlediv" style="z-index:140;"><img class="needle" src="appApmClient/themes/default/images/nc13.png" id="n2eedle13" /></div>
                  <div class="needlediv" style="z-index:150;"><img class="needle" src="appApmClient/themes/default/images/nc14.png" id="n2eedle14" /></div>
                  <div class="needlediv" style="z-index:160;"><img class="needle" src="appApmClient/themes/default/images/nc15.png" id="n2eedle15" /></div>
                  <div id="gaugeprogress2" style="z-index:500; position:absolute; top: 120px; left:140px;"></div>
                </div>
                <div id="rankdiv2" style="clear: left;background-color:Black;height:70px;width:300px;overflow: hidden;position:relative;border-top: 1px solid white;display:none;">
                  <div id="rank2over" style="position:absolute;top:0px;left:0px;display:none;"></div>
                  <div id="rank2over2" style="position:absolute;top:50px;left:0px;display:none;"></div>
                  <div class="rankpindiv" id="rank2pin1" style="z-index:10;"><img class="rankpin" src="appApmClient/themes/default/images/mappin1.png" /></div>
                  <div class="rankpindiv" id="rank2pin2" style="top:77px;z-index:10;"><img class="rankpin" src="appApmClient/themes/default/images/mappin1.png" /></div>
                  <div id="needlerank2" style="position:absolute;bottom:0px;clear:left; width:270px; background-color: Black; color: White; font-size: 12px; padding-bottom: 3px; font-weight:bold; text-align: center;">
                  </div>
                </div>
              </div>
                    <div class="filterrankgauge" style="display:none;position:relative;overflow: hidden;width:100%;">
                        Place filterrankgauge here.
                    </div>
            </div>
           
      
            
            

            <!--FILTERS TAB CONTENT-->
            <div>
              
              <div id="scoringdiv" class="filters" style="clear:left; width: 270px; position:relative;">
                <div>
                  <span style="font-size:18px; font-weight:bold;">
                  <span class="scaname">Project</span>
                  Admin
                  </span>
                  <!--<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='0',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','auto'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
                    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                    <a class="help" target="_blank" href="../help.aspx?cid=AdminScoring">&nbsp;&nbsp;&nbsp;</a>-->
                </div>
                <div class="projectadmin-wrapper" id="projectadmin">
                  <br />Loading <span class="scaname">Project</span> &amp; Scoring Information...<br />&nbsp;
                </div>
                <div id="projectadminprogress" style="z-index:2; position:absolute; top: 50px; left:140px;"></div>
              </div>
              <div id="datasourcediv" class="filters panelbox" style="clear:left; width: 270px; position:relative;">
                <div style="font-size:18px; font-weight:bold;margin-top: -5px;">
                  Data Source
                  <!--<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='0',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; p.css('overflow','hidden'); } else { p.css('height','auto').css('overflow','visible'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
                    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                    <a class="help" target="_blank" href="../help.aspx?cid=DashboardDatasources">&nbsp;&nbsp;&nbsp;</a>-->
                </div>
                <dl style="margin:0;padding:0;margin-top:25px;">
                  <!-- <dt>Debug Monitor:</dt><dd id="debmon">...</dd> -->
                  <dt><span class="scaname">Name</span></dt>
                  <dd>
                    <select class="chosen" id="selDataSources">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                </dl>
                <div id="datasourceprogress" style="z-index:2; position:absolute; top: 25px; left:140px;"></div>
              </div>
              <div id="filterdiv" class="filters panelbox" style="clear: left; z-index:100; width: 270px; height:auto; position:relative; overflow:visible;">

                <div class="filter-stats-bubbles" style="display:none;">
                  <div class="teamrank" style="display:none;position:relative;text-align: center; font-size: 13px;color:White;font-weight: bold;padding: 0 10px 20px 0;">
                      Place team rank here.
                  </div>
                  <div class="shiftbid" style="display:none;position:relative;text-align: center; font-size: 13px;color:White;font-weight: bold;padding: 0 10px 20px 0;">
                      Place shift bid here.
                  </div>
                  <div class="mqfrank" style="display:none;position:relative;text-align: center; font-size: 13px;color:White;font-weight: bold;padding: 0 0 20px 0;">
                    Place mqfrank here.
                  </div>
                  <div class="chime-attendance-challenge" style="display:none;line-height:18px;font-style:italic;position:relative;text-align: center; font-size: 14px;color:White;padding: 0 10px 20px 0;">
                    Place Attendance Challenge Here
                  </div>
                </div>
                
                <!-- <h2>Filters</h2> -->
                <div class="stgdashboard-override-hide">
                  <div id="StgDashboard" class="stg attrition-hide" style="display:none;">
                    <div style="margin: 5px 0px 10px 0px">
                      <select style="display:none;">
                        <option value="Agent" selected="selected">Agent Operations Data</option>
                        <option value="Supervisor">Supervisor Operations Data</option>
                        <option value="Source">HR-Centric KPIs</option>
                        <option value="Program">Program</option>
                        <option value="Sidekick">Sidekick Metrics</option>
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
                  <dd id="agencyfilter" style="display:none;">
                    <select class="chosen" id="selAgencys">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt id="agencyofficelabel" style="display:none;">Office</dt>
                  <dd id="agencyofficefilter" style="display:none;">
                    <select class="chosen" id="selAgencyoffices">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt id="projectlabel"><span class="scaname">Project</span></dt>
                  <dd id="projectfilter">
                    <select class="chosen" id="selProjects">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt id="locationlabel">
                    <span class="locname">Location</span>
                  </dt>
                  <dd id="locationfilter">
                    <select class="chosen" id="selLocations">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt id="grouplabel"><span class="grpname">Group</span></dt>
                  <dd id="groupfilter">
                    <select class="chosen" id="selGroups">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt id="teamlabel">
                    <span class="teamname">Team</span>
                  </dt>
                  <dd id="teamfilter">
                    <select class="chosen" id="selTeams">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt id="csrlabel">CSR</dt>
                  <dd id="csrfilter" style="position:relative;">
                    <select class="chosen" id="selCSRs">
                      <option value="">..loading</option>
                    </select>
                    <div class="filters-attributes-link">&nbsp;</div>
                  </dd>
                </dl>
                <dl style="margin:0;padding:0;margin-top:0px;display:none;" id="filtersdiv">
                  <dt id="filterlabel">Attributes</dt>
                  <dd id="filtergroup">&nbsp;</dd>
                </dl>
                <dl id="newhiredatesdl" style="position:relative; margin:0;padding-top:5px;display:none;">
                  <dt class="date-display3" style="padding-top:5px;">Hire Date:</dt>
                  <dd class="date-display3">
                    <div class='hd-label' style="display:inline-block;width:150px;"></div>
                    <select class="chosen" id="selHiredates" style="display:none;">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                </dl>
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
                  <dd>
                    <select class="chosen" id="selAttritionLocations">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                </dl>
                <dl id="kpidl" style="position:relative; margin:0;padding:0;" class="attrition-hide">
                  <div id="StgScorecard" class="stg" style="display:none;margin-top: 5px;">
                    <div style="margin: 15px 0 10px 0;">
                      <label>Scorecard:</label>
                      <select style="display:none;margin-left: 20px;width:150px;">
                        <option value="1" selected="selected">Previous</option>
                        <option value="2">Current</option>
                      </select>
                    </div>
                  </div>
                  <dt class="kpi-display">KPI</dt>
                  <dd class="kpi-display">
                    <select class="chosen" id="selKPIs" onchange="">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt class="subkpi-display">SubKPI</dt>
                  <dd class="subkpi-display">
                    <select class="chosen" id="selSubKPIs" onchange="">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt style="display:none;">X Axis:</dt>
                  <dd style="display:none;">
                    <select class="chosen" id="selXaxiss" onchange="">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                </dl>
                <dl id="datedl" style="position:relative; margin:0;padding:0;" class="attrition-hide">
                  <dt class="date-display">Score View:</dt>
                  <dd class="date-display">
                    <select class="chosen" id="selPayperiods">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt class="date-display">Date Intvl:</dt>
                  <dd class="date-display" style="display:block;text-align:center;margin-right:20px;"><span id="spanDatefrom"></span> - <span id="spanDateto"></span></dd>
                </dl>
                <dl id="datedl2" style="position:relative; margin:0;padding:0;margin-top:10px;margin-bottom:10px;" class="attrition-hide date-display2">
                  <dt class="date-display2">Date 2:</dt>
                  <dd class="date-display2">
                    <select class="chosen" id="selPayperiod2s">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                  <dt class="date-display2">Date Intvl:</dt>
                  <dd class="date-display2" style="display:block;text-align:center;margin-right:20px;"><span id="spanDatefrom2"></span> - <span id="spanDateto2"></span></dd>
                </dl>
                <dl id="qadl" style="position:relative; margin:0;padding:0;" class="attrition-hide qualityform-display">
                  <dt class="qualityform-display">Quality Frm</dt>
                  <dd class="qualityform-display">
                    <select class="chosen" id="selQualityforms">
                      <option value="">..loading</option>
                    </select>
                  </dd>
                </dl>
              </div>
              <div id="dashboardcontroldiv" class="filters panelbox" style="clear: left; z-index:100; width: 270px; height:auto; z-index: 50; position:relative; overflow:visible;">
                <dl id="trenddl" style="position:relative;">
                  <dt>Trend By:</dt>
                  <dd>
                    <select class="chosen" id="selTrendbys">
                      <option value="">..loading</option>
                    </select>
                  </dd>
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
                  <br />
                  <input id="btnPlot" class="btnPlot" style="width:56px;" type="button" value="Submit" />
                  <input id="btnAdd" style="width:56px;" type="button" value="Add" />
                  <input id="btnClear" style="width:56px;" type="button" value="Clear" />
                  <!-- <input id="debug" type="button" value="debug" onclick="alert('debug1');var i; for (i=0;i<100000000;i++) { var j = 0; j = j+i; }; alert('debug2');" /> -->
                  <div id="StgScoreModel_Filter" class="stg" style="margin-top: 5px;">
                    <!-- MAKEDEV -->
                    <div style="margin: 5px 0 10px 0;">
                      <label>Score Basis:</label>
                    </div>
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
                  <dd>
                    <select class="chosen" id="selPresets" data-placeholder="..select a preset">
                      <option value="">(not selected)</option>
                      <option value="Preset1">Preset1</option>
                      <option value="Preset2">Preset2</option>
                    </select>
                    <div class="filters-presets-link presets-command-add">&nbsp;</div>
                  </dd>
                </dl>
                <div id="comboprogress" style="z-index:2; position:absolute; top: 90px; left:90px;"></div>
              </div>
              <div id="scoreeditorcontroldiv" class="filters panelbox" style="clear: left; z-index:0; width: 270px; height:auto; position:relative; overflow:visible;">
                <div style="text-align: center;">
                  <input id="btnSEView" style="width:56px;" type="button" value="View" />
                  <input id="btnSESave" style="width:106px;" type="button" disabled="disabled" value="Save Changes" />
                  <input id="btnSECancel" style="width: 56px;" type="button" disabled="disabled" value="Cancel" />
                </div>
              </div>
              <div class="settingsdiv-wrapper">
                <div id="filtersettingsdiv" class="filters panelbox attrition-hide" style="clear:left; width: 270px; position:relative;">
                  <div id="StgFilterType" class="stg">
                    <div style="margin: 5px 0 10px 0;">
                      <label>Filter Type:</label>
                      <select class="selectpicker">
                        <option value="Multiple" selected="selected">
                          Multi Select
                        </option>
                        <option value="Singular">
                          Single Select
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div id="settingsdiv" class="filters panelbox attrition-hide" style="clear:left; width: 270px; position:relative;display: none;">
                  <!-- <div class="slidemenu" style="position:absolute;top:10px;right:0px;"><a href="#">-</a><a href="#">+</a><a href="#" onclick="if (settingstoggle) { $('#gaugesdiv1,#gaugesdiv2,#filterdiv,#messagediv').animate({ height: '0px' }, 1000); }  else { $('#gaugesdiv1,#gaugesdiv2,#filterdiv,#messagediv').animate({ height: '200px' }, 1000); } settingstoggle=!settingstoggle; return false;">^</a></div> -->
                  <div style="font-size:18px; font-weight:bold;margin-top: 0;">Settings</div>
                  <div id="StgSupervisorFilters_label" style="font-size:14px; font-weight:bold; margin-left: 10px; margin-top: 5px;display:none;">Supervisor Filters</div>
                  <div id="StgSupervisorFilters" class="stg" style="display:none;">
                    <div style="margin: 5px 20px 10px 20px">
                      <select style="display:none;">
                        <option value="Default" selected="selected">Show my default level.</option>
                        <option value="Team">Show only my Team.</option>
                        <!-- TODO: <option value="Grp">Show only my Group.</option> -->
                        <option value="Location">Show <span class="locname">Location</span>.</option>
                        <option class="scaname-override" value="Entire Project">Show Entire <span class="scaname">Project</span>.</option>
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
                  <div id="Div1" class="stg">
                    <div style="margin: 5px 0 10px 0;">
                      <select style="display:none;">
                        <option value="On" selected="selected">Labels On</option>
                        <option value="Off">Labels Off</option>
                      </select>
                    </div>
                  </div>
                  <div id="StgDisplayScreen" class="stg" style="display:none;">
                    <div style="margin: 5px 0 10px 0;">
                      <label>Display Screen:</label>
                      <select class="selectpicker">
                        <option value="1" selected="selected">
                          Dashboard 1
                        </option>
                        <option value="2">
                          Dashboard 2
                        </option>
                        <option value="">
                          All
                        </option>
                      </select>
                    </div>
                  </div>
                  <div id="StgBarView" class="stg">
                    <div style="margin: 5px 0 10px 0;">
                      <label>Graph Appearance:</label>
                      <select class="selectpicker">
                        <option value="Performance Colors" selected="selected">
                          Performance Colors - Display Red/Yellow/Green for all bars
                        </option>
                        <option value="Series Colors">
                          Series Colors - Display a unique color for each series
                        </option>
                      </select>
                    </div>
                  </div>
                  <div id="StgShowSeries" class="stg" style="display:none;">
                    <div style="margin: 5px 0 10px 0;">
                      <select>
                        <option value="Every Series" selected="selected">Show every series.</option>
                        <option value="Non-Zero Series">Show only non-zero series.</option>
                      </select>
                    </div>
                  </div>
                  <div id="StgScoreModel" class="stg" style="margin-top: 5px;">
                    <div style="margin: 15px 0 10px 0;">
                      <label>Score Basis:</label>
                      <select style="display:none;width:150px;">
                        <option value="Balanced" selected="selected">Scored Value</option>
                        <option value="Raw">Standard Value</option>
                      </select>
                    </div>
                  </div>
                  <div id="StgInTraining" class="stg" style="margin-top: 5px;">
                    <div style="margin: 5px 0 10px 0;">
                      <label>In-Training Scores:</label>
                      <select>
                        <option value="Only">Only</option>
                        <option value="Include">Include</option>
                        <option value="Exclude" selected="selected">Exclude</option>
                      </select>
                    </div>
                  </div>
                  <div id="StgAgentStatus" class="stg" style="margin-top: 5px;">
                    <div style="margin: 5px 0 10px 0;">
                      <label>Agent Status<br />Override<br /><br /><br /></label>
                      <select multiple="multiple">
                        <option value="1">Active</option>
                        <option value="7">In Training</option>
                        <option value="2">Terminated</option>
                        <option value="9">LOA</option>
                      </select>
                    </div>
                  </div>
                  <div id="StgHireDatesFilter" class="stg" style="margin-top: 5px;">
                    <div style="margin: 5px 0 10px 0;">
                      <label>Hire Dates:</label>
                      <select>
                        <option value="Filter On">Hire Date Range - Use Hire Date Range filter above</option>
                        <option value="Filter Off" selected="selected">All Hire Dates Included in Results</option>
                      </select>
                    </div>
                  </div>
                  <div id="StgReportScoreModelID" class="stg" style="margin-top: 5px;">
                    <div style="margin: 5px 20px 10px 20px">
                      <label>Report Score Model:</label>
                      <select>
                        <option value="Balanced" >Scored Value</option>
                        <option value="Raw" selected="selected">Standard Value</option>
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
            <!--END FILTERS TAB CONTENT-->
            
          </div>
          <!--TURN OFF <div id="leftpanelOverlay" class="leftpanelOverlay"></div>-->
          <div class="ticker-recognition" style="display:none;position:relative;height:24px;color:White;background-color:Red;width:100%;">
            <div class="ticker-content" style="position:absolute;top:0px;left:0px;font-size:16px;font-weight:bold;"></div>
          </div>
          <div class="tabs" id="tabs">
            <ul>
              <li id="graphtab"><a id="graphlabel" class="tablabel" href="#tabs-1">Home</a></li>
              <li id="overviewtab" style="display:none;"><a id="overviewlabel" class="tablabel" href="#tabs-overview">Overview</a></li>
              <li id="userdashboardtab" style="display:none;"><a id="userdashboardlabel" class="tablabel" href="#tabs-userdashboard">Dashboard</a></li>
              <li id="meettab" style="display:none;"><a id="meetlabel" class="tablabel" href="#tabs-meet">Meet</a></li>
              <li id="graphsubtab"><a id="graphsublabel" class="tablabel graphsublabel" href="#tabs-1sub">Split</a></li>
              <li id="tabletab"><a id="tablelabel" class="tablabel" href="#tabs-2">Table</a></li>
              <li id="km2compliancetab" style="display:none;"><a id="km2compliancelabel" class="tablabel" href="#tabs-km2compliance">Compliance</a></li>
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
              <li id="attendanceformtab" style="display:none;"><a id="attendanceformlabel" class="tablabel" href="#tabs-attendanceform">Attendance</a></li>
              <!-- MADELIVE -->
              <li id="journalformtab" style="display:none;"><a id="journalformlabel" class="tablabel" href="#tabs-journalform">Journal</a></li>
              <!-- MADELIVE -->
              <li id="reviewformtab" style="display:none;"><a id="reviewformlabel" class="tablabel" href="#tabs-reviewform">Review</a></li>
              <!-- MAKEDEV -->
              <li id="complianceformtab" style="display:none;"><a id="complianceformlabel" class="tablabel" href="#tabs-complianceform">Compliance</a></li>
              <!-- MAKEDEV -->
              <li id="journaltab" style="display:none;"><a id="journallabel" class="tablabel" href="#tabs-journals">Journals</a></li>
              <!-- MADELIVE -->
              <li id="lbtab"><a id="lblabel" class="tablabel" href="#tabs-lb">Leaderboard</a></li>
              <li id="guidetab" style="display:none;"><a id="guidelabel", class="tablabel" href="#tabs-guide">Guide</a></li>
              <li id="treasurehunttab" style="display:none;"><a id="treasurehuntlabel" class="tablabel" href="#tabs-18">Treasure Hunt (dev)</a></li>
              <li id="helloworldtab" style="display:none;"><a id="helloworldlabel" class="tablabel" href="#tabs-helloworld">Hello World (dev)</a></li>
              <li id="sandboxtab" style="display:none;"><a id="sandboxlabel" class="tablabel" href="#tabs-sandbox">Sandbox</a></li>
              <li id="perfectattendancetab" style="display:none;"><a id="perfectattendancelabel" class="tablabel" href="#tabs-perfectattendance">Attendance Contest</a></li>
              <li id="admintab" style="display:none;"><a id="adminlabel" class="tablabel" href="#tabs-admin">Admin</a></li>
              <li id="clintwerxtab" style="display:none;"><a id="clintwerxlabel" class="tablabel" href="#tabs-clintwerx">CDJ Skunkwerx</a></li>
              <li id="performancetab" style="display:none;"><a id="performancelabel" class="tablabel" href="#tabs-performance">Performance</a></li>
              <li id="qmdashboardtab" style="display:none;"><a id="qmdashboardlabel" class="tablabel" href="#tabs-qmdashboard">QM Dashboard</a></li>
              <li id="autoqatab" style="display:none;"><a id="autoqalabel" class="tablabel" href="#tabs-autoqa">Auto QA</a></li>
              <li class="launch-meeting" style="display:none;/* float:right; */">
                <div class="dropdown">
                    <button onclick="myFunction()" class="dropbtn">Launch &raquo;</button>
                    <div id="myDropdown" class="dropdown-content">
                        <a target="_blank" style="display:none !important;" href="https://www.google.com">
                            &nbsp;
                        </a>
                        <a target="_blank" href="https://teams.microsoft.com">
                            MS Teams
                        </a>
                        <a target="_blank" href="https://global.gotomeeting.com">
                            GoToMeeting
                        </a>
                        <a href="https://zoom.us">
                            ZOOM
                        </a>
                    </div>
                </div>
              </li>
            </ul>
            <div id="tabs-1" style="background-color: #fff;">
              <div class="tabarea home-highchart">
                <div class="home-print-wrapper stg-field">
                  <div class="report-print stg-field">
                    <span class="acuity-print-grid" style="cursor:pointer;text-decoration:underline;">Print</span>
                  </div>
                </div>
                <div class="home-show-wrapper stg-field" style="z-index:1;">
                  <label style="/*REVERTED 2020-01-15: display:none;*/" id="ReportGroupingLabel">
                  Show:
                  </label>
                  <span style="/*REVERTED 2020-01-15: display:none;*/" id="HomeReportList" class="stg"></span>
                </div>
                <div class="home-grouping-wrapper stg-field" style="z-index:1;">
                  <label id="Label1">Grouping:</label>
                  <span id="ReportGrouping" class="stg"></span>
                </div>
                <div id="myreportcontainer" style="display:none;width: 300px;height:auto;float:left;background-color:White;padding: 10px;overflow-x:scroll;">
                  Report View
                </div>
                <div id="mycontainer" style="position:relative;float:left;z-index:2;"></div>
                <div id="mycontainerprompt" style="display:none;text-align:center;z-index:100000;font-weight:bold;">
                  Set Report Filter then click '<span class="plotname">Plot</span>'.
                </div>
              </div>
            </div>
            <div id="tabs-1sub" style="width:100% !important;background-color: #fff;">
              <div class="tabarea" style="width:100% !important;">
                <div id="mycontainersub" style="position:relative;width:100% !important;"></div>
                <div id="mycontainerpromptsub" style="display:none;text-align:center;z-index:100000;font-weight:bold;">
                  Set Report Filter with SubKPI then click '<span class="plotname">Plot</span>'.
                </div>
              </div>
            </div>
            <div id="tabs-2">
              <div class="tabarea" style="text-align:center;">
                <div id="mytablelabel" class="table-label">History</div>
                <div id="mytable1" style="margin-left:auto;margin-right:auto;display:block;">
                  <table id="list1" style="width: 100% !important;"></table>
                  <div id="pager1" style="width: 100% !important;"></div>
                  <div id="tablemessage" style="margin-top: 20px;">Select a bar or point from the graph, and the results will display here.</div>
                  <div id="serverside_rowdv" class="data-validation">
                  </div>
                  <iframe id="rowdviframe" src="" style="width:100%;border:none;overflow:hidden;"></iframe>
                  <div class="table-sourcedivider" id="rowdv_show" style="display:none;">&nbsp;</div>
                  <div id="datasourcetables_row"></div>
                  <div class="table-sourcedivider" id="tabledv_show" style="display:none;">&nbsp;</div>
                  <div id="clientside_tabledv" class="data-validation"></div>
                  <div id="serverside_tabledv" class="data-validation"></div>
                  <div id="datasourcetables_table"></div>
                  
                </div>
              </div>
            </div>
            <div id="tabs-3" style="position:relative;">
              <div id="messagediv" class="filters panelbox" style="clear:left; width: 265px; position:relative;">
                <div style="margin-top: -5px;">
                  <div class="messages-alert-messagereceived">
                    <span>&nbsp;</span>
                    <a onclick="$(this).parent().hide();return false;" href="#">X</a>
                  </div>
                  <div class="messages-alert-newmessages"><span>&nbsp;</span></div>
                  <div class="messages-alert-messagesent"><span>&nbsp;</span></div>
                </div>
                <div>
                  <span style="font-size:18px; font-weight:bold;">Messages</span>
                  <span class="messages-compose"><input type="button" value="Compose" /></span>
                  <!--<a class="sidebar-collapse icon-minus" onclick="var me=$(this),ch='0',p=me.parent().parent(),h; if (me.hasClass('icon-minus')) { h=ch; } else { p.css('height','auto'); h= p.height(); p.css('height',ch); } p.animate({ height: h }, 1000); me.toggleClass('icon-minus icon-plus'); return false;"
                    href="#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
                    <a class="help" target="_blank" href="../help.aspx?cid=DashboardMessages"><i class="fa fa-question"></i></a>-->
                </div>
                <div class="message-wrapper" id="messages"><br />Loading Messages...<br />&nbsp;</div>
                <div id="messageprogress" style="z-index:2; position:absolute; top: 50px; left:140px;"></div>
                <div class="beacon-launch-wrapper" style="display:none;font-weight:bold;margin-top:20px;text-decoration:underline;">
                  <a href="Beacon.html" target="_blank">Diagnostic Beacon</a>
                </div>
                <div class="message-notifier-wrapper-km2" style="display:none;">
                  <!-- <a href="Acuity Notifier KM2.msi">Acuity Notifier (KM2)</a> -->
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
                <div class="message-notifier-wrapper-all" style="display:none;margin-top: 20px;">
                  <a href="Acuity Notifier ALL.msi">Download Acuity Mini</a>
                </div>
              </div>
              <div style="display:none;position:absolute;top: 0px;left: 0px;height:400px;width:400px;">
                Message control areas.
              </div>
              <div class="tabarea sidebar-indent" id="messagearea">
                <p>Messages are loading, please wait...</p>
              </div>
              <div class="tabarea sidebar-indent" style="display:none;" id="messageareaACK">
                <p>Acknowledgement Report loading, please wait...</p>
              </div>
            </div>
            <div id="tabs-report">
              <div class="tabarea" style="background-color:White;">
                <div class="report-search-top">
                  <div class="row">
                    <div class="col-2">
                      <label id="SearchLabel">Search:</label>
                      <input class="report-filter-global" type="text"  value="" placeholder="Search Report" />
                    </div>
                    <div class="col-4" style="position:relative;">
                      <div id="ReportReportListToggle" style="position:absolute;right:100px;top:5px;cursor:pointer;font-size:9px;color:black;display:none;">Favorites</div>
                      <label id="ReportReportListLabel">Select Report:</label>
                      <div>                        
                        <span id="ReportReportList" class="stg">
                            <select data-placeholder="Select Report" style="max-width: calc( 100% - 80px);">
                                <option value=""></option>
                            </select>
                        </span>
                        <span id="ReportReportFavorites" class="stg" style="display:none;">
                            <select data-placeholder="Select Favorite" style="max-width: calc( 100% - 80px);">
                                <option value="">Favorites...</option>
                            </select>
                        </span>
                        <span id="ReportReportSave" style="cursor:pointer;text-transform:lowercase;font-size:9px;color:black;display:none;">save</span>
                        <span id="ReportReportShare" style="cursor:pointer;text-transform:lowercase;font-size:9px;color:black;display:none;">share</span>
                        <span id="ReportReportRemove" style="cursor:pointer;text-transform:lowercase;font-size:9px;color:black;display:none;">remove</span>
                      </div>                      
                    </div>
                    <div class="col-2">
                      <label class="report-label-intraining">In-Training:</label>
                      <span id="ReportShowInTraining" class="stg"></span>
                    </div>
                    <div style="display:none;">
                      <div class="col-2">
                        <label class="report-label-grouping">Grouping:</label>
                        <span id="ReportReportGrouping" class="stg"></span>
                      </div>
                    </div>
                    <div class="col-3">
                      <label class="report-label-scoring">Scoring</label>
                      <span id="ReportReportScoreModel" class="stg"></span>
                    </div>
                    <div class="col-2">
                      <label class="report-label-scoring">&nbsp;</label>
                      <input class="btnPlot" style="margin-top:-4px;width:66px;" type="button" value="Submit" />
                    </div>
                    <div class="report-acuity-print" style="position:absolute;right: 10px;top:2px;">
                      <span class="acuity-print" title="Print Page"><i class="fas fa-print"></i> Print</span>
                    </div>
                  </div>
                </div>
                <div class="clearfix"></div>
                <div class="ReportReports reports_instructions">
                  <p>Select Report to Show and Set Filters.</p>
                </div>
                <div class="ReportSandbox" style="display:none;">
                  <iframe src="" id="ReportSandboxIframe" style="width:100%;height:100%; border:0px;"></iframe>
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
                      <option value="Normal" selected="selected">Refresh every half hour.</option>
                      <!-- CTHIX: -->
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
              <div class="tabarea sidebar-indent" id="companyadminarea">..Loading</div>
            </div>
            <div id="tabs-6">
              <div class="tabare sidebar-indent" id="modeladminarea">Select Model from menu..</div>
            </div>
            <div id="tabs-7">
              <div class="tabarea sidebar-indent" id="projectadminarea">Select <span class="scaname">Project</span> from menu..</div>
            </div>
            <div id="tabs-8">
              <div class="tabarea sidebar-indent" id="kpiadminarea">Select KPI from menu..</div>
            </div>
            <div id="tabs-9">
              <div class="tabarea sidebar-indent" id="subkpiadminarea">Select SubKPI from menu..</div>
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
              <!-- #Include virtual="../applib/html/views/unitedtreasurehunt.htm" -->
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
                <div class="CEPointsPrizes" id="CEPointsPrizesMgrCopy"></div>
              </div>
            </div>
            <div id="tabs-15">
              <div class="subtabs" id="tabsattrition">
                <ul>
                  <li>
                    <!--<a class="tablabel attrition-management-link" href=".AttritionLedger-wrapper">Management</a>-->
                    <a class="tablabel attrition-management-link">Management</a>
                  </li>
                  <li style="display:none;">
                    <!--<a class="tablabel attrition-reports-link" href=".AttritionLedger-wrapper">Reports</a>-->
                    <a class="tablabel attrition-reports-link">Reports</a>
                  </li>
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
            <div id="tabs-userdashboard" style="padding:0 !important;">
              <div class="tabarea">
                <iframe src="" id="UserdashboardIframe" style="width:100%;height:100%; border:0px;"></iframe>
              </div>
            </div>
            <div id="tabs-overview">
              <div class="tabarea">
                <iframe src="" id="OverviewIframe" style="width:100%;height:100%; border:0px;"></iframe>
              </div>
            </div>
            <div id="tabs-sandbox">
              <div class="tabarea">
                <div class="report-search-top">
                  <div class="row">
                    <div class="col-2">
                      <label id="Label5" style="display:none;">Search:</label>
                      <input class="sandbox-filter-global" style="display:none;" type="text"  value="" placeholder="Search Report" />
                    </div>
                    <div class="col-3">
                      <label id="Label6">Select Report:</label>
                      <span id="SandboxReportList" class="stg"></span>
                    </div>
                    <div class="col-2">
                      <label class="report-label-scoring">&nbsp;</label>
                      <input class="btnPlot" style="display:none;margin-top:-4px;width:66px;" type="button" value="Submit" />
                    </div>
                    <div class="report-acuity-print" style="position:absolute;right: 10px;top:2px;">
                      <span class="acuity-print" title="Print Page"><i class="fas fa-print"></i> Print</span>
                    </div>
                  </div>
                </div>
                <div class="clearfix"></div>

                <iframe src="" id="SandboxIframe" style="width:100%;height:100%; border:0px;"></iframe>
              </div>
            </div>
            <div id="tabs-perfectattendance">
              <div class="tabarea tabarea-perfectattendance">
                <iframe src="" id="PerfectattendanceIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-guide">
              <div class="tabarea tabarea-guide">
                <div class="guide-nav" style="position:absolute;padding:10px;background-color:White;opacity:0.7;"></div>
                <iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts" src="" id="GuideIframe" name="myguideframe" style="border:0px; width: 1200px;  height: 100%" >
                </iframe>
                <iframe sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts" src="" id="GuideGeneralIframe" name="myguidegeneralframe" style="border:0px; width: 1200px;  height: 100%" >
                </iframe>
              </div>
            </div>
            <!-- MADELIVE -->
            <div id="tabs-attendanceform">
              <div class="tabarea">
                <p class="attendanceform-message">Please select a Team and CSR (use the filters on the left).</p>
                <iframe src="" id="AttendanceformIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-lb" class="theme-underthesea">
              <div class="tabarea">
                <iframe src="" id="LeaderboardIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
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
            <div id="tabs-meet" style="width: 100%; height: 100%;">
              <div class="tabarea tabarea-meet" style="width: 100%; height: 100%;">
                <p class="meet-message">Start or receive invitation to a meeting in the chat window.</p>
                <iframe src="" id="MeetIframe" sandbox="allow-top-navigation allow-scripts allow-same-origin allow-popups allow-pointer-lock allow-forms"
                allow="camera; microphone"
                style="border:0px; width: 98%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-admin" style="width: 100%; height: 100%;">
              <div class="tabarea tabarea-admin" style="width: 100%; height: 100%;">
                <iframe src="" id="AdminIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-clintwerx" style="width: 100%; height: 100%;">
              <div class="tabarea tabarea-clintwerx" style="width: 100%; height: 100%;">
                <iframe src="" id="ClintwerxIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-performance" style="width: 100%; height: 100%;">
              <div class="tabarea tabarea-performance" style="width: 100%; height: 100%;">
                <iframe src="" id="PerformanceIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-qmdashboard" style="width: 100%; height: 100%;">
              <div class="tabarea tabarea-qmdashboard" style="width: 100%; height: 100%;">
                <iframe src="" id="QmdashboardIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-autoqa" style="width: 100%; height: 100%;">
              <div class="tabarea tabarea-autoqa" style="width: 100%; height: 100%;">
                <iframe src="" id="AutoqaIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
              </div>
            </div>
            <div id="tabs-km2compliance" style="width: 100%; height: 100%;">
              <div class="tabarea tabarea-km2compliance" style="width: 100%; height: 100%;">
                <iframe src="" id="Km2complianceIframe" style="border:0px; width: 100%;  height: 100%" ></iframe>
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
          <script type="text/javascript" src="<%=CONFMGR.minified("appApmClient/js/appApmMain.js?r=128E")%>"></script>
          <script type="text/javascript" src="<%=CONFMGR.minified("TOUCHPOINT/js/TouchpointInterface-2.2.js?r=3")%>"></script>
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
        </div>
      </form>
    </div>
    <!-- #Include virtual="../applib/html/views/qa.htm" -->
    <!-- #Include virtual="../applib/html/views/filterattributes.htm" -->

  </body>
</html>