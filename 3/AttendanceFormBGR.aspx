<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AttendanceFormBGR.aspx.cs" ValidateRequest="false" Inherits="three_AttendanceFormBGR" %>
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
         <script type="text/javascript" src="../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
         <!-- App Modules -->
         <!-- Spectrum Color Picker -->
         <link rel="stylesheet" href="../lib/bgrins-spectrum-98454b5/spectrum.css" />
         <script type="text/javascript" src="../lib/bgrins-spectrum-98454b5/spectrum.js"></script>
         <!-- Date Range Picker Suite -->
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
         <link rel="stylesheet" href="../App_Themes/Acuity3/css/app.css?<%=CONFMGR.Bump()%>" />
         <link rel="stylesheet" href="../applib/dev/FORMS1/FORMS1-view/forms.css?<%=CONFMGR.Bump()%>" />
         <!-- /JULIE CSS -->

         <!-- ng buildout -->
         <script type="text/javascript" src="../appLib/js/controllers/main.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/directives/tableeditor.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/directives/dynamicui.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../appLib/js/directives/attendanceform.js?<%=CONFMGR.Bump()%>"></script>
      </asp:PlaceHolder>

   </head>
   <body id="Body1" style="position:relative;" runat="server" ng-controller="legacyController">
      <form id="form1" runat="server"></form> <!-- This form was causing sizing issues in the iframe, so I emptied it (not sure I need it). -->
      <div ng-legacy-container class="content" style="width:100%;height:100%; position:relative;">
      	<!--
        <div style="position: absolute;bottom:0px;right:0px;border: 1px solid gray; width: 300px; z-index: 10; height: 200px; opacity: 1.0;">
            <ng-identity who="CSR"></ng-identity>
        </div>
        -->
        <div ng-table-editor style="height: 100%; overflow:auto;"
            dataview="DAS:AttendanceTEST" edit="ng-form-attendance"
            headertext="Attendance Records"
            tablesum="Occurrence"
            allow="/jeffgack,dweather,gsalvato/" disallow="//CSR"></div>
      </div>
   </body>
</html>