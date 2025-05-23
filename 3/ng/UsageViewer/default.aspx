<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld"
  %>
  <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

  <head id="Head1" runat="server">
    <title>Login vs Performance dashboard</title>
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
      <script type="text/javascript"
        src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="js/usageViewer.js?<%=DevBumper%>"></script>
      <!-- Login -->
      <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
      <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../../../appLib/dev/DataAnalysis/vm/UsageAnalyzerGraph.js?<%=DevBumper%>"></script>
      <script type="text/javascript"
        src="../../../appLib/dev/DataAnalysis/vm/UsageAnalyzerFilters.js?<%=DevBumper%>"></script>
      <script type="text/javascript"
        src="../../../appLib/dev/DataAnalysis/vm/UsageAnalyzerFull.js?<%=DevBumper%>"></script>
      <!-- HighCharts START -->
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
      <link rel="stylesheet"
        href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
      <!-- <link rel="stylesheet" href="css/acuity-auto-qa-styles.css?<%=DevBumper%>" /> -->
      <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
      <link rel="stylesheet" href="../../../3/ng/UsageViewer/css/UsageViewer.css?<%=DevBumper%>">
    </asp:PlaceHolder>
  </head>

  <body ng-controller="legacyController">
    <ng-legacy-container>
      <ng-embedded-login></ng-embedded-login>
      <section class="acuity-app" ng-show="LOGGED_IN()">
        <ng-embedded-header iframehide="true"></ng-embedded-header>
        <div class="top-title">
          <h2>Login vs Performance dashboard</h2>
          <div class="jumplinks">
            <a href="#locations">Locations</a>
            <a href="#projects">Projects</a>
            <a href="#groups">LOB / Groups</a>
            <a href="#teams">Teams</a>
            <a href="#other-users">Other Users</a>
            <a href="#top">Back to Top</a>
          </div>
          <div>
            <button onclick="RefreshPage()" class="button btn btn-refresh">Refresh</button>
            <!-- &nbsp;
            <button onclick="toggleDiv()" class="button btn btn-notes">
                Notes
            </button> -->
          </div>
        </div>
        <div>
          <ng-usage-analyzer-filters></ng-usage-analyzer-filters>
        </div>
        <!-- <div id="openNotes" class="openNotes">
          <h4>Notes</h4>
          <ul>
            <li>
                Users logged includes all users.  Scores are based off of agent counts; only users that we can get a balanced score for.
            </li>
            <li>Logged vs. Not logged numbers may differ due to having a balanced score only for agents/csr's.  All other balanced scores are collections of these balanced scores.</li>
          </ul>
        </div> -->
        <script>
          window.addEventListener("hashchange", function () {
            window.scrollTo(window.scrollX, window.scrollY - 250);
          });
        </script>
        <div class="page-sections-holder">
          <div class="usage-container">
            <ng-usage-analyzer-full dataLoadArea="overall" displayTitleText="All Users" id="top"></ng-usage-analyzer-full>
            <!-- <ng-usage-analyzer-full dataLoadArea="overall-qualified"  displayTitleText="All Agents (Qualified)"></ng-usage-analyzer-full> -->
            <div>
              <h1 id="locations">Locations</h1>
              <ng-usage-analyzer-full dataLoadArea="location"></ng-usage-analyzer-full>
            </div>
            <div>
              <h1 id="projects">Projects</h1>
              <ng-usage-analyzer-full dataLoadArea="project"></ng-usage-analyzer-full>
            </div>
            <div>
              <h1 id="groups">LOB / Groups</h1>
              <ng-usage-analyzer-full dataLoadArea="group"></ng-usage-analyzer-full>
            </div>
            <div>
              <h1 id="teams">Teams</h1>
              <ng-usage-analyzer-full dataLoadArea="team"></ng-usage-analyzer-full>
            </div>
            <div>
              <h1 id="other-users">Other Users</h1>
              <ng-usage-analyzer-graph dataLoadType="singular" dataLoadArea="admin" displayTitleText="Administrators"
                displayScoring="off"></ng-usage-analyzer-graph>
              <ng-usage-analyzer-graph dataLoadType="singular" dataLoadArea="management" displayTitleText="Managers"
                displayScoring="off"></ng-usage-analyzer-graph>
              <ng-usage-analyzer-graph dataLoadType="singular" dataLoadArea="qa" displayTitleText="Quality Assurance"
                displayScoring="off"></ng-usage-analyzer-graph>
            </div>
          </div>
        </div>

    </ng-legacy-container>
  </body>

  </html>
