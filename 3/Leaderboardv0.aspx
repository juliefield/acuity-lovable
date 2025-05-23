<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Leaderboardv0.aspx.cs" ValidateRequest="false" Inherits="Leaderboardv0" %>
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
      <script src="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.spin.js"></script>
      <script type="text/javascript" src="../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
      <!-- knockout (for PubSub) Any issues with this? -->
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/knockout-3.3.0.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko.mapping.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko-postbox.js"></script>
      <!-- App Modules -->
      <script type="text/javascript" src="../jq/appApmClient/js/appApmContentTriggers-1.0.js?r=3"></script>
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
      <!-- AngularJS ng- ng -->
      <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
      <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
      <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
      <!-- ES5 Compatibility for IE 11 -->
      <script src="/lib/bluebird/3.3.4/bluebird.min.js"></script>
      <!-- see purecss.io for docs -->
      <link rel="stylesheet" href="../lib/pure/pure-min.css" />
      <link rel="stylesheet" href="../lib/pure/grids-responsive-min.css">
      <!-- JULIE CSS -->
      <link rel="stylesheet" href="../App_Themes/AcuityV3/css/app.css?<%=CONFMGR.Bump()%>" />
      <link rel="stylesheet" href="../applib/dev/FORMS1/FORMS1-view/forms.css?<%=CONFMGR.Bump()%>" />
      <!-- /JULIE CSS -->
      <link rel="stylesheet" href="../applib/css/journal-list.css?<%=CONFMGR.Bump()%>" />
      <!-- ng buildout -->
      <!--
        <script type="text/javascript" src="../appLib/js/controllers/main.js?<%=CONFMGR.Bump()%>"></script>
        -->
      <script type="text/javascript" src="../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../appLib/js/controllers/legacyController.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../appLib/js/directives/tableeditor.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../appLib/js/directives/dynamicui.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../appLib/js/directives/journalform.js?<%=CONFMGR.Bump()%>"></script>
      <!-- NEW -->
      <link rel="stylesheet" href="../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/POSTNOTE1/POSTNOTE1-vm/postnote.js?<%=CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../applib/dev/REPORT1/REPORT1-view/report.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../lib/highcharts-6.2.0/code/highcharts.js"></script>
      <script type="text/javascript" src="../lib/highcharts-6.2.0/code/js/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../lib/highcharts-6.2.0/code/js/modules/export-data.js?<%=CONFMGR.Bump()%>"></script>
      <!-- Styled Mode -->
      <link rel="stylesheet" href="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/highcharts.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript"
        src="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appChartDefinitions.js?<%=CONFMGR.Bump()%>"
        styled_mode="YES" ></script>
      <script type="text/javascript" src="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appCustomCharts.js?<%=CONFMGR.Bump()%>"></script>
    </asp:PlaceHolder>
  </head>
  <body id="Body1" style="overflow-y: auto;background: none;max-width: 95%;margin: 0 auto;" runat="server" ng-controller="legacyController">
    <ng-legacy-container class="content" style="width:99vw;height:99vh; position:relative;">
      <div class="leaderboard_chart">
        <label>Adherence:</label>
        <div class="leaderboard-table-container">
          <ng-acuity-report cid="Leaderboardv0a" filters="user1=Adherence&StartDate={Date,Week_ChimeElite,Start,0}&EndDate={Date,Week_ChimeElite,End,0}"></ng-acuity-report>
        </div>
      </div>

      <div class="leaderboard_chart">
        <label>Quality:</label>
        <div class="leaderboard-table-container">
          <ng-acuity-report cid="Leaderboardv0a" filters="user1=Quality&StartDate={Date,Week_ChimeElite,Start,0}&EndDate={Date,Week_ChimeElite,End,0}"></ng-acuity-report>
        </div>
      </div>

      <div class="leaderboard_chart">
        <label>Errors:</label>
        <div class="leaderboard-table-container">
          <ng-acuity-report cid="Leaderboardv0a" filters="user1=Errors&StartDate={Date,Week_ChimeElite,Start,0}&EndDate={Date,Week_ChimeElite,End,0}"></ng-acuity-report>
        </div>
      </div>

      <div class="leaderboard_chart">
        <label>Wrap Up Time:</label>
        <div class="leaderboard-table-container">
          <ng-acuity-report cid="Leaderboardv0a" filters="user1=Wrap Up Time&StartDate={Date,Week_ChimeElite,Start,0}&EndDate={Date,Week_ChimeElite,End,0}"></ng-acuity-report>
        </div>
      </div>
    </ng-legacy-container>
    <br />
    <br />
    <br />
  </body>
</html>
