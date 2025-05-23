<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
  <head id="Head1" runat="server">
    <title>Acuity QM Dashboard</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <!-- AngularJS ng- ng -->
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
    <!-- ES5 Compatibility for IE 11 -->
    <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
    <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>
    <asp:PlaceHolder runat="server">
      <link rel="stylesheet" href="/App_Themes/Acuity3/app-1.0.16.css?<%=CONFMGR.Bump()%>" />
      <!-- these are required for main.js for API / legacy functionality -->
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
      <script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
      <!-- Login -->
      <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
      <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/AutoQaTrending.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/AutoQaDetailDisplay.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/TotalCallsCount.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/TotalMonitorsCount.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/MonitorScoreDisplay.js?<%=DevBumper%>"></script>
      <!-- <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/PassFailDisplay.js?<%=DevBumper%>"></script> -->
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/HumanVsAiMonitors.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/HumanVsAiScoreCompare.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/HumanVsAISQFCompare.js?<%=DevBumper%>"></script>
      <!-- <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/AverageQualityScore.js?<%=DevBumper%>"></script> -->
      <!-- <script type="text/javascript" src="../../../appLib/dev/AutoQa/vm/AverageSentimentScore.js?<%=DevBumper%>"></script> -->
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
            <script src="../../../lib/highcharts-8.2.0/code/modules/exporting-data.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/accessibility.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/series-label.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/coloraxis.js?<%=CONFMGR.Bump()%>"></script>
            
      <script src="../../../appLib/css/highcharts.js"></script>
      <!-- HighCharts END -->
      <script type="text/javascript" src="js/autoQaDashboard.js?<%=DevBumper%>"></script>
      <!-- <script type="text/javascript" src="js/acuityPrizeCatalogPage.js?<%=DevBumper%>"></script> -->
      <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
      <link rel="stylesheet" href="css/acuity-auto-qa-styles.css?<%=DevBumper%>" />
      <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
      <style>
        .page-holder {
        padding: 20px;
        overflow: auto;
        max-width: 1400px;
        margin: 20px auto;
        max-height: calc(100vh - 150px);
        background: rgba(255, 255, 255, 1);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
        }
        .inline-div {
        display:inline-block;
        }
        .page-section-row {
        display: flex;
        margin: 15px;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 15px;
        gap: 14px;
        }
        .qa-top-stats {
        display: flex;
        margin: 15px;
        border-bottom: 1px solid #d8d8d8;
        padding-bottom: 15px;
        gap: 14px;
        justify-content: space-between;
        }
        .qa-top-stats_box {
        width: 25%;
        padding: 17px 5px;
        border: 1px solid #eee;
        display: inline-block;
        -webkit-box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15);
        -moz-box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15);
        box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15);
        background-color: white;
        }
        .qa-top-stats_box-item  {
        }
        .flex {
        display: flex;
        }
        .flex-space-between {
        justify-content: space-between
        }
        .mt-0 {
        margin-top: 0;
        }
        .flex-align-center {
        align-items: center;
        }
        .light-shadow {
          -webkit-box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.15);
        }
        .highcharts-background {
          fill: #fff !important;
        }
      </style>
    </asp:PlaceHolder>
  </head>
  <body ng-controller="legacyController" style="background: aliceblue url('../../../applib/css/images/qadash-bg-min.jpg') center center / cover;background-attachment: fixed; ">
    <ng-legacy-container>
      <ng-embedded-login></ng-embedded-login>
      <section class="acuity-app" ng-show="LOGGED_IN()">
        <ng-embedded-header iframehide="true"></ng-embedded-header>
        <div class="page-holder">
          <div>
            <div id="autoQaLoadingPanel" class="auto-qa-dashboard-loading-panel">
              <img src="../../../applib/css/images/acuity-loading.gif" height="50px"> Loading information...
            </div>
            <div class="flex flex-space-between flex-align-center">
              <div class="title-btn-top">
                <h2 id="lnkGoToAutoQa" class="mt-0">QM Dashboard</h2> 
                <!-- <button id="btnLoadStatsData" class="button btn btn-refresh">Load Stats</button> -->
              </div>
              <div class="refresh-btn-container">
                <button id="btnRefreshAll" class="button btn btn-refresh"><i class="fa fa-refresh"></i> Refresh</button>
                <div id="lastRunDateHolder" class="last-run-date-holder small-font">
                  Data as of <span id="lastRunDateText"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="qa-top-stats">
            <!-- <div class="qa-top-stats_box">
              <ng-total-calls-count class="qa-top-stats_box-item"></ng-total-calls-count>
            </div> -->
            <div class="qa-top-stats_box">
              <ng-total-monitors-count class="qa-top-stats_box-item"></ng-total-monitors-count>
            </div>
            <div class="qa-top-stats_box">
              <ng-monitor-score-display dataType="overall" class="qa-top-stats_box-item"></ng-monitor-score-display>
            </div>
            <div class="qa-top-stats_box">
              <ng-monitor-score-display dataType="human" class="qa-top-stats_box-item"></ng-monitor-score-display>
            </div>
            <div class="qa-top-stats_box">
              <ng-monitor-score-display dataType="ai" class="qa-top-stats_box-item"></ng-monitor-score-display>
            </div>
            <!-- <div class="qa-top-stats_box">
              <ng-average-sentiment-score class="qa-top-stats_box-item"></ng-average-sentiment-score>
            </div> -->
          </div>
          <div class="page-section-row">
            <div class="inline-div light-shadow" style="width: 70%;">
              <div class="trend-holder-section">
                <ng-auto-qa-trending></ng-auto-qa-trending>
              </div>
            </div>
            <div class="inline-div light-shadow" style="width: 30%;">
              <ng-human-vs-ai-monitors></ng-human-vs-ai-monitors>
            </div>
          </div>
          <div class="page-section-row">
            <div class="full-width">
              <ng-human-vs-ai-score-compare></ng-human-vs-ai-score-compare>
              <ng-human-vs-ai-sqf-compare></ng-human-vs-ai-sqf-compare>
            </div>
          </div>
          <!-- <div>
            <ng-auto-qa-detail-display></ng-auto-qa-detail-display>
          </div> -->
        </div>
      </section>
    </ng-legacy-container>
  </body>
</html>