<%@ Page Language="C#" AutoEventWireup="true" CodeFile="DashboardAsync-new.aspx.cs" ValidateRequest="false" Inherits="jq_DashboardAsync_new" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title id="Title1">Acuity&trade; 2.0</title>
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
      <!-- 1. Add these JavaScript inclusions in the head of your page -->
      <!-- jquery -->
      <!--<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/js/jquery-1.6.2.min.js"></script>-->
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/jquery-1.7.2.min.js"></script>
      <!--<script type="text/javascript" src="../applib/BootstrapModalPopover/lib/jquery-1.11.3.min.js"></script> -->
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
      <script type="text/javascript" src="dev_HelloWorld/js/viewmodels/helloworld.js"></script>
      <link rel="stylesheet" type="text/css" media="screen" href="dev_HelloWorld/css/helloworld.css" />
    </asp:PlaceHolder>
    <!-- see purecss.io for docs -->
    <link rel="stylesheet" href="../pure/pure-min.css" />
    <link rel="stylesheet" href="../pure/grids-responsive-min.css">
    <!-- NEW UI ITEMS -->
    <link rel="stylesheet" type="text/css" media="all" href="../App_Themes/Acuity3-new/rpt.css" />
    <script type="text/javascript" src="../App_Themes/Acuity3-new/julie-ui-new-scripts.js"></script>
    <!--[if IE 7]>
    <style>
      .messages-box-unread { margin-top: -18px; }
      .messages-box-incomplete  { margin-top: -18px; }
    </style>
    <![endif]-->
    <!--[if lt IE 9]>
    <script type="text/javascript">
      (function(){
        var html5elements = "address|article|aside|audio|canvas|command|datalist|details|dialog|figure|figcaption|footer|header|hgroup|keygen|mark|meter|menu|nav|progress|ruby|section|time|video".split('|');
        for(var i = 0; i < html5elements.length; i++){
          document.createElement(html5elements[i]);
        }

      })();
    </script>
    <![endif]-->
  </head>
  <body id="Dashboard" style="position:relative;" runat="server">
    <div class="full-profile">
      <div class="full-profile_fields">
        <div class="agent-profile-panel_img">
          <img src="../App_Themes/Acuity3-new/images/avatar-img-new.jpg"  />
        </div>
        <div class="agent-profile-panel_name">Samantha Smith</div>
        <div class="agent-profile-panel_form">
          <div class="agent-profile-panel_form-group">
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>First Name:</label>
              <input type="text" placeholder="First Name" />
            </div>
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>Last Name:</label>
              <input type="text" placeholder="Last Name" />
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="agent-profile-panel_form-group">
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>Department:</label>
              <select>
                <option value="" disabled>Select Department</option>
                <option value="">Department Option</option>
                <option value="">Department Option</option>
                <option value="">Department Option</option>
              </select>
            </div>
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>Team:</label>
              <select>
                <option value="" disabled>Select Team</option>
                <option value="">Team Option</option>
                <option value="">Team Option</option>
                <option value="">Team Option</option>
              </select>
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="agent-profile-panel_form-group">
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>Location:</label>
              <select>
                <option value="" disabled>Select Location</option>
                <option value="">Location Option</option>
                <option value="">Location Option</option>
                <option value="">Location Option</option>
              </select>
            </div>
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>Hire Date:</label>
              <input type="date" id="start" name="hire-date" value="2019-07-22" min="2016-01-01" max="2020-12-31">
            </div>
          </div>
          <div class="clearfix"></div>
          <div class="agent-profile-panel_form-group">
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>Role:</label>
              <select>
                <option value="" disabled>Select Role</option>
                <option value="">Agent</option>
                <option value="">Supervisor</option>
                <option value="">Role Option</option>
              </select>
            </div>
            <div class="agent-profile-panel_field agent-profile-panel_field--half">
              <label>Hire Source:</label>
              <select>
                <option value="" disabled>Select Hire Source</option>
                <option value="">Hire Source Option</option>
                <option value="">Hire Source Option</option>
                <option value="">Hire Source Option</option>
              </select>
            </div>
          </div>
          <div class="clearfix"></div>
          <br />
          <div class="add-agent-appear">
            <a class="btn btn-small btn-blue" id="add-profile-note"><i class="fa fa-plus"></i> Add an Agent Note</a>
          </div>

          <div class="agent-profile-panel_form-group agent-profile-panel-notebox">
            <div class="agent-profile-panel_field">
              <span class="max-limit-note">500 Characters Max</span>
              <label>Notes:</label>
              <textarea maxlength="500"></textarea>
              <a class="btn btn-small btn-blue" id="save-profile-note">Save Note</a>
            </div>
          </div>
          <hr />
          <div class="agent-profile-panel_form-buttons">
            <button class="btn btn-large btn-blue">Save Profile</button>
          </div>
        </div>
      </div>

      <!-- AGENT PROFILE NOTES HISTORY -->
      <div class="agent-notes-panel">
        <div class="agent-notes-panel_title">
          <div class="agent-notes-panel_img">
            <img src="../App_Themes/Acuity3-new/images/avatar-img-new.jpg"  />
          </div>
          Notes for Samantha Smith
        </div>
        <div class="notes-tabs">
          <div class="notes-tab-item">
            <input type="checkbox" id="chck1">
            <label class="notes-tab-label" for="chck1">
            Feb. 12, 2020 - Recorded by James Smith
            </label>
            <div class="notes-tab-content">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, reiciendis!
              <div class="notes-tab-actions">
                <a href="#"  id="deletenote">
                  <i class="fa fa-edit"></i> Edit Note
                </a>
                <a href="#" id="deletenote">
                  <i class="fa fa-trash-alt"></i> Delete Note
                </a>
              </div>
              <div class="notes-tab-delete-message" id="delete-message">
                <p>
                  Are you sure?<br />This action can not be undone.
                </p>
                <a href="#" class="btn notes-tab-delete-message-btn">Yes, Delete it.</a>
                <a href="#" class="btn notes-tab-delete-message-btn">Cancel</a>
              </div>
            </div>

          </div>
          <div class="notes-tab-item">
            <input type="checkbox" id="chck2">
            <label class="notes-tab-label" for="chck2">
            Feb. 10, 2020 - Recorded by James Smith
            </label>
            <div class="notes-tab-content">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, reiciendis!
              <div class="notes-tab-actions">
                <a href="#"  id="deletenote">
                  <i class="fa fa-edit"></i> Edit Note
                </a>
                <a href="#" id="deletenote">
                  <i class="fa fa-trash-alt"></i> Delete Note
                </a>
              </div>
              <div class="notes-tab-delete-message" id="delete-message">
                <p>
                  Are you sure?<br />This action can not be undone.
                </p>
                <a href="#" class="btn notes-tab-delete-message-btn">Yes, Delete it.</a>
                <a href="#" class="btn notes-tab-delete-message-btn">Cancel</a>
              </div>
            </div>
          </div>
          <div class="notes-tab-item">
            <input type="checkbox" id="chck3">
            <label class="notes-tab-label" for="chck3">
            Feb. 08, 2020 - Recorded by Daniel Weston
            </label>
            <div class="notes-tab-content">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsum, reiciendis!
              <div class="notes-tab-actions">
                <a href="#"  id="deletenote">
                  <i class="fa fa-edit"></i> Edit Note
                </a>
                <a href="#" id="deletenote">
                  <i class="fa fa-trash-alt"></i> Delete Note
                </a>
              </div>
              <div class="notes-tab-delete-message" id="delete-message">
                <p>
                  Are you sure?<br />This action can not be undone.
                </p>
                <a href="#" class="btn notes-tab-delete-message-btn">Yes, Delete it.</a>
                <a href="#" class="btn notes-tab-delete-message-btn">Cancel</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END AGENT PROFILE NOTES HISTORY -->
    </div>
  </body>
