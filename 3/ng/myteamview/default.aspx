<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld"
     %>
     <!DOCTYPE html
          PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
     <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

          <head id="Head1" runat="server">
               <title>My Team View</title>
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
                    <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
                    <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
                    <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
                    <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="js/rosterManagement.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
                    <script src="https://code.highcharts.com/highcharts.js"></script>
                    <script src="https://code.highcharts.com/modules/data.js"></script>
                    <script src="https://code.highcharts.com/modules/drilldown.js"></script>
                    <script src="https://code.highcharts.com/modules/exporting.js"></script>
                    <script src="https://code.highcharts.com/modules/export-data.js"></script>
                    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
                    <script src="https://code.highcharts.com/modules/series-label.js"></script>
                    <script src="https://code.highcharts.com/modules/coloraxis.js"></script>
                    <!-- <script type="text/javascript" src="../../../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script> -->
                    
                    <!-- Login -->
                    <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
                    <script type="text/javascript" src="../../../applib/dev/TeamDashboard1/vm/myTeamOverview.js?<%=DevBumper%>"></script>
                    <script type="text/javascript" src="../../../applib/dev/TeamDashboard1/vm/myTeamMemberDisplayInfo.js?<%=DevBumper%>"></script>                    
                    <script type="text/javascript" src="../../../applib/dev/TeamDashboard1/vm/myTeamMoves.js?<%=DevBumper%>"></script>
                    <script type="text/javascript" src="../../../applib/dev/AcuityAI1/vm/CoachingSuggestionsWidget.js?<%=DevBumper%>"></script>
                    <script type="text/javascript" src="../../../applib/anothercolorpicker/src/jquery.simple-color.js?<%=CONFMGR.Bump()%>"></script>
                    
                    <link rel="stylesheet" href="/App_Themes/Acuity3/app-1.0.16.css?<%=CONFMGR.Bump()%>" />
                    <link rel="stylesheet" href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css">
                    <link rel="stylesheet" href="../../../applib/dev/QA1/QA1-view/qa.css?<%=CONFMGR.Bump()%>" />
                    <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
                    <!-- <link rel="stylesheet" href="../../../applib/dev/REPORT1/REPORT1-view/report.css?<%=CONFMGR.Bump()%>" /> -->
                    <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
               </asp:PlaceHolder>
          </head>

          <body ng-controller="legacyController">
               <ng-legacy-container>
                    <ng-embedded-login></ng-embedded-login>
                    
                    <section class="acuity-app" ng-show="LOGGED_IN()">
                        <ng-embedded-header iframehide="true"></ng-embedded-header>
                        <div style="max-width:calc(99%-100px);min-width:calc(99%-100px);padding-left:50px;padding-right:50px;background-color:smokewhite;min-height:calc(99%-250xp);max-height:calc(99%-250px);">
                         <div style="display:inline-block;width:10vw;max-width:10vw;border:1px dotted gray;min-height:90vh;max-height:90vh;overflow:auto;text-align:top">
                              <div>
                                   <div>
                                        <div style="max-height:15vh;min-height:15vh;overflow:auto;background-color:lightslategray;">
                                             <div>
                                                  Leader Effectiveness Scores
                                             </div>
                                        </div>
                                        <hr />
                                        <div style="max-height:15vh;min-height:15vh;overflow:auto;background-color:lightblue;">
                                             <div>Touch Quality Information</div>
                                        </div>
                                        <hr />
                                        <div style="max-height:15vh;min-height:15vh;overflow:auto;background-color:lightseagreen;">
                                             <div>Team Touch Rankings</div>
                                        </div>
                                        <hr />
                                        <div style="max-height:15vh;min-height:15vh;overflow:auto;background-color:lightyellow;">
                                             <div>More Stuff here</div>
                                        </div>
                                        <hr />
                                        <div style="max-height:15vh;min-height:15vh;overflow:auto;background-color:lightgreen;">
                                             <div>More Stuff here</div>
                                        </div>
                                        <hr />
                                   </div>
                              </div>
                         </div>
                         <div style="display:inline-block;width:55vw;max-width:55vw;border:1px dotted gray;min-height:90vh;max-height:90vh;overflow:auto;text-align:top">
                                   <div style="min-height:65vh;max-height:65vh;overflow:auto;text-align:top;border:1px dotted green;">
                                        <ng-my-team-overview></ng-my-team-overview>
                                   </div>
                                   <div style="min-height:250px;max-height:250px;overflow:auto;text-align:top;border:1px dotted lime;position:relative;bottom:0px;">
                                        <ng-my-team-member-display-info></ng-my-team-member-display-info>
                                   </div>
                              </div>
                              <div style="display:inline-block;width:25vw;max-width:25vw;border:1px dotted gray;min-height:90vh;max-height:90vh;overflow:auto;text-align:top">
                                   <div>
                                        <ng-coaching-suggestions-widget></ng-coaching-suggestions-widget>
                                   </div>
                                   <hr />
                                   <div>
                                        <ng-my-team-moves></ng-my-team-moves>
                                   </div>
                                   <hr />
                                   <div>
                                        <div>
                                             <h3>Team Performance Trend</h3>
                                        </div>
                                        <div style="max-height:25vh;min-height:25vh;overflow:auto;background-color:lightskyblue;">
                                             Team Performance Trend Here.
                                        </div>
                                   </div>
                              </div>
                        </div>
                    </section>
               </ng-legacy-container>
          </body>

     </html>
