<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReportTest.aspx.cs" ValidateRequest="false" Inherits="three_ReportTest" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"  ng-app="angularApp">
   <head id="Head1" runat="server">
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>Acuity&trade; 3.0</title>
      <!--[if gt IE 9]>sel
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <![endif]-->
      <!--[if lte IE 9]>
      <meta http-equiv="X-UA-Compatible" content="IE=8" />
      <![endif]-->

		  <!-- AngularJS ng- ng -->
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
  		
      <asp:PlaceHolder runat="server">
         <link href="../applib/css/theme.css?<%=CONFMGR.Bump()%>" type="text/css" rel="stylesheet" />
         <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib")%>jquery-ui/development-bundle/themes/base/jquery.ui.all.css" />
         <!--<link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css" />-->
         <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jqgrid40/css/ui.jqgrid.css" />
         <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.css" />
         <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/qtip2dev/dist/jquery.qtip.css" />
         <!-- 1. Add these JavaScript inclusions in the head of your page -->
         <!-- jquery -->
         <!--<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery-ui/js/jquery-1.6.2.min.js"></script>-->
         <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/jquery-1.7.2.min.js"></script>
         <!--<script type="text/javascript" src="../lib/BootstrapModalPopover/lib/jquery-1.11.3.min.js"></script> -->
         <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery-ui/js/jquery-ui-1.8.16.custom.min.js"></script>
         <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery-ui/js/spinner.js"></script>
         <!-- plugins -->
          <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery-ui/development-bundle/ui/jquery.ui.tabs.js"></script>

         <script src="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
         <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
         <script type="text/javascript" src="../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
         <!-- App Modules -->
         <!-- Spectrum Color Picker -->
         <link rel="stylesheet" href="../lib/bgrins-spectrum-98454b5/spectrum.css" />
         <script type="text/javascript" src="../lib/bgrins-spectrum-98454b5/spectrum.js"></script>
         <!-- Date Range Picker Suite -->
         <script type="text/javascript" src="../lib/ace-builds/src-noconflict/ace.js"></script>
         <script type="text/javascript" src="../lib/moment/moment.min.js"></script>
         <link rel="stylesheet" href="../lib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
         <script type="text/javascript" src="../lib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>
		     <link rel="stylesheet" href="../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.css" />
	       <script type="text/javascript" src="../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.js"></script>
         <script type="text/javascript" src="../lib/jquery-tablesorter/jquery.tablesorter.js"></script>
         <!-- Files with separate JulieDev replacements  -->
         <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/base.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/fan.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/rpt.css?<%=CONFMGR.Bump()%>" />
         <!-- ES5 Compatibility for IE 11 -->
         <script src="../lib/bluebird/3.3.4/bluebird.min.js"></script>
         <!-- see purecss.io for docs -->
         <link rel="stylesheet" href="../lib/pure/pure-min.css" />
         <link rel="stylesheet" href="../lib/pure/grids-responsive-min.css">
         <!-- JULIE CSS -->
         <link rel="stylesheet" href="../App_Themes/Acuity3/css/app.css?<%=CONFMGR.Bump()%>" />
         <!-- /JULIE CSS -->

         <!-- ng buildout -->
         <script type="text/javascript" src="../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/controllers/legacyController.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/directives/dynamicui.js?<%=CONFMGR.Bump()%>"></script>

      <!-- NEW -->
      <link rel="stylesheet" href="../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/POSTNOTE1/POSTNOTE1-vm/postnote.js?<%=CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../applib/dev/REPORT1/REPORT1-view/report.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>
      <!-- /NEW -->
      
      <!-- Highcharts -->
      <script type="text/javascript" src="../lib/highcharts-2.3.3/js/highcharts.src.js"></script>
      <script type="text/javascript" src="../lib/highcharts-2.3.3/js/highcharts-more.js"></script>
      <!-- 1a) Optional: add a theme file -->
      <script type="text/javascript" src="../lib/highcharts-2.3.3/js/themes/touchpointasync4.js?<%=CONFMGR.Bump()%>"></script>
      <!-- 1b) Optional: the exporting module -->
      <script type="text/javascript" src="../lib/highcharts-2.3.3/js/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
      <!-- 2. Add the JavaScript to initialize the chart on document ready -->
      <script type="text/javascript" src="../applib/css/highcharts.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../appLib/js/appChartDefinitions.js?<%=CONFMGR.Bump()%>"></script>

      </asp:PlaceHolder>
   </head>
   <body id="Body1" style="position:relative;" runat="server" ng-controller="legacyController">
      <form id="form1" runat="server"></form> <!-- This form was causing sizing issues in the iframe, so I emptied it (not sure I need it). -->
      <ng-legacy-container class="content" style="width:100%;height:100%;overflow-y: scroll; position:relative;">
        <ng-acuity-report-editor></ng-acuity-report-editor>
        <div class="mypanel" style="position:absolute;left:0px;top:0px;">
            <div style="width:1200px;height:500px;padding:30px;position:relative;">
                <ng-acuity-report text="Assist These Agents ASAP!"
                    hidetopper="NOTtrue" filters="Project=11&CSR=each&scoremodel=Balanced&KPI=each&StartDate=09/01/2018&EndDate=09/30/2018" panel="sk_assist_table" cid="DashboardGrid" cidclient="all">
                </ng-acuity-report>
            </div>
            <!--
            <div style="width:400px;height:400px;">
            <ng-acuity-report text="Assist These Agents ASAP!"
                hidetopper="NOTtrue" filters="Project=1&Team=2&CSR=each&KPI=each&StartDate=09/01/2018&EndDate=09/30/2018" cid="reporttest-test" cidclient="all">
            </ng-acuity-report>
            <div style="width:400px;height:400px;">
            <ng-acuity-report text="Assist These Agents ASAP!"
                hidetopper="NOTtrue" filters="Project=1&Team=2&CSR=each&KPI=each&StartDate=09/01/2018&EndDate=09/30/2018" cid="reporttest-test2" cidclient="all">
            </ng-acuity-report>
            -->
            <!--
                <ng-acuity-report text="Test Panel 1" details="test details for test panel 1"
                    hidetopper="NOTtrue" filters="Project=11&StartDate=8/1/2018&EndDate=10/15/2018" cid="sk-performance-topleft" cidclient="all">
                </ng-acuity-report>
            -->
            </div>
        </div>
        <div class="mypanel" style="position:absolute;left:1100px;top:0px;">
            <div style="width:500px;height:300px;">
            <!--
                <ng-acuity-report text="Test Panel 2" hidetopper="NOTtrue" filters="Project=11&StartDate=8/1/2018&EndDate=10/15/2018" cid="sk-performance-bottomleft" cidclient="all">
                </ng-acuity-report>
            -->
            </div>
        		<!--
            <ng-acuity-report style="width:500px;height:500px;" text="Weekly Quality" hidetopper="false" filters="Project=11&StartDate=10/1/2018&EndDate=10/15/2018" cid="WeeklyQuality"></ng-acuity-report>
            <ng-acuity-report style="width:500px;height:500px;" text="Logged In" hidetopper="true" cid="Login"></ng-acuity-report>
            <ng-acuity-report text="Sidekick Home Bubble Stats" cid="sk_home_bubblestats" filters="params&Date=CURRENT_MONTH" title="Login Stats By Month"></ng-acuity-report>
            <ng-acuity-report text="Sidekick Home Performance" cid="sk_home_performance" filters="params&Date=CURRENT_MONTH" title="Login Stats By Month"></ng-acuity-report>
            <ng-acuity-report text="Sidekick Home Recommendations" cid="sk_home_recommendations" filters="params&Date=CURRENT_MONTH" title="Login Stats By Month"></ng-acuity-report>
            -->
        </div>
      </ng-legacy-container>
   </body>

</html>