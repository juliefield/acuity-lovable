<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld"
     %>
     <!DOCTYPE html
          PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

          <head id="Head1" runat="server">
               <title>Acuity - Admin</title>
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
                    <script type="text/javascript"
                         src="../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
                    <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
                    <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
                    <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
                    <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
                    <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
                    <!-- Login -->
                    <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
                    <script type="text/javascript"
                         src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/dev/USERBADGE1/vm/userbadge.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/dev/USERBADGE1/vm/userpoints.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/dev/USERBADGE1/vm/userTrophy.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/dev/ACUITYADMIN1/vm/pointsPrizeManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/dev/ACUITYADMIN1/vm/fulfillmentManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/dev/ACUITYADMIN1/vm/reportAdmin.js?<%=CONFMGR.Bump()%>"></script>
                    <!-- <script type="text/javascript" src="../../../applib/dev/ACUITYADMIN1/vm/reportAdmin.js?<%=DevBumper%>"></script> -->
                    <script type="text/javascript"
                         src="../../../applib/dev/ACUITYADMIN1/vm/dataManagerOptions.js?<%=CONFMGR.Bump()%>"></script>
                    <!-- <script type="text/javascript" src="../../../applib/dev/BADGEADMIN1/vm/badgeAdmin.js?<%=CONFMGR.Bump()%>"></script> -->
                    <script type="text/javascript"
                         src="../../../applib/dev/BADGEADMIN1/vm/badgeAdmin.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/dev/BADGEADMIN1/vm/badgeRules.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/projectManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/locationManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/groupManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/teamManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/userManager.js?<%=DevBumper%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/configParameterManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/budgetManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/entityItemStats.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/sidekickReasonManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/resourceTextManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/managerTipsTricks.js?<%=CONFMGR.Bump()%>"></script>
                         <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/virutualMentorTextManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript"
                         src="../../../appLib/dev/ACUITYADMIN1/vm/payPerformanceManager.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="../../../applib/dev/Acuityadmin1/vm/myTeamManager.js?<%=DevBumper%>"></script>
                    <script type="text/javascript" src="../../../applib/dev/Acuityadmin1/vm/userPromotionManager.js?<%=DevBumper%>"></script>
                    <script type="text/javascript" src="../../../applib/dev/Acuityadmin1/vm/flexThemeManager.js?<%=DevBumper%>"></script>
                    <script type="text/javascript" src="js/acuityAdminPage.js?<%=DevBumper%>"></script>
                    <script type="text/javascript"
                         src="../../../applib/anothercolorpicker/src/jquery.simple-color.js?<%=CONFMGR.Bump()%>"></script>
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

                         <script src="../../../appLib/css/highcharts.js"></script>


                    <link rel="stylesheet"
                         href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
                    <link rel="stylesheet" href="./css/acuity-admin.css?<%=DevBumper%>" />
                    <link rel="stylesheet" href="../BadgeAdmin/css/badge-admin.css?<%=CONFMGR.Bump()%>" />
                    <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>"
                         crossorigin="anonymous"></script>
               </asp:PlaceHolder>
          </head>

          <body ng-controller="legacyController">
               <ng-legacy-container>
                    <ng-embedded-login></ng-embedded-login>
                    <section class="acuity-app" ng-show="LOGGED_IN()">
                         <ng-embedded-header iframehide="true"></ng-embedded-header>
                         <div class="tabsHolder">
                              <div class="tab">
                                   <button id="pointsPrizeManagerTab" class="tablinks">Prize Mgr.</button>
                                   <button id="fulfillmentManagerTab" class="tablinks">Fulfillment Mgr.</button>
                                   <button id="badgeManagerTab" class="tablinks">Badge Mgr.</button>
                                   <button id="userPointsTab" class="tablinks">User Credits</button>
                                   <button id="userBadgesTab" class="tablinks">User Badges</button>
                                   <button id="userTrophiesTab" class="tablinks">User Trophies</button>
                                   <button id="entityAdminTab" class="tablinks">Entities </button>
                                   <!-- <button id="locationsAdminTab" class="tablinks">Locations</button>
                        <button id="groupsAdminTab" class="tablinks">Groups</button>
                        <button id="teamsAdminTab" class="tablinks">Teams</button>
                        <button id="usersAdminTab" class="tablinks">Users</button> -->
                                   <button id="dataManagerOptionsTab" class="tablinks">Data Mgr.</button>
                                   <button id="configManagerOptionsTab" class="tablinks">Config Mgr.</button>
                                   <button id="budgetManagerOptionsTab" class="tablinks">Budget Mgr.</button>
                                   <button id="resourceTextManagerTab" class="tablinks">Text Mgr.</button>
                                   <button id="tipsTricksManagerTab" class="tablinks">Tips/Tricks Mgr.</button>
                                   <button id="payPerformanceTab" class="tablinks">P4P</button>
                                   <button id="rosterManagerTab" class="tablinks">Roster Mgr.</button>
                                   <button id="userPromotionManagerTab" class="tablinks">UPM</button>
                                   <button id="flexThemeManagerTab" class="tablinks">FTM</button>
                                   <!-- <button id="reportsAdminTab" class="tablinks">Reports Admin</button> -->
                              </div>
                         </div>
                         <div class="subTabsHolder">
                              <div class="subTab" id="entitySubTabOptionsContainer">
                                   <button id="projectSubTab" class="subtablinks">Projects</button>
                                   <button id="locationSubTab" class="subtablinks">Locations</button>
                                   <button id="groupSubTab" class="subtablinks">Groups</button>
                                   <button id="teamSubTab" class="subtablinks">Teams</button>
                                   <button id="userSubTab" class="subtablinks">Users</button>
                                   <button id="sidekickReasonSubTab" class="subtablinks">Sidekick Reasons</button>
                              </div>
                              <div class="subTab" id="textSubTabOptionsContainer">
                                   <button id="generalTextSubTab" class="subtablinks">General Text</button>
                                   <button id="virtualMentorTextSubTab" class="subtablinks">Virtual Mentor Text</button>
                              </div>
                         </div>
                         <div id="LoadingPanel">
                              <img src="../../../applib/css/images/acuity-loading.gif" height="50px"> Loading
                              information...
                         </div>
                         <div id="noAccess">
                              <div>
                                   You do not have access to this section.
                              </div>
                         </div>
                         <div id="userBadgesContainer" class="tabcontent">
                              <ng-user-badge></ng-user-badge>
                         </div>
                         <div id="userPointsContainer" class="tabcontent">
                              <ng-user-points></ng-user-points>
                         </div>
                         <div id="userTrophiesContainer" class="tabcontent">
                              <ng-user-trophy></ng-user-trophy>
                         </div>
                         <div id="pointsPrizeManagerContainer" class="tabcontent">
                              <ng-points-prize-manager></ng-points-prize-manager>
                         </div>
                         <div id="fulfillmentManagerContainer" class="tabcontent">
                              <ng-fulfillment-manager></ng-fulfillment-manager>
                         </div>
                         <div id="badgeManagerContainer" class="tabcontent">
                              <ng-badge-admin></ng-badge-admin>
                         </div>
                         <div id="budgetManagerContainer" class="tabcontent">
                              <ng-budget-manager></ng-budget-manager>
                         </div>
                         <div id="resourceTextManagerContainer" class="tabcontent">
                              <div id="sugTabsTextSections" class="subTabSection">
                                   <div id="generalTextContainer" class="subTabContent">
                                        <ng-resource-text-manager></ng-resource-text-manager>
                                   </div>
                                   <div id="virtualMentorTextContainer" class="subTabContent">
                                        <ng-virtual-mentor-text-manager></ng-virtual-mentor-text-manager>
                                   </div>
                              </div>

                         </div>
                         <div id="entityAdminContainer" class="tabcontent">
                              <div id="subTabsSections" class="subTabSection">
                                   <div id="projectsManagerContainer" class="subTabContent">
                                        <ng-project-manager></ng-project-manager>
                                   </div>
                                   <div id="locationsManagerContainer" class="subTabContent">
                                        <ng-location-manager></ng-location-manager>
                              </div>
                                   <div id="groupsManagerContainer" class="subTabContent">
                                        <ng-group-manager></ng-group-manager>
                                   </div>
                                   <div id="teamsManagerContainer" class="subTabContent">
                                        <ng-team-manager></ng-team-manager>
                                   </div>
                                   <div id="usersManagerContainer" class="subTabContent">
                                        <ng-user-manager></ng-user-manager>
                                   </div>
                                   <div id="sidekickReasonContainer" class="subTabContent">
                                        <ng-sidekick-reason-manager></ng-sidekick-reason-manager>
                                   </div>
                              </div>
                         </div>
                         <div id="configParameterContainer" class="tabcontent">
                              <ng-config-param-manager></ng-config-param-manager>
                         </div>

                         <!-- <div id="reportsAdminContainer" class="tabcontent">
                    <ng-report-admin></ng-report-admin>
               </div> -->
                         <div id="dataManagerOptionsContainer" class="tabcontent">
                         <ng-data-manager-options></ng-data-manager-options>
                         </div>
                         <div id="tipsTricksManagerContainer" class="tabcontent">
                              <ng-manager-tips-tricks></ng-manager-tips-tricks>
                         </div>
                         <div id="payPerformanceContainer" class="tabcontent">
                              <ng-pay-performance-manager></ng-pay-performance-manager>
                         </div>
                         <div id="rosterManagerContainer" class="tabcontent">
                              <ng-my-team-manager></ng-my-team-manager>
                         </div>
                         <div id="userPromotionManagerContainer" class="tabcontent">
                              <ng-user-promotion-manager></ng-user-promotion-manager>
                         </div>
                         <div id="flexThemeManagerContainer" class="tabcontent">
                              <ng-flex-theme-manager></ng-flex-theme-manager>
                         </div>
                    </section>
               </ng-legacy-container>
          </body>

     </html>
