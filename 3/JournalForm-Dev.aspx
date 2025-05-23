<%@ Page Language="C#" AutoEventWireup="true" CodeFile="JournalForm.aspx.cs" ValidateRequest="false" Inherits="three_JournalForm" %>
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
         <script src="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
         <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
 		 <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.spin.js"></script>
         <script type="text/javascript" src="../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
         <!-- knockout (for PubSub) Any issues with this? -->
		 <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/knockout-3.3.0.js"></script>
		 <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko.mapping.js"></script>
		 <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko-postbox.js"></script>

         <!-- App Modules -->
        <script type="text/javascript" src="../jq/appApmClient/js/appApmContentTriggers-1.0.js?r=3"></script>

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
         <!-- AngularJS ng- ng -->
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
         <!-- ES5 Compatibility for IE 11 -->
         <script src="/lib/bluebird/3.3.4/bluebird.min.js"></script>
         <!-- see purecss.io for docs -->
         <link rel="stylesheet" href="../lib/pure/pure-min.css" />
         <link rel="stylesheet" href="../lib/pure/grids-responsive-min.css">
         <!-- JULIE CSS -->
         <link rel="stylesheet" href="../App_Themes/AcuityV3/css/app.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet" href="../applib/dev/FORMS1/FORMS1-view/forms.css?<%=CONFMGR.Bump()%>" />
         <!-- /JULIE CSS -->
         <link rel="stylesheet" href="../applib/css/journal-list.css?<%=CONFMGR.Bump()%>" />
         <!-- ng buildout -->
         <!--
         <script type="text/javascript" src="../appLib/js/controllers/main.js?<%=CONFMGR.Bump()%>"></script>
         -->
         <script type="text/javascript" src="../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/controllers/legacyController.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>


         <script type="text/javascript" src="../appLib/js/directives/tableeditor.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/directives/dynamicui.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/directives/journalform.js?<%=CONFMGR.Bump()%>"></script>

      <!-- NEW -->
      <link rel="stylesheet" href="../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/POSTNOTE1/POSTNOTE1-vm/postnote.js?<%=CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../applib/dev/REPORT1/REPORT1-view/report.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>

      <script type="text/javascript" src="../lib/highcharts-6.2.0/code/highcharts.js"></script>
      <script type="text/javascript" src="../lib/highcharts-6.2.0/js/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../lib/highcharts-6.2.0/js/modules/export-data.js?<%=CONFMGR.Bump()%>"></script>

      <!-- Styled Mode -->
	  <link rel="stylesheet" href="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/highcharts.css?<%=CONFMGR.Bump()%>" />
	  <script type="text/javascript"
		src="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appChartDefinitions.js?<%=CONFMGR.Bump()%>"
		styled_mode="YES" >
      </script>
	  <script type="text/javascript" src="../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appCustomCharts.js?<%=CONFMGR.Bump()%>"></script>


      </asp:PlaceHolder>

   </head>
   <body id="Body1" style="position:relative;overflow-y:scroll;" class="journal-panel" runat="server" ng-controller="legacyController">
      <form id="form1" runat="server"></form> <!-- This form was causing sizing issues in the iframe, so I emptied it (not sure I need it). -->
      <div ng-legacy-container class="content" style="width:100%;height:100%; position:relative;">
 	      <ng-acuity-report-editor></ng-acuity-report-editor>

      	<!--
        <div style="position: absolute;bottom:0px;right:0px;border: 1px solid gray; width: 300px; z-index: 10; height: 200px; opacity: 1.0;">
            <ng-identity who="CSR"></ng-identity>
        </div>
        -->
    <div class="row">
      <div class="col-12">
        <div class="openbox-container">
          <button id="openbox-button" class="btn btn-blue btn-xsmall right"><i class="fa fa-plus switcher"></i></button>
          <h2 id="journaldetailsbox" title="Open Journal Details">Sidekick</h2>
          <div class="journal-details">
            <div class="half-col_flex">
              <div class="col-4 report-touchcount sidekick-column">
                <div class="rpt-title">
                  <div class="toggle-btns right">
                  	<ng-acuity-report-bar-select assoc="journal-touch-count">
	                 		<div style="margin-top: -12px;">
												<button class="active" params="StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}">Current Month</button>
												<button params="StartDate={Date,Month,Start,-1}&EndDate={Date,Month,End,-1}">Last Month</button>
											</div>
                  	</ng-acuity-report-bar-select>
                  </div>
                  Touch Count
                </div>

                <ng-acuity-report text="Touch Count" details="test details for test panel 1"
                  headertext="Touch Count"
            			hidetopper="true" class="report-box" filters="CSR={CSR}&Team={Team}&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}"
                	cid="journal-touch-count" cidclient="all">
              	</ng-acuity-report>
              </div>

              <div class="col-3 report-touchcount sidekick-column">
                <div class="rpt-title">
                  <div class="toggle-btns right">
                  	<ng-acuity-report-bar-select assoc="journal-touch-quality">
                 	  <div style="margin-top: -12px;">
						<button class="active" params="StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}">Current Month</button>
						<button params="StartDate={Date,Month,Start,-1}&EndDate={Date,Month,End,-1}">Last Month</button>
					  </div>
                  	</ng-acuity-report-bar-select>
                  </div>
                  Touch Quality
                </div>
                <ng-acuity-report text="Touch Quality" details="test details for test panel 1"
                  headertext="Touch Quality"
            			hidetopper="true" class="report-box" filters="CSR={CSR}&Team={Team}&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}"
                	cid="journal-touch-quality" cidclient="all">
              	</ng-acuity-report>

                <!-- JULIE's Markup for Touch Quality Panel:

                <div class="touchquality-box">
                  <div class="touchquality-title">
                    <p>
                      Touch Quality Score
                    </p>
                  </div>
                  <div class="touchquality-scores">
                    <div class="touchquality-scores_col">
                      <div class="touchquality-scores_circle circle-teal">
                        1.5
                      </div>
                      My Team
                    </div>
                    <div class="touchquality-scores_col">
                      <div class="touchquality-scores_circle blue-gray-circle">
                        2.5
                      </div>
                      All Teams
                    </div>
                  </div>
                  <div class="touchquality-stats">
                    <div class="touchquality-stats_col">
                      <span>12</span>
                      Entries
                    </div>
                    <div class="touchquality-stats_col">
                      <span>6</span>
                      Ratings
                    </div>
                    <div class="touchquality-stats_col">
                      <span>50%</span>
                      Ratio
                    </div>
                  </div>
                </div>

                -->

              </div>

              <div class="col-4 report-touchrank sidekick-column">
              	<div class="rpt-table-topper">
              		<div class="rpt-title">
                    <div class="toggle-btns right">
	                  	<ng-acuity-report-bar-select assoc="journal-touch-rank">
	                  		<div style="margin-top: -12px;">
												  <button class="active" params="StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}">Current Month</button>
												  <button params="StartDate={Date,Month,Start,-1}&EndDate={Date,Month,End,-1}">Last Month</button>
												</div>
      	            	</ng-acuity-report-bar-select>

                		</div>
                    Touch Rank
									</div>
								</div>
                <ng-acuity-report text="Touch Rank" details="test details for test panel 1"
                  headertext="Touch Rank"
            			hidetopper="true" filters="CSR={CSR}&Team={Team}&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}"
                	cid="journal-touch-rank" cidclient="all">
              	</ng-acuity-report>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div class="rpt-title">
                    <div class="toggle-btns right">
	                  	<ng-acuity-report-bar-select assoc="journal-team-score-per-touch">
	                  		<div style="margin-top: -12px;">
				                <button class="active" params="cid=journal-team-score-per-touch&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}">Touch Count</button>
								<button params="cid=journal-agent-trend-year&StartDate={Date,Month,Start,-12}&EndDate={Date,Month,End,0}">Performance Score</button>
						    </div>
      	            	</ng-acuity-report-bar-select>
                        <!-- duck -->
                	</div>
              	   Trailing 12 month Average (Touch Count / Score)
                </div>
                <ng-acuity-report text="Trailing 12 month Touch Count (agent avg.)" details="test details for test panel 1"
                  headertext="Trailing 12 month Touch Count (agent avg.)"
            			hidetopper="true" filters="CSR={CSR}&Team={Team}&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}"
                	cid="journal-team-score-per-touch" cidclient="all">
              	</ng-acuity-report>

              </div>
            </div>
            <script>
            // $('#openbox-button, #journaldetailsbox').click(function() {
            //   if ($(this).attr('value') == 'show') {
            //       $(this).attr('value', 'hide');
            //       $('.journal-details').slideDown();
            //   } else {
            //       $(this).attr('value', 'show');
            //       $('.journal-details').slideUp();
            //   }
            // });
            $('#openbox-button, #journaldetailsbox').click(function(){
                var link = $(this);
                $('.journal-details').slideToggle('fast', function() {
                    if ($(this).is(':visible')) {
                      $("i.switcher").addClass("fa-minus");
                      $("i.switcher").removeClass("fa-plus");
                    } else {
                      $("i.switcher").addClass("fa-plus");
                      $("i.switcher").removeClass("fa-minus");
                    }
                });
            });
            </script>
          </div>
        </div>
      </div>
    </div>



    <div class="row">
      <div class="col-12">
        <!--
        <ng-table-editor style="overflow:auto;background:transparent;"
            dataview="DAS:JournalTEST" edit="ng-form-journal"
            headertext="Journal"
            tablesum="Occurrence"
            class="addrecord-table"
            allow="/jeffgack,dweather,gsalvato/" disallow="//CSR">
        </ng-table-editor>
        -->
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="rpt-title">
          Performance Grid
        </div>
        <div style="position:relative;height:300px;width:1000px;">
        <ng-acuity-report text="Grid View" details="test details for test panel 1"
          style="overflow:auto;background:transparent;"
    			hidetopper="true" filters="CSR={CSR}&Team={Team}&Project=1&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}"
        	cid="SpreadsheetDashboard" cidclient="all">
      	</ng-acuity-report>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 agent-trend-chart">
        <div class="rpt-title">
          <div class="toggle-btns right">
           	<ng-acuity-report-bar-select assoc="journal-agent-trend">
           		<div style="margin-top: -12px;">
								<button class="active" params="StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}">Current Month</button>
								<button params="StartDate={Date,Month,Start,-1}&EndDate={Date,Month,End,-1}">Last Month</button>
							</div>
           	</ng-acuity-report-bar-select>
          </div>
          <div class="toggle-btns right">
          	<div style="margin-top: -10px;margin-right: 10px;color:black;">
          		<ng-acuity-filter-select assoc="journal-agent-trend" action="KPI_SUBKPI" default="KPI=">
          		</ng-acuity-filter-select>
          	</div>
          </div>
          Performance Trend
        </div>
        <ng-acuity-report text="Agent Trend" details="test details for test panel 1"
    			hidetopper="true" filters="CSR={CSR}&Team={Team}&StartDate={Date,Month,Start,0}&EndDate={Date,Month,End,0}"
        	cid="journal-agent-trend" cidclient="all">
      	</ng-acuity-report>
      </div>
    </div>
    <script type="text/javascript">
      if ($.cookie("CSR") == "" || $.cookie("Team") == "") {
        $('.addrecord-table').parent().parent().hide();
      }
      if ($.cookie("Team") == "" && $.cookie("CSR") == "") {
        $('.report-touchcount').hide();
        $('.report-touchrank').removeClass("col-6").addClass("col-12");
      }
      // console.log("debug: CSR=" + $.cookie("CSR"));
      // console.log("debug: Team=" + $.cookie("Team"));
      // console.log("debug: username=" + $.cookie("username"));
    </script>

   </body>
</html>
