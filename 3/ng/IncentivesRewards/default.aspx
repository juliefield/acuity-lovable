<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

    <head id="Head1" runat="server">
        <title>Incentive and Reward Program Administrative System (IRPAS)</title>
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
            <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
            <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>            
            <script type="text/javascript" src="../../../jq/appApmClient/js/appApmSignal.js??<%=CONFMGR.Bump()%>"></script>
            <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
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
                    
            <!-- HighCharts END -->
            <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="js/IrpasBase.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/IrpasFilter.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/IrpasSettings.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/currentPointsAward.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/currentPointsAwardChart.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/IrpasRosterInformation.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/pointsAwardedTrendChart.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/topUserPoints.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/UserRewardsDisplay.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../applib/dev/IncentivesRewards/vm/claimedItems.js?<%=DevBumper%>"></script>
            <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />            
            <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
            <link href="../IncentivesRewards/incentivesRewards.css" rel="stylesheet">
        </asp:PlaceHolder>
    </head>

    <body ng-controller="legacyController">
        <ng-legacy-container>
            <ng-embedded-login></ng-embedded-login>
            <section class="acuity-app" ng-show="LOGGED_IN()">
                <ng-embedded-header iframehide="true"></ng-embedded-header>
                <div class="p-20">
                    <div class="header-w-btn">
                        <h2>Incentive & Reward Program Administrative System (IRPAS)</h2>
                        <div>
                            <button id="btnGoToUserPage" class="button btn btn-small">
                                Go to User Page
                            </button>    
                            <button id="btnIrpasForceRefresh" class="button btn btn-large">
                                Refresh
                            </button>
                        </div>
                        <!-- <button id="btnManageAvailableItems" class="button btn">Manage Available Items</button> -->
                    </div>
           
                    <div>
                        <div>
                            <!-- <ng-irpas-filter></ng-irpas-filter> -->
                            <ng-irpas-settings></ng-irpas-settings>
                        </div>
                       <br>
                       <div class="flex p-20 incentivesRewards_table-container">
                         <div class="column1">                   
                            <div>
                                <ng-current-points-award></ng-current-points-award>                    
                            </div>
                            <br>
                            <div>
                                <ng-claimed-items itemClaimType="recentClaimed"></ng-claimed-items>
                            </div>
                            <br>
                            <div>
                                <ng-claimed-items itemClaimType="mostClaimed"></ng-claimed-items>
                            </div>
                        </div>
                         <div class="column2">
                            <div>
                                <ng-current-points-award-chart class="shadow-sm"></ng-current-points-award-chart>
                            </div>
                            <br>
                            <div>
                                <ng-points-awarded-trend-chart chartType="perDay" class="inline-chart-holder"></ng-points-awarded-trend-chart>
                                <ng-points-awarded-trend-chart chartType="perMonth" class="inline-chart-holder"></ng-points-awarded-trend-chart>
                            </div>                        
                         </div>
                         <div class="column3">
                            <div>
                                <ng-irpas-roster-information></ng-irpas-roster-information>
                            </div>
                            <br>
                            <div>
                                <ng-user-rewards-display rewardsType="awardedToday"></ng-user-rewards-display>
                            </div>
                            <br>
                            <div>
                                <ng-user-rewards-display rewardsType="upcoming"></ng-user-rewards-display>
                            </div>
                            <br>
                            <div>
                                <ng-top-user-points></ng-top-user-points>
                            </div>
    
                         </div>
                       </div>
                    </div>
                   </div>
                </div>
                
            </section>
            <script>                
                $("#btnIrpasForceRefresh").off("click").on("click", function(){
                    ko.postbox.publish("IRPASManagementLoad", true);
                });
                $("#btnShowRules").off("click").on("click", function(){
                    alert("[NYI]: Show rules not implemented.  Still working on determining how to handle info.");
                });
                $("#btnGoToUserPage").off("click").on("click", function(){
                    ko.postbox.publish("IRPASManagementInit");
                    ko.postbox.publish("IRPASManagementLoad", true);
                    document.location = a$.debugPrefix() + "/3/ng/IncentivesRewards/UserClaimsDashboard.aspx?prefix=" + a$.urlprefix().split(".")[0];
                });
                // $("#btnManageAvailableItems").off("click").on("click", function(){
                //     alert("[NYI]: Go to management of the available Award Prize Catalog.");
                // });
            </script>
        </ng-legacy-container>
   </body>

    </html>
