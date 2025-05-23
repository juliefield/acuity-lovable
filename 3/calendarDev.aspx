<%@ Page Language="C#" AutoEventWireup="true" CodeFile="calendarDev.aspx.cs" ValidateRequest="false" Inherits="three_calendarDev" %>
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
        <script type="text/javascript" src="../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>

        <!-- Datebook -->
        <script src="https://cdn.jsdelivr.net/npm/datebook"></script>

         <!-- Spectrum Color Picker -->
         <link rel="stylesheet" href="../lib/bgrins-spectrum-98454b5/spectrum.css" />
         <script type="text/javascript" src="../lib/bgrins-spectrum-98454b5/spectrum.js"></script>
         <!-- Date Range Picker Suite -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/htmlmixed/htmlmixed.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/xml/xml.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/javascript/javascript.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/css/css.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/display/autorefresh.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/sql/sql.js"></script>
         <script type="text/javascript" src="../lib/moment/moment.min.js"></script>
         <link rel="stylesheet" href="../lib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
         <script type="text/javascript" src="../lib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>
		     <link rel="stylesheet" href="../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.css" />
	       <script type="text/javascript" src="../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.js"></script>
         <script type="text/javascript" src="../lib/jquery-tablesorter/jquery.tablesorter.js"></script>
         <script type="text/javascript" src="../lib/jquery-tablesorter/jquery.metadata.js"></script>
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

      <link rel="stylesheet" href="../applib/dev/QA1/QA1-view/qa.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../appLib/dev/QA1/QA1-vm/qa.js?<%=CONFMGR.Bump()%>"></script>

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
      
      <style>
          
        select[disabled],input[type=text][disabled],textarea[disabled]
        {
            color: Black !important;
        }
        
        .td-tooltip 
        {
            max-height: 40px;
            overflow: hidden;
        }
        
        @media print {
     body * {
         visibility: hidden;
    }
.journal-panel .rpt-popup-sizer.form-popup .rpt-popup.form-popup_content .rpt-form .form-popup_info-fields > div {
height: auto !important;
}
.bg-ta {
height: auto;
min-height: 20px;
}
.q-col {
padding: 1px !important;
}
.performance-form-container body {
background: transparent;
}
.form-popup_content, .form-popup_content * {
background: transparent;
}
     body::-webkit-scrollbar {
         display: none;
    }
#CDS_HTMLContent {
font-size: 11px !important;
}
     body {
         -ms-overflow-style: none;
        /* IE and Edge */
         scrollbar-width: none;
        /* Firefox */
    }
.journal-panel .rpt-popup-sizer.form-popup .rpt-popup.form-popup_content .rpt-form > h1 {
background: transparent;
padding: 0;
}
    
     .custom-form-placeholder {
         max-height: auto;
    }
     .pure-u-md-1-6 {
         width: auto !important;
    }
     .cds-fiddle {
         display: none;
    }
     .rpt-popup.form-popup_content {
         overflow: visible !important;
    }
     .rpt-form h1 {
         margin-bottom: 20px;
         font-size: 20px;
    }
     .form-popup_content, .form-popup_content * {
         visibility: visible;
    }
     .rpt-form, .rpt-form * {
         visibility: visible;
    }
     .pure-u-1-1 {
         display: inline-block;
         max-width: 45%;
         margin: 5px;
    }
     .rpt-form {
         padding: 20px 20px;
         max-width: 98%;
    }
     .rpt-form textarea {
         height: 100% !important;
         width: 100%;
         height: 150px !important;
         margin-bottom: 20px;
         display: inline-block;
         resize:none !important;
         overflow: visible !important;
         float: left;
    }
    .performance-form-container iframe {
      
    }
     .pure-u-1-1.subhead {
         display: block !important;
         width: 100% !important;
         position: absolute;
    }
     .pure-u-1-1.subhead h3 {
         margin-top: -30px !important;
    }
     .form-popup_content {
         position: fixed;
         display: inline-block;
         left: 0;
         top: 0;
         height:100%;
         width:100%;
        
     
    }
     .journal-entry-form-btn {
         display: none;
    }
}
 
 
 
 </style>

   </head>
   <body id="Body1" style="position:relative;overflow-y:scroll;" class="journal-panel" runat="server" ng-controller="legacyController">

    <div style="margin-top: 20px;margin-left: 50px;">

        <div class="cal-wrapper" style="display:none;">
            <div class="cal-link ac-cal"><img width="14" src="../applib/css/images/addtocal-icon.png"></div>
        </div>
    </div>


        <script>
            $(document).ready(function () {
                $(".cal-wrapper").show();

                $(".ac-cal").on("click", function () {
                    a$.showCalendarMenu(
                    this,           //Element for position.
                    function () {    //Callback for values
                        return {
                            title: 'Test Title',
                            //location: 'The Bar, New York, NY',
                            description: 'Test Description',
                            start: new Date('10/31/2022'),
                            end: new Date('10/31/2022')
                        }
                    },
                    $(this).offset().top,
                    $(this).offset().left
                    );
                });

            });

            
        </script>

   </body>
</html>
