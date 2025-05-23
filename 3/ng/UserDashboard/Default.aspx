<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

    <head id="Head1" runat="server">
        <title>User Dashboard</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
        <script src="../../../lib/angularjs/1.6.0-rc.2/angular.min.js"></script>
        <script src="../../../lib/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
        <script src="../../../lib/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
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
            <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../jq/appApmClient/js/appApmDashboard-2.15.17.js?<%=CONFMGR.Bump()%>"></script>
            <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
            <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>

          <script type="text/javascript" src="../../../appLib/dev/AGAMEFLEX1/vm/agameflexwidget.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="js/userDashboardScripts.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../lib/jquery-tablesorter/jquery.tablesorter.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../lib/jquery-tablesorter/jquery.metadata.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/highcharts.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/highcharts-3d.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/data.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/drilldown.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/accessibility.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/series-label.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../lib/highcharts-8.2.0/code/modules/coloraxis.js?<%=CONFMGR.Bump()%>"></script>
            <script src="../../../appLib/css/highcharts.js"></script>

            <script type="text/javascript" src="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appChartDefinitions.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appCustomCharts.js?<%=CONFMGR.Bump()%>"></script>

            <script type="text/javascript" src="../../../appLib/dev/USERDASHBOARD1/vm/userOverallStats.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/USERDASHBOARD1/vm/userMessages.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/USERDASHBOARD1/vm/userGoalsAndTasks.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/USERPERFORMANCE1/vm/userPerformance.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/USERDASHBOARD1/vm/userSidekick.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/USERDASHBOARD1/vm/userRequiredActions.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/USERDASHBOARD1/vm/userAwards.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/AGAMELEAGUES1/vm/userAgameLeagueView.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/AGAMELEAGUES1/vm/aGameRosterTimer.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/AGAMELEAGUES1/vm/agameWagerWidget.js?<%=CONFMGR.Bump()%>"></script>

            <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
            <link rel="stylesheet" href="css/user-dashboard-styles.css?<%=CONFMGR.Bump()%>" />
            <link rel="stylesheet" href="../AgameFlex/css/agame-flex-styles.css?<%=CONFMGR.Bump()%>" />
            <link rel="stylesheet" href="../../../../appLib/dev/GOALTASK1/goalTaskStyles.css?<%=CONFMGR.Bump()%>" />
            <link rel="stylesheet" href="../../../../appLib/css/base.css?<%=CONFMGR.Bump()%>" />
            <link rel="stylesheet" href="../../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/highcharts.css?<%=CONFMGR.Bump()%>" />

            <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
            <script src="js/GaugeMeter.js"></script>
        </asp:PlaceHolder>
        <style>
          .admin-display-check-on {
            border:3px solid gray;
          }
        </style>
    </head>

    <body class="bg-gray" ng-controller="legacyController">
      <ng-legacy-container>
        <ng-embedded-login></ng-embedded-login>
        <ng-embedded-header iframehide="true"></ng-embedded-header>
        <section class="user-dashboard">
            <div class="user-dashboard-top">
                <div class="dashboard-side">
                  <ng-user-overall-stats></ng-user-overall-stats>
                </div>
                <div class="dashboard-main">
                    <div class="user-dashboard-countdown">
                        <ng-agame-roster-timer></ng-agame-roster-timer>
                    </div>
                    <div class="user-dashboard_tabs">
                        <!-- Tab links -->
                        <div class="tab">
                          <button class="tablinks" onclick="openTab(event, 'tab-messages')" id="myMessages" module="USER_MESSAGING">
                            <img src="../../../App_Themes/Acuity3-new/images/message-icon.png" height="25px" alt="My Messages">
                            <span class="menu-bar-text-for-icon">Messages</span>
                          </button>
                          <button class="tablinks" onclick="openTab(event, 'tab-tasks')" id="myTasks" module="GOAL_AND_TASKS">
                              <img src="../../../App_Themes/Acuity3-new/images/pencil_icon.png" height="25px" alt="My Tasks">
                              <span class="menu-bar-text-for-icon">Tasks</span>
                            </button>
                            <button class="tablinks" onclick="openTab(event, 'tab-goals')" id="myGoals" module="GOAL_AND_TASKS">
                              <img src="../../../App_Themes/Acuity3-new/images/target1.png" height="25px" alt="My Goals">
                              <span class="menu-bar-text-for-icon">
                                <label resource="RESOURCE_TEXT_GOALS" defaultText="Goals">Goals</label>
                              </span>
                            </button>
                            <button class="tablinks" onclick="openTab(event, 'tab-sidekick')" id="mySidekick" module="SIDEKICK">
                                <img src="../../../App_Themes/Acuity3-new/images/sidekick-pg-icon.png" height="25px" alt="Sidekick">
                                <span class="menu-bar-text-for-icon">
                                  <label resource="RESOURCE_TEXT_SIDEKICK" defaultText="Sidekick">Sidekick</label>
                                </span>
                            </button>
                            <button class="tablinks" onclick="openTab(event, 'tab-games')" id="myGames" module="FLEX">
                              <img src="../../../App_Themes/Acuity3-new/images/gold-trophy.png" height="25px" alt="My Games">
                              <span class="menu-bar-text-for-icon">Flex</span>
                            </button>
                            <button class="tablinks" onclick="openTab(event, 'tab-agame-leagues')" id="myAgame" module="AGAME">
                              <span class="menu-bar-text-for-icon">A-GAME</span>
                            </button>
                              <button class="tablinks" onclick="openTab(event, 'tab-awards')" id="myAwards" module="AWARDS_AND_PRIZES">
                              <span class="menu-bar-text-for-icon">
                                <label resource="RESOURCE_TEXT_AWARDS" defaultText="Awards">Awards</label>
                              </span>
                            </button>
                            <button class="tablinks" onclick="openTab(event, 'tab-required-user-actions')" id="myRequiredUserActions" module="REQUIRED_USER_ACTIONS">
                              <span class="menu-bar-text-for-icon">
                                <label resource="RESOURCE_TEXT_REQUIRED_ACTIONS" defaultText="Required Actions">Required Actions</label>
                              </span>
                            </button>
                        </div>
                        <!-- Tab content -->
                        <div id="tab-messages" class="tabcontent">
                            <div class="tab-messages-block">
                                <ng-user-messages></ng-user-messages>
                            </div>
                        </div>
                        <div id="tab-tasks" class="tabcontent">
                            <ng-user-goals-and-tasks itemtype="tasks"></ng-user-goals-and-tasks>
                        </div>
                        <div id="tab-goals" class="tabcontent">
                          <ng-user-goals-and-tasks itemtype="goals"></ng-user-goals-and-tasks>
                        </div>
                        <div id="tab-games" class="tabcontent">
                          <ng-agame-flex-widget></ng-agame-flex-widget>
                        </div>
                        <div id="tab-awards" class="tabcontent">
                          <ng-user-awards></ng-user-awards>
                        </div>
                        <div id="tab-sidekick" class="tabcontent">
                          <ng-user-sidekick></ng-user-sidekick>
                        </div>
                        <div id="tab-agame-leagues" class="tabcontent">
                          <ng-user-agame-league-view></ng-user-agame-league-view>
                          <ng-agame-wager-widget></ng-agame-wager-widget>
                        </div>
                        <div id="tab-required-user-actions" class="tabcontent">
                          <ng-user-required-actions></ng-user-required-actions>
                        </div>
                    </div>
                    <div class="user-dashboard_performance" id="performance">
                        <div class="container-topper">
                          <!-- <select class="user-dashboard_performance-select">
                            <option>This Month</option>
                            <option>Last Month</option>
                          </select>
                          <div class="toggle-btns user-dashboard_performance-btns">
                            <button>Bar</button>
                            <button class="active">Trend</button>
                            <button>Rel. Rank</button>
                            <button>Pay</button>
                          </div>-->
                          <div id="maximize-panel" class="rpt-max-link" title="Maximize Panel"></div>
                          <div id="minimize-panel" class="rpt-min-link" title="Minimize Panel"></div>
                          <img src="../../../../appLib/css/images/performance-icon.png" alt="Performance Analysis" class="container-topper_icon" /> Performance  Analysis
                        </div>
                        <div class="container-body performance-analysis-holder">
                          <ng-user-performance></ng-user-performance>
                          <div class="clearfix"></div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
            <script>
              $(document).ready(function(){
                console.log("UserDashboardReady call.");
                window.setTimeout(function(){
                  ko.postbox.publish("userDashboardInit");
                  ko.postbox.publish("userDashboardLoad");
                  ko.postbox.publish("aGameTimerLoad");
                  ko.postbox.publish("AGameFlexWidgetLoad");
                }, 500);

                console.log(`UserName: ${$.cookie("TP1Username")}`);
              });

            </script>
        </section>
        </ng-legacy-container>
    </body>

    </html>
