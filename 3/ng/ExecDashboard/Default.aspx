<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld"
   %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
   <head id="Head1" runat="server">
      <title>Executive Dashboard</title>
      <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
      <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
      <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
      <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
      <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
      <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>
      <asp:PlaceHolder runat="server">
         <link rel="stylesheet" href="/App_Themes/Acuity3/app-1.0.16.css?<%=CONFMGR.Bump()%>" />
         <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
         <script type="text/javascript" src="../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
         <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
         <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
         <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
         <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
         <script type="text/javascript" src="js/controller.js?<%=DevBumper%>"></script>
         <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript"
            src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
         <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
         <script type="text/javascript"
            src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>

         <script type="text/javascript"
            src="../../../appLib/dev/EXECDASHBOARD1/vm/measureableChart.js?<%=DevBumper%>"></script>
         <script type="text/javascript"
            src="../../../appLib/dev/EXECDASHBOARD1/vm/executiveScoring.js?<%=DevBumper%>"></script>
         <script type="text/javascript"
            src="../../../../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript"
            src="../../../lib/jquery-tablesorter/jquery.tablesorter.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript"
            src="../../../lib/jquery-tablesorter/jquery.metadata.js?<%=CONFMGR.Bump()%>"></script>
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
            <script src="../../../lib/highcharts-8.2.0/code/modules/exporting-data.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/accessibility.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/series-label.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/coloraxis.js?<%=CONFMGR.Bump()%>"></script>
            
         <!-- <script src="../../../appLib/css/highcharts.js"></script> -->
         <script type="text/javascript" src="../../../appLib/dev/REPORT1-vm/vm/report.js?<%=DevBumper%>"></script>

         <link rel="stylesheet"
            href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet"
            href="../../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/highcharts.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet" href="../../../../appLib/css/rpt.css?<%=CONFMGR.Bump()%>" />
         <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>

         <link rel="stylesheet" href="./css/execDashboard.css?<%=DevBumper%>" />
      </asp:PlaceHolder>
   </head>

   <body class="bg-gray" ng-controller="legacyController">
      <ng-legacy-container>
         <ng-embedded-login></ng-embedded-login>
         <ng-embedded-header iframehide="true"></ng-embedded-header>
         <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
         <section>
            <!-- <div class="tab-holder">
               <div class="tab-item active">Daily</div>
               <div class="tab-item">Weekly</div>
               <div class="tab-item">Monthly</div>
               <div class="tab-item">Quarterly</div>
               <div class="tab-item">Yearly</div>
            </div> -->
            <div class="containers">
               <div class="tabContainer">
                  <div class="top-stats-holder">
                     <div class="stats-holder">
                        <ng-acuity-report cid="UserRoleBreakdownCounts" cidclient="all"
                           filters="ToppertextPrepend=User Breakdown- ~Project={Project}~Location={Location}~Group={Group}~Team={Team}~CSR={CSR}~StartDate={StartDate}~EndDate={EndDate}"></ng-acuity-report>
                     </div>
                     <div class="stats-holder">
                        <ng-acuity-report cid="UserRoleRatios" cidclient="all"
                           filters="ToppertextPrepend=User Ratios- ~Project={Project}~Location={Location}~Group={Group}~Team={Team}~CSR={CSR}~StartDate={StartDate}~EndDate={EndDate}"></ng-acuity-report>
                     </div>
                     <!-- <div class="stats-holder">
                        <ng-acuity-report cid="ExecDashboardCallInfoAll" cidclient="all"
                           filters="ToppertextPrepend=Call Data- ~Project={Project}~Location={Location}~Group={Group}~Team={Team}~CSR={CSR}~StartDate={StartDate}~EndDate={EndDate}"></ng-acuity-report>
                     </div>
                     <div class="stats-holder">
                        <ng-acuity-report cid="ExecDashboardRatesAll" cidclient="all"
                           filters="ToppertextPrepend=Rates- ~Project={Project}~Location={Location}~Group={Group}~Team={Team}~CSR={CSR}~StartDate={StartDate}~EndDate={EndDate}"></ng-acuity-report>
                     </div> -->
                     <div class="stats-holder">
                        <ng-acuity-report cid="LoginPercentage" cidclient="all" filters="ToppertextPrepend=Login Stats- "></ng-acuity-report>
                        <!-- <ng-acuity-report cid="LoginPercentage" cidclient="all" filters="ToppertextPrepend=Login Stats- ~Project={Project}~Location={Location}~Group={Group}~Team={Team}~CSR={CSR}~StartDate={StartDate}~EndDate={EndDate}"></ng-acuity-report> -->
                     </div>
                  </div>
                  <div class="middle-stats-holder">
                     <div class="stats-holder-large">
                        <ng-measureable-chart></ng-measureable-chart>
                     </div>
                  </div>
                  <!-- <div class="stats-holder-medium">
                     <button onclick="ko.postbox.publish('executiveScoringLoad');return false;">Load scoring!</button>
                     <ng-executive-scoring></ng-executive-scoring>
                  </div> -->
               </div>
               <!-- 
               <div class="tabContainer">Monthly Exec Summary Information Here.</div>
               <div class="tabContainer">Quarertly Exec Summary Information Here.</div>
               <div class="tabContainer">Yearly Exec Summary Information Here.</div>
               -->
            </div>
            <!-- <ng-acuity-report></ng-acuity-report> -->
         </section>
      <script>
         $(document).ready(function(){
            appLib.HandleResourceTexts(null);
         });
      </script>
   </body>
</html>