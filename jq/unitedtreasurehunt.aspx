<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DashboardAsync-new.aspx.cs" ValidateRequest="false" Inherits="jq_DashboardAsync_new" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title id="Title1">United CCC Rewards</title>
    <!--[if gt IE 9]>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <![endif]-->
    <!--[if lte IE 9]>
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <![endif]-->
    <asp:PlaceHolder runat="server">
      <!-- FAVICON-->
      <link rel="apple-touch-icon" sizes="57x57" href="../images/favicon/apple-icon-57x57.png">
      <link rel="apple-touch-icon" sizes="60x60" href="../images/favicon/apple-icon-60x60.png">
      <link rel="apple-touch-icon" sizes="72x72" href="../images/favicon/apple-icon-72x72.png">
      <link rel="apple-touch-icon" sizes="76x76" href="../images/favicon/apple-icon-76x76.png">
      <link rel="apple-touch-icon" sizes="114x114" href="../images/favicon/apple-icon-114x114.png">
      <link rel="apple-touch-icon" sizes="120x120" href="../images/favicon/apple-icon-120x120.png">
      <link rel="apple-touch-icon" sizes="144x144" href="../images/favicon/apple-icon-144x144.png">
      <link rel="apple-touch-icon" sizes="152x152" href="../images/favicon/apple-icon-152x152.png">
      <link rel="apple-touch-icon" sizes="180x180" href="../images/favicon/apple-icon-180x180.png">
      <link rel="icon" type="image/png" sizes="192x192"  href="../images/favicon/android-icon-192x192.png">
      <link rel="icon" type="image/png" sizes="32x32" href="../images/favicon/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="96x96" href="../images/favicon/favicon-96x96.png">
      <link rel="icon" type="image/png" sizes="16x16" href="../images/favicon/favicon-16x16.png">
      <link rel="manifest" href="../images/favicon/manifest.json">
      <meta name="msapplication-TileColor" content="#ffffff">
      <meta name="msapplication-TileImage" content="../images/favicon/ms-icon-144x144.png">
      <meta name="theme-color" content="#ffffff">
      <!-- END FAVICON-->
      <link href="appApmClient/themes/default/theme-1.2.css" type="text/css" rel="stylesheet" />
      <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/css/ui.jqgrid.css" />
      <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/qtip2dev/dist/jquery.qtip.css" />

      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/jquery-1.7.2.min.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/js/spinner.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/knockout-3.3.0.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko.mapping.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>knockout/ko-postbox.js"></script>
      <!-- plugins -->
      <script src="<%=CONFMGR.AppSettings("jslib")%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jQueryRotate.js" type="text/javascript"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.spin.js"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery-treeview/jquery.treeview.js" type="text/javascript"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/highcharts.src.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/highcharts-more.js"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>raphael/raphael-2.1.0.js"></script>
      <!-- Debugging Tools -->
      <script type="text/javascript" src="../lib/break-on-access/break-on-access.js"></script>
      <!-- Common Library -->
      <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>
      <!-- App-Dependent plugins -->
      <script type="text/javascript" src="plugins/bellGraph-1.0.0.js"></script>
      <!-- App Modules -->
      <script type="text/javascript" src="appApmClient/js/appApmSupTools-1.0.1.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmDashboard-2.15.17.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmContentTriggers-1.0.js?r=3"></script>
      <script type="text/javascript" src="appApmClient/js/appApmReport-1.1.0.js?r=8"></script>
      <script type="text/javascript" src="appApmClient/js/appClientDV/clientDVProcessing-1.0.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmScoreEditing-1.1.0.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmMessaging-1.4.11.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmNavMenus-2.0.2.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmSettings-1.1.0.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmAdmin-1.3.6.js"></script>
      <script type="text/javascript" src="appApmClient/js/appApmAttrition-1.0.4.js"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.tabs.js"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>
      <!-- <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.qtip-1.0.0-rc3.min.js" type="text/javascript"></script> -->
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>
      <!-- 1a) Optional: add a theme file -->
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/themes/touchpointasync4.js"></script>
      <!-- 1b) Optional: the exporting module -->
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>highcharts-2.3.3/js/modules/exporting.js"></script>
      <script type="text/javascript" src="../appLib/js/appChartDefinitions.js"></script>
      <script type="text/javascript" src="../appLib/js/appEasycom-0.2.js"></script> <!-- MADELIVE -->
      <!-- 2. Add the JavaScript to initialize the chart on document ready -->
      <script type="text/javascript" src="../applib/css/highcharts-theme-julie.js"></script>
      <script type="text/javascript" src="../applib/anothercolorpicker/src/jquery.simple-color.js"></script>
      <script type="text/javascript" src="../appLib/js/viewmodels/rankpoints-0.8.js"></script>
      <script type="text/javascript" src="../appLib/js/viewmodels/filterattributes.js"></script>
      <script type="text/javascript" src="../appLib/js/FilterAction-1.0.0.js"></script>
      <script type="text/javascript" src="../appLib/js/qa-1.0.3.js"></script>
      <!-- Date Range Picker Suite -->
      <link rel="stylesheet" href="../applib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
      <script type="text/javascript" src="../applib/moment/moment.min.js"></script>
      <script type="text/javascript" src="../applib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>
      <script type="text/javascript" src="../applib/jquery-tablesorter/jquery.tablesorter.js"></script>
      <script type="text/javascript" src="../appLib/js/viewmodels/fan-2.5.js?r=22"></script>
      <!-- Files with separate JulieDev replacements  -->
      <link rel="stylesheet" type="text/css" media="all" href="../applib/css/base.css" />
      <link rel="stylesheet" type="text/css" media="all" href="../applib/css/fan-2.5.css?r=2" />
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/rankpoints-2.1.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/easycom-0.2.css" />
      <!-- MADELIVE -->
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/grid.css" />
      <!-- RESPONSIVE GRID -->
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/all.css" />
      <!-- FONT AWESOME ICONS -->
      <script type="text/javascript" src="dev_ayokay/js/viewmodels/treasurehunt.js"></script>
      <link rel="stylesheet" type="text/css" media="screen" href="dev_ayokay/css/treasurehunt.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="../applib/css/united-treasurehunt.css" />
    </asp:PlaceHolder>
    <!-- see purecss.io for docs -->
    <link rel="stylesheet" href="../pure/pure-min.css" />
    <link rel="stylesheet" href="../pure/grids-responsive-min.css">
    <!-- NEW UI ITEMS -->
    <link rel="stylesheet" type="text/css" media="all" href="../App_Themes/Acuity3-new/rpt.css" />

  </head>
  <body id="Dashboard" style="position:relative;" runat="server">
    <div id="tabs-13" class="ui-tabs-panel ui-widget-content ui-corner-bottom united-th_bg">
      <div class="tabarea" id="cepointsarea" style="height: 985px; width: 1381px;">
        <div class="united-th_logo">
          <img src="../appLib/css/images/united-th-rewards-logo.png" alt="CCC Rewards" />
        </div>
        <div class="united-th_container">
          <div class="united-th_left">
            <div class="united-th_kpibox">
              <div class="united-th_top-label">
                <div class="united-th_avatar">
                  <img src="../appLib/css/images/united-th-avatar.jpg" alt="JarDanai Hill" />
                </div>
                <strong>JarDanai Hill</strong>
              </div>
              <p>
                Duke - Sheri Harris Team
              </p>
              <div class="united-th_kpis">
                KPI Scores
                <table>
                  <tr>
                    <td>Attendance</td>
                    <td>5.41 <span class="united-th_kpi-dot dot-yellow"></span></td>
                  </tr>
                  <tr>
                    <td>Quality</td>
                    <td>5.41 <span class="united-th_kpi-dot dot-red"></span></td>
                  </tr>
                  <tr>
                    <td>AHT</td>
                    <td>5.41 <span class="united-th_kpi-dot dot-orange"></span></td>
                  </tr>
                  <tr>
                    <td>Utilization</td>
                    <td>5.41 <span class="united-th_kpi-dot dot-green"></span></td>
                  </tr>
                  <tr>
                    <td>CPH</td>
                    <td>5.41 <span class="united-th_kpi-dot dot-yellow"></span></td>
                  </tr>
                  <tr>
                    <td><strong>Overall Score</strong></td>
                    <td>9.20 <span class="united-th_kpi-dot dot-green"></span></td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div class="united-th_right">
            <div class="united-th_top-label">
              Welcome back, <strong>JarDanai Hill</strong>!
            </div>
            <div class="united-th_row">
              <div class="united-th_row-left">
                <img src="../appLib/css/images/united-th-coins.png" alt="Coins Graphic" />
              </div>
              <div class="united-th_row-right">
                <div class="united-th_row-right-content">
                  <p>
                    You currently have treasure with a total value of:
                  </p>
                  <h2>635<span>Coins</span></h2>
                  <a href="" class="united-th_row-btn">Redeem Coins</a>
                </div>

              </div>
              <div class="clearfix"></div>
            </div>

            <div class="united-th_row">
              <div class="united-th_row-left">
                <img src="../appLib/css/images/united-th-coupons.png" alt="Coupons Graphic" />
              </div>
              <div class="united-th_row-right">
                <div class="united-th_row-right-content">
                  <p>
                    You currently have a total of:
                  </p>
                  <h2>3 <span class="united-th_count-label">Flex Coupons</span></h2>
                  <a href="" class="united-th_row-btn">Redeem Flex Coupons</a>
                </div>

              </div>
              <div class="clearfix"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </body>
