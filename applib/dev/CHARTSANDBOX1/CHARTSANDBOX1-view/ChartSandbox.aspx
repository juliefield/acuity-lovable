<!-- foo -->
<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ChartSandbox.aspx.cs" ValidateRequest="false" Inherits="dev_ChartSandbox" %>
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
  		<!-- Chris, is this what you want? -->
      <script src="//code.angularjs.org/1.3.0-rc.1/angular-route.min.js"></script>

      <asp:PlaceHolder runat="server">
         <link href="../../../../applib/css/theme.css?<%=CONFMGR.Bump()%>" type="text/css" rel="stylesheet" />
         <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib_dev")%>jquery-ui/development-bundle/themes/base/jquery.ui.all.css" />
         <!--<link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib_dev")%>jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css" />-->
         <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib_dev")%>jqgrid40/css/ui.jqgrid.css" />
         <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib_dev")%>harvesthq-chosen-12a7a11/chosen/chosen.css" />
         <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib_dev")%>jquery/plugins/qtip2dev/dist/jquery.qtip.css" />
         <!-- 1. Add these JavaScript inclusions in the head of your page -->
         <!-- jquery -->
         <!--<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib_dev")%>jquery-ui/js/jquery-1.6.2.min.js"></script>-->
         <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib_dev")%>jquery/jquery-1.7.2.min.js"></script>
         <!--<script type="text/javascript" src="../../../../lib/BootstrapModalPopover/lib/jquery-1.11.3.min.js"></script> -->
         <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib_dev")%>jquery-ui/js/jquery-ui-1.8.16.custom.min.js"></script>
         <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib_dev")%>jquery-ui/js/spinner.js"></script>
         <!-- plugins -->
          <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib_dev")%>jquery-ui/development-bundle/ui/jquery.ui.tabs.js"></script>

         <script src="<%=CONFMGR.AppSettings("jslib_dev")%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
         <script src="<%=CONFMGR.AppSettings("jslib_dev")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
         <script type="text/javascript" src="../../../../applib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
         <!-- App Modules -->
         <!-- Spectrum Color Picker -->
         <link rel="stylesheet" href="../../../../lib/bgrins-spectrum-98454b5/spectrum.css" />
         <script type="text/javascript" src="../../../../lib/bgrins-spectrum-98454b5/spectrum.js"></script>
         <!-- Date Range Picker Suite -->
         <script type="text/javascript" src="../../../../lib/ace-builds/src-noconflict/ace.js"></script>
         <script type="text/javascript" src="../../../../lib/moment/moment.min.js"></script>
         <link rel="stylesheet" href="../../../../lib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
         <script type="text/javascript" src="../../../../lib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>
		     <link rel="stylesheet" href="../../../../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.css" />
	       <script type="text/javascript" src="../../../../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.js"></script>
         <script type="text/javascript" src="../../../../lib/jquery-tablesorter/jquery.tablesorter.js"></script>
         <!-- Files with separate JulieDev replacements  -->
         <link rel="stylesheet" type="text/css" media="screen" href="../../../../applib/css/base.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet" type="text/css" media="screen" href="../../../../applib/css/fan.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet" type="text/css" media="screen" href="../../../../applib/css/rpt.css?<%=CONFMGR.Bump()%>" />
         <!-- ES5 Compatibility for IE 11 -->
         <script src="../../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
         <!-- see purecss.io for docs -->
         <link rel="stylesheet" href="../../../../lib/pure/pure-min.css" />
         <link rel="stylesheet" href="../../../../lib/pure/grids-responsive-min.css">
         <!-- JULIE CSS -->
         <link rel="stylesheet" href="../../../../app_themes/Acuity3/css/app.css?<%=CONFMGR.Bump()%>" />
         <!-- /JULIE CSS -->

         <!-- ng buildout -->
         <script type="text/javascript" src="../../../../applib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../../applib/js/controllers/legacyController.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../../applib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../../applib/js/directives/dynamicui.js?<%=CONFMGR.Bump()%>"></script>

      <!-- Sandbox-relevant directives -->
      <link rel="stylesheet" href="../../../../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../../applib/dev/POSTNOTE1/POSTNOTE1-vm/postnote.js?<%=CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../../../../applib/dev/REPORT1/REPORT1-view/report.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../../applib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>

      <!-- Highcharts OLDER VERSION (2.3.3) -->
      <!-- <script type="text/javascript" src="../../../../lib/highcharts-2.3.3/js/highcharts.src.js"></script> -->
      <!-- <script type="text/javascript" src="../../../../lib/highcharts-2.3.3/js/highcharts-more.js"></script> -->
      <!-- 1a) Optional: add a theme file -->
      <!-- <script type="text/javascript" src="../../../../lib/highcharts-2.3.3/js/themes/touchpointasync4.js?<%=CONFMGR.Bump()%>"></script> -->
      <!-- 1b) Optional: the exporting module -->
      <!-- <script type="text/javascript" src="../../../../lib/highcharts-2.3.3/js/modules/exporting.js?<%=CONFMGR.Bump()%>"></script> -->
      <!-- 2. Add the JavaScript to initialize the chart on document ready -->
      <!-- <script type="text/javascript" src="../../../../applib/css/highcharts.js?<%=CONFMGR.Bump()%>"></script> -->

      <!-- Highcharts NEW VERSION (6.2.0) -->
      <!-- 1. Add the base modules (some charts require additional modules, see examples -->
      <script type="text/javascript" src="../../../../lib/highcharts-6.2.0/code/highcharts.js"></script>
      <script type="text/javascript" src="../../../../lib/highcharts-6.2.0/js/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../../../../lib/highcharts-6.2.0/js/modules/export-data.js?<%=CONFMGR.Bump()%>"></script>
      <!-- 2. Add the JavaScript to initialize the chart on document ready -->
      <script type="text/javascript" src="../../../../applib/css/highcharts.js?<%=CONFMGR.Bump()%>"></script>


      <script type="text/javascript" src="../CHARTSANDBOX1-vm/appChartDefinitions.js?<%=CONFMGR.Bump()%>"></script>
      
      <!-- /NEW -->

      </asp:PlaceHolder>
   </head>
   <body id="Body1" runat="server" ng-controller="legacyController">
      <form id="form1" runat="server"></form> <!-- This form was causing sizing issues in the iframe, so I emptied it (not sure I need it). -->
          <ng-legacy-container class="content">
              <div style="position:relative;height:100%;width:100%;">
                <ng-acuity-report-editor></ng-acuity-report-editor>
                <div style="position:absolute; top: 0px; left: 0px; width: 50%; height: 50%;">
                  <ng-acuity-report text="Sandbox Chart 1" details="Sandbox Chart 1 Details"
                        hidetopper="NOTtrue" filters="StartDate=8/1/2018&EndDate=10/15/2018" cid="sandbox-chart-1" cidclient="all">
                  </ng-acuity-report>
                </div>
                <div style="position:absolute; top: 0px; left: 50%; width: 50%; height: 50%;">
                  <ng-acuity-report text="Sandbox Chart 2" details="Sandbox Chart 2 Details"
                    hidetopper="NOTtrue" filters="StartDate=8/1/2018&EndDate=10/15/2018" cid="sandbox-chart-2" cidclient="all">
                  </ng-acuity-report>
                </div>
                <div style="position:absolute; top: 50%; left: 0%; width: 100%; height: 50%;">
                  <ng-acuity-report text="Sandbox Chart 3" details="Sandbox Chart 3 Details"
                    hidetopper="NOTtrue" filters="StartDate=8/1/2018&EndDate=10/15/2018" cid="sandbox-chart-3" cidclient="all">
                  </ng-acuity-report>
                </div>
              </div>
          </ng-legacy-container>
      </form>
   </body>

</html>