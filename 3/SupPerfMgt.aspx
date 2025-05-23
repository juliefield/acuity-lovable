<%@ Page Language="C#" AutoEventWireup="true" CodeFile="SupPerfMgt.aspx.cs" ValidateRequest="false" Inherits="three_SupPerfMgt" %>
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
      <script src="//code.angularjs.org/1.3.0-rc.1/angular-route.min.js"></script>
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
          <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery-ui/development-bundle/ui/jquery.ui.tabs.js"></script>
         <script src="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
         <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
         <script type="text/javascript" src="../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
         <!-- App Modules -->
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
         <!-- ES5 Compatibility for IE 11 -->
         <script src="../lib/bluebird/3.3.4/bluebird.min.js"></script>
         <!-- see purecss.io for docs -->
         <link rel="stylesheet" href="../lib/pure/pure-min.css" />
         <link rel="stylesheet" href="../lib/pure/grids-responsive-min.css">
         <!-- JULIE CSS -->
         <link rel="stylesheet" href="../App_Themes/Acuity3/css/app.css?<%=CONFMGR.Bump()%>" />
         <!-- /JULIE CSS -->
         
         <!-- ng buildout -->
         <script type="text/javascript" src="../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/dev/SidePerfShell1/side-perf-controller.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/directives/dynamicui.js?<%=CONFMGR.Bump()%>"></script>
      <!-- NEW -->
      <link rel="stylesheet" href="../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/POSTNOTE1/POSTNOTE1-vm/postnote.js?<%=CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../applib/dev/REPORT1/REPORT1-view/report.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>
      <!-- Highcharts OLDER VERSION (2.3.3) -->
      <!-- <script type="text/javascript" src="../../lib/highcharts-2.3.3/js/highcharts.src.js"></script> -->
      <!-- <script type="text/javascript" src="../../lib/highcharts-2.3.3/js/highcharts-more.js"></script> -->
      <!-- 1a) Optional: add a theme file -->
      <!-- <script type="text/javascript" src="../../lib/highcharts-2.3.3/js/themes/touchpointasync4.js?<%=CONFMGR.Bump()%>"></script> -->
      <!-- 1b) Optional: the exporting module -->
      <!-- <script type="text/javascript" src="../../lib/highcharts-2.3.3/js/modules/exporting.js?<%=CONFMGR.Bump()%>"></script> -->
      <!-- 2. Add the JavaScript to initialize the chart on document ready -->
      <!-- <script type="text/javascript" src="../../applib/css/highcharts.js?<%=CONFMGR.Bump()%>"></script> -->
      <!-- Highcharts NEW VERSION (6.2.0) -->
      <!-- 1. Add the base modules (some charts require additional modules, see examples -->
      <script type="text/javascript" src="../lib/highcharts-6.2.0/code/highcharts.js"></script>
      <script type="text/javascript" src="../lib/highcharts-6.2.0/js/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../lib/highcharts-6.2.0/js/modules/export-data.js?<%=CONFMGR.Bump()%>"></script>
      <!-- 2. Add the JavaScript to initialize the chart on document ready -->
			<!-- NON - Styled Mode
			<script type="text/javascript" src="../applib/css/highcharts.js?<%=CONFMGR.Bump()%>"></script>
			<script type="text/javascript"
				src="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appChartDefinitions.js?<%=CONFMGR.Bump()%>"
				styled_mode="NO" >
			</script>
      -->
      <!-- Styled Mode -->
			<link rel="stylesheet" href="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/highcharts.css?<%=CONFMGR.Bump()%>" />
			<script type="text/javascript"
				src="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appChartDefinitions.js?<%=CONFMGR.Bump()%>"
				styled_mode="YES" >
			</script>
      <!--
         ckraft
      -->
      <link rel="stylesheet" href="../applib/dev/SidePerfShell1/side-perf-shell.css?<%=CONFMGR.Bump()%>" />
      <!-- Sidekick -->
      <link rel="stylesheet" href="../applib/dev/Sidekick1/Sidekick1-view/sidekick.css?<%=CONFMGR.Bump()%>" />
      <!-- <script type="text/javascript" src="../appLib/dev/Sidekick1/Sidekick1-vm/sidekick.js?<%=CONFMGR.Bump()%>"></script> -->
      <!-- Performance Review -->
      <link rel="stylesheet" href="../applib/dev/PerfReview1/PerfReview1-view/performance-review.css?<%=CONFMGR.Bump()%>" />
      <!-- <script type="text/javascript" src="../appLib/dev/PerfReview1/PerfReview1-vm/performance-review.js?<%=CONFMGR.Bump()%>"></script> -->
      <!--
         end ckraft
      -->
      <!-- /NEW -->
      </asp:PlaceHolder>
   </head>
   <body id="Body1" runat="server" ng-controller="sideperfController">
      <form id="form1" runat="server"></form> <!-- This form was causing sizing issues in the iframe, so I emptied it (not sure I need it). -->
      <ng-legacy-container class="content">
      <ng-acuity-report-editor></ng-acuity-report-editor>
      <div id="side-perf-shell" ng-init="agentFlag = true;">
        <!-- 
        <nav class="top-tab-nav" ng-hide="agentFlag || from_journal"> 
          <a href="#sidekick" id="">Sidekick</a>
          <a href="#performance-review" id="">Performance Review</a>
          <a href="#self-evaluation" ng-click="self_eval_toggle=true">Agent Evaluation (Dev Only)</a>
        </nav>
        -->
        <div class="nv sidekick_container" nv=";sidekick;sidekick/summary">
          <h1><img src="../App_Themes/Acuity3/images/sidekick-pg-icon.png" class="sidekick_icon" />Sidekick</h1>
          <div class="content-area" >
            <div class="table_topper text-left table-topper_summary">
              <nav class="table-topper_toggle">
                <a href="#sidekick/summary/process" type="button" ng-click="my_position='left'">Process</a>
                <span class="btn-img" ng-class="my_position"><i class="fa fa-circle"></i></span>
                <a href="#sidekick/summary/performance" type="button" ng-click="my_position='right'">Performance</a>
              </nav>
              Summary
            </div>
            <div class="nv sidekick_summary" nv="default:;default:sidekick;default:sidekick/summary;sidekick/summary/process">
              <!--<code>nv="default:;default:sidekick;default:sidekick/summary;sidekick/summary/process"</code>-->
              <div class="row top-metric-labels">
                <div class="col-6 top-metric-labels_left">
                  <div class="top-metric-labels_img">
                    <img src="../App_Themes/Acuity3/images/process-icon.png" />
                  </div>
                  <p>Process Metrics</p>
                  <ul class="color-label-boxes">
                    <li>
                      <div class="box-color box-color--purple"></div> You
                    </li>
                    <li>
                      <div class="box-color box-color--blue"></div> Average
                    </li>
                    <li>
                      <div class="box-color box-color--teal"></div> Top 10%
                    </li>
                  </ul>
                </div>
                <div class="col-6 top-metric-labels_right">
                  <div class="top-metric-labels_img">
                    <img src="../App_Themes/Acuity3/images/performance-icon.png" />
                  </div>
                  <p>
                    Performance Metrics
                  </p>
                  <ul class="color-label-boxes">
                    <li>
                      <div class="box-color box-color--orange"></div>
                      You
                    </li>
                    <li>
                      <div class="box-color box-color--gray"></div>
                      Average
                    </li>
                    <li>
                      <div class="box-color box-color--pink"></div>
                      Top 10%
                    </li>
                  </ul>
                </div>
              </div>
              <div id="summary-process-wrap" class="two-col-arrow">
                <!--<code>#summary-process-wrap</code>-->
                <div class="row">
                  <div class="col-7">
                    <!--<code>#acuity-report1</code>
                    <postnote text="Bubble Diagram" details="ng-acuity-report directives"></postnote>-->
                    <div class="text-center">
                      <h2>June 2019</h2>
                    </div>
                    <div class="bubble-diagram_container">
                      <div class="bubble-diagram_process">
                        <div class="bubble-diagram bubble--small bubble--purple bubble-1">
                          <div><b>40%</b>
                          <span>10 of 25 Agents</span></div>
                        </div>
                        <div class="bubble-diagram bubble--large bubble--teal bubble-2">
                          <div><b>85%</b></div>
                        </div>
                        <div class="bubble-diagram bubble--medium bubble--blue bubble-3">
                          <div><b>65%</b></div>
                        </div>
                      </div>
                      <div class="bubble-diagram_performance">
                        <div class="bubble-diagram bubble--small bubble--orange bubble-4">
                          <div><b>7.1</b></div>
                        </div>
                        <div class="bubble-diagram bubble--large bubble--pink bubble-5">
                          <div><b>8.6</b></div>
                        </div>
                        <div class="bubble-diagram bubble--medium bubble--gray bubble-6">
                          <div><b>7.4</b></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-5">
                    <div class="date-pagination">
                      <ul class="pagination-bar">
                        <li><a href="#"><i class="fa fa-chevron-left"></i></a></li>
                        <li style="min-width: 40%;">01/18 - 07/18</li>
                        <li><a href="#"><i class="fa fa-chevron-right"></i></a></li>
                      </ul>
                    </div>
                    <code>#acuity-report2</code>
                    <ng-acuity-report text="Process Balanced" details="test details for test panel 1"
                        hidetopper="true" filters="StartDate=8/1/2018&EndDate=10/15/2018"
                        cid="sk-process-trend-balanced" cidclient="all">
                    </ng-acuity-report>
                    <br />
                    <code>#acuity-report3</code>
                    <ng-acuity-report text="Process Percentage" details="test details for test panel 1"
                        hidetopper="true" filters="StartDate=8/1/2018&EndDate=10/15/2018"
                        cid="sk-process-trend-percentage" cidclient="all">
                    </ng-acuity-report>
                  </div>
                </div>
              </div>
            </div>
            <div class="nv sidekick_performance" nv="sidekick/summary/performance">
              <!-- <code>nv="sidekick/summary/performance"</code>-->
              <!-- <postnote text="Performance Graphs go here" details="ng-acuity-report directives"></postnote> -->
              <div class="row top-metric-labels">
                <div class="col-6"> </div>
                <div class="col-6 top-metric-labels_right">
                  <ul class="color-label-boxes">
                    <li>
                      <div class="box-color box-color--darkpurple"></div>
                      You
                    </li>
                    <li>
                      <div class="box-color box-color--blue"></div>
                      Average
                    </li>
                    <li>
                      <div class="box-color box-color--teal"></div>
                      Top 10%
                    </li>
                    <li>
                      <div class="box-color" style="left: -5px;">
                        <img src="../App_Themes/Acuity3/images/plusminus-icon.png" />
                      </div>
                      From Top 10%
                    </li>
                  </ul>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="toggle-btns right">
                    <button class="active">Current Month</button>
                    <button>Last 6 Months</button>
                  </div>
                  <p>
                    <b>Team Performance</b>
                  </p>
                  <ng-acuity-report text="Team Performance" details="test details for test panel 1"
                      hidetopper="true"
                      toppertext="Team Performance" filters="Project=11&StartDate=8/1/2018&EndDate=10/15/2018"
                      cid="sk-performance-topleft" cidclient="all">
                  </ng-acuity-report>
                </div>
                <div class="col-6">
                  <div class="toggle-btns right">
                    <button class="active">Current Month</button>
                    <button>Last 6 Months</button>
                  </div>
                  <p>
                    <b>Agent/Team Attendancee</b>
                  </p>
                  <ng-acuity-report text="Agent/Team Attendance"
                      hidetopper="true"
                      toppertext="Agent/Team Attendance" filters="Project=11&StartDate=8/1/2018&EndDate=10/15/2018"
                      cid="sk-performance-bottomleft" cidclient="all">
                  </ng-acuity-report>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="toggle-btns right">
                    <button class="active">Current Month</button>
                    <button>Last 6 Months</button>
                  </div>
                  <p>
                    <b>ESAT</b>
                  </p>
                  <ng-acuity-report text="ESAT" details="test details for test panel 1"
                    hidetopper="true"
                      toppertext="ESAT" filters="Project=11&StartDate=8/1/2018&EndDate=10/15/2018" cid="sk-performance-topright" cidclient="all">
                  </ng-acuity-report>
                </div>
                <div class="col-6">
                  <div class="toggle-btns right">
                    <button class="active">Current Month</button>
                    <button>Last 6 Months</button>
                  </div>
                  <p>
                    <b>Attrition</b>
                  </p>
                  <ng-acuity-report text="Attrition"
                    hidetopper="true"
                    toppertext="Attrition" filters="Project=11&StartDate=8/1/2018&EndDate=10/15/2018" cid="sk-performance-bottomright" cidclient="all">
                  </ng-acuity-report>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>
            <div class="sidekick-reco-box">
              <div class="row">
                <div class="col-12">
                  <div id="agent-selection">
                    <div id="recommendations">
                      <span id="number">99</span> <p><em>Sidekick Recommendations</em></p>
                    </div>
                    <div id="sortBy">
                     <label for="" style="margin-right: 10px;">Sort By</label>
                     <select name="" id="">
                       <option value="">Balanced Score — Low-to-high</option>
                       <option value="">Balanced Score — High-to-Low</option>
                     </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-area">
            <div id="assistTable">
              <div class="row">
                <div style="width:100%;height:500px;">
                    <ng-acuity-report text="Assist These Agents ASAP!" toppertext="Assist these agents ASAP!"
                        hidetopper="NOTtrue" filters="Project=6&Team=18&CSR=each&scoremodel=Balanced&KPI=each&StartDate=09/01/2018&EndDate=09/30/2018" panel="sk_assist_table" cid="DashboardGrid_NOTUSED" cidclient="all">
                    </ng-acuity-report>
                </div>
              </div>
            </div>
          </div>
          <br />
          <div class="content-area">
            <div id="liveSummaryTable">
              <div style="width:100%;height:500px;">
                <ng-acuity-report text="Assist These Agents ASAP!" toppertext="Live Summary of Agents Who Have Been Assisted"
                    hidetopper="NOTtrue" filters="Project=6&Team=18&CSR=each&scoremodel=Balanced&KPI=each&StartDate=09/01/2018&EndDate=09/30/2018" cid="DashboardGrid_NOTUSED" cidclient="all">
                </ng-acuity-report>
              </div>
            </div>
          </div>
          <br />
          <div id="one-on-one-modal" class="modal-wrapper" ng-init="one_on_one_modal = false" ng-show="one_on_one_modal">
            <!--#include virtual="../applib/dev/Sidekick1/Sidekick1-view/one-on-one-modal.htm" -->
          </div>
        </div>
        <div class="nv" nv="self-evaluation" id="selfEval">
          <!--#include virtual="../applib/dev/Sidekick1/Sidekick1-view/self-evaluation.htm" -->
        </div>
        <div class="nv" nv="performance-review">
            <!--#include virtual="../applib/dev/PerfReview1/PerfReview1-view/find-agent.htm" -->
            <!--#include virtual="../applib/dev/PerfReview1/PerfReview1-view/create-review.htm" -->
        </div>
      </div>
      <!--
          Modal Underlay
        -->          
          <div class="modal-underlay" ng-init="modal_underlay = false" ng-show="modal_underlay"></div>
        <!--
          end Modal Underlay
        -->
      </ng-legacy-container>
   </body>
</html>
