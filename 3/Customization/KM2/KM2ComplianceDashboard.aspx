<%@ Page Language="C#" AutoEventWireup="true" CodeFile="KM2ComplianceDashboard.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
  <head id="Head1" runat="server">
    <title>Compliance Dashboard</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" /> <meta http-equiv="Pragma" content="no-cache" /> <meta http-equiv="Expires" content="0" />
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <!-- AngularJS ng- ng -->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
    <!-- ES5 Compatibility for IE 11 -->
    <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
    <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>
    <asp:PlaceHolder runat="server">
      <!-- these are required for main.js for API / legacy functionality -->
       <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
      <script type="text/javascript" src="../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
      <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
      <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
      <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
      <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
      <script type="text/javascript" src="js/controller.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
      <!-- Login -->
      <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
      <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
      <!-- HighCharts START -->
      <!-- <script src="https://code.highcharts.com/highcharts.js"></script>
            <script src="https://code.highcharts.com/modules/data.js"></script>
            <script src="https://code.highcharts.com/modules/drilldown.js"></script>
            <script src="https://code.highcharts.com/modules/exporting.js"></script>
            <script src="https://code.highcharts.com/modules/export-data.js"></script>
            <script src="https://code.highcharts.com/modules/accessibility.js"></script>
            <script src="https://code.highcharts.com/modules/series-label.js"></script>
            <script src="https://code.highcharts.com/modules/coloraxis.js"></script> -->
            <script src="../../../lib/highcharts-8.2.0/code/highcharts.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/highcharts-3d.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/data.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/drilldown.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
            <!-- <script src="../../../lib/highcharts-8.2.0/code/modules/exporting-data.js?<%=CONFMGR.Bump()%>"></script> -->
            <script src="../../../lib/highcharts-8.2.0/code/modules/accessibility.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/series-label.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/coloraxis.js?<%=CONFMGR.Bump()%>"></script>

      <!-- <script src="../../../appLib/css/highcharts.js"></script> -->
      <!-- HighCharts END -->
   <script type="text/javascript" src="js/km2ComplianceDashboard.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/ComplianceFilters.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/TotalAuditorsCount.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/TotalAuditsCount.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/AuditorLoginStats.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/AuditSummary.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/AuditorDisputesCount.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/ClientsCount.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/ComplianceFailRates.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/FailRatesChart.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="vm/ComplianceDashboardDetails.js?<%=CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
      <link rel="stylesheet" href="css/km2-compliance-dashboard.css?<%=CONFMGR.Bump()%>" />
      <!-- <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script> -->
    </asp:PlaceHolder>
  </head>
  <body ng-controller="legacyController">
    <ng-legacy-container>
      <ng-embedded-login></ng-embedded-login>
      <section class="acuity-app" ng-show="LOGGED_IN()">
        <ng-embedded-header iframehide="true"></ng-embedded-header>
         <div id="noAccessDisplay" class="no-access-holder">
            <div>
               You do not have access.
            </div>
         </div>
         <div id="dashboardMainSection">
            <div class="page-holder">
            <div class="page-header">
               <div>
                  <h2>Compliance Dashboard</h2>
                  <p>
                     Select the options below to filter down results.
                  </p>
               </div>
               <div class="inline-div refresh-page-holder" >
                  <button id="btnRefreshAll" class="button btn btn-refresh">Refresh</button>
                  <br />
                  <div class="inline-div refresh-page-holder-timing">Auto refresh in <label id="lblTimeToRefreshLeft" class="refresh-page-holder-timing"></label></div>
               </div>
            </div>
            <div class="filters-page-header">
               <ng-compliance-filters></ng-compliance-filters>
            </div>
            <div class="page-body">
               <div class="main-body">
                  <div class="compliance-loading-panel-holder">
                     <div id="km2ComplianceLoadingPanel" class="compliance-loading-panel">
                       <img src="../../../applib/css/images/acuity-loading.gif" height="50px"> Loading information...
                     </div>
                  </div>
                     <ng-compliance-dashboard-details></ng-compliance-dashboard-details>
                     <div class="custom-dashboard-body-row-holder">
                        <ng-total-auditors-count></ng-total-auditors-count>
                        <ng-total-audits-count></ng-total-audits-count>
                        <ng-clients-count></ng-clients-count>
                        <ng-compliance-fail-rates></ng-compliance-fail-rates>
                        <ng-auditor-disputes-count datatype="pending" id="PendingDisputes"></ng-auditor-disputes-count>
                        <ng-auditor-disputes-count datatype="valid" id="ValidDisputes"></ng-auditor-disputes-count>
                     </div>
                     <div class="custom-dashboard-body-row">
                        <div class="custom-dashboard-body-row-holder_left">
                           <ng-audit-summary datatype="auditor-complete"></ng-audit-summary>
                           <ng-auditor-login-stats></ng-auditor-login-stats>
                        </div>
                        <div class="custom-dashboard-body-row-holder_right">
                           <ng-audit-summary datatype="client-complete"></ng-audit-summary>
                        </div>
                     </div>
                     <div class="custom-dashboard-body-row-holder">
                        <ng-fail-rates-chart datatype="location"></ng-fail-rates-chart>
                     </div>

               </div>
            </div>
            <div class="page-footer">
               &nbsp;
            </div>
        </div>
      </div>
   </section>
    </ng-legacy-container>
  </body>
</html>
